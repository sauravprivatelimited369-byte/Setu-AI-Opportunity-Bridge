"use client";
import Link from "next/link";
import { Bridge } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function NotFound() {
  const { lang } = useLang();
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-setu-600 text-white flex items-center justify-center mx-auto mb-5">
        <Bridge size={34}/>
      </div>
      <h1 className="text-5xl font-extrabold text-ink-900 mb-2">404</h1>
      <p className="text-gray-600 mb-6">
        {lang === "hi"
          ? "यह पेज नहीं मिल सका। शायद यह अवसर आगे बढ़ चुका है — लेकिन चिंता न करें, हज़ारों दूसरे मौके आपका इंतज़ार कर रहे हैं।"
          : "We couldn't find that page. The opportunity may have moved on — but thousands of others are waiting for you."}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/dashboard" className="btn-primary">
          {lang === "hi" ? "डैशबोर्ड पर जाएँ" : "Go to dashboard"}
        </Link>
        <Link href="/opportunities" className="btn-secondary">
          {lang === "hi" ? "अवसर ब्राउज़ करें" : "Browse opportunities"}
        </Link>
      </div>
    </div>
  );
}
