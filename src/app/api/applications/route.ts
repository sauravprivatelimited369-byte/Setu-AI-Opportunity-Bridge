import { NextResponse } from "next/server";
import { getApplications, getOpportunityById } from "@/lib/db";
import type { Application, Opportunity } from "@/lib/types";

type AppWithOpp = Application & { opportunity: Opportunity };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  let apps = getApplications();
  if (status && status !== "ALL") apps = apps.filter((a) => a.status === status);
  const withOpp = apps
    .map((a): AppWithOpp | null => {
      const o = getOpportunityById(a.opportunityId);
      if (!o) return null;
      return { ...a, opportunity: o };
    })
    .filter((x): x is AppWithOpp => x !== null)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  return NextResponse.json({ applications: withOpp });
}
