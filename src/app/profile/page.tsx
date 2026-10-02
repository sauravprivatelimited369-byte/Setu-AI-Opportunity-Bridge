"use client";
import { useEffect, useState } from "react";
import { Save, CheckCircle2, RotateCcw } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";
import type { SeekerProfile, OpportunityType } from "@/lib/types";

const TYPES: { id: OpportunityType; icon: string }[] = [
  { id: "JOB", icon: "💼" },
  { id: "INTERNSHIP", icon: "🎓" },
  { id: "GIG", icon: "🛵" },
  { id: "SCHOLARSHIP", icon: "📘" },
  { id: "SCHEME", icon: "🏛️" },
  { id: "SKILLING", icon: "🧑‍💻" },
];

export default function ProfilePage() {
  const { lang } = useLang();
  const t = useT(lang);
  const tLabels = t.typeLabels;
  const [form, setForm] = useState<SeekerProfile | null>(null);
  const [toast, setToast] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => setForm(d.profile));
  }, []);

  const update = <K extends keyof SeekerProfile>(k: K, v: SeekerProfile[K]) => {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  };

  const toggleType = (tp: OpportunityType) => {
    if (!form) return;
    const arr = form.preferredTypes ?? [];
    const has = arr.includes(tp);
    update(
      "preferredTypes",
      has ? arr.filter((x) => x !== tp) : [...arr, tp]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    setSaving(false);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const onReset = async () => {
    if (!confirm(lang === "hi" ? "डेमो डेटा रीसेट करें?" : "Reset demo data?")) return;
    await fetch("/api/reset", { method: "POST" }).catch(() => {});
    window.location.reload();
  };

  if (!form) {
    return <div className="max-w-4xl mx-auto p-6">{lang === "hi" ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-ink-900">{t.yourProfile}</h1>
        <p className="text-gray-600 mt-1">{t.profileDesc}</p>
      </div>

      {toast && (
        <div className="mb-4 card !border-setu-200 !bg-setu-50 text-setu-800 p-3 flex items-center gap-2">
          <CheckCircle2 size={18}/> {t.savedToast}
        </div>
      )}

      <form onSubmit={onSubmit} className="card p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label={lang === "hi" ? "नाम" : "Full name"}>
            <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Riya Verma"/>
          </Field>
          <Field label={lang === "hi" ? "ईमेल" : "Email"}>
            <input className="input" type="email" value={form.email ?? ""} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com"/>
          </Field>
          <Field label={lang === "hi" ? "फ़ोन" : "Phone"}>
            <input className="input" value={form.phone ?? ""} onChange={(e) => update("phone", e.target.value)} placeholder="+91-..." />
          </Field>
          <Field label={lang === "hi" ? "वर्तमान शहर" : "Current city / location"}>
            <input className="input" value={form.location ?? ""} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Patna, Bihar"/>
          </Field>
          <Field label={lang === "hi" ? "वर्तमान भूमिका" : "Current role / headline"}>
            <input className="input" value={form.currentRole ?? ""} onChange={(e) => update("currentRole", e.target.value)} placeholder="Aspiring web developer"/>
          </Field>
          <Field label={lang === "hi" ? "अनुभव (वर्ष)" : "Years of experience"}>
            <input className="input" type="number" min={0} max={40} value={form.experienceYears} onChange={(e) => update("experienceYears", Number(e.target.value))}/>
          </Field>
          <Field label={lang === "hi" ? "शिक्षा" : "Education"}>
            <input className="input" value={form.education ?? ""} onChange={(e) => update("education", e.target.value)} placeholder="B.A., B.Sc., 12th pass, ITI…"/>
          </Field>
          <Field label={lang === "hi" ? "भाषाएँ" : "Languages you speak"}>
            <input className="input" value={(form.languages ?? []).join(", ")} onChange={(e) => update("languages", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Hindi, English, Tamil"/>
          </Field>
        </div>

        <Field label={lang === "hi" ? "आपके स्किल्स" : "Your skills (comma-separated)"}>
          <input
            className="input"
            value={form.skills.join(", ")}
            onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="React, Hindi, Communication, Sales, Tailwind CSS…"
          />
          <p className="text-xs text-gray-500 mt-1">
            {lang === "hi"
              ? "सुझाव: तकनीकी स्किल्स (React, SQL, Excel), सॉफ्ट स्किल्स (संचार, बिक्री), और भाषाएँ शामिल करें।"
              : "Tip: include technical skills (React, SQL, Excel), soft skills (communication, sales), and languages."}
          </p>
        </Field>

        <Field label={lang === "hi" ? "संक्षिप्त परिचय" : "Short bio"}>
          <textarea className="input min-h-[88px]" value={form.bio ?? ""} onChange={(e) => update("bio", e.target.value)} placeholder={lang === "hi" ? "अपने बारे में 2–3 पंक्तियाँ…" : "2–3 lines about yourself and your goals…"}/>
        </Field>

        <Field label={lang === "hi" ? "अवसर के प्रकार जो आप चाहते हैं" : "Opportunity types you're interested in"}>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => {
              const active = (form.preferredTypes ?? []).includes(t.id);
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => toggleType(t.id)}
                  className={`px-3 py-1.5 rounded-full border text-sm font-medium transition flex items-center gap-1.5 ${
                    active
                      ? "bg-setu-600 text-white border-setu-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-setu-400"
                  }`}
                >
                  <span>{t.icon}</span> {tLabels[t.id]}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button type="button" onClick={onReset} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
            <RotateCcw size={14}/> {t.resetDb}
          </button>
          <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
            <Save size={16}/> {t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 mb-1 block">{label}</span>
      {children}
    </label>
  );
}
