"use client";
import Link from "next/link";
import { BookmarkPlus, BookmarkCheck, MapPin, Briefcase, Clock, Sparkles, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import type { Opportunity } from "@/lib/types";
import { useLang } from "@/context/LangContext";
import { useT, pickLocalized } from "@/lib/i18n";

type Props = {
  opportunity: Opportunity;
  score?: number;
  reasons?: string[];
  onSave?: (id: string) => void;
  saved?: boolean;
};

export default function OpportunityCard({ opportunity: o, score, reasons, onSave, saved }: Props) {
  const { lang } = useLang();
  const t = useT(lang);

  const typeClass: Record<string, string> = {
    JOB: "chip-green",
    INTERNSHIP: "chip-blue",
    SCHOLARSHIP: "chip-orange",
    SCHEME: "chip-orange",
    SKILLING: "chip-blue",
    GIG: "chip-gray",
  };

  const workModeChip = () => {
    if (o.workMode === "REMOTE") return <span className="chip chip-blue">{t.remote}</span>;
    if (o.workMode === "HYBRID") return <span className="chip chip-green">{t.hybrid}</span>;
    return <span className="chip chip-gray">{t.onSite}</span>;
  };

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={clsx("chip", typeClass[o.type])}>{t.typeLabels[o.type]}</span>
            {workModeChip()}
            {o.experienceLevel === "FRESHER" && (
              <span className="chip chip-green">
                {lang === "hi" ? "फ्रेशर" : "Fresher"}
              </span>
            )}
            {(o.type === "SCHEME" || o.type === "SCHOLARSHIP" || o.type === "SKILLING") && (
              <span className="chip chip-orange" title={lang === "hi" ? "विवरण में पात्रता जाँचें" : "Check eligibility in detail"}>
                <ShieldCheck size={12}/> {lang === "hi" ? "पात्रता" : "Eligibility"}
              </span>
            )}
          </div>
          <Link
            href={`/opportunities/${o.id}`}
            className="text-lg font-bold text-ink-900 hover:text-setu-700 line-clamp-2"
          >
            {pickLocalized(o, "title", lang)}
          </Link>
          <div className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
            <Briefcase size={14} /> {pickLocalized(o, "company", lang)}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin size={14} /> {pickLocalized(o, "location", lang)}
          </div>
        </div>
        <button
          aria-label={saved ? t.saved : t.save}
          onClick={() => onSave?.(o.id)}
          className="text-gray-400 hover:text-setu-600 transition p-1.5 rounded-md hover:bg-setu-50"
        >
          {saved ? <BookmarkCheck size={20} className="text-setu-600" /> : <BookmarkPlus size={20} />}
        </button>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">
        {pickLocalized(o, "description", lang)}
      </p>

      {score !== undefined && (
        <div className="bg-setu-50/60 border border-setu-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-setu-700 font-semibold text-sm">
              <Sparkles size={14} /> {t.matchScore}
            </div>
            <div className="text-sm font-bold text-setu-700">{score}%</div>
          </div>
          <div className="w-full h-1.5 bg-setu-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-setu-500 to-saffron-500"
              style={{ width: `${score}%` }}
            />
          </div>
          {reasons && reasons[0] && (
            <p className="text-xs text-setu-800 mt-2 line-clamp-2">{reasons[0]}</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mt-1">
        {(o.skills || []).slice(0, 4).map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
        {o.skills.length > 4 && <span className="chip">+{o.skills.length - 4}</span>}
      </div>

      <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {(o.salaryLabel || o.salaryLabelHi || o.stipend) && (
            <span className="font-semibold text-gray-700">
              {pickLocalized(o, "salaryLabel", lang) || o.stipend}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} /> {t.postedDays(o.postedDaysAgo)}
          </span>
        </div>
        <Link href={`/opportunities/${o.id}`} className="btn-primary !py-1.5 !px-3 text-sm">
          {t.applyNow}
        </Link>
      </div>
    </div>
  );
}
