"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, ArrowLeft, Sparkles, Bot, User } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";
import { chat, type ChatMsg } from "@/lib/assistant";
import MicButton from "@/components/MicButton";

export default function ChatPage(){
  const{lang}=useLang();const t=useT(lang);
  const[msgs,setMsgs]=useState<ChatMsg[]>([]);const[input,setInput]=useState("");const[busy,setBusy]=useState(false);const scRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const h=lang==="hi"?"नमस्ते! मैं सेतु मित्र हूँ — आपका AI करियर साथी। आप किस प्रकार का अवसर ढूँढ रहे हैं?":"Hi, I'm Setu Mitra — your AI career companion. What kind of opportunity are you looking for today?";if(msgs.length===0)setMsgs([{role:"assistant",text:h,locale:lang,suggestions:lang==="hi"?["डैशबोर्ड दिखाएँ","नौकरियाँ दिखाएँ","सरकारी योजनाएँ"]:["Show my dashboard","Show me jobs","Government schemes"]}])},[lang]);
  useEffect(()=>{scRef.current?.scrollTo({top:scRef.current.scrollHeight,behavior:"smooth"})},[msgs]);
  const send=async(text?:string)=>{const m=(text??input).trim();if(!m||busy)return;const user:ChatMsg={role:"user",text:m};setMsgs(prev=>[...prev,user]);setInput("");setBusy(true);try{const r=chat(m);setMsgs(prev=>[...prev,r])}finally{setBusy(false)}};
  const onVoice=(t:string)=>{setInput(t)};
  const lastAssistant=msgs.filter(m=>m.role==="assistant").slice(-1)[0]?.text;
  return(<div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-8rem)]">
    <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Link href="/dashboard" className="btn-secondary !p-2"><ArrowLeft size={16}/></Link><div><h1 className="text-xl font-bold text-ink-900 flex items-center gap-1.5"><Sparkles size={18} className="text-setu-600"/>{t.navChat}</h1><p className="text-xs text-gray-500">{t.chatSub}</p></div></div></div>
    <div ref={scRef} className="flex-1 overflow-y-auto card !p-0 flex flex-col">
      <div className="flex-1 p-4 space-y-3">
        {msgs.map((m,i)=>(<div key={i} className={`flex gap-2 ${m.role==="user"?"justify-end":""}`}>{m.role==="assistant"&&<div className="w-7 h-7 rounded-full bg-setu-100 text-setu-700 flex items-center justify-center shrink-0"><Bot size={16}/></div>}<div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role==="user"?"bg-setu-600 text-white rounded-br-sm":"bg-gray-100 text-ink-900 rounded-bl-sm"}`}>{m.text}</div>{m.role==="user"&&<div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0"><User size={16}/></div>}</div>))}
        {busy&&<div className="flex gap-2"><div className="w-7 h-7 rounded-full bg-setu-100 text-setu-700 flex items-center justify-center shrink-0"><Bot size={16}/></div><div className="bg-gray-100 rounded-2xl px-3.5 py-2.5 flex gap-1"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span></div></div>}
      </div>
      {msgs[msgs.length-1]?.suggestions&&<div className="px-4 pb-3 flex flex-wrap gap-2">{msgs[msgs.length-1].suggestions!.map(s=><button key={s} onClick={()=>send(s)} className="chip chip-setu cursor-pointer hover:bg-setu-100">{s}</button>)}</div>}
    </div>
    <form onSubmit={e=>{e.preventDefault();send()}} className="mt-3 flex gap-2">
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder={t.chatPh} className="input flex-1" disabled={busy}/>
      <MicButton onText={onVoice} lastAssistantText={lastAssistant}/>
      <button type="submit" className="btn-primary px-4" disabled={busy||!input.trim()}><Send size={16}/></button>
    </form>
  </div>);
}
