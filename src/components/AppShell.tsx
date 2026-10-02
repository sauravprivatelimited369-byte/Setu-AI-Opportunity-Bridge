"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bridge, Languages } from "lucide-react";
import clsx from "clsx";
import { LangProvider, useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";

function NavBar() {
  const pathname = usePathname();
  const { lang, toggle } = useLang();
  const t = useT(lang);

  const links = [
    { href: "/", label: t.navHome },
    { href: "/dashboard", label: lang === "hi" ? "डैशबोर्ड" : "Dashboard" },
    { href: "/opportunities", label: t.navOpportunities },
    { href: "/matches", label: t.navMatches },
    { href: "/applications", label: lang === "hi" ? "आवेदन" : "Applications" },
    { href: "/chat", label: t.navChat },
    { href: "/profile", label: t.navProfile },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-setu-600 text-white flex items-center justify-center group-hover:bg-setu-700 transition">
            <Bridge size={20} />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-ink-900 text-base">
              {lang === "hi" ? "सेतु AI" : "Setu AI"}
            </div>
            <div className="text-[11px] text-gray-500 -mt-0.5">
              {lang === "hi" ? "ऑपर्च्युनिटी ब्रिज" : "Opportunity Bridge"}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm font-medium transition",
                  active
                    ? "bg-setu-50 text-setu-700"
                    : "text-gray-600 hover:text-ink-900 hover:bg-gray-100"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="btn-secondary !px-3 !py-1.5 flex items-center gap-1.5 text-sm"
            aria-label="Toggle language"
          >
            <Languages size={16} />
            <span>{lang === "en" ? "हिं" : "EN"}</span>
          </button>
          <Link href="/chat" className="btn-primary hidden sm:inline-flex text-sm">
            {t.chatCta}
          </Link>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-100 flex overflow-x-auto scrollbar-thin">
        {links.map((l) => {
          const active =
            l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2",
                active
                  ? "border-setu-600 text-setu-700"
                  : "border-transparent text-gray-600"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

function Footer() {
  const { lang } = useLang();
  const t = useT(lang);
  return (
    <footer className="border-t border-gray-200 mt-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>{t.footer}</div>
        <div className="flex items-center gap-4">
          <span className="chip chip-green">{t.stats.seekers}</span>
          <span className="chip chip-blue">{t.stats.opps}</span>
          <span className="chip chip-orange">{t.stats.states}</span>
        </div>
      </div>
    </footer>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <ShellBody>{children}</ShellBody>
    </LangProvider>
  );
}

function ShellBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
