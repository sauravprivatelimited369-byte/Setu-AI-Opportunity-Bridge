import { NextResponse } from "next/server";
import { toggleSave } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = (body?.opportunityId as string) ?? "";
  if (!id) return NextResponse.json({ error: "opportunityId required" }, { status: 400 });
  const res = toggleSave(id);
  return NextResponse.json(res);
}
