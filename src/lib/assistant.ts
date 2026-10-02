import { getMatches } from "./matching";
import type { Opportunity } from "./types";
import { getOpportunities, getSeeker } from "./db";

// Rule-based assistant "Setu Mitra" — supports EN + HI (roman/Hindi script) queries.
// Designed to be easily swapped for an LLM later via a single function.

type Locale = "en" | "hi";

const HI_WORDS = [
  "नमस्ते", "नौकरी", "मुझे", "चाहिए", "हैलो", "हाय", "कौन", "क्या",
  "कैसे", "कहाँ", "स्किल", "पढ़ाई", "लोन", "छात्रवृत्ति", "मदद",
  "आवेदन", "कौशल", "पैसा", "वेतन", "रिमोट", "फ्रेशर", "हिंदी",
];

function detectLocale(text: string): Locale {
  const lower = text.toLowerCase();
  if (HI_WORDS.some((w) => text.includes(w)) || /[\u0900-\u097F]/.test(text)) return "hi";
  const hiHints = ["namaste", "namaskar", "kaise", "kya", "kaun", "kahan", "naukri", "chahiye", "mujhe", "madad"];
  if (hiHints.some((w) => new RegExp(`\\b${w}\\b`).test(lower))) return "hi";
  return "en";
}

function detectType(text: string): string | null {
  const t = text.toLowerCase();
  if (/(intern|internship|इंटर्न|इंटर्नशिप)/.test(t)) return "INTERNSHIP";
  if (/(scholar|छात्रव)/.test(t)) return "SCHOLARSHIP";
  if (/(scheme|sarkari|yojana|योजना|सरकारी|scheme)/.test(t)) return "SCHEME";
  if (/(course|skill|training|कौशल|प्रशिक्षण|कोर्स)/.test(t)) return "SKILLING";
  if (/(gig|delivery|part.time|डिलीवरी)/.test(t)) return "GIG";
  if (/(job|work|naukri|नौकरी|काम)/.test(t)) return "JOB";
  return null;
}

function detectLocation(text: string): string | null {
  const cities = [
    "bengaluru", "bangalore", "mumbai", "delhi", "gurgaon", "gurugram", "noida",
    "pune", "hyderabad", "chennai", "kolkata", "jaipur", "ahmedabad", "lucknow",
    "remote", "online",
  ];
  const t = text.toLowerCase();
  for (const c of cities) if (t.includes(c)) return c;
  return null;
}

function detectSkills(text: string): string[] {
  const skillVocab = [
    "React", "Node.js", "Python", "SQL", "TypeScript", "JavaScript", "Java",
    "Tailwind", "CSS", "HTML", "Figma", "Excel", "Marketing", "Sales",
    "Communication", "Design", "Data", "Nursing", "AWS", "Hindi",
  ];
  const t = text.toLowerCase();
  return skillVocab.filter((s) => t.includes(s.toLowerCase()));
}

function describeOpp(o: Opportunity, loc: Locale): string {
  if (loc === "hi") {
    return `• ${o.titleHi ?? o.title} — ${o.companyHi ?? o.company} (${o.locationHi ?? o.location})${
      o.salaryLabelHi ?? o.salaryLabel ? `, ${o.salaryLabelHi ?? o.salaryLabel}` : ""
    }`;
  }
  return `• ${o.title} — ${o.company} (${o.location})${o.salaryLabel ? `, ${o.salaryLabel}` : ""}`;
}

export type AssistantReply = {
  locale: Locale;
  text: string;
  suggestions?: string[];
};

export function chatReply(userMessage: string, _history: { role: string; content: string }[] = []): AssistantReply {
  const loc = detectLocale(userMessage);
  const msg = userMessage.trim();
  const lower = msg.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|namaste|namaskar|नमस्ते|हैलो|हाय)[!.]*$/i.test(msg) || lower.length < 6) {
    if (loc === "hi") {
      return {
        locale: "hi",
        text:
          "नमस्ते! मैं सेतु मित्र हूँ — आपका AI कैरियर और अवसर सहायक। मैं आपकी प्रोफ़ाइल के आधार पर नौकरियाँ, इंटर्नशिप, छात्रवृत्तियाँ, सरकारी योजनाएँ और कौशल पाठ्यक्रम सुझा सकता हूँ। आप किस तरह के अवसर ढूँढ रहे हैं?",
        suggestions: [
          "मेरे लिए उपयुक्त नौकरियाँ दिखाएँ",
          "फ्रेशर नौकरियाँ",
          "सरकारी योजनाएँ बताइए",
          "छात्रवृत्ति के अवसर",
        ],
      };
    }
    return {
      locale: "en",
      text:
        "Hi! I'm Setu Mitra — your AI career & opportunities assistant. Based on your profile I can recommend jobs, internships, scholarships, government schemes, and free skilling courses. What are you looking for today?",
      suggestions: [
        "Show me top job matches",
        "Fresher jobs in my city",
        "Government schemes I'm eligible for",
        "Help me improve my resume",
      ],
    };
  }

  const type = detectType(msg);
  const locCity = detectLocation(msg);
  const skills = detectSkills(msg);

  // Help / how-apply
  if (/(how.*(apply|register)|apply|register|kaise apply|आवेदन|कैसे)/.test(lower)) {
    const text =
      loc === "hi"
        ? "आवेदन करने के लिए: किसी भी अवसर कार्ड पर जाएँ → 'अभी आवेदन करें' दबाएँ → हम आपकी प्रोफ़ाइल के आधार पर AI फिट स्कोर और सुझाव देंगे। जहाँ सीधा लिंक उपलब्ध है वहाँ आप बाहरी पोर्टल पर भी आवेदन कर सकते हैं। सरकारी योजनाओं के लिए पात्रता अवश्य जाँच लें।"
        : "To apply: open any opportunity card → click 'Apply now' → we'll generate an AI fit score and feedback based on your profile. Where a direct link is available you'll be taken to the official portal. For government schemes please review eligibility first.";
    return { locale: loc, text };
  }

  // Resume/profile help
  if (/(resume|cv|profile|बायोडाटा|रिज्यूमे)/.test(lower)) {
    const seeker = getSeeker();
    const top = getMatches(3);
    const topMissing = new Set<string>();
    top.forEach((m) => m.skillGaps.slice(0, 2).forEach((g) => topMissing.add(g)));
    const missArr = Array.from(topMissing).slice(0, 5);
    if (loc === "hi") {
      return {
        locale: "hi",
        text:
          `आपकी प्रोफ़ाइल में ${seeker.skills.length} स्किल्स दर्ज हैं। शीर्ष अनुशंसा: (1) अपने शीर्ष 3 प्रोजेक्ट जोड़ें, (2) अपने स्थान और अनुभव को सटीक भरें, (3) इन स्किल्स को जोड़ने पर विचार करें जो टॉप मैचिंग अवसरों में माँगी जा रही हैं: ${
            missArr.length ? missArr.join(", ") : "सभी आवश्यक स्किल्स पहले से मौजूद हैं"
          }।`,
      };
    }
    return {
      locale: loc,
      text:
        `Your profile currently lists ${seeker.skills.length} skills. Top suggestions: (1) add your top 3 projects with outcomes, (2) keep your location & experience up to date, (3) consider adding these in-demand skills appearing in your top matches: ${
          missArr.length ? missArr.join(", ") : "you already cover the key skills"
        }. Visit the Profile page to edit any time.`,
    };
  }

  // Salary / pay questions
  if (/(salary|pay|stipend|package|ctc|वेतन|पैसा|स्टाइपेंड)/.test(lower)) {
    const jobs = getOpportunities()
      .filter((o) => o.type === (type ?? "JOB"))
      .slice(0, 3);
    if (loc === "hi") {
      return {
        locale: "hi",
        text:
          "आपकी शीर्ष मैच वाली भूमिकाओं का वेतन:\n" +
          jobs.map((o) => describeOpp(o, "hi")).join("\n") +
          "\n\n'मैचेस' पेज पर जाकर आप और अधिक विस्तार से वेतन व स्किल गैप देख सकते हैं।",
      };
    }
    return {
      locale: "en",
      text:
        "Salary ranges for your top-matching roles:\n" +
        jobs.map((o) => describeOpp(o, "en")).join("\n") +
        "\n\nHead to Matches to see detailed scores and breakdowns.",
    };
  }

  // Default: find relevant opportunities
  let opps = getMatches(10);
  if (type) opps = opps.filter((m) => m.opportunity.type === type);
  if (locCity)
    opps = opps.filter((m) =>
      m.opportunity.location.toLowerCase().includes(locCity.replace("bangalore", "bengaluru"))
    );
  if (skills.length > 0) {
    opps = opps
      .map((m) => {
        const has = m.opportunity.skills.some((s) =>
          skills.some((sk) => s.toLowerCase().includes(sk.toLowerCase()))
        );
        return { m, has };
      })
      .filter((x) => x.has)
      .map((x) => x.m);
  }

  const top3 = opps.slice(0, 4);
  const seeker = getSeeker();

  if (top3.length === 0) {
    if (loc === "hi") {
      return {
        locale: "hi",
        text:
          "मुझे अभी आपके मानदंडों से पूरी तरह मेल खाते अवसर नहीं मिले। अपनी प्रोफ़ाइल में स्किल्स और पसंदीदा स्थान अपडेट करें — इससे बेहतर सुझाव मिलेंगे। क्या मैं आपको निःशुल्क कौशल पाठ्यक्रम दिखाऊँ?",
        suggestions: ["मुफ़्त कौशल कोर्स दिखाएँ", "स्किल अपडेट करें"],
      };
    }
    return {
      locale: "en",
      text:
        "I couldn't find exact matches for those criteria right now. Try updating your skills or preferred location on the Profile page. Would you like me to show free skilling courses that can help?",
      suggestions: ["Show free skilling courses", "Update my profile"],
    };
  }

  if (loc === "hi") {
    return {
      locale: "hi",
      text:
        `आपकी प्रोफ़ाइल (${seeker.skills.slice(0, 3).join(", ")}${
          seeker.skills.length > 3 ? "…" : ""
        }) के आधार पर ये शीर्ष ${top3.length} अवसर हैं:\n\n` +
        top3
          .map((m, i) => `${i + 1}. ${describeOpp(m.opportunity, "hi")} — मैच स्कोर ${m.score}%`)
          .join("\n") +
        `\n\nकिसी एक के बारे में विस्तार से जानने के लिए उसका नाम/नंबर कहें, या 'रिज्यूमे सुधार' कहकर सुझाव पाएँ।`,
      suggestions: ["विस्तार से #1", "रिज्यूमे सुधार सुझाव", "सरकारी योजनाएँ दिखाएँ"],
    };
  }
  return {
    locale: "en",
    text:
      `Based on your profile (${seeker.skills.slice(0, 3).join(", ")}${
        seeker.skills.length > 3 ? "…" : ""
      }), here are your top ${top3.length} matches:\n\n` +
      top3
        .map((m, i) => `${i + 1}. ${describeOpp(m.opportunity, "en")} — match score ${m.score}%`)
        .join("\n") +
      `\n\nAsk me about any of them (e.g. "tell me more about #1") or say "resume tips" for profile improvement.`,
    suggestions: ["Tell me more about #1", "Resume tips", "Show government schemes"],
  };
}
