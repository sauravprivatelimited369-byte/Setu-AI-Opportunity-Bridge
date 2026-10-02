"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { useLang } from "@/context/LangContext";
import OpportunityCard from "@/components/OpportunityCard";
import type { Opportunity } from "@/lib/types";

type Saved = { id: string; opportunity: Opportunity; savedAt: string };

export default function SavedPage() {
  const { lang } = useLang();
  const [list, setList] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/saved")
      .then((r) => r.json())
      .then((d) => setList(d.saved ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (id: string) => {
    await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ opportunityId: id }) });
    setList((p) => p.filter((s) => s.opportunity.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-setu-700 mb-4">
        <ArrowLeft size={16}/> {lang === "hi" ? "← वापस" : "← Back"}
      </Link>
      <h1 className="text-3xl font-extrabold text-ink-900 mb-1 flex items-center gap-2">
        <Bookmark size={26} className="text-setu-600"/> {lang === "hi" ? "सहेजे गए अवसर" : "Saved Opportunities"}
      </h1>
      <p className="text-gray-600 mb-6">
        {lang === "hi"
          ? "बाद में आवेदन करने के लिए सहेजे गए अवसर।"
          : "Opportunities you've bookmarked to apply to later."}
      </p>

      {loading && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({length:3}).map((_,i)=><div key={i} className="card p-5 h-64 animate-pulse"/>)}</div>}

      {!loading && list.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-setu-50 text-setu-600 flex items-center justify-center mx-auto mb-3"><BookmarkCheck size={28}/></div>
          <h3 className="text-lg font-bold">{lang === "hi" ? "अभी कुछ सहेजा नहीं" : "Nothing saved yet"}</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            {lang === "hi" ? "अवसरों पर बुकमार्क आइकन दबाकर उन्हें यहाँ सहेजें।" : "Tap the bookmark icon on any opportunity to save it here."}
          </p>
          <Link href="/opportunities" className="btn-primary inline-flex">{lang === "hi" ? "अवसर ब्राउज़ करें" : "Browse opportunities"}</Link>
        </div>
      )}

      {!loading && list.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((s) => (
            <OpportunityCard key={s.id} opportunity={s.opportunity} saved onSave={handleSave}/>
          ))}
        </div>
      )}
    </div>
  );
}
