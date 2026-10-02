"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";
import OpportunityCard from "@/components/OpportunityCard";
import type { MatchResult } from "@/lib/types";

export default function MatchesPage() {
  const { lang } = useLang();
  const t = useT(lang);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/matches?limit=20")
      .then((r) => r.json())
      .then((d) => {
        setMatches(d.matches ?? []);
        const s = new Set<string>();
        (d.matches ?? []).forEach((m: MatchResult) => {
          if (m.opportunity.saved) s.add(m.opportunity.id);
        });
        setSavedSet(s);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (id: string) => {
    const r = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: id }),
    });
    const d = await r.json();
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (d.saved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="chip chip-green mb-2 inline-flex items-center gap-1">
            <Sparkles size={12}/> AI
          </div>
          <h1 className="text-3xl font-extrabold text-ink-900">{t.topMatches}</h1>
          <p className="text-gray-600 mt-1 max-w-2xl">{t.topMatchesSub}</p>
        </div>
        <Link href="/profile" className="btn-secondary text-sm inline-flex items-center gap-1">
          {lang === "hi" ? "प्रोफ़ाइल अपडेट करें" : "Update profile"} <ArrowRight size={16}/>
        </Link>
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 h-72 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center py-16 text-gray-500">{t.noMatches}</div>
      )}

      {!loading && matches.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m) => (
            <OpportunityCard
              key={m.opportunity.id}
              opportunity={m.opportunity}
              score={m.score}
              reasons={m.reasons}
              saved={savedSet.has(m.opportunity.id)}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
