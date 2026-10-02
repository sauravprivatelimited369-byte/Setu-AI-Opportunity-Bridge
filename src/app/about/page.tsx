"use client";
import Link from "next/link";
import { Bridge, Globe2, HeartHandshake, Sparkles } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function About() {
  const { lang } = useLang();
  const hi = lang === "hi";
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold text-ink-900 mb-2 flex items-center gap-2">
        <Bridge size={28} className="text-setu-600"/>
        {hi ? "सेतु AI के बारे में" : "About Setu AI"}
      </h1>
      <p className="text-gray-600 mb-8">
        {hi ? "सेतु का मतलब 'पुल'। हम भारत के युवाओं को उन अवसरों से जोड़ते हैं जिनके वे हक़दार हैं।"
            : "Setu means 'bridge'. We connect India's youth to the opportunities they actually qualify for."}
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: Sparkles, t: hi ? "AI मैचिंग" : "AI Matching", d: hi ? "हर अवसर को आपके स्किल्स के अनुसार स्कोर करता है।" : "Every opportunity scored for fit against your profile." },
          { icon: Globe2, t: hi ? "बहुभाषी" : "Multilingual", d: hi ? "अंग्रेज़ी व हिंदी — जल्द 12 भारतीय भाषाएँ।" : "EN/हिंदी today; 12 Indian languages on the roadmap." },
          { icon: HeartHandshake, t: hi ? "समावेशी" : "Inclusive", d: hi ? "नौकरियों के साथ योजनाएँ, छात्रवृत्तियाँ, कोर्स भी।" : "Jobs + schemes + scholarships + free skilling." },
          { icon: Bridge, t: hi ? "ऑफलाइन + ऐप" : "Offline + PWA", d: hi ? "बिना इंटरनेट बुकमार्क पृष्ठ; फ़ोन ऐप जैसे इंस्टॉल।" : "Offline-ready; installs as a phone app." },
        ].map(({ icon: I, t, d }) => (
          <div key={t} className="card p-5">
            <I size={22} className="text-setu-600 mb-2"/>
            <div className="font-bold text-ink-900">{t}</div>
            <p className="text-sm text-gray-600 mt-1">{d}</p>
          </div>
        ))}
      </div>
      <div className="card !bg-setu-50/50 !border-setu-200 p-5">
        <div className="font-bold text-setu-800 mb-1">{hi ? "MVP" : "Demo MVP"}</div>
        <p className="text-sm text-gray-700">
          {hi ? "यह डेमो स्थानीय डेटा व नियम-आधारित AI का उपयोग करता है। प्रोडक्शन में LLM व लाइव फ़ीड जुड़ेंगे।"
              : "This demo uses local data and a rule-based AI; production adds an LLM and live feeds."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/opportunities" className="btn-primary">{hi ? "अवसर देखें" : "Browse"}</Link>
          <Link href="/chat" className="btn-secondary">{hi ? "सेतु मित्र" : "Setu Mitra"}</Link>
        </div>
      </div>
    </div>
  );
}
