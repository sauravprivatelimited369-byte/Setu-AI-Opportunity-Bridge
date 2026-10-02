import { NextResponse } from "next/server";
import { getSeeker, updateSeeker } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ profile: getSeeker() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const skills =
    typeof body.skills === "string"
      ? (body.skills as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(body.skills)
      ? body.skills
      : [];
  const languages =
    typeof body.languages === "string"
      ? (body.languages as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(body.languages)
      ? body.languages
      : [];
  const preferredTypes = Array.isArray(body.preferredTypes)
    ? body.preferredTypes
    : typeof body.preferredTypes === "string" && body.preferredTypes
    ? body.preferredTypes.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];
  const exp = Number(body.experienceYears);
  const updated = updateSeeker({
    name: body.name ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    location: body.location ?? "",
    currentRole: body.currentRole ?? "",
    experienceYears: Number.isFinite(exp) ? exp : 0,
    education: body.education ?? "",
    skills,
    languages,
    bio: body.bio ?? "",
    preferredTypes,
    preferredLocation: body.preferredLocation ?? body.location ?? "",
  });
  return NextResponse.json({ profile: updated });
}
