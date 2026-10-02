import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const viewport: Viewport = {
  themeColor: "#167946",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://setu-ai-opportunity-bridge.vercel.app"),
  title: {
    default: "Setu AI Opportunity Bridge — Find the right opportunity in your language",
    template: "%s · Setu AI",
  },
  description:
    "AI-powered bridge between Indian job seekers, students and the right opportunity — jobs, internships, scholarships, government schemes, and free skilling courses across Bharat. हिंदी में भी उपलब्ध।",
  keywords: [
    "jobs India", "sarkari naukri", "government schemes", "scholarships India", "PMKVY",
    "Mudra loan", "PM SVANidhi", "AI job match", "internships India", "free skilling",
    "रोजगार", "नौकरी", "सरकारी योजना", "छात्रवृत्ति",
  ],
  authors: [{ name: "Setu AI Team" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Setu AI", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    title: "Setu AI Opportunity Bridge",
    description:
      "AI-powered bridge between Indian seekers and opportunities. Jobs, schemes, scholarships, skilling — in your language.",
    images: ["/icon-512.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Setu AI Opportunity Bridge",
    description: "AI-powered opportunity discovery for Bharat.",
    images: ["/icon-512.svg"],
  },
  icons: { icon: "/favicon.svg", apple: "/icon-512.svg" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
