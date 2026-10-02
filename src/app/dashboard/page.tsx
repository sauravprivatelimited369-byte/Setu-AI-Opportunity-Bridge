"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  Bookmark,
  Briefcase,
  CheckCircle2,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import { useLang } from "@/context/LangContext";
import OpportunityCard from "@/components/OpportunityCard";
import StatCard from "@/components/StatCard";
import type { MatchResult, SeekerProfile, Opportunity } from "@/lib/types";

type AppEntry = {
  id: string;
  opportunityId: string;
  status: string;
  aiScore?: number;
  aiFeedback?: string;
  appliedAt: string;
  opportunity: Opportunity;
};
type SavedEntry = { id: string; savedAt: string; opportunity: Opportunity };

type Dashboard = {
  profile: SeekerProfile;
  stats: { applied: number; saved: number; highMatchCount: number; totalOpps: number; profileCompleteness: number };
  applications: AppEntry[];
  saved: SavedEntry[];
  topMatches: MatchResult[];
  skillSuggestions: string[];
};

export default function DashboardPage() {
  const { lang } = useLang();
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const T = (en: string, hi: string) => (lang === "hi" ? hi : en);

  if (!data) {
    return <div className="max-w-6xl mx-auto p-6">{T("Loading…", "लोड हो रहा है…")}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-ink-900 flex items-center gap-2">
            <Sparkles size={24} className="text-setu-600" />
            {T(
              `Namaste${data.profile.name ? ", " + data.profile.name.split(" ")[0] : ""} 👋`,
              `नमस्ते${data.profile.name ? ", " + data.profile.name.split(" ")[0] : ""} 👋`
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            {T(
              "Here's your opportunity dashboard for today.",
              "आज के अवसरों का आपका डैशबोर्ड यहाँ है।"
            )}
          </p>
        </div>
        <Link href="/profile" className="btn-secondary inline-flex items-center gap-2 text-sm">
          <UserCircle size={16}/> {T("Edit profile", "प्रोफ़ाइल संपादित करें")}
        </Link>
      </div>

      {/* Profile Completeness */}
      {data.stats.profileCompleteness < 100 && (
        <div className="card p-4 mb-5 !border-setu-200 !bg-setu-50/40 flex items-center gap-4">
          <Target size={20} className="text-setu-700 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-semibold text-setu-800">
                {T("Complete your profile for better matches", "बेहतर मैच के लिए प्रोफ़ाइल पूरी करें")}
              </span>
              <span className="font-bold text-setu-800">{data.stats.profileCompleteness}%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden border border-setu-100">
              <div className="h-full bg-gradient-to-r from-setu-500 to-saffron-500" style={{ width: `${data.stats.profileCompleteness}%` }}/>
            </div>
          </div>
          <Link href="/profile" className="text-sm text-setu-700 font-semibold inline-flex items-center gap-1">
            {T("Finish", "पूरा करें")} <ArrowRight size={14}/>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label={T("High-match opps", "उच्च मैच वाले अवसर")} value={data.stats.highMatchCount} sublabel={T("70%+ match score", "70%+ मैच स्कोर")} accent="green" href="/matches"/>
        <StatCard icon={Send} label={T("Applied", "आवेदन किए")} value={data.stats.applied} sublabel={T("Track status", "स्थिति देखें")} accent="blue" href="/applications"/>
        <StatCard icon={Bookmark} label={T("Saved", "सहेजे गए")} value={data.stats.saved} sublabel={T("Review later", "बाद में देखें")} accent="orange" href="/saved"/>
        <StatCard icon={Briefcase} label={T("Total opps", "कुल अवसर")} value={data.stats.totalOpps} sublabel={T("Across all types", "सभी प्रकार")} accent="gray" href="/opportunities"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Matches */}
        <section className="lg:col-span-2">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-xl font-bold text-ink-900 flex items-center gap-2">
              <Award size={20} className="text-setu-600" /> {T("Top opportunities for you", "आपके लिए शीर्ष अवसर")}
            </h2>
            <Link href="/matches" className="text-sm text-setu-700 font-semibold inline-flex items-center gap-1">
              {T("See all", "सभी देखें")} <ArrowRight size={14}/>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.topMatches.map((m) => (
              <OpportunityCard key={m.opportunity.id} opportunity={m.opportunity} score={m.score} reasons={m.reasons}/>
            ))}
          </div>
        </section>

        {/* Right column */}
        <aside className="space-y-5">
          {/* Skill suggestions */}
          {data.skillSuggestions.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-ink-900 mb-2 flex items-center gap-1.5">
                <Sparkles size={18} className="text-saffron-500"/> {T("Skills trending in your matches", "आपके मैच में माँगे जा रहे स्किल्स")}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {T("Building these could unlock more opportunities:", "इन्हें सीखने से और अवसर खुल सकते हैं:")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.skillSuggestions.map((s) => (
                  <span key={s} className="chip chip-orange">{s}</span>
                ))}
              </div>
              <Link href="/opportunities?type=SKILLING" className="mt-4 text-sm text-setu-700 font-semibold inline-flex items-center gap-1">
                {T("Find free courses →", "निःशुल्क कोर्स देखें →")}
              </Link>
            </div>
          )}

          {/* Recent applications */}
          <div className="card p-5">
            <h3 className="font-bold text-ink-900 mb-3 flex items-center gap-1.5">
              <CheckCircle2 size={18} className="text-setu-600"/> {T("Recent applications", "हाल के आवेदन")}
            </h3>
            {data.applications.length === 0 ? (
              <p className="text-sm text-gray-500">
                {T("No applications yet — your applied roles will show up here.", "अभी कोई आवेदन नहीं — आवेदन करने पर वे यहाँ दिखाई देंगे।")}
              </p>
            ) : (
              <ul className="space-y-3">
                {data.applications.slice(0, 4).map((a: AppEntry) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-setu-50 text-setu-700 flex items-center justify-center shrink-0">
                      <Briefcase size={16}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/opportunities/${a.opportunity.id}`} className="font-semibold text-sm text-ink-900 hover:text-setu-700 line-clamp-1">
                        {lang === "hi" && a.opportunity.titleHi ? a.opportunity.titleHi : a.opportunity.title}
                      </Link>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{new Date(a.appliedAt).toLocaleDateString()}</span>
                        <span className="chip chip-green !py-0 !px-2 !text-[10px]">
                          {a.aiScore}% {T("match", "मैच")}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/applications" className="mt-4 text-sm text-setu-700 font-semibold inline-flex items-center gap-1">
              {T("Track all applications →", "सभी आवेदन ट्रैक करें →")}
            </Link>
          </div>

          {/* Quick actions */}
          <div className="card p-5 bg-gradient-to-br from-setu-600 to-setu-800 text-white">
            <h3 className="font-bold text-lg mb-1">{T("Talk to Setu Mitra", "सेतु मित्र से बात करें")}</h3>
            <p className="text-setu-50/90 text-sm mb-3">
              {T("Ask anything — jobs, schemes, career help.", "कुछ भी पूछें — नौकरी, योजनाएँ, करियर सलाह।")}
            </p>
            <Link href="/chat" className="inline-flex items-center gap-1 bg-white text-setu-700 px-3 py-1.5 rounded-lg font-semibold text-sm">
              {T("Open chat →", "चैट खोलें →")}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
