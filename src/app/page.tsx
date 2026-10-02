"use client";
import Link from "next/link";
import { ArrowRight, Bot, Briefcase, GraduationCap, Languages, MapPin, Sparkles, HeartHandshake, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";
import OpportunityCard from "@/components/OpportunityCard";
import type { MatchResult } from "@/lib/types";

export default function Home() {
  const { lang } = useLang();
  const t = useT(lang);
  const [top, setTop] = useState<MatchResult[]>([]);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    fetch("/api/matches?limit=3")
      .then((r) => r.json())
      .then((d) => setTop(d.matches ?? []))
      .catch(() => {});
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.profile?.name && window.location.search.includes("go") === false) {
          setHasProfile(true);
        }
      })
      .catch(() => {});
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
    <div>
      {/* HERO */}
      <section className="gradient-hero">
        {hasProfile && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
            <Link href="/dashboard" className="w-full flex items-center justify-between card p-3 !bg-setu-600 !border-setu-700 !text-white hover:!bg-setu-700 transition">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <LayoutDashboard size={18}/>
                {lang === "hi" ? "आपका डैशबोर्ड तैयार है — यहाँ क्लिक करें" : "Your dashboard is ready — continue where you left off"}
              </span>
              <ArrowRight size={18}/>
            </Link>
          </div>
        )}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 chip chip-green mb-4">
                <Sparkles size={14} />
                <span>{lang === "hi" ? "AI-संचालित · भारत के लिए" : "AI-powered · Built for Bharat"}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink-900 leading-[1.1]">
                {t.heroTitle}
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">{t.heroSub}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={hasProfile ? "/dashboard" : "/matches"} className="btn-primary inline-flex items-center gap-2">
                  {hasProfile
                    ? (lang === "hi" ? "मेरा डैशबोर्ड" : "Go to my dashboard")
                    : t.heroCta} <ArrowRight size={18} />
                </Link>
                <Link href="/opportunities" className="btn-secondary inline-flex items-center gap-2">
                  {t.heroCta2}
                </Link>
                <Link href="/chat" className="btn-secondary inline-flex items-center gap-2">
                  {t.chatCta}
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Languages size={18} className="text-setu-600"/>{t.stats.langs}</div>
                <div className="flex items-center gap-2 text-gray-600"><Briefcase size={18} className="text-setu-600"/>{t.stats.opps}</div>
                <div className="flex items-center gap-2 text-gray-600"><HeartHandshake size={18} className="text-setu-600"/>{t.stats.seekers}</div>
                <div className="flex items-center gap-2 text-gray-600"><MapPin size={18} className="text-setu-600"/>{t.stats.states}</div>
              </div>
            </div>
            <div className="relative">
              <div className="card p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-setu-600 text-white flex items-center justify-center"><Bot size={18}/></div>
                  <div>
                    <div className="font-bold text-ink-900 text-sm">{t.setuMitra}</div>
                    <div className="text-[11px] text-gray-500">{lang === "hi" ? "आपका AI सहायक" : "Your AI assistant"}</div>
                  </div>
                  <span className="ml-auto chip chip-green">{lang === "hi" ? "ऑनलाइन" : "Online"}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2">
                  <p>{lang === "hi"
                    ? "आपकी प्रोफ़ाइल के आधार पर आज के शीर्ष 3 अवसर ये रहे:"
                    : "Based on your profile, here are today's top 3 opportunities:"}</p>
                  <ul className="space-y-1 text-ink-900 font-medium">
                    <li>• {lang === "hi" ? "फ्रंटएंड डेवलपर" : "Frontend Developer"} — FinEdge · 87% match</li>
                    <li>• {lang === "hi" ? "AI/ML रिसर्च इंटर्न" : "AI/ML Intern"} — Bharat AI Lab · 74%</li>
                    <li>• {lang === "hi" ? "डेटा विश्लेषक" : "Data Analyst"} — GreenKart · 71%</li>
                  </ul>
                </div>
                <Link href="/chat" className="btn-primary mt-4 w-full inline-flex items-center justify-center gap-2">
                  {t.chatCta}
                </Link>
              </div>
              <div className="absolute -bottom-6 -left-6 card p-3 hidden sm:flex items-center gap-2 shadow-lg">
                <div className="w-8 h-8 rounded-md badge-saffron flex items-center justify-center text-white"><GraduationCap size={16}/></div>
                <div className="text-xs">
                  <div className="font-semibold">{lang === "hi" ? "PMKVY 4.0" : "PMKVY 4.0"}</div>
                  <div className="text-gray-500">{lang === "hi" ? "निःशुल्क कौशल प्रशिक्षण" : "Free skill training"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2">{t.howItWorks}</h2>
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {[
            { n: "1", t: t.step1T, d: t.step1D, color: "bg-setu-100 text-setu-700" },
            { n: "2", t: t.step2T, d: t.step2D, color: "bg-saffron-500/20 text-saffron-600" },
            { n: "3", t: t.step3T, d: t.step3D, color: "bg-blue-100 text-blue-700" },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg ${s.color}`}>
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
              <p className="text-gray-600 text-sm mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOP MATCHES PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900">{t.topMatches}</h2>
            <p className="text-gray-600 mt-1">{t.topMatchesSub}</p>
          </div>
          <Link href="/matches" className="text-setu-700 hover:text-setu-800 font-semibold text-sm hidden sm:inline-flex items-center gap-1">
            {lang === "hi" ? "सभी देखें" : "See all"} <ArrowRight size={16}/>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {top.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card p-5 animate-pulse h-64" />
              ))
            : top.map((m) => (
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
      </section>

      {/* Demo note */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-4 text-sm text-gray-600">
          <span className="chip chip-orange mr-2">Demo</span>
          {t.demoNote}
        </div>
      </section>
    </div>
  );
}
