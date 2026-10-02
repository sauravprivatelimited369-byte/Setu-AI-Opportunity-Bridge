"use client";
import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";
import OpportunityCard from "@/components/OpportunityCard";
import type { Opportunity } from "@/lib/types";

const FILTER_TYPES = ["ALL", "JOB", "INTERNSHIP", "SCHOLARSHIP", "SCHEME", "SKILLING", "GIG"] as const;

export default function OpportunitiesPage() {
  const { lang } = useLang();
  const t = useT(lang);
  const [list, setList] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("ALL");
  const [workMode, setWorkMode] = useState<string>("ALL");

  const fetchList = async (extra?: Record<string, string>) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type !== "ALL") params.set("type", type);
    if (workMode !== "ALL") params.set("workMode", workMode);
    if (extra) Object.entries(extra).forEach(([k, v]) => params.set(k, v));
    const r = await fetch(`/api/opportunities?${params.toString()}`);
    const d = await r.json();
    setList(d.opportunities ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, workMode]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchList();
  };

  const handleSave = async (id: string) => {
    const r = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: id }),
    });
    const d = await r.json();
    setList((prev) =>
      prev.map((o) => (o.id === id ? { ...o, saved: d.saved } : o))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-ink-900">{t.navOpportunities}</h1>
          <p className="text-gray-600 mt-1">
            {lang === "hi"
              ? "नौकरियों, इंटर्नशिप, छात्रवृत्ति, योजनाओं और कौशल पाठ्यक्रमों में से चुनें।"
              : "Browse jobs, internships, scholarships, schemes, and skilling courses."}
          </p>
        </div>
      </div>

      <form onSubmit={onSearch} className="card p-3 flex items-center gap-2 mb-5">
        <Search size={18} className="text-gray-400 ml-2" />
        <input
          className="input !border-0 !shadow-none flex-1"
          placeholder={t.searchPh}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-primary !py-2 !px-4 text-sm" type="submit">
          {lang === "hi" ? "खोजें" : "Search"}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {FILTER_TYPES.map((f) => {
          const active = type === f;
          const label = f === "ALL" ? t.filterAll : t.typeLabels[f];
          return (
            <button
              key={f}
              onClick={() => setType(f)}
              className={`text-sm px-3 py-1.5 rounded-full border font-medium transition ${
                active
                  ? "bg-setu-600 text-white border-setu-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-setu-400"
              }`}
            >
              {label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2 text-sm">
          <Filter size={16} className="text-gray-500" />
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="input !py-1.5 !px-2 text-sm"
          >
            <option value="ALL">{lang === "hi" ? "कोई भी कार्यशैली" : "Any work mode"}</option>
            <option value="REMOTE">{t.remote}</option>
            <option value="HYBRID">{t.hybrid}</option>
            <option value="ON_SITE">{t.onSite}</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        {loading
          ? lang === "hi"
            ? "लोड हो रहा है…"
            : "Loading…"
          : `${list.length} ${lang === "hi" ? "परिणाम" : "results"}`}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 h-64 animate-pulse" />
          ))}
        {!loading && list.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500">
            {lang === "hi"
              ? "कोई परिणाम नहीं मिला। फ़िल्टर बदलकर देखें।"
              : "No opportunities match those filters. Try adjusting search or filters."}
          </div>
        )}
        {!loading &&
          list.map((o) => (
            <OpportunityCard
              key={o.id}
              opportunity={o}
              saved={o.saved}
              onSave={handleSave}
            />
          ))}
      </div>
    </div>
  );
}
