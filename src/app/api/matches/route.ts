import { NextResponse } from "next/server";
import { getMatches } from "@/lib/matching";
import { isSaved, hasApplied } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));
  const matches = getMatches(limit).map((m) => ({
    ...m,
    opportunity: {
      ...m.opportunity,
      saved: isSaved(m.opportunity.id),
      applied: hasApplied(m.opportunity.id),
    },
  }));
  return NextResponse.json({ matches });
}
