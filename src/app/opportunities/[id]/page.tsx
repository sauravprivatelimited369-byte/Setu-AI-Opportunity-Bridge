"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Building2, Calendar, Percent, CheckCircle2, Sparkles, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useLang } from "@/context/LangContext";
import type { Opportunity, MatchResult, Application } from "@/lib/types";
import ShareButtons from "@/components/ShareButtons";
import Confetti from "@/components/Confetti";

export default function OpportunityDetail(){
  const params=useParams();const id=params.id as string;const router=useRouter();const{lang}=useLang();const hi=lang==="hi";
  const[opp,setOpp]=useState<Opportunity|null>(null);const[match,setMatch]=useState<MatchResult|null>(null);const[applied,setApplied]=useState<Application|null>(null);const[applying,setApplying]=useState(false);const[err,setErr]=useState<string|null>(null);const[fire,setFire]=useState(false);
  useEffect(()=>{(async()=>{try{const r=await fetch(`/api/opportunities/${id}`);if(!r.ok)throw new Error("not found");const d=await r.json();setOpp(d.opportunity);setMatch(d.match);const ar=await fetch(`/api/applications`);const ad=await ar.json();setApplied(ad.applications.find((a:Application)=>a.opportunityId===id)||null)}catch(e:any){setErr(e.message)}})()},[id]);
  const apply=async()=>{if(!opp||opp.applied)return;setApplying(true);setErr(null);try{const r=await fetch("/api/apply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({opportunityId:opp.id})});if(!r.ok)throw new Error("failed");const d=await r.json();setApplied(d.application);setOpp({...opp,applied:true});setFire(true)}catch(e:any){setErr(e.message)}finally{setApplying(false)}};
  if(err)return(<div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center"><p className="text-red-600 mb-4">{err==="not found"?(hi?"अवसर नहीं मिला।":"Opportunity not found."):err}</p><Link href="/opportunities" className="btn-primary inline-flex items-center gap-1"><ArrowLeft size={16}/>{hi?"सभी अवसर":"All opportunities"}</Link></div>);
  if(!opp)return(<div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-3"/>Loading…</div>);
  const scoreColor=match&&match.score>=80?"text-setu-600 bg-setu-50 border-setu-200":match&&match.score>=60?"text-orange-600 bg-orange-50 border-orange-200":"text-gray-600 bg-gray-50 border-gray-200";
  const typeLabel={JOB:hi?"नौकरी":"Job",SCHEME:hi?"सरकारी योजना":"Govt Scheme",INTERNSHIP:hi?"इंटर्नशिप":"Internship",SKILLING:hi?"कौशल पाठ्यक्रम":"Skilling course",FELLOWSHIP:hi?"फेलोशिप":"Fellowship"}[opp.type];
  return(<><Confetti fire={fire}/><div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
    <Link href="/opportunities" className="btn-secondary mb-4 inline-flex items-center gap-1 text-sm"><ArrowLeft size={14}/>{hi?"सभी अवसर":"All opportunities"}</Link>
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div><div className="flex items-center gap-2 mb-1"><span className="chip chip-setu">{typeLabel}</span><span className="chip chip-gray">{opp.source}</span></div><h1 className="text-2xl font-extrabold text-ink-900">{opp.title}</h1><p className="text-gray-600 mt-1 flex items-center gap-1"><Building2 size={14}/>{opp.employer}</p></div>
        {match&&<div className={clsx("text-center border rounded-xl px-4 py-2 min-w-[90px]",scoreColor)}><div className="text-2xl font-extrabold">{match.score}%</div><div className="text-[11px] uppercase tracking-wide">{hi?"मैच":"match"}</div></div>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-600 mb-5"><span className="inline-flex items-center gap-1.5"><MapPin size={14}/>{opp.location}</span>{opp.salary&&<span className="inline-flex items-center gap-1.5"><Briefcase size={14}/>{opp.salary}</span>}<span className="inline-flex items-center gap-1.5"><Calendar size={14}/>{hi?"अंतिम तिथि":"Deadline"}: {new Date(opp.deadline).toLocaleDateString(lang==="hi"?"hi-IN":"en-IN")}</span>{opp.qualification&&<span className="inline-flex items-center gap-1.5"><GraduationCap size={14}/>{opp.qualification}</span>}</div>
      <p className="text-ink-800 leading-relaxed mb-4">{opp.description}</p>
      <div className="mb-4"><h3 className="text-sm font-semibold text-ink-900 mb-2">{hi:"आवश्यक स्किल्स":"Skills required"}</h3><div className="flex flex-wrap gap-1.5">{opp.skills.map(s=>{const has=match?.matchedSkills.some(ms=>ms.toLowerCase()===s.toLowerCase());return<span key={s} className={clsx("chip",has?"chip-green":"chip-gray")}>{has&&"✓ "}{s}</span>})}</div></div>
      {match&&match.missingSkills.length>0&&(<div className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm"><div className="font-semibold text-orange-800 mb-1">{hi:"स्किल गैप (पहले इन्हें सीखें)":"Skill gaps to build first:"}</div><div className="flex flex-wrap gap-1.5">{match.missingSkills.map(s=><span key={s} className="chip chip-orange">{s}</span>)}</div></div>)}
      {match&&match.reasons.length>0&&(<div className="mb-4"><h3 className="text-sm font-semibold text-ink-900 mb-2 flex items-center gap-1"><Sparkles size={14} className="text-setu-600"/>{hi:"यह क्यों मेल खाता है":"Why this matches"}</h3><ul className="space-y-1.5 text-sm">{match.reasons.map((r,i)=><li key={i} className="flex items-start gap-2 text-ink-800"><ThumbsUp size={14} className="text-setu-600 mt-0.5 shrink-0"/>{r}</li>)}</ul></div>}
      {opp.link&&<div className="mb-4"><p className="text-xs text-gray-500 mb-1">{hi:"आधिकारिक लिंक":"Official link"}</p><a href={opp.link} target="_blank" rel="noreferrer" className="text-setu-700 underline text-sm break-all">{opp.link}</a></div>}
      <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
        <button onClick={apply} disabled={applying||!!opp.applied} className={clsx("btn-primary",(applying||!!opp.applied)&&"opacity-60 cursor-not-allowed")}>{opp.applied?(<><CheckCircle2 size={16}/>{hi:"आवेदन हो गया ✓":"Applied ✓"}</>):applying?(<><Loader2 size={16} className="animate-spin"/>{hi:"भेज रहे हैं…":"Applying…"}</>):(<><Sparkles size={16}/>{hi:"AI के साथ आवेदन करें":"Apply with AI"}</>)}</button>
        <Link href="/chat" className="btn-secondary">{hi?"सेतु मित्र से पूछें":"Ask Setu Mitra"}</Link>
        <ShareButtons title={`${opp.title} — ${opp.employer} | Setu AI`}/>
      </div>
      {err&&<p className="text-red-600 text-sm mt-3">{err}</p>}
      {applied&&<div className="mt-4 card !bg-setu-50 !border-setu-200"><div className="flex items-start gap-2"><ThumbsUp size={18} className="text-setu-700 shrink-0 mt-0.5"/><div><p className="font-semibold text-setu-800">{hi:"आवेदन सफल! (AI फीडबैक)":"Application submitted! (AI feedback)"}</p><p className="text-sm text-ink-800 mt-1">{applied.feedback}</p><p className="text-xs text-gray-500 mt-1">{hi:"AI स्कोर":"AI score"}: {applied.aiScore}%</p></div></div></div>}
    </div>
  </div></>);
}
