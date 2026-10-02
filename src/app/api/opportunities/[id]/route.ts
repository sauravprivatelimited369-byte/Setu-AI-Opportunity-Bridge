import { NextResponse } from "next/server";
import { getOpportunityById, isSaved, hasApplied, getSeeker } from "@/lib/db";
import { scoreOpportunity } from "@/lib/matching";
import { checkEligibility } from "@/lib/eligibility";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opp = getOpportunityById(id);
  if (!opp) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const seeker = getSeeker();
  const match = scoreOpportunity(seeker, opp);
  const eligibility = ["SCHEME", "SCHOLARSHIP", "SKILLING"].includes(opp.type)
    ? checkEligibility(opp, seeker)
    : null;
  return NextResponse.json({
    opportunity: { ...opp, saved: isSaved(id), applied: hasApplied(id) },
    match,
    eligibility,
  });
}
