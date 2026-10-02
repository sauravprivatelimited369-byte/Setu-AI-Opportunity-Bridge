import { NextResponse } from "next/server";
import { applyToOpportunity, getOpportunityById, getSeeker } from "@/lib/db";
import { generateAiFeedback } from "@/lib/matching";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = (body?.opportunityId as string) ?? "";
  if (!id) return NextResponse.json({ error: "opportunityId required" }, { status: 400 });
  const opp = getOpportunityById(id);
  if (!opp) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  const seeker = getSeeker();
  const ai = generateAiFeedback(seeker, opp);
  const app = applyToOpportunity(id, ai);
  return NextResponse.json({ application: app, ai });
}
