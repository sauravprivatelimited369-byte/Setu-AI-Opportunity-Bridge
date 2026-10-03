"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, UserCircle, Briefcase, MapPin, BookOpen, Languages, Sparkles, CheckCircle2 } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";
import type { SeekerProfile } from "@/lib/types";

const empty: SeekerProfile = { id: "me", name: "", email: "", phone: "", location: "", currentRole: "", experienceYears: 0, education: "", skills: [], languages: ["English","Hindi"], bio: "", preferredTypes: [], preferredLocation: "" };

export default function ProfilePage(){
  const { lang } = useLang();
  const t = useT(lang);
  const hi = lang === "hi";
  const [p, setP] = useState<SeekerProfile>(empty);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { setP(d.profile || empty); setLoaded(true); setErr(null); })
      .catch(e => { setLoaded(true); setErr(String(e)); });
  }, []);

  const upd = (k: keyof SeekerProfile, v: any) => setP(prev => ({ ...prev, [k]: v }));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      const res = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, skills: typeof p.skills === "string" ? p.skills : p.skills.join(", "), languages: typeof p.languages === "string" ? p.languages : p.languages.join(", ") }) });
      if (!res.ok) throw new Error("save failed");
      const d = await res.json(); setP(d.profile); setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) { setErr((e as Error).message); }
    finally { setSaving(false); }
  };

  const label = (en: string, h: string) => hi ? h : en;
  const field = "w-full input";
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/dashboard" className="btn-secondary mb-4 inline-flex items-center gap-1 text-sm"><ArrowLeft size={14}/>{label("Back to dashboard", "डैशबोर्ड पर वापस")}</Link>
      <div className="card">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-1 flex items-center gap-2"><UserCircle size={22} className="text-setu-600"/>{label("My Profile", "मेरी प्रोफ़ाइल")}</h1>
        <p className="text-sm text-gray-500 mb-5">{label("Fill in your details for better AI matches.", "बेहतर AI मैच के लिए अपना विवरण भरें।")}</p>
        {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{err}</div>}
        {!loaded ? <p className="text-gray-500 text-sm py-4">Loading…</p> : (
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="label"><UserCircle size={13}/>{label("Full name", "पूरा नाम")}</label><input className={field} value={p.name} onChange={e => upd("name", e.target.value)} placeholder={label("Your name", "आपका नाम")}/></div>
            <div><label className="label"><Briefcase size={13}/>{label("Current role / goal", "वर्तमान भूमिका / लक्ष्य")}</label><input className={field} value={p.currentRole} onChange={e => upd("currentRole", e.target.value)} placeholder={label("e.g. Fresher, Web developer", "जैसे: फ्रेशर, वेब डेवलपर")}/></div>
            <div><label className="label"><MapPin size={13}/>{label("Location", "स्थान")}</label><input className={field} value={p.location} onChange={e => upd("location", e.target.value)} placeholder={label("City, State", "शहर, राज्य")}/></div>
            <div><label className="label">📞 {label("Phone", "फ़ोन")}</label><input className={field} value={p.phone} onChange={e => upd("phone", e.target.value)} placeholder="+91-..."/></div>
            <div><label className="label">✉ {label("Email", "ईमेल")}</label><input className={field} type="email" value={p.email} onChange={e => upd("email", e.target.value)} placeholder="you@example.com"/></div>
            <div><label className="label"><BookOpen size={13}/>{label("Education", "शिक्षा")}</label><input className={field} value={p.education} onChange={e => upd("education", e.target.value)} placeholder={label("e.g. B.A. 2nd year", "जैसे: B.A. द्वितीय वर्ष")}/></div>
            <div><label className="label">⏳ {label("Experience (years)", "अनुभव (वर्ष)")}</label><input className={field} type="number" min={0} max={50} value={p.experienceYears} onChange={e => upd("experienceYears", Math.max(0, Number(e.target.value)||0))}/></div>
            <div><label className="label"><Languages size={13}/>{label("Languages", "भाषाएँ")}</label><input className={field} value={(p.languages||[]).join(", ")} onChange={e => upd("languages", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} placeholder={label("English, Hindi", "हिंदी, अंग्रेज़ी")}/></div>
          </div>
          <div><label className="label">🛠 {label("Skills (comma separated)", "स्किल्स (अल्पविराम से अलग)")}</label><input className={field} value={(p.skills||[]).join(", ")} onChange={e => upd("skills", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} placeholder={label("e.g. React, Tailwind, Excel", "जैसे: React, Tailwind, Excel")}/></div>
          <div><label className="label">💬 {label("Short bio", "संक्षिप्त परिचय")}</label><textarea className={field + " min-h-[80px]"} value={p.bio} onChange={e => upd("bio", e.target.value)} placeholder={label("A line or two about you…", "अपने बारे में एक-दो पंक्तियाँ…")}/></div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2"><Save size={16}/>{saving ? label("Saving…", "सहेज रहे हैं…") : label("Save profile", "प्रोफ़ाइल सहेजें")}</button>
            {saved && <span className="text-setu-700 text-sm inline-flex items-center gap-1"><CheckCircle2 size={16}/>{label("Saved!", "सहेजा गया!")}</span>}
          </div>
          <p className="text-xs text-gray-400 pt-1 flex items-center gap-1"><Sparkles size={12}/>{label("Better profile → smarter matches.", "बेहतर प्रोफ़ाइल → बेहतर सुझाव।")}</p>
        </form>
        )}
      </div>
    </div>
  );
}
