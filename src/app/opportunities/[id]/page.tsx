"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Building2, Clock, CheckCircle2, Sparkles, ThumbsUp, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useLang } from "@/context/LangContext";
import type { Opportunity, MatchResult, Application } from "@/lib/types";
import ShareButtons from "@/components/ShareButtons";
import Confetti from "@/components/Confetti";

export default function OpportunityDetail(){
  const params = useParams();
  const id = params.id as string;
  const { lang } = useLang();
  const hi = lang === "hi";
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [appRec, setAppRec] = useState<Application | null>(null);
  const [applying, setApplying] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fire, setFire] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/opportunities/" + id);
        if (!r.ok) throw new Error("not found");
        const d = await r.json();
        setOpp(d.opportunity); setMatch(d.match);
        const ar = await fetch("/api/applications");
        const ad = await ar.json();
        setAppRec((ad.applications || []).find((a: Application) => a.opportunityId === id) || null);
      } catch (e: unknown) { setErr((e as Error).message); }
    })();
  }, [id]);

  const apply = async () => {
    if (!opp || opp.applied) return;
    setApplying(true); setErr(null);
    try {
      const r = await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ opportunityId: opp.id }) });
      if (!r.ok) throw new Error("failed");
      const d = await r.json();
      setAppRec(d.application); setOpp({ ...opp, applied: true }); setFire(true);
    } catch (e: unknown) { setErr((e as Error).message); }
    finally { setApplying(false); }
  };

  const T = (en: string, h: string) => hi ? h : en;
  const typeMap: Record<string,string> = {
    JOB: T("Job", "नौकरी"),
    SCHEME: T("Govt Scheme", "सरकारी योजना"),
    SCHOLARSHIP: T("Scholarship", "छात्रवृत्ति"),
    INTERNSHIP: T("Internship", "इंटर्नशिप"),
    SKILLING: T("Skilling course", "कौशल पाठ्यक्रम"),
    GIG: T("Gig", "गिग")
  };

  if (err) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
      <p className="text-red-600 mb-4">{err === "not found" ? T("Opportunity not found.", "अवसर नहीं मिला।") : err}</p>
      <Link href="/opportunities" className="btn-primary inline-flex items-center gap-1"><ArrowLeft size={16}/>{T("All opportunities", "सभी अवसर")}</Link>
    </div>
  );
  if (!opp) return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-3"/>Loading…</div>;

  const scoreColor = match && match.score >= 80 ? "text-setu-600 bg-setu-50 border-setu-200" : match && match.score >= 60 ? "text-orange-600 bg-orange-50 border-orange-200" : "text-gray-600 bg-gray-50 border-gray-200";
  const typeLabel = typeMap[opp.type] || opp.type;
  const title = hi && opp.titleHi ? opp.titleHi : opp.title;
  const company = hi && opp.companyHi ? opp.companyHi : opp.company;
  const loc = hi && opp.locationHi ? opp.locationHi : opp.location;
  const desc = hi && opp.descriptionHi ? opp.descriptionHi : opp.description;
  const salary = hi && opp.salaryLabelHi ? opp.salaryLabelHi : (opp.salaryLabel || (opp.salaryMin && opp.salaryMax ? "\u20B9" + (opp.salaryMin/100000).toFixed(1) + "-" + (opp.salaryMax/100000).toFixed(1) + " LPA" : ""));
  const reqs = hi && opp.requirementsHi ? opp.requirementsHi : opp.requirements;
  const wmMap: Record<string,string> = { REMOTE: T("Remote", "रिमोट"), HYBRID: T("Hybrid", "हाइब्रिड"), ON_SITE: T("On-site", "ऑन-साइट") };
  const matched = match ? opp.skills.filter(s => match.strengths.some(st => st.toLowerCase().includes(s.toLowerCase()))) : opp.skills;

  return (<>
    <Confetti fire={fire}/>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/opportunities" className="btn-secondary mb-4 inline-flex items-center gap-1 text-sm"><ArrowLeft size={14}/>{T("All opportunities", "सभी अवसर")}</Link>
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="chip chip-setu">{typeLabel}</span>
              <span className="chip chip-blue">{wmMap[opp.workMode] || opp.workMode}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-ink-900">{title}</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-1"><Building2 size={14}/>{company}</p>
          </div>
          {match && <div className={clsx("text-center border rounded-xl px-4 py-2 min-w-[90px]", scoreColor)}>
            <div className="text-2xl font-extrabold">{match.score}%</div>
            <div className="text-[11px] uppercase tracking-wide">{T("match", "मैच")}</div>
          </div>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-600 mb-5">
          <span className="inline-flex items-center gap-1.5"><MapPin size={14}/>{loc}</span>
          {salary && <span className="inline-flex items-center gap-1.5"><Briefcase size={14}/>{salary}</span>}
          <span className="inline-flex items-center gap-1.5"><Clock size={14}/>{T("Posted", "पोस्ट किया")} {opp.postedDaysAgo}d</span>
          {opp.experienceLevel && <span className="inline-flex items-center gap-1.5"><GraduationCap size={14}/>{opp.experienceLevel.toLowerCase()}</span>}
        </div>
        <p className="text-ink-800 leading-relaxed mb-4">{desc}</p>
        {reqs && <div className="mb-4">
          <h3 className="text-sm font-semibold text-ink-900 mb-2">{T("Requirements", "आवश्यकताएँ")}</h3>
          <p className="text-sm text-ink-800 whitespace-pre-wrap">{reqs}</p>
        </div>}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-ink-900 mb-2">{T("Skills required", "आवश्यक स्किल्स")}</h3>
          <div className="flex flex-wrap gap-1.5">
            {opp.skills.map(s => {
              const has = matched.some(ms => ms.toLowerCase() === s.toLowerCase());
              return <span key={s} className={clsx("chip", has ? "chip-green" : "chip-gray")}>{has ? "✓ " : ""}{s}</span>;
            })}
          </div>
        </div>
        {match && match.skillGaps.length > 0 && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm">
            <div className="font-semibold text-orange-800 mb-1">{T("Skill gaps to build first:", "स्किल गैप (पहले इन्हें सीखें)")}</div>
            <div className="flex flex-wrap gap-1.5">{match.skillGaps.map((s: string) => <span key={s} className="chip chip-orange">{s}</span>)}</div>
          </div>
        )}
        {match && match.reasons.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-ink-900 mb-2 flex items-center gap-1"><Sparkles size={14} className="text-setu-600"/>{T("Why this matches", "यह क्यों मेल खाता है")}</h3>
            <ul className="space-y-1.5 text-sm">{match.reasons.map((r: string, i: number) => <li key={i} className="flex items-start gap-2 text-ink-800"><ThumbsUp size={14} className="text-setu-600 mt-0.5 shrink-0"/>{r}</li>)}</ul>
          </div>
        )}
        {opp.eligibility && <div className="mb-4">
          <h3 className="text-sm font-semibold text-ink-900 mb-2">{T("Eligibility", "पात्रता")}</h3>
          <p className="text-sm text-ink-800 whitespace-pre-wrap">{hi && opp.eligibilityHi ? opp.eligibilityHi : opp.eligibility}</p>
        </div>}
        {opp.applyUrl && <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">{T("Apply / official link", "आवेदन / आधिकारिक लिंक")}</p>
          <a href={opp.applyUrl} target="_blank" rel="noreferrer" className="text-setu-700 underline text-sm break-all">{opp.applyUrl}</a>
        </div>}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
          <button onClick={apply} disabled={applying || !!opp.applied} className={clsx("btn-primary", (applying || !!opp.applied) && "opacity-60 cursor-not-allowed")}>
            {opp.applied ? (<><CheckCircle2 size={16}/>{T("Applied ✓", "आवेदन हो गया ✓")}</>) : applying ? (<><Loader2 size={16} className="animate-spin"/>{T("Applying…", "भेज रहे हैं…")}</>) : (<><Sparkles size={16}/>{T("Apply with AI", "AI के साथ आवेदन करें")}</>)}
          </button>
          <Link href="/chat" className="btn-secondary">{T("Ask Setu Mitra", "सेतु मित्र से पूछें")}</Link>
          <ShareButtons title={title + " — " + company + " | Setu AI"}/>
        </div>
        {err && <p className="text-red-600 text-sm mt-3">{err}</p>}
        {appRec && <div className="mt-4 card !bg-setu-50 !border-setu-200">
          <div className="flex items-start gap-2">
            <ThumbsUp size={18} className="text-setu-700 shrink-0 mt-0.5"/>
            <div>
              <p className="font-semibold text-setu-800">{T("Application submitted! (AI feedback)", "आवेदन सफल! (AI फीडबैक)")}</p>
              <p className="text-sm text-ink-800 mt-1">{appRec.aiFeedback}</p>
              {appRec.aiScore != null && <p className="text-xs text-gray-500 mt-1">{T("AI score", "AI स्कोर")}: {appRec.aiScore}%</p>}
            </div>
          </div>
        </div>}
      </div>
    </div>
  </>);
}
