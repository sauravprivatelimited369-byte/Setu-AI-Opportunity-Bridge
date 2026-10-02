import type { Opportunity, SeekerProfile } from "./types";

export type EligibilityCheck = {
  eligible: boolean;
  status: "eligible" | "likely" | "check" | "unlikely";
  reasons: { ok: boolean; text: string }[];
};

// Heuristic eligibility checker for schemes/scholarships/skilling courses.
// Looks at the seeker's age (from education/experience as a proxy), location,
// income (not collected in MVP, so treated as "verify"), occupation/student status, etc.
export function checkEligibility(
  opp: Opportunity,
  seeker: SeekerProfile
): EligibilityCheck {
  const reasons: { ok: boolean; text: string }[] = [];
  let positive = 0;
  let negative = 0;

  const isAllIndia = /all india|online|urban india|remote/i.test(opp.location);
  if (isAllIndia) {
    reasons.push({ ok: true, text: "Open across India / online" });
    positive++;
  } else if (seeker.location) {
    const locMatch = opp.location.toLowerCase().split(/[,/]/).some((token) => {
      const t = token.trim().toLowerCase();
      return t.length >= 4 && seeker.location!.toLowerCase().includes(t);
    });
    if (locMatch) {
      reasons.push({ ok: true, text: `Location matches ${opp.location}` });
      positive++;
    } else {
      reasons.push({ ok: false, text: `Located in ${opp.location} — verify if you're based there` });
      negative++;
    }
  } else {
    reasons.push({ ok: false, text: "Add your location to check eligibility" });
    negative++;
  }

  // Age-related rules (heuristic from education/experience)
  const ed = (seeker.education ?? "").toLowerCase();
  const isStudent = /b\.?tech|b\.?e|b\.?sc|b\.?a|b\.?com|12th|diploma|iti|student|pursuing/i.test(ed);
  const grad = /graduate|b\.?tech|b\.?e|b\.?sc|b\.?a|b\.?com|m\.?tech|mba|phd/i.test(ed);

  switch (opp.id) {
    case "sch-001": // NMMS
      reasons.push({ ok: true, text: "For class 9–12 students (verify class enrollment)" });
      reasons.push({ ok: false, text: "Requires family income ≤ ₹3.5 LPA & 55% in class 8" });
      break;
    case "sch-002": // Jindal
      if (grad || isStudent) {
        reasons.push({ ok: true, text: "You appear to be a student/graduate — eligible categories" });
        positive++;
      } else {
        reasons.push({ ok: false, text: "Requires enrollment in ITI/Diploma/Grad/PG course" });
        negative++;
      }
      reasons.push({ ok: false, text: "Verify family income criteria at application time" });
      break;
    case "sch-003": // PMKVY
      reasons.push({ ok: true, text: "Age 15–45 — verify before enrollment" });
      reasons.push({ ok: true, text: "No educational barrier; open to school dropouts" });
      positive += 2;
      break;
    case "sch-004": // PM SVANidhi
      reasons.push({ ok: false, text: "Requires vending certificate or LoR from ULN/TVC" });
      reasons.push({ ok: false, text: "For urban street vendors specifically" });
      break;
    case "sch-005": // Mudra
      reasons.push({ ok: true, text: "Any Indian citizen with a non-farm business plan can apply" });
      positive++;
      reasons.push({ ok: false, text: "Requires a business plan and bank account" });
      break;
    case "sch-006": // NPTEL
      reasons.push({ ok: true, text: "Any age/qualification — only a laptop + internet required" });
      positive++;
      break;
    default:
      if (opp.eligibility) {
        reasons.push({ ok: true, text: "Review official eligibility before applying" });
      }
  }

  // Aadhaar / bank / documents note for schemes
  if (opp.type === "SCHEME" || opp.type === "SCHOLARSHIP" || opp.type === "SKILLING") {
    reasons.push({ ok: true, text: "Keep Aadhaar, bank passbook & recent photo handy" });
    positive++;
  }

  const total = positive + negative;
  let status: EligibilityCheck["status"] = "check";
  if (total === 0) status = "check";
  else if (negative === 0 && positive > 0) status = "eligible";
  else if (positive > negative) status = "likely";
  else if (negative > positive) status = "unlikely";

  const eligible = status === "eligible" || status === "likely";
  return { eligible, status, reasons };
}

export function statusLabel(s: EligibilityCheck["status"], lang: "en" | "hi"): string {
  if (lang === "hi") {
    return s === "eligible"
      ? "आप पात्र हैं"
      : s === "likely"
      ? "संभवतः पात्र"
      : s === "unlikely"
      ? "पात्रता संदिग्ध"
      : "जाँच आवश्यक";
  }
  return s === "eligible"
    ? "You look eligible"
    : s === "likely"
    ? "Likely eligible"
    : s === "unlikely"
    ? "Check eligibility"
    : "Verify details";
}
