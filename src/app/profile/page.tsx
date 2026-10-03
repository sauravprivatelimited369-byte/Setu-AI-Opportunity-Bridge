"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, UserCircle, CheckCircle2 } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";
import type { SeekerProfile } from "@/lib/types";

const empty: SeekerProfile = {
  id: "me", name: "", email: "", phone: "", location: "",
  currentRole: "", experienceYears: 0, education: "",
  skills: [], languages: ["English", "Hindi"], bio: "",
  preferredTypes: [], preferredLocation: ""
};

export default function ProfilePage(){
  const { lang } = useLang();
  const t = useT(lang);
  const hi = lang === "hi";
  const [p, setP] = useState<SeekerProfile>(empty);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { setP(d.profile || empty); setLoaded(true); setErr(null); })
      .catch(e => { setLoaded(true); setErr(String(e)); });
  }, []);

  const upd = <K extends keyof SeekerProfile>(k: K, v: SeekerProfile[K]) => setP(prev => ({ ...prev, [k]: v } as SeekerProfile));
  const T = (en: string, h: string) => hi ? h : en;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      const skills = p.skills ?? [];
      const languages = p.languages ?? [];
      const body = {
        ...p,
        skills: Array.isArray(skills) ? skills.join(", ") : String(skills),
        languages: Array.isArray(languages) ? languages.join(", ") : String(languages),
      };
      const res = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("save failed");
      const d = await res.json();
      setP(d.profile);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (e: unknown) { setErr((e as Error).message); }
    finally { setSaving(false); }
  };

  const joinList = (arr: string[] | undefined) => (arr ?? []).join(", ");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/dashboard" className="btn-secondary mb-4 inline-flex items-center gap-1 text-sm"><ArrowLeft size={14}/>{T("Back to dashboard","डैशबोर्ड पर वापस")}</Link>
      <div className="card">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-1 flex items-center gap-2"><UserCircle size={22} className="text-setu-600"/>{T("My Profile","मेरी प्रोफ़ाइल")}</h1>
        <p className="text-sm text-gray-500 mb-5">{T("Fill in your details for better AI matches.","बेहतर AI मैच के लिए अपना विवरण भरें।")}</p>
        {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{err}</div>}
        {!loaded ? <p className="text-gray-500 text-sm py-4">Loading…</p> : (
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="label">👤 {T("Full name","पूरा नाम")}</label><input className="w-full input" value={p.name} onChange={e => upd("name", e.target.value)} placeholder={T("Your name","आपका नाम")}/></div>
            <div><label className="label">💼 {T("Current role / goal","वर्तमान भूमिका / लक्ष्य")}</label><input className="w-full input" value={p.currentRole} onChange={e => upd("currentRole", e.target.value)} placeholder={T("e.g. Fresher, Web developer","जैसे: फ्रेशर, वेब डेवलपर")}/></div>
            <div><label className="label">📍 {T("Location","स्थान")}</label><input className="w-full input" value={p.location} onChange={e => upd("location", e.target.value)} placeholder={T("City, State","शहर, राज्य")}/></div>
            <div><label className="label">📞 {T("Phone","फ़ोन")}</label><input className="w-full input" value={p.phone} onChange={e => upd("phone", e.target.value)} placeholder="+91-..."/></div>
            <div><label className="label">✉ {T("Email","ईमेल")}</label><input className="w-full input" type="email" value={p.email} onChange={e => upd("email", e.target.value)} placeholder="you@example.com"/></div>
            <div><label className="label">🎓 {T("Education","शिक्षा")}</label><input className="w-full input" value={p.education} onChange={e => upd("education", e.target.value)} placeholder={T("e.g. B.A. 2nd year","जैसे: B.A. द्वितीय वर्ष")}/></div>
            <div><label className="label">⏳ {T("Experience (years)","अनुभव (वर्ष)")}</label><input className="w-full input" type="number" min={0} max={50} value={p.experienceYears} onChange={e => upd("experienceYears", Math.max(0, Number(e.target.value) || 0))}/></div>
            <div><label className="label">🗣 {T("Languages","भाषाएँ")}</label><input className="w-full input" value={joinList(p.languages)} onChange={e => upd("languages", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder={T("English, Hindi","हिंदी, अंग्रेज़ी")}/></div>
          </div>
          <div><label className="label">🛠 {T("Skills (comma separated)","स्किल्स (अल्पविराम से अलग)")}</label><input className="w-full input" value={joinList(p.skills)} onChange={e => upd("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder={T("e.g. React, Tailwind, Excel","जैसे: React, Tailwind, Excel")}/></div>
          <div><label className="label">💬 {T("Short bio","संक्षिप्त परिचय")}</label><textarea className="w-full input min-h-[80px]" value={p.bio} onChange={e => upd("bio", e.target.value)} placeholder={T("A line or two about you…","अपने बारे में एक-दो पंक्तियाँ…")}/></div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2"><Save size={16}/>{saving ? T("Saving…","सहेज रहे हैं…") : T("Save profile","प्रोफ़ाइल सहेजें")}</button>
            {savedFlash && <span className="text-setu-700 text-sm inline-flex items-center gap-1"><CheckCircle2 size={16}/>{T("Saved!","सहेजा गया!")}</span>}
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
