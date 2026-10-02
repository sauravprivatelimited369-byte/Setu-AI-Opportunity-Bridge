"use client";
import { createContext, useContext, useState } from "react";
import type { Lang } from "@/lib/types";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};
const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, toggle: () => {} });

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem("setu-lang") as Lang | null;
    if (stored === "en" || stored === "hi") return stored;
  } catch {}
  return "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readInitialLang());

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("setu-lang", l); } catch {}
  };
  const toggle = () => setLang(lang === "en" ? "hi" : "en");

  return <LangCtx.Provider value={{ lang, setLang, toggle }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
