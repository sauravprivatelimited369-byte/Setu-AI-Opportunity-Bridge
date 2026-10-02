import { NextResponse } from "next/server";
import { listOpportunities, isSaved, hasApplied } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  const location = url.searchParams.get("location") ?? undefined;
  const workMode = url.searchParams.get("workMode") ?? undefined;
  const experience = url.searchParams.get("experience") ?? undefined;

  const opps = listOpportunities({ type, q, location, workMode, experience }).map((o) => ({
    ...o,
    saved: isSaved(o.id),
    applied: hasApplied(o.id),
  }));
  return NextResponse.json({ opportunities: opps });
}
