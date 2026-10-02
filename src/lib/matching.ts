import { getOpportunities, getSeeker } from "./db";
import type { MatchResult, Opportunity, SeekerProfile } from "./types";

const STOPWORDS = new Set([
  "and", "or", "the", "in", "for", "of", "to", "a", "an", "with", "on", "at",
  "from", "by", "as", "is", "are", "be", "using", "use",
]);

function tokenize(s: string | undefined): string[] {
  if (!s) return [];
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+#.\- ]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t));
}

function skillMatch(
  seekerSkills: string[],
  oppSkills: string[]
): { matched: string[]; missing: string[]; ratio: number } {
  const s = new Set(seekerSkills.map((x) => x.toLowerCase().trim()));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const raw of oppSkills) {
    const sk = raw.toLowerCase().trim();
    const hit =
      s.has(sk) ||
      Array.from(s).some(
        (us) => us.includes(sk) || sk.includes(us)
      );
    if (hit) matched.push(raw);
    else missing.push(raw);
  }
  const ratio = oppSkills.length === 0 ? 1 : matched.length / oppSkills.length;
  return { matched, missing, ratio };
}

function locationScore(seekerLoc: string | undefined, oppLoc: string): number {
  if (!seekerLoc) return 0.5;
  const sl = seekerLoc.toLowerCase();
  const ol = oppLoc.toLowerCase();
  if (ol.includes("remote") || ol.includes("online") || ol.includes("all india")) return 1;
  for (const token of tokenize(sl)) {
    if (token.length < 3) continue;
    if (ol.includes(token)) return 1;
  }
  return 0;
}

function experienceFit(expYears: number, level: string): number {
  switch (level) {
    case "FRESHER":
      return expYears <= 1 ? 1 : 0.6;
    case "ENTRY":
      return expYears <= 2 ? 1 : 0.8;
    case "JUNIOR":
      return expYears >= 1 && expYears <= 4 ? 1 : expYears < 1 ? 0.5 : 0.7;
    case "MID":
      return expYears >= 3 && expYears <= 7 ? 1 : 0.5;
    case "SENIOR":
      return expYears >= 5 ? 1 : 0.3;
    default:
      return 0.6;
  }
}

export function scoreOpportunity(
  seeker: SeekerProfile,
  opp: Opportunity
): MatchResult {
  const reasons: string[] = [];
  let score = 0;

  // Skill match (up to 50 pts). If opportunity lists no required skills (many schemes),
  // score a neutral-but-not-max baseline so real skill matches rise to the top.
  const sk = skillMatch(seeker.skills, opp.skills);
  if (opp.skills.length === 0) {
    score += 20;
    reasons.push("No specific skills required — broadly accessible.");
  } else {
    score += sk.ratio * 50;
    if (sk.matched.length > 0) {
      reasons.push(
        `You already have ${sk.matched.length}/${opp.skills.length} required skill(s): ${sk.matched
          .slice(0, 3)
          .join(", ")}`
      );
    }
  }

  // Location (20 pts)
  const loc = locationScore(seeker.location, opp.location);
  score += loc * 20;
  if (loc >= 1) reasons.push(`Location "${opp.location}" matches your preference.`);
  else if (opp.workMode === "REMOTE")
    reasons.push("This is a remote opportunity — you can work from anywhere.");

  // Experience (15 pts)
  const expFit = experienceFit(seeker.experienceYears ?? 0, opp.experienceLevel);
  score += expFit * 15;
  if (expFit >= 0.9)
    reasons.push(`Your experience (${seeker.experienceYears} yrs) fits the ${opp.experienceLevel.toLowerCase()} level well.`);

  // Work-mode preference (10 pts)
  // remote/hybrid bonuses for most seekers
  if (opp.workMode === "REMOTE") {
    score += 8;
    reasons.push("Remote work fits modern flexible preferences.");
  } else if (opp.workMode === "HYBRID") {
    score += 6;
    reasons.push("Hybrid setup offers a balanced work style.");
  } else {
    score += 4;
  }

  // Type preference (up to 20 pts). Strong reward for preferred types, mild penalty
  // for categories the seeker hasn't favourited, so schemes/scholarships don't outrank
  // core job matches unless the user opts in.
  const prefs = seeker.preferredTypes && seeker.preferredTypes.length > 0 ? seeker.preferredTypes : null;
  if (prefs && prefs.includes(opp.type)) {
    score += 20;
    reasons.push(`This matches your preferred opportunity type (${labelType(opp.type)}).`);
  } else if (prefs) {
    score += 2;
  } else {
    score += 8;
  }

  // Recency freshness bonus
  score += Math.max(0, 5 - opp.postedDaysAgo) * 0.2;

  const final = Math.max(0, Math.min(100, Math.round(score)));
  const strengths = sk.matched.slice(0, 4);
  const skillGaps = sk.missing;

  return {
    opportunity: opp,
    score: final,
    reasons,
    skillGaps,
    strengths,
  };
}

export function getMatches(limit = 20): MatchResult[] {
  const seeker = getSeeker();
  const opps = getOpportunities();
  const results = opps.map((o) => scoreOpportunity(seeker, o));
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function generateAiFeedback(
  seeker: SeekerProfile,
  opp: Opportunity
): { score: number; feedback: string } {
  const m = scoreOpportunity(seeker, opp);
  const gap = m.skillGaps;
  let fb = "";
  if (m.score >= 80) {
    fb = `Strong match! Your skills in ${m.strengths.slice(0, 3).join(", ")} align directly with this role. Recommend applying within 2–3 days with a tailored cover letter highlighting recent projects.`;
  } else if (m.score >= 60) {
    fb = `Good fit overall. You cover core requirements (${m.strengths.slice(0, 2).join(", ")}${
      m.strengths.length > 2 ? "" : ""
    }). Strengthen your profile with ${gap.slice(0, 2).join(" and ")} before applying — a short project or certification would help.`;
  } else if (m.score >= 40) {
    fb = `Partial match. While you have ${m.strengths[0] ?? "some relevant background"}, you would benefit from building skills in ${gap.slice(0, 3).join(", ")} first. Consider related internships or freelance work to bridge the gap.`;
  } else {
    fb = `Currently a stretch match for this role. Focus on upskilling in ${gap.slice(0, 3).join(", ")} and building 2–3 portfolio projects before applying to similar opportunities.`;
  }
  return { score: m.score, feedback: fb };
}

export function labelType(t: string): string {
  const map: Record<string, string> = {
    JOB: "Job",
    INTERNSHIP: "Internship",
    SCHOLARSHIP: "Scholarship",
    SCHEME: "Government Scheme",
    SKILLING: "Skilling Course",
    GIG: "Gig Work",
  };
  return map[t] ?? t;
}
