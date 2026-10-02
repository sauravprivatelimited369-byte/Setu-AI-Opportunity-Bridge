"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Briefcase, CheckCircle2, Clock, Sparkles, XCircle } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";

type App = {
  id: string;
  opportunityId: string;
  status: "applied" | "reviewing" | "shortlisted" | "rejected";
  aiScore?: number;
  aiFeedback?: string;
  appliedAt: string;
  opportunity: {
    id: string;
    title: string;
    titleHi?: string;
    company: string;
    companyHi?: string;
    location: string;
    locationHi?: string;
    type: string;
  };
};

const TABS = [
  { id: "ALL", en: "All", hi: "सभी" },
  { id: "applied", en: "Applied", hi: "आवेदित" },
  { id: "reviewing", en: "Under review", hi: "समीक्षाधीन" },
  { id: "shortlisted", en: "Shortlisted", hi: "शॉर्टलिस्टेड" },
  { id: "rejected", en: "Rejected", hi: "अस्वीकृत" },
];

export default function ApplicationsPage() {
  const { lang } = useLang();
  const t = useT(lang);
  const [apps, setApps] = useState<App[]>([]);
  const [tab, setTab] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/applications?status=${tab}`)
      .then((r) => r.json())
      .then((d) => setApps(d.applications ?? []))
      .finally(() => setLoading(false));
  }, [tab]);

  const statusStyle = (s: string) => {
    switch (s) {
      case "shortlisted":
        return "chip-green";
      case "reviewing":
        return "chip-blue";
      case "rejected":
        return "chip-orange";
      default:
        return "chip-gray";
    }
  };
  const statusIcon = (s: string) => {
    if (s === "shortlisted") return <CheckCircle2 size={14} />;
    if (s === "rejected") return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-setu-700 mb-4">
        <ArrowLeft size={16}/> {t.back}
      </Link>
      <h1 className="text-3xl font-extrabold text-ink-900 mb-1">
        {lang === "hi" ? "मेरे आवेदन" : "My Applications"}
      </h1>
      <p className="text-gray-600 mb-6">
        {lang === "hi"
          ? "आपके द्वारा आवेदित सभी अवसरों की स्थिति यहाँ ट्रैक करें।"
          : "Track all opportunities you've applied to in one place."}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t2) => (
          <button
            key={t2.id}
            onClick={() => setTab(t2.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
              tab === t2.id
                ? "bg-setu-600 text-white border-setu-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-setu-400"
            }`}
          >
            {lang === "hi" ? t2.hi : t2.en}
          </button>
        ))}
      </div>

      {loading && <div className="space-y-3">{Array.from({length:3}).map((_,i)=><div key={i} className="card p-5 h-28 animate-pulse"/>)}</div>}

      {!loading && apps.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-setu-50 text-setu-600 flex items-center justify-center mx-auto mb-3"><Briefcase size={28}/></div>
          <h3 className="text-lg font-bold">{lang === "hi" ? "अभी कोई आवेदन नहीं" : "No applications yet"}</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            {lang === "hi" ? "अवसर ब्राउज़ करें और आवेदन शुरू करें।" : "Browse opportunities and start applying."}
          </p>
          <Link href="/matches" className="btn-primary inline-flex">{t.heroCta}</Link>
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {apps.map((a) => {
            const title = lang === "hi" && a.opportunity.titleHi ? a.opportunity.titleHi : a.opportunity.title;
            const company = lang === "hi" && a.opportunity.companyHi ? a.opportunity.companyHi : a.opportunity.company;
            const loc = lang === "hi" && a.opportunity.locationHi ? a.opportunity.locationHi : a.opportunity.location;
            return (
              <div key={a.id} className="card p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <Link href={`/opportunities/${a.opportunity.id}`} className="text-lg font-bold text-ink-900 hover:text-setu-700">
                      {title}
                    </Link>
                    <div className="text-sm text-gray-600 mt-0.5">
                      {company} · {loc}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {lang === "hi" ? "आवेदन की तिथि:" : "Applied:"} {new Date(a.appliedAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`chip ${statusStyle(a.status)}`}>{statusIcon(a.status)} {lang === "hi" ? TABS.find(x=>x.id===a.status)?.hi : TABS.find(x=>x.id===a.status)?.en}</span>
                    {typeof a.aiScore === "number" && (
                      <span className="chip chip-green"><Sparkles size={12}/> {a.aiScore}% {lang === "hi" ? "मैच" : "match"}</span>
                    )}
                  </div>
                </div>
                {a.aiFeedback && (
                  <div className="mt-3 bg-setu-50/70 border border-setu-100 rounded-lg p-3 text-sm text-gray-700">
                    <div className="flex items-center gap-1.5 text-setu-700 font-semibold text-xs mb-1"><Sparkles size={12}/>{t.aiFeedback}</div>
                    {a.aiFeedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
