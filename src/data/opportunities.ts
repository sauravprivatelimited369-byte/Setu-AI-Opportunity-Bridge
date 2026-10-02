import type { OpportunityType, WorkMode, ExperienceLevel } from "../lib/types";

export type SeedOpportunity = {
  id: string;
  title: string;
  titleHi?: string;
  company: string;
  companyHi?: string;
  location: string;
  locationHi?: string;
  type: OpportunityType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryLabel?: string;
  salaryLabelHi?: string;
  description: string;
  descriptionHi?: string;
  requirements: string;
  requirementsHi?: string;
  skills: string[];
  tags: string[];
  postedDaysAgo: number;
  language?: string;
  contactEmail?: string;
  applyUrl?: string;
  eligibility?: string;
  eligibilityHi?: string;
  stipend?: string;
  duration?: string;
};

export const seedOpportunities: SeedOpportunity[] = [
  // ---------- JOBS ----------
  {
    id: "job-001",
    title: "Frontend Developer (React)",
    titleHi: "फ्रंटएंड डेवलपर (React)",
    company: "FinEdge Solutions",
    location: "Bengaluru, Karnataka",
    locationHi: "बेंगलुरु, कर्नाटक",
    type: "JOB",
    workMode: "HYBRID",
    experienceLevel: "JUNIOR",
    salaryMin: 450000,
    salaryMax: 700000,
    salaryLabel: "₹4.5 – 7 LPA",
    description:
      "Build modern, responsive web interfaces for our banking-tech platform used by 2M+ customers across India. Work closely with design and backend teams to ship delightful, accessible UIs.",
    descriptionHi:
      "हमारे बैंकिंग-टेक प्लेटफॉर्म के लिए आधुनिक, रिस्पॉन्सिव वेब इंटरफेस बनाएँ, जिसका उपयोग पूरे भारत में 20 लाख+ ग्राहक करते हैं। सुंदर व सुलभ UI बनाने के लिए डिज़ाइन और बैकएंड टीम के साथ काम करें।",
    requirements:
      "1–3 years of experience with React, TypeScript, and modern CSS. Comfortable with Git, REST APIs, and component-driven design. Portfolio or GitHub profile required.",
    requirementsHi:
      "React, TypeScript और आधुनिक CSS में 1–3 वर्ष का अनुभव। Git, REST APIs और कंपोनेंट-ड्रिवन डिज़ाइन की समझ। पोर्टफोलियो या GitHub प्रोफ़ाइल आवश्यक।",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Git"],
    tags: ["IT", "Bengaluru", "Tech", "Hybrid"],
    postedDaysAgo: 2,
    contactEmail: "careers@finedge.example",
  },
  {
    id: "job-002",
    title: "Customer Support Executive (Hindi)",
    titleHi: "ग्राहक सहायता कार्यकारी (हिंदी)",
    company: "KiranaMart",
    location: "Jaipur, Rajasthan",
    locationHi: "जयपुर, राजस्थान",
    type: "JOB",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    salaryMin: 180000,
    salaryMax: 260000,
    salaryLabel: "₹15k – 22k / month",
    salaryLabelHi: "₹15k – 22k / माह",
    description:
      "Help Hindi-speaking merchants on our e-commerce platform over phone and chat. Resolve order, payment, and onboarding issues. 6-day working week with rotational shifts.",
    descriptionHi:
      "हमारे ई-कॉमर्स प्लेटफॉर्म पर हिंदी भाषी व्यापारियों की फोन और चैट के माध्यम से मदद करें। ऑर्डर, भुगतान और ऑनबोर्डिंग संबंधी समस्याएँ हल करें। 6-दिन का कार्य सप्ताह, शिफ़्ट रोटेशनल।",
    requirements:
      "Fluent in Hindi and basic English. 12th pass required, graduates preferred. Prior BPO/voice experience a plus but not mandatory.",
    requirementsHi:
      "हिंदी में धाराप्रवाह और बुनियादी अंग्रेज़ी। 12वीं पास आवश्यक, स्नातक प्राथमिकता। बीपीओ/वॉइस अनुभव प्लस पॉइंट परंतु अनिवार्य नहीं।",
    skills: ["Hindi", "Communication", "CRM", "Phone Support", "Problem Solving"],
    tags: ["BPO", "Fresher", "Jaipur", "Customer Success"],
    postedDaysAgo: 5,
  },
  {
    id: "job-003",
    title: "Data Analyst",
    titleHi: "डेटा विश्लेषक",
    company: "GreenKart AgriTech",
    location: "Pune, Maharashtra",
    locationHi: "पुणे, महाराष्ट्र",
    type: "JOB",
    workMode: "REMOTE",
    experienceLevel: "ENTRY",
    salaryMin: 350000,
    salaryMax: 550000,
    salaryLabel: "₹3.5 – 5.5 LPA",
    description:
      "Work with agricultural supply chain data to build dashboards and insights that help farmers get better prices. Build reports in SQL/Python and present findings to product and ops teams.",
    skills: ["SQL", "Python", "Excel", "Tableau", "Statistics"],
    tags: ["Analytics", "Remote", "AgriTech", "Pune"],
    requirements:
      "Bachelor's degree in Statistics/Mathematics/CS or related. Hands-on SQL and Python (Pandas). Good communication.",
    requirementsHi:
      "सांख्यिकी/गणित/कंप्यूटर या संबंधित क्षेत्र में स्नातक। SQL और Python (Pandas) का व्यावहारिक ज्ञान। अच्छा संचार कौशल।",
    descriptionHi:
      "किसानों को बेहतर दाम दिलाने में मदद करने के लिए कृषि आपूर्ति-शृंखला डेटा से डैशबोर्ड और इनसाइट्स बनाएँ। SQL/Python में रिपोर्ट बनाएँ और प्रोडक्ट व ऑप्स टीम को निष्कर्ष प्रस्तुत करें।",
    postedDaysAgo: 7,
  },
  {
    id: "job-004",
    title: "Sales Executive – FMCG",
    titleHi: "सेल्स एक्जीक्यूटिव – FMCG",
    company: "Shudh Aahar Foods",
    location: "Lucknow, Uttar Pradesh",
    locationHi: "लखनऊ, उत्तर प्रदेश",
    type: "JOB",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    salaryMin: 150000,
    salaryMax: 220000,
    salaryLabel: "₹12k – 18k / month + incentives",
    salaryLabelHi: "₹12k – 18k / माह + प्रोत्साहन",
    description:
      "Visit retail shops in your assigned territory to distribute our food products, onboard new retailers, and collect orders. Two-wheeler and valid DL required.",
    descriptionHi:
      "अपने निर्धारित क्षेत्र में खुदरा दुकानों पर जाएँ, खाद्य उत्पादों का वितरण करें, नए खुदरा विक्रेताओं को जोड़ें और ऑर्डर एकत्र करें। टू-व्हीलर और वैध DL आवश्यक।",
    requirements:
      "10th/12th pass, good communication in Hindi, own two-wheeler with DL. Field sales experience preferred.",
    requirementsHi:
      "10वीं/12वीं पास, हिंदी में अच्छा संचार, स्वयं का टू-व्हीलर और DL। फील्ड सेल्स अनुभव प्राथमिकता।",
    skills: ["Field Sales", "Hindi", "Negotiation", "Retail", "FMCG"],
    tags: ["Sales", "Field Job", "Lucknow", "Fresher"],
    postedDaysAgo: 3,
  },
  {
    id: "job-005",
    title: "Senior Backend Engineer (Node.js)",
    titleHi: "वरिष्ठ बैकएंड इंजीनियर (Node.js)",
    company: "NexusPay",
    location: "Hyderabad, Telangana / Remote",
    locationHi: "हैदराबाद, तेलंगाना / रिमोट",
    type: "JOB",
    workMode: "REMOTE",
    experienceLevel: "SENIOR",
    salaryMin: 1800000,
    salaryMax: 2800000,
    salaryLabel: "₹18 – 28 LPA",
    description:
      "Own core payments infrastructure handling millions of transactions per day. Design distributed systems, lead code reviews, mentor junior engineers.",
    skills: ["Node.js", "PostgreSQL", "Redis", "Kafka", "AWS", "System Design"],
    tags: ["Payments", "Remote", "Senior", "Hyderabad"],
    requirements:
      "5+ years building scalable backend systems, deep Node.js expertise, experience with distributed databases and message queues.",
    postedDaysAgo: 10,
  },
  {
    id: "job-006",
    title: "Delivery Partner",
    titleHi: "डिलीवरी पार्टनर",
    company: "QuickBox Logistics",
    location: "Kolkata, West Bengal",
    locationHi: "कोलकाता, पश्चिम बंगाल",
    type: "GIG",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    salaryLabel: "₹18k – 35k / month (per order)",
    salaryLabelHi: "₹18k – 35k / माह (प्रति ऑर्डर)",
    description:
      "Flexible delivery work. Choose your own hours, earn per delivery. Daily payouts available after first week. Bike/scooter, smartphone, and valid documents required.",
    descriptionHi:
      "लचीला डिलीवरी कार्य। अपनी पसंद की शिफ़्ट चुनें, प्रति डिलीवरी कमाएँ। पहले सप्ताह के बाद दैनिक भुगतान उपलब्ध। बाइक/स्कूटर, स्मार्टफोन और वैध दस्तावेज़ आवश्यक।",
    requirements: "18+ years old, own two-wheeler, valid DL, Aadhaar, smartphone.",
    requirementsHi: "18+ आयु, स्वयं का टू-व्हीलर, वैध DL, आधार, स्मार्टफोन।",
    skills: ["Two Wheeler Riding", "Navigation Apps", "Customer Service"],
    tags: ["Gig", "Flexible", "Kolkata"],
    postedDaysAgo: 1,
  },
  {
    id: "job-007",
    title: "Registered Nurse – General Ward",
    titleHi: "रजिस्टर्ड नर्स – जनरल वार्ड",
    company: "Arogya Multispeciality Hospital",
    location: "Chennai, Tamil Nadu",
    locationHi: "चेन्नई, तमिलनाडु",
    type: "JOB",
    workMode: "ON_SITE",
    experienceLevel: "ENTRY",
    salaryMin: 280000,
    salaryMax: 420000,
    salaryLabel: "₹23k – 35k / month",
    salaryLabelHi: "₹23k – 35k / माह",
    description:
      "Provide inpatient care, administer medication, and support doctors on the general ward. Rotational shifts, hostel facility available for outstation candidates.",
    skills: ["Nursing", "Patient Care", "BLS", "Tamil", "English"],
    tags: ["Healthcare", "Chennai", "GNC/Nursing"],
    requirements:
      "GNM / B.Sc Nursing with valid Tamil Nadu Nursing Council registration. 0–2 years experience.",
    postedDaysAgo: 4,
  },
  {
    id: "job-008",
    title: "Graphic Designer (Social Media)",
    titleHi: "ग्राफिक डिज़ाइनर (सोशल मीडिया)",
    company: "Dhaage Apparel",
    location: "Ahmedabad, Gujarat",
    locationHi: "अहमदाबाद, गुजरात",
    type: "JOB",
    workMode: "HYBRID",
    experienceLevel: "JUNIOR",
    salaryMin: 240000,
    salaryMax: 360000,
    salaryLabel: "₹20k – 30k / month",
    salaryLabelHi: "₹20k – 30k / माह",
    description:
      "Create engaging posts, reels covers, and ad creatives for Instagram, Facebook, and WhatsApp campaigns for a fast-growing ethnic wear brand.",
    skills: ["Figma", "Photoshop", "Illustrator", "Canva", "Motion Graphics"],
    tags: ["Design", "Fashion", "Ahmedabad"],
    requirements:
      "1–2 years in social media design. Strong portfolio showing reel/thumbnails and ad creatives. Sense of typography and color for Indian audiences.",
    postedDaysAgo: 6,
  },

  // ---------- INTERNSHIPS ----------
  {
    id: "int-001",
    title: "AI/ML Research Intern",
    titleHi: "AI/ML रिसर्च इंटर्न",
    company: "Bharat AI Lab",
    location: "Remote (India)",
    locationHi: "रिमोट (भारत)",
    type: "INTERNSHIP",
    workMode: "REMOTE",
    experienceLevel: "FRESHER",
    stipend: "₹25k / month",
    duration: "6 months",
    description:
      "Research and prototype LLM applications for Indian languages. Contribute to open-source datasets, run evaluations, and co-author reports.",
    skills: ["Python", "PyTorch", "LLMs", "NLP", "Hindi"],
    tags: ["AI", "Research", "Remote", "Internship"],
    requirements:
      "Pre-final/final year B.Tech/M.Tech in CS or related. Strong Python and ML fundamentals. Publications/projects in NLP a plus.",
    postedDaysAgo: 3,
  },
  {
    id: "int-002",
    title: "Marketing Intern",
    titleHi: "मार्केटिंग इंटर्न",
    company: "CampusKart",
    location: "Delhi NCR",
    locationHi: "दिल्ली एनसीआर",
    type: "INTERNSHIP",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    stipend: "₹10k / month + certificate",
    duration: "3 months",
    description:
      "Support growth campaigns across college campuses. Create Instagram content, coordinate with campus ambassadors, and analyse campaign data.",
    skills: ["Social Media", "Content Writing", "Excel", "Hindi", "English"],
    tags: ["Marketing", "Internship", "Delhi"],
    requirements: "Currently pursuing BBA/B.Com/BA. Available full-time for 3 months.",
    postedDaysAgo: 2,
  },

  // ---------- SCHOLARSHIPS ----------
  {
    id: "sch-001",
    title: "National Means-cum-Merit Scholarship (NMMS)",
    titleHi: "राष्ट्रीय साधन-सह-मेधा छात्रवृत्ति (NMMS)",
    company: "Ministry of Education, Govt. of India",
    companyHi: "शिक्षा मंत्रालय, भारत सरकार",
    location: "All India",
    locationHi: "अखिल भारत",
    type: "SCHOLARSHIP",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    stipend: "₹12,000 / year (₹1000/month)",
    description:
      "Scholarship for meritorious students from economically weaker sections studying in class 9–12 to prevent drop-out at secondary stage.",
    descriptionHi:
      "आर्थिक रूप से कमज़ोर वर्ग के मेधावी विद्यार्थियों (कक्षा 9–12) के लिए छात्रवृत्ति, जिससे वे माध्यमिक स्तर पर पढ़ाई छोड़ने को मजबूर न हों।",
    eligibility:
      "Class 8 pass with ≥55% marks (50% for SC/ST). Parental income ≤ ₹3,50,000 per annum. Must appear for state-level NMMS exam.",
    eligibilityHi:
      "कक्षा 8 में ≥55% अंक (SC/ST हेतु 50%)। माता-पिता की वार्षिक आय ≤ ₹3,50,000। राज्य-स्तरीय NMMS परीक्षा देना अनिवार्य।",
    requirements: "Class 8 marksheet, income certificate, caste certificate (if applicable), Aadhaar.",
    requirementsHi: "कक्षा 8 की मार्कशीट, आय प्रमाण-पत्र, जाति प्रमाण-पत्र (यदि लागू), आधार।",
    skills: [],
    tags: ["Scholarship", "School Students", "All India", "Government"],
    postedDaysAgo: 12,
  },
  {
    id: "sch-002",
    title: "Sitaram Jindal Scholarship",
    titleHi: "सीताराम जिंदल छात्रवृत्ति",
    company: "Sitaram Jindal Foundation",
    location: "All India",
    type: "SCHOLARSHIP",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    stipend: "₹500 – ₹3,500 / month (varies by course)",
    description:
      "Merit-cum-means scholarship for students pursuing ITI, Diploma, Graduation, or Post-Graduation across India, with preference for students from Karnataka, West Bengal, Chhattisgarh.",
    eligibility:
      "Based on previous class marks (varies). Family income criteria apply. No separate exam; direct application.",
    skills: [],
    tags: ["Scholarship", "College Students", "All India"],
    requirements: "Marksheets, income certificate, fee receipt, recommendation letter from institution.",
    postedDaysAgo: 20,
  },

  // ---------- GOVERNMENT SCHEMES ----------
  {
    id: "sch-003",
    title: "PM Kaushal Vikas Yojana (PMKVY 4.0)",
    titleHi: "प्रधानमंत्री कौशल विकास योजना (PMKVY 4.0)",
    company: "Ministry of Skill Development & Entrepreneurship",
    companyHi: "कौशल विकास एवं उद्यमिता मंत्रालय",
    location: "All India",
    locationHi: "अखिल भारत",
    type: "SKILLING",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    stipend: "Free training + ₹2,000 reward on certification",
    description:
      "Short-term skill training across 40+ job roles (retail, healthcare, IT/ITES, construction, beauty & wellness, electronics, etc.) with free certification and placement support.",
    descriptionHi:
      "40+ नौकरी भूमिकाओं (रिटेल, हेल्थकेयर, IT/ITES, निर्माण, ब्यूटी वेलनेस, इलेक्ट्रॉनिक्स आदि) में अल्पकालिक कौशल प्रशिक्षण, निःशुल्क प्रमाणन और प्लेसमेंट सहायता।",
    eligibility:
      "Indian citizen aged 15–45. School/college dropouts, unemployed youth preferred. Aadhaar and bank account required.",
    eligibilityHi:
      "15–45 आयु के भारतीय नागरिक। स्कूल/कॉलेज ड्रॉपआउट और बेरोज़गार युवाओं को प्राथमिकता। आधार और बैंक खाता आवश्यक।",
    requirements: "Aadhaar, bank passbook, recent photo, 10th/12th marksheet (if any).",
    requirementsHi: "आधार, बैंक पासबुक, हाल का फोटो, 10वीं/12वीं की मार्कशीट (यदि हो)।",
    skills: [],
    tags: ["Skill Training", "Free", "All India", "Government"],
    postedDaysAgo: 30,
  },
  {
    id: "sch-004",
    title: "PM SVANidhi – Street Vendor Loan",
    titleHi: "पीएम स्वनिधि – रेहड़ी-पटरी विक्रेता ऋण",
    company: "Ministry of Housing & Urban Affairs",
    companyHi: "आवासन एवं शहरी कार्य मंत्रालय",
    location: "Urban India",
    locationHi: "शहरी भारत",
    type: "SCHEME",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    stipend: "Working capital loan up to ₹50,000",
    description:
      "Collateral-free working capital loans for street vendors to restart businesses post-pandemic. Timely repayment unlocks higher loan limits and interest subsidy.",
    descriptionHi:
      "रेहड़ी-पटरी विक्रेताओं को बिना गारंटी कार्यशील पूंजी ऋण, ताकि वे अपना व्यवसाय फिर से शुरू कर सकें। समय पर चुकाने पर अधिक ऋण सीमा और ब्याज सब्सिडी मिलती है।",
    eligibility:
      "Street vendors in urban areas with vending certificate or Letter of Recommendation (LoR) from ULN/TVC.",
    eligibilityHi:
      "शहरी क्षेत्र के रेहड़ी-पटरी विक्रेता जिनके पास वेंडिंग प्रमाण-पत्र या ULN/TVC का अनुशंसा-पत्र हो।",
    requirements: "Aadhaar, vending certificate/LoR, bank account, mobile number linked to Aadhaar.",
    requirementsHi: "आधार, वेंडिंग प्रमाण-पत्र/LoR, बैंक खाता, आधार से जुड़ा मोबाइल।",
    skills: [],
    tags: ["Loan", "Self-employed", "Street Vendors", "Government"],
    postedDaysAgo: 15,
  },
  {
    id: "sch-005",
    title: "Mudra Loan (Shishu / Kishor / Tarun)",
    titleHi: "मुद्रा ऋण (शिशु / किशोर / तरुण)",
    company: "Pradhan Mantri MUDRA Yojana",
    location: "All India",
    type: "SCHEME",
    workMode: "ON_SITE",
    experienceLevel: "FRESHER",
    stipend: "Loan up to ₹10 lakh; no processing fee for Shishu",
    description:
      "Collateral-free business loans for micro and small enterprises: Shishu (up to ₹50k), Kishor (₹50k–5 lakh), Tarun (₹5–10 lakh). Available through all banks.",
    eligibility: "Any Indian citizen with a business plan for a non-farm income-generating activity.",
    requirements: "Business plan, identity/address proof, bank statements, quotation of items to be purchased.",
    skills: [],
    tags: ["Loan", "Business", "MSME", "All India"],
    postedDaysAgo: 45,
  },
  {
    id: "sch-006",
    title: "Free Python & Data Science Course (NPTEL)",
    titleHi: "निःशुल्क Python एवं डेटा साइंस कोर्स (NPTEL)",
    company: "NPTEL / IIT Madras",
    location: "Online",
    type: "SKILLING",
    workMode: "REMOTE",
    experienceLevel: "FRESHER",
    stipend: "Free enrollment; certification fee ₹1,000",
    duration: "12 weeks",
    description:
      "NPTEL's 12-week certified course in Python for Data Science — learn from IIT professors. Free online videos; pay a small fee for the proctored exam and certificate.",
    skills: ["Python", "Data Science", "NumPy", "Pandas", "Matplotlib"],
    tags: ["Free Course", "Certification", "Online"],
    requirements: "Basic 12th-level math. Laptop/PC with internet. Any age/qualification.",
    postedDaysAgo: 8,
  },
];
