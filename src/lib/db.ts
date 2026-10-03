import fs from "node:fs";
import path from "node:path";
import type { SeekerProfile } from "./types";
import { seedOpportunities } from "../data/opportunities";
import type { Application, ChatMessage, Opportunity, SavedOpportunity } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const TMP_DIR = process.env.VERCEL ? "/tmp" : DATA_DIR;
const TMP_FILE = path.join(TMP_DIR, "db.json");

type DbShape = {
  opportunities: Opportunity[];
  seeker: SeekerProfile;
  applications: Application[];
  saved: SavedOpportunity[];
  messages: ChatMessage[];
};

function defaultSeeker(): SeekerProfile {
  return {
    id: "me",
    name: "",
    email: "",
    phone: "",
    location: "",
    currentRole: "",
    experienceYears: 0,
    education: "",
    skills: [],
    languages: ["English", "Hindi"],
    bio: "",
    preferredTypes: [],
    preferredLocation: "",
  };
}

function seed(): DbShape {
  return {
    opportunities: seedOpportunities.map((o) => ({ ...o, saved: false, applied: false })),
    seeker: defaultSeeker(),
    applications: [],
    saved: [],
    messages: [],
  };
}

// In-memory fallback used when filesystem is read-only (e.g., Vercel serverless)
let memoryDb: DbShape | null = null;
let fsAvailable: boolean | null = null;

function canUseFs(): boolean {
  if (fsAvailable !== null) return fsAvailable;
  try {
    const dir = process.env.VERCEL ? TMP_DIR : DATA_DIR;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const testFile = path.join(dir, ".write-test");
    fs.writeFileSync(testFile, "ok", "utf-8");
    fs.unlinkSync(testFile);
    fsAvailable = true;
  } catch {
    fsAvailable = false;
  }
  return fsAvailable;
}

function readFile(p: string): string | null {
  try { return fs.readFileSync(p, "utf-8"); } catch { return null; }
}
function writeFile(p: string, data: string): boolean {
  try { fs.writeFileSync(p, data, "utf-8"); return true; } catch { return false; }
}

function ensure(): DbShape {
  if (memoryDb) return memoryDb;
  const tryPaths = canUseFs() ? [TMP_FILE, DB_FILE] : [];
  for (const fp of tryPaths) {
    const raw = readFile(fp);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as DbShape;
        if (parsed.opportunities?.length) {
          if (!parsed.seeker) parsed.seeker = defaultSeeker();
          if (!parsed.applications) parsed.applications = [];
          if (!parsed.saved) parsed.saved = [];
          if (!parsed.messages) parsed.messages = [];
          memoryDb = parsed;
          return parsed;
        }
      } catch { /* corrupt */ }
    }
  }
  memoryDb = seed();
  if (canUseFs()) writeFile(TMP_FILE, JSON.stringify(memoryDb, null, 2));
  return memoryDb;
}

function read(): DbShape { return ensure(); }

function persist(db: DbShape) {
  memoryDb = db;
  if (canUseFs()) { writeFile(TMP_FILE, JSON.stringify(db, null, 2)); }
}

export function resetDb() { persist(seed()); }

// ---------- Opportunities ----------
export function getOpportunities(): Opportunity[] { return read().opportunities; }
export function getOpportunityById(id: string): Opportunity | undefined {
  return read().opportunities.find((o) => o.id === id);
}
export function listOpportunities(filters?: { type?: string; q?: string; location?: string; workMode?: string; experience?: string; }): Opportunity[] {
  let list = getOpportunities();
  const db = read();
  const appliedSet = new Set(db.applications.map(a => a.opportunityId));
  const savedSet = new Set(db.saved.map(s => s.opportunityId));
  list = list.map(o => ({ ...o, applied: appliedSet.has(o.id), saved: savedSet.has(o.id) }));
  if (filters) {
    if (filters.type && filters.type !== "ALL") list = list.filter((o) => o.type === filters.type);
    if (filters.workMode && filters.workMode !== "ALL") list = list.filter((o) => o.workMode === filters.workMode);
    if (filters.experience && filters.experience !== "ALL") list = list.filter((o) => o.experienceLevel === filters.experience);
    if (filters.location) { const q = filters.location.toLowerCase(); list = list.filter((o) => o.location.toLowerCase().includes(q)); }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter((o) => [o.title, o.company, o.location, o.description, o.skills.join(" "), o.tags.join(" ")].join(" ").toLowerCase().includes(q));
    }
  }
  return list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
}

// ---------- Seeker ----------
export function getSeeker(): SeekerProfile { return read().seeker; }
export function updateSeeker(patch: Partial<SeekerProfile>): SeekerProfile {
  const db = read();
  db.seeker = { ...db.seeker, ...patch, id: "me" };
  persist(db);
  return db.seeker;
}

// ---------- Saved ----------
export function getSaved(): SavedOpportunity[] { return read().saved; }
export function toggleSave(opportunityId: string): { saved: boolean } {
  const db = read();
  const idx = db.saved.findIndex((s) => s.opportunityId === opportunityId && s.seekerId === "me");
  if (idx >= 0) { db.saved.splice(idx, 1); persist(db); return { saved: false }; }
  db.saved.push({ id: cryptoRandomId(), opportunityId, seekerId: "me", savedAt: new Date().toISOString() });
  persist(db); return { saved: true };
}
export function isSaved(opportunityId: string): boolean {
  return read().saved.some((s) => s.opportunityId === opportunityId && s.seekerId === "me");
}

// ---------- Applications ----------
export function getApplications(): Application[] { return read().applications; }
export function applyToOpportunity(opportunityId: string, ai: { score: number; feedback: string }): Application {
  const db = read();
  const existing = db.applications.find((a) => a.opportunityId === opportunityId && a.seekerId === "me");
  if (existing) return existing;
  const app: Application = { id: cryptoRandomId(), opportunityId, seekerId: "me", status: "applied", aiScore: ai.score, aiFeedback: ai.feedback, appliedAt: new Date().toISOString() };
  db.applications.push(app);
  // also mark opportunity as applied
  const opp = db.opportunities.find(o => o.id === opportunityId);
  if (opp) opp.applied = true;
  persist(db);
  return app;
}
export function hasApplied(opportunityId: string): boolean {
  return read().applications.some((a) => a.opportunityId === opportunityId && a.seekerId === "me");
}

// ---------- Chat ----------
export function getMessages(sessionId: string): ChatMessage[] {
  return read().messages.filter((m) => m.sessionId === sessionId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
export function addMessage(sessionId: string, role: "user" | "assistant", content: string): ChatMessage {
  const db = read();
  const msg: ChatMessage = { id: cryptoRandomId(), sessionId, role, content, createdAt: new Date().toISOString() };
  db.messages.push(msg);
  persist(db);
  return msg;
}

function cryptoRandomId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
