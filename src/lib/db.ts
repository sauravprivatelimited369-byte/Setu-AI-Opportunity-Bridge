import fs from "node:fs";
import path from "node:path";
import type { SeekerProfile } from "./types";
import { seedOpportunities } from "../data/opportunities";
import type { Application, ChatMessage, Opportunity, SavedOpportunity } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

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
    opportunities: seedOpportunities.map((o) => ({
      ...o,
      saved: false,
      applied: false,
    })),
    seeker: {
      ...defaultSeeker(),
      // demo prefilled profile so matching works out of the box
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91-98xxxxxxxx",
      location: "Bengaluru, Karnataka",
      currentRole: "Aspiring Frontend Developer",
      experienceYears: 1,
      education: "B.Tech, Computer Science (2024)",
      skills: ["React", "JavaScript", "HTML", "CSS", "TypeScript", "Git", "Python"],
      languages: ["English", "Hindi"],
      bio: "Passionate about building clean, accessible web experiences. Open to remote and hybrid roles across India.",
      preferredTypes: ["JOB", "INTERNSHIP"],
      preferredLocation: "Bengaluru",
    },
    applications: [],
    saved: [],
    messages: [],
  };
}

function ensure(): DbShape {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const data = seed();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DbShape;
    // re-seed opportunities if empty (e.g. after file wiped)
    if (!parsed.opportunities || parsed.opportunities.length === 0) {
      parsed.opportunities = seed().opportunities;
    }
    if (!parsed.seeker) parsed.seeker = defaultSeeker();
    if (!parsed.applications) parsed.applications = [];
    if (!parsed.saved) parsed.saved = [];
    if (!parsed.messages) parsed.messages = [];
    return parsed;
  } catch {
    const data = seed();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

let cached: DbShape | null = null;
function read(): DbShape {
  if (!cached) cached = ensure();
  return cached;
}
function write(db: DbShape) {
  cached = db;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function resetDb() {
  write(seed());
}

// ---------- Opportunities ----------
export function getOpportunities(): Opportunity[] {
  return read().opportunities;
}
export function getOpportunityById(id: string): Opportunity | undefined {
  return read().opportunities.find((o) => o.id === id);
}
export function listOpportunities(filters?: {
  type?: string;
  q?: string;
  location?: string;
  workMode?: string;
  experience?: string;
}): Opportunity[] {
  let list = getOpportunities();
  if (filters) {
    if (filters.type && filters.type !== "ALL") {
      list = list.filter((o) => o.type === filters.type);
    }
    if (filters.workMode && filters.workMode !== "ALL") {
      list = list.filter((o) => o.workMode === filters.workMode);
    }
    if (filters.experience && filters.experience !== "ALL") {
      list = list.filter((o) => o.experienceLevel === filters.experience);
    }
    if (filters.location) {
      const q = filters.location.toLowerCase();
      list = list.filter((o) => o.location.toLowerCase().includes(q));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter((o) => {
        const hay = [
          o.title,
          o.company,
          o.location,
          o.description,
          o.skills.join(" "),
          o.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
  }
  return list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
}

// ---------- Seeker ----------
export function getSeeker(): SeekerProfile {
  return read().seeker;
}
export function updateSeeker(patch: Partial<SeekerProfile>): SeekerProfile {
  const db = read();
  db.seeker = { ...db.seeker, ...patch, id: "me" };
  write(db);
  return db.seeker;
}

// ---------- Saved ----------
export function getSaved(): SavedOpportunity[] {
  return read().saved;
}
export function toggleSave(opportunityId: string): { saved: boolean } {
  const db = read();
  const idx = db.saved.findIndex(
    (s) => s.opportunityId === opportunityId && s.seekerId === "me"
  );
  if (idx >= 0) {
    db.saved.splice(idx, 1);
    write(db);
    return { saved: false };
  }
  db.saved.push({
    id: cryptoRandomId(),
    opportunityId,
    seekerId: "me",
    savedAt: new Date().toISOString(),
  });
  write(db);
  return { saved: true };
}
export function isSaved(opportunityId: string): boolean {
  return read().saved.some(
    (s) => s.opportunityId === opportunityId && s.seekerId === "me"
  );
}

// ---------- Applications ----------
export function getApplications(): Application[] {
  return read().applications;
}
export function applyToOpportunity(
  opportunityId: string,
  ai: { score: number; feedback: string }
): Application {
  const db = read();
  const existing = db.applications.find(
    (a) => a.opportunityId === opportunityId && a.seekerId === "me"
  );
  if (existing) return existing;
  const app: Application = {
    id: cryptoRandomId(),
    opportunityId,
    seekerId: "me",
    status: "applied",
    aiScore: ai.score,
    aiFeedback: ai.feedback,
    appliedAt: new Date().toISOString(),
  };
  db.applications.push(app);
  write(db);
  return app;
}
export function hasApplied(opportunityId: string): boolean {
  return read().applications.some(
    (a) => a.opportunityId === opportunityId && a.seekerId === "me"
  );
}

// ---------- Chat ----------
export function getMessages(sessionId: string): ChatMessage[] {
  return read()
    .messages.filter((m) => m.sessionId === sessionId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}
export function addMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): ChatMessage {
  const db = read();
  const msg: ChatMessage = {
    id: cryptoRandomId(),
    sessionId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
  db.messages.push(msg);
  write(db);
  return msg;
}

function cryptoRandomId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}
