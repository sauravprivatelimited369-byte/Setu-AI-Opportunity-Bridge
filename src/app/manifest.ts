import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Setu AI Opportunity Bridge",
    short_name: "Setu AI",
    description:
      "AI-powered bridge between Indian seekers and opportunities — jobs, schemes, scholarships, skilling.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fafaf7",
    theme_color: "#167946",
    categories: ["education", "productivity", "business"],
    lang: "en",
    dir: "ltr",
    icons: [
      { src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
    screenshots: [],
    shortcuts: [
      { name: "AI Matches", short_name: "Matches", url: "/matches", icons: [{ src: "/icon-192.svg", sizes: "192x192" }] },
      { name: "Setu Mitra Chat", short_name: "Chat", url: "/chat", icons: [{ src: "/icon-192.svg", sizes: "192x192" }] },
      { name: "Opportunities", short_name: "Opps", url: "/opportunities", icons: [{ src: "/icon-192.svg", sizes: "192x192" }] },
    ],
  };
}
