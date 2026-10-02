"use client";
import { useEffect, useState } from "react";
import { Link2, Share2, CheckCircle2 } from "lucide-react";
import { useLang } from "@/context/LangContext";
export default function ShareButtons({title,url}:{title:string;url?:string}){
  const{lang}=useLang();const[copied,setCopied]=useState(false);const[u,setU]=useState("");
  useEffect(()=>setU(url||window.location.href),[url]);
  const share=async()=>{if(navigator.share){try{await navigator.share({title,url:u});return}catch{}}try{await navigator.clipboard.writeText(u);setCopied(true);setTimeout(()=>setCopied(false),2000)}catch{}};
  const wt=encodeURIComponent(title+"\n"+u);const eu=encodeURIComponent(u);const tx=encodeURIComponent(title);
  return(<div className="flex flex-wrap items-center gap-2">
    <button onClick={share} className="btn-secondary !py-1.5 !px-3 text-sm inline-flex items-center gap-1.5">{copied?<><CheckCircle2 size={14} className="text-setu-600"/>{lang==="hi"?"लिंक कॉपी!":"Link copied!"}</>:<><Link2 size={14}/>{lang==="hi"?"लिंक कॉपी":"Copy link"}</>}</button>
    <a href={`https://wa.me/?text=${wt}`} target="_blank" rel="noreferrer" className="chip chip-green !text-sm cursor-pointer hover:bg-setu-200"><Share2 size={12}/> WhatsApp</a>
    <a href={`https://twitter.com/intent/tweet?text=${tx}&url=${eu}`} target="_blank" rel="noreferrer" className="chip chip-blue !text-sm cursor-pointer">X</a>
    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${eu}`} target="_blank" rel="noreferrer" className="chip chip-blue !text-sm cursor-pointer">in</a>
    <a href={`mailto:?subject=${tx}&body=${wt}`} className="chip chip-gray !text-sm cursor-pointer">✉ {lang==="hi"?"ईमेल":"Email"}</a>
  </div>);
}
