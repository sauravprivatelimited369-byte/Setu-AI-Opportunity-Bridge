import { NextResponse } from "next/server";
import { getSaved, getOpportunityById } from "@/lib/db";
import type { Opportunity, SavedOpportunity } from "@/lib/types";

type SavedWithOpp = SavedOpportunity & { opportunity: Opportunity };

export async function GET() {
  const saved = getSaved();
  const withOpp = saved
    .map((s): SavedWithOpp | null => {
      const o = getOpportunityById(s.opportunityId);
      if (!o) return null;
      return { ...s, opportunity: o };
    })
    .filter((x): x is SavedWithOpp => x !== null)
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  return NextResponse.json({ saved: withOpp });
}
