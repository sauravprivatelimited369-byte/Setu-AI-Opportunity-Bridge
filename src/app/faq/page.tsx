"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLang } from "@/context/LangContext";
const Q = {
  en: [
    { q: "Is Setu AI free?", a: "Yes. Matching, chat and the phone app are free for seekers." },
    { q: "How does AI matching work?", a: "We score each opportunity against your skills, location and experience to produce a 0-100% fit score with reasons & gaps." },
    { q: "Do you apply on my behalf?", a: "Not yet. 'Apply' records the application and gives AI feedback; official portals open where available." },
    { q: "Is my data private?", a: "In this MVP data stays on your device." },
    { q: "How do I install it as a phone app?", a: "Open in Chrome or Safari and tap 'Install App' or use 'Add to Home Screen'." },
    { q: "Does it work offline?", a: "Visited pages work offline via a service worker. Applying/chat need internet." },
  ],
  hi: [
    { q: "क्या सेतु मुफ़्त है?", a: "हाँ — मैचिंग, चैट और ऐप मुफ़्त हैं।" },
    { q: "AI मैचिंग कैसे काम करती है?", a: "हर अवसर को आपके स्किल्स, स्थान और अनुभव के अनुसार 0-100% स्कोर देते हैं।" },
    { q: "क्या आप मेरी ओर से आवेदन करते हैं?", a: "अभी नहीं — आवेदन रिकॉर्ड होता है व AI फीडबैक मिलता है।" },
    { q: "डेटा सुरक्षित है?", a: "हाँ — आपका डेटा आपके डिवाइस पर ही रहता है।" },
    { q: "फ़ोन ऐप कैसे इंस्टॉल करूँ?", a: "Chrome/Safari में खोलें → 'Install App' / 'Add to Home Screen' करें।" },
    { q: "ऑफ़लाइन चलता है?", a: "देखे हुए पृष्ठ ऑफ़लाइन खुलते हैं।" },
  ],
};
export default function FAQ() {
  const { lang } = useLang();
  const [o, setO] = useState<number|null>(0);
  const items = lang === "hi" ? Q.hi : Q.en;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-6">{lang === "hi" ? "सामान्य प्रश्न" : "FAQ"}</h1>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="card">
            <button onClick={() => setO(o === i ? null : i)} className="w-full flex items-center justify-between p-4 font-semibold text-left hover:bg-setu-50/50">
              <span>{it.q}</span>
              <ChevronDown className={`transition ${o === i ? "rotate-180 text-setu-700" : "text-gray-400"}`} size={18}/>
            </button>
            {o === i && <div className="px-4 pb-4 text-gray-700 text-sm border-t pt-3">{it.a}</div>}
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-500">
        <Link href="/contact" className="text-setu-700 font-semibold underline">
          {lang === "hi" ? "और प्रश्न? संपर्क करें" : "More questions? Contact us"}
        </Link>
      </p>
    </div>
  );
}
