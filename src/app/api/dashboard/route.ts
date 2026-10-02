import { NextResponse } from "next/server";
import { getApplications, getSaved, getOpportunityById, getSeeker } from "@/lib/db";
import { getMatches } from "@/lib/matching";
import type { Application, Opportunity, SavedOpportunity } from "@/lib/types";

type AppWithOpp = Application & { opportunity: Opportunity };
type SavedWithOpp = SavedOpportunity & { opportunity: Opportunity };

export async function GET() {
  const seeker = getSeeker();
  const apps = getApplications();
  const saved = getSaved();
  const matches = getMatches(3);

  const applicationsWithOpp: AppWithOpp[] = apps
    .map((a) => {
      const o = getOpportunityById(a.opportunityId);
      if (!o) return null;
      return { ...a, opportunity: o };
    })
    .filter((x): x is AppWithOpp => x !== null)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  const savedWithOpp: SavedWithOpp[] = saved
    .map((s) => {
      const o = getOpportunityById(s.opportunityId);
      if (!o) return null;
      return { ...s, opportunity: o };
    })
    .filter((x): x is SavedWithOpp => x !== null);

  const allMatches = getMatches(100);
  const highMatchCount = allMatches.filter((m) => m.score >= 70).length;
  const missingSkills = new Set<string>();
  allMatches.slice(0, 5).forEach((m) => m.skillGaps.slice(0, 2).forEach((g) => missingSkills.add(g)));

  return NextResponse.json({
    profile: seeker,
    stats: {
      applied: apps.length,
      saved: saved.length,
      highMatchCount,
      totalOpps: allMatches.length,
      profileCompleteness: computeCompleteness(seeker),
    },
    applications: applicationsWithOpp,
    saved: savedWithOpp,
    topMatches: matches.slice(0, 3),
    skillSuggestions: Array.from(missingSkills).slice(0, 5),
  });
}

function computeCompleteness(p: ReturnType<typeof getSeeker>): number {
  const fields: (string | undefined | number | string[])[] = [
    p.name, p.email, p.phone, p.location, p.currentRole, p.education, p.bio,
  ];
  let filled = fields.filter((f) => (Array.isArray(f) ? f.length > 0 : !!f && f !== 0)).length;
  if (p.skills.length >= 3) filled += 1;
  if ((p.languages ?? []).length > 0) filled += 1;
  const total = fields.length + 2;
  return Math.round((filled / total) * 100);
}
