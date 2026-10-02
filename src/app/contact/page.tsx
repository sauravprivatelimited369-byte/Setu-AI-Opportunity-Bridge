"use client";
import { useState } from "react";
import { Mail, MessageCircle, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function Contact() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", email: "", message: "" });
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-2">{hi ? "संपर्क करें" : "Contact us"}</h1>
      <p className="text-gray-600 mb-8">{hi ? "सुझाव या समस्या? हम जल्द जवाब देंगे।" : "Questions or feedback? We'd love to hear from you."}</p>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <a href="mailto:hello@setu-ai.example.com" className="card p-5">
          <Mail className="text-setu-600 mb-2" size={22}/>
          <div className="font-bold">{hi ? "ईमेल" : "Email"}</div>
          <div className="text-sm text-gray-600 break-all">hello@setu-ai.example.com</div>
        </a>
        <div className="card p-5">
          <MessageCircle className="text-setu-600 mb-2" size={22}/>
          <div className="font-bold">{hi ? "व्हाट्सऐप" : "WhatsApp"}</div>
          <div className="text-sm text-gray-600">{hi ? "जल्द" : "Coming soon"}</div>
        </div>
        <div className="card p-5">
          <MapPin className="text-setu-600 mb-2" size={22}/>
          <div className="font-bold">{hi ? "स्थान" : "Based in"}</div>
          <div className="text-sm text-gray-600">Bengaluru &amp; Kolkata, 🇮🇳</div>
        </div>
      </div>
      {sent ? (
        <div className="card p-8 text-center !border-setu-200 !bg-setu-50/50">
          <CheckCircle2 size={40} className="text-setu-600 mx-auto mb-2"/>
          <h3 className="text-xl font-bold text-setu-800">{hi ? "भेज दिया 🙏" : "Sent! 🙏"}</h3>
          <p className="text-gray-600 mt-1">{hi ? "हम जल्द संपर्क करेंगे।" : "We'll get back to you shortly."}</p>
        </div>
      ) : (
        <form onSubmit={(e)=>{e.preventDefault();setSent(true);}} className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block"><span className="text-sm font-semibold text-gray-700 mb-1 block">{hi?"नाम":"Your name"}</span>
              <input required className="input" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></label>
            <label className="block"><span className="text-sm font-semibold text-gray-700 mb-1 block">{hi?"ईमेल":"Email"}</span>
              <input required type="email" className="input" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label>
          </div>
          <label className="block"><span className="text-sm font-semibold text-gray-700 mb-1 block">{hi?"संदेश":"Message"}</span>
            <textarea required className="input min-h-[120px]" value={f.message} onChange={e=>setF({...f,message:e.target.value})}/></label>
          <button className="btn-primary inline-flex items-center gap-2"><Send size={16}/> {hi?"भेजें":"Send"}</button>
        </form>
      )}
    </div>
  );
}
