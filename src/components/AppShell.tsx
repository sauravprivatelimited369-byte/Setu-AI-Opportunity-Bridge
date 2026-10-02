"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bridge, Languages, Smartphone, CheckCircle2, Info, HelpCircle, Mail } from "lucide-react";
import clsx from "clsx";
import { LangProvider, useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";
import { canInstallPwa, captureInstallPrompt, isInstalledPwa, promptInstall, registerSW } from "@/lib/pwa";
import InstallBanner from "./InstallBanner";
import NetworkStatus from "./NetworkStatus";
import KeyboardShortcuts from "./KeyboardShortcuts";
function NavBar(){
  const pathname=usePathname();const{lang,toggle}=useLang();const t=useT(lang);
  const[installable,setInstallable]=useState(false);const[installed,setInstalled]=useState(false);const[msg,setMsg]=useState<string|null>(null);
  useEffect(()=>{registerSW();captureInstallPrompt();setInstalled(isInstalledPwa());const chk=()=>setInstallable(canInstallPwa());chk();window.addEventListener("setu:pwa-ready",chk);window.addEventListener("setu:pwa-installed",()=>{setInstalled(true);setInstallable(false)});},[]);
  const install=async()=>{const r=await promptInstall();if(r==="accepted"){setMsg(lang==="hi"?"ऐप इंस्टॉल हो रहा है ✓":"Installing app ✓");setInstallable(false);setTimeout(()=>setMsg(null),3000)}};
  const links=[{href:"/",label:t.navHome},{href:"/dashboard",label:lang==="hi"?"डैशबोर्ड":"Dashboard"},{href:"/opportunities",label:t.navOpportunities},{href:"/matches",label:t.navMatches},{href:"/applications",label:lang==="hi"?"आवेदन":"Applications"},{href:"/chat",label:t.navChat},{href:"/profile",label:t.navProfile}];
  return(<header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-gray-200">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
      <Link href="/" className="flex items-center gap-2"><div className="w-9 h-9 rounded-xl bg-setu-600 text-white flex items-center justify-center"><Bridge size={20}/></div><div className="leading-tight"><div className="font-bold text-ink-900 text-base">{lang==="hi"?"सेतु AI":"Setu AI"}</div><div className="text-[11px] text-gray-500 -mt-0.5">{lang==="hi"?"ऑपर्च्युनिटी ब्रिज":"Opportunity Bridge"}</div></div></Link>
      <nav className="hidden md:flex items-center gap-1">{links.map(l=>{const a=l.href==="/"?pathname==="/":pathname?.startsWith(l.href);return(<Link key={l.href}href={l.href}className={clsx("px-3 py-2 rounded-lg text-sm font-medium transition",a?"bg-setu-50 text-setu-700":"text-gray-600 hover:text-ink-900 hover:bg-gray-100")}>{l.label}</Link>)})}</nav>
      <div className="flex items-center gap-2">
        {installable&&!installed&&(<button onClick={install} className="hidden sm:inline-flex btn-secondary !px-3 !py-1.5 items-center gap-1.5 text-sm" title="Install as app"><Smartphone size={16}/><span>{lang==="hi"?"ऐप इंस्टॉल":"Install App"}</span></button>)}
        {installed&&(<span className="hidden sm:inline-flex chip chip-green items-center gap-1 text-xs"><CheckCircle2 size={12}/>{lang==="hi"?"ऐप":"App"}</span>)}
        <button onClick={toggle} className="btn-secondary !px-3 !py-1.5 flex items-center gap-1.5 text-sm" aria-label="Lang"><Languages size={16}/><span>{lang==="en"?"हिं":"EN"}</span></button>
        <Link href="/chat" className="btn-primary hidden sm:inline-flex text-sm">{t.chatCta}</Link>
      </div>
    </div>
    {msg&&(<div className="fixed top-20 right-4 z-50 card !bg-setu-600 !text-white !border-setu-700 px-4 py-2 text-sm shadow-xl flex items-center gap-2"><CheckCircle2 size={16}/>{msg}</div>)}
    <div className="md:hidden border-t border-gray-100 flex overflow-x-auto">{links.map(l=>{const a=l.href==="/"?pathname==="/":pathname?.startsWith(l.href);return(<Link key={l.href}href={l.href}className={clsx("whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2",a?"border-setu-600 text-setu-700":"border-transparent text-gray-600")}>{l.label}</Link>)})}</div>
  </header>);
}
function Footer(){const{lang}=useLang();const t=useT(lang);return(<footer className="border-t border-gray-200 mt-16 bg-white"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-4 justify-center"><span>{t.footer}</span><Link href="/about" className="hover:text-setu-700 inline-flex items-center gap-1"><Info size={13}/>{lang==="hi"?"परिचय":"About"}</Link><Link href="/faq" className="hover:text-setu-700 inline-flex items-center gap-1"><HelpCircle size={13}/>{lang==="hi"?"सामान्य प्रश्न":"FAQ"}</Link><Link href="/contact" className="hover:text-setu-700 inline-flex items-center gap-1"><Mail size={13}/>{lang==="hi"?"संपर्क":"Contact"}</Link></div><div className="flex items-center gap-4"><span className="chip chip-green">{t.stats.seekers}</span><span className="chip chip-blue">{t.stats.opps}</span><span className="chip chip-orange">{t.stats.states}</span><span className="hidden md:inline chip chip-gray" title="Keyboard shortcuts: g then d/o/m/c/p">⌨ g?</span></div></div></footer>)}
function AppShellBody({children}:{children:React.ReactNode}){return(<div className="min-h-screen flex flex-col"><a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-setu-700 text-white px-3 py-1.5 rounded z-50 text-sm">Skip to content</a><NavBar/><NetworkStatus/><KeyboardShortcuts/><main id="main-content" className="flex-1" tabIndex={-1}>{children}</main><Footer/><InstallBanner/></div>)}
export default function AppShell({children}:{children:React.ReactNode}){return(<LangProvider><AppShellBody>{children}</AppShellBody></LangProvider>)}
