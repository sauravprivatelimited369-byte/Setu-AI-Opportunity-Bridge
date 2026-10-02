import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://setu-ai.example.com";
  const routes = ["/", "/opportunities", "/matches", "/chat", "/profile", "/dashboard", "/applications", "/saved"];
  const now = new Date();
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: now, changeFrequency: "weekly" as const, priority: r === "/" ? 1 : 0.7 }));
}
