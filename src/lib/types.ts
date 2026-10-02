export type OpportunityType =
  | "JOB"
  | "INTERNSHIP"
  | "SCHOLARSHIP"
  | "SCHEME"
  | "SKILLING"
  | "GIG";

export type WorkMode = "ON_SITE" | "REMOTE" | "HYBRID";
export type ExperienceLevel = "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "FRESHER";

export type Opportunity = {
  id: string;
  title: string;
  titleHi?: string;
  company: string;
  companyHi?: string;
  location: string;
  locationHi?: string;
  type: OpportunityType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryLabel?: string;
  salaryLabelHi?: string;
  description: string;
  descriptionHi?: string;
  requirements: string;
  requirementsHi?: string;
  skills: string[];
  tags: string[];
  postedDaysAgo: number;
  contactEmail?: string;
  applyUrl?: string;
  eligibility?: string;
  eligibilityHi?: string;
  stipend?: string;
  duration?: string;
  saved?: boolean;
  applied?: boolean;
};

export type SeekerProfile = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  experienceYears: number;
  education?: string;
  skills: string[];
  languages?: string[];
  bio?: string;
  preferredTypes?: OpportunityType[];
  preferredLocation?: string;
};

export type Application = {
  id: string;
  opportunityId: string;
  seekerId: string;
  status: "applied" | "reviewing" | "shortlisted" | "rejected";
  aiScore?: number;
  aiFeedback?: string;
  appliedAt: string;
};

export type SavedOpportunity = {
  id: string;
  opportunityId: string;
  seekerId: string;
  savedAt: string;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type MatchResult = {
  opportunity: Opportunity;
  score: number; // 0-100
  reasons: string[];
  skillGaps: string[];
  strengths: string[];
};

export type Lang = "en" | "hi";
