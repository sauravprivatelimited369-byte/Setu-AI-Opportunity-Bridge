"use client";
import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { canInstallPwa, isInstalledPwa, promptInstall } from "@/lib/pwa";

export default function InstallBanner() {
  const { lang } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInstalledPwa()) return;
    if (typeof window === "undefined") return;
    const check = () => setShow(canInstallPwa());
    check();
    window.addEventListener("setu:pwa-ready", check);
    window.addEventListener("setu:pwa-installed", () => setShow(false));
    // Show a tip after 3s for mobile (narrow screens) regardless of prompt
    const t = setTimeout(() => {
      const dismissed = sessionStorage.getItem("setu-install-banner-dismissed");
      if (dismissed) return;
      setShow((s) => s || window.innerWidth < 768);
    }, 2500);
    return () => {
      window.removeEventListener("setu:pwa-ready", check);
      clearTimeout(t);
    };
  }, []);

  if (!show) return null;

  const close = () => {
    sessionStorage.setItem("setu-install-banner-dismissed", "1");
    setShow(false);
  };
  const install = async () => {
    const res = await promptInstall();
    if (res === "accepted" || res === "unavailable") close();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 card !border-setu-300 !bg-setu-600 !text-white p-3 pl-4 pr-2 flex items-center gap-3 shadow-xl">
      <Smartphone size={22} className="shrink-0"/>
      <div className="flex-1 text-sm leading-snug">
        <div className="font-bold">{lang === "hi" ? "सेतु को ऐप की तरह इस्तेमाल करें" : "Install Setu as an app"}</div>
        <div className="opacity-90 text-[12px]">
          {lang === "hi"
            ? "होम स्क्रीन पर जोड़ें — बिना ऐप स्टोर के।"
            : "Add to home screen — no app store needed."}
        </div>
      </div>
      <button onClick={install} className="bg-white text-setu-700 font-semibold text-xs px-3 py-1.5 rounded-lg">
        {lang === "hi" ? "इंस्टॉल" : "Install"}
      </button>
      <button onClick={close} aria-label="Close" className="p-1.5 text-white/80 hover:text-white">
        <X size={16}/>
      </button>
    </div>
  );
}
