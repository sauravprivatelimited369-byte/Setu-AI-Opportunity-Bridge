import { NextResponse } from "next/server";
import { addMessage, getMessages } from "@/lib/db";
import { chatReply } from "@/lib/assistant";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") ?? "default";
  const messages = getMessages(sessionId);
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = (body?.message as string) ?? "";
  const sessionId = (body?.sessionId as string) ?? "default";
  if (!message.trim()) return NextResponse.json({ error: "empty message" }, { status: 400 });
  addMessage(sessionId, "user", message);
  const history = getMessages(sessionId);
  const reply = chatReply(message, history);
  const saved = addMessage(sessionId, "assistant", reply.text);
  return NextResponse.json({ reply: saved, assistant: reply });
}
