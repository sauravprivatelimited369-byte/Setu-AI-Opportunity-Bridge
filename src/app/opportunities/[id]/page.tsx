"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookmarkCheck,
  BookmarkPlus,
  Building2,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT, pickLocalized } from "@/lib/i18n";
import type { EligibilityCheck } from "@/lib/eligibility";
import { statusLabel } from "@/lib/eligibility";
import type { MatchResult, Opportunity } from "@/lib/types";

export default function OpportunityDetail() {
  const { lang } = useLang();
  const t = useT(lang);
  const params = useParams();
  const id = params?.id as string;

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityCheck | null>(null);
  const [applying, setApplying] = useState(false);
  const [appliedResult, setAppliedResult] = useState<{ score: number; feedback: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/opportunities/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setOpp(d.opportunity);
        setMatch(d.match);
        setEligibility(d.eligibility ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!opp) return;
    const r = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: opp.id }),
    });
    const d = await r.json();
    setOpp({ ...opp, saved: d.saved });
  };

  const handleApply = async () => {
    if (!opp || opp.applied) return;
    setApplying(true);
    const r = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: opp.id }),
    });
    const d = await r.json();
    setOpp({ ...opp, applied: true });
    setAppliedResult(d.ai);
    setApplying(false);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">{lang === "hi" ? "लोड हो रहा है…" : "Loading…"}</div>;
  }
  if (!opp) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>{lang === "hi" ? "अवसर नहीं मिला।" : "Opportunity not found."}</p>
        <Link href="/opportunities" className="text-setu-700 underline">{t.back}</Link>
      </div>
    );
  }

  const score = appliedResult?.score ?? match?.score ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/opportunities" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-setu-700 mb-6">
        <ArrowLeft size={16}/> {t.back}
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="chip chip-green">{t.typeLabels[opp.type]}</span>
              {opp.workMode === "REMOTE" && <span className="chip chip-blue">{t.remote}</span>}
              {opp.workMode === "HYBRID" && <span className="chip chip-green">{t.hybrid}</span>}
              {opp.workMode === "ON_SITE" && <span className="chip chip-gray">{t.onSite}</span>}
              {opp.experienceLevel === "FRESHER" && <span className="chip chip-green">{lang === "hi" ? "फ्रेशर" : "Fresher"}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
              {pickLocalized(opp, "title", lang)}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
              <span className="flex items-center gap-1"><Building2 size={16}/> {pickLocalized(opp, "company", lang)}</span>
              <span className="flex items-center gap-1"><MapPin size={16}/> {pickLocalized(opp, "location", lang)}</span>
              {(opp.salaryLabel || opp.stipend) && (
                <span className="font-semibold text-gray-800">
                  {pickLocalized(opp, "salaryLabel", lang) || opp.stipend}
                </span>
              )}
              {opp.duration && <span className="text-sm">{opp.duration}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} className="btn-secondary flex items-center gap-1.5 text-sm">
              {opp.saved ? <BookmarkCheck size={16} className="text-setu-600"/> : <BookmarkPlus size={16}/>}
              {opp.saved ? t.saved : t.save}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="md:col-span-2 space-y-5">
            <section>
              <h2 className="text-lg font-bold text-ink-900 mb-2 flex items-center gap-2">
                <Target size={18} className="text-setu-600"/> {t.aboutRole}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {pickLocalized(opp, "description", lang)}
              </p>
            </section>

            {(opp.eligibility || opp.eligibilityHi) && (
              <section>
                <h2 className="text-lg font-bold text-ink-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-setu-600"/> {t.eligibility}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{pickLocalized(opp, "eligibility", lang)}</p>
              </section>
            )}

            <section>
              <h2 className="text-lg font-bold text-ink-900 mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-setu-600"/> {t.requirements}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{pickLocalized(opp, "requirements", lang)}</p>
            </section>

            {opp.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-ink-900 mb-2 flex items-center gap-2">
                  <Sparkles size={18} className="text-setu-600"/> {t.skills}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {opp.skills.map((s) => {
                    const has = match?.strengths?.some((x) => x.toLowerCase() === s.toLowerCase()) || match?.strengths?.some((x) => s.toLowerCase().includes(x.toLowerCase()) || x.toLowerCase().includes(s.toLowerCase()));
                    return (
                      <span key={s} className={`chip ${has ? "chip-green" : ""}`}>{s}</span>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card p-4 bg-setu-50/50 !border-setu-100">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-setu-700 font-semibold text-sm"><Sparkles size={14}/>{t.matchScore}</div>
                <div className="text-xl font-extrabold text-setu-700">{score}%</div>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-setu-100">
                <div className="h-full bg-gradient-to-r from-setu-500 to-saffron-500" style={{ width: `${score}%` }}/>
              </div>
              {match && match.reasons.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {match.reasons.slice(0, 3).map((r, i) => (
                    <li key={i} className="flex gap-2 text-gray-700">
                      <CheckCircle2 size={16} className="text-setu-600 shrink-0 mt-0.5"/> <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
              {match && match.skillGaps.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <Lightbulb size={14}/>{t.skillGaps}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {match.skillGaps.slice(0, 4).map((s) => (
                      <span key={s} className="chip chip-orange">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleApply}
              disabled={applying || !!opp.applied}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {opp.applied ? (
                <><CheckCircle2 size={16}/> {lang === "hi" ? "आवेदन हो चुका" : "Applied"}</>
              ) : (
                <><ExternalLink size={16}/> {t.applyNow}</>
              )}
            </button>
            {opp.applyUrl && (
              <a href={opp.applyUrl} target="_blank" rel="noreferrer" className="btn-secondary w-full flex items-center justify-center gap-2">
                <ExternalLink size={16}/> {t.applyExternal}
              </a>
            )}
            {opp.contactEmail && (
              <p className="text-xs text-gray-500 text-center">
                {lang === "hi" ? "संपर्क:" : "Contact:"} <a className="underline" href={`mailto:${opp.contactEmail}`}>{opp.contactEmail}</a>
              </p>
            )}

            {appliedResult?.feedback && (
              <div className="card p-4 border-setu-200 bg-setu-50/40">
                <div className="flex items-center gap-1.5 text-setu-700 font-semibold text-sm mb-1">
                  <Sparkles size={14}/> {t.aiFeedback}
                </div>
                <p className="text-sm text-gray-700">{appliedResult.feedback}</p>
              </div>
            )}

            {eligibility && (
              <div className={`card p-4 ${eligibility.eligible ? "!border-setu-200 !bg-setu-50/40" : "!border-orange-200 !bg-orange-50/50"}`}>
                <div className="flex items-center gap-1.5 font-semibold text-sm mb-2">
                  <ShieldCheck size={16} className={eligibility.eligible ? "text-setu-700" : "text-orange-700"}/>
                  <span className={eligibility.eligible ? "text-setu-700" : "text-orange-700"}>
                    {lang === "hi" ? "पात्रता जाँच" : "Eligibility check"}: {statusLabel(eligibility.status, lang)}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {eligibility.reasons.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      {r.ok ? (
                        <CheckCircle2 size={14} className="text-setu-600 shrink-0 mt-0.5"/>
                      ) : (
                        <Lightbulb size={14} className="text-orange-600 shrink-0 mt-0.5"/>
                      )}
                      <span>{r.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-gray-500 mt-2">
                  {lang === "hi"
                    ? "यह एक स्वचालित प्रारंभिक जाँच है। आवेदन से पहले आधिकारिक पोर्टल पर अवश्य सत्यापित करें।"
                    : "This is an automated initial check. Please verify on the official portal before applying."}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
