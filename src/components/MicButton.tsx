"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/context/LangContext";
type SR = {continuous:boolean;interimResults:boolean;lang:string;onresult:((e:any)=>void)|null;onend:(()=>void)|null;onerror:(()=>void)|null;start:()=>void;stop:()=>void};
type Props={onText:(t:string)=>void;lastAssistantText?:string};
export default function MicButton({onText,lastAssistantText}:Props){
  const{lang}=useLang();const[listening,setListening]=useState(false);const[speaking,setSpeaking]=useState(false);const[supported,setSupported]=useState(false);const recRef=useRef<SR|null>(null);
  useEffect(()=>{const w:any=window;const SR=w.SpeechRecognition||w.webkitSpeechRecognition;setSupported(!!(SR||"speechSynthesis"in window));if(!SR)return;const r=new SR();r.continuous=false;r.interimResults=false;r.lang=lang==="hi"?"hi-IN":"en-IN";r.onresult=(e:any)=>{const t=e.results?.[0]?.[0]?.transcript;if(t)onText(t.trim())};r.onend=()=>setListening(false);r.onerror=()=>setListening(false);recRef.current=r;},[lang,onText]);
  useEffect(()=>{if(!lastAssistantText||!speaking)return;if(!("speechSynthesis"in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(lastAssistantText);u.lang=lang==="hi"?"hi-IN":"en-IN";u.rate=1;window.speechSynthesis.speak(u);return()=>window.speechSynthesis.cancel()},[lastAssistantText,speaking,lang]);
  const toggle=()=>{if(!recRef.current)return;if(listening){recRef.current.stop();setListening(false);return}try{recRef.current.lang=lang==="hi"?"hi-IN":"en-IN";recRef.current.start();setListening(true)}catch{}};
  if(!supported)return null;
  return(<div className="flex items-center gap-1">
    <button type="button" onClick={toggle} aria-label="Voice" className={`p-2 rounded-lg ${listening?"bg-red-500 text-white animate-pulse":"text-gray-500 hover:bg-gray-100"}`} title="Voice input">{listening?<MicOff size={18}/>:<Mic size={18}/>}</button>
    <button type="button" onClick={()=>setSpeaking(s=>!s)} aria-label="Speak" className={`p-2 rounded-lg ${speaking?"bg-setu-600 text-white":"text-gray-500 hover:bg-gray-100"}`} title="Read aloud">{speaking?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
  </div>);
}
