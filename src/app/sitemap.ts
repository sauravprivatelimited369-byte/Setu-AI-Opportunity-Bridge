import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const host=process.env.VERCEL_PROJECT_PRODUCTION_URL||process.env.SITE_URL||process.env.VERCEL_URL||"setu-ai-bridge.vercel.app";
  const base=host.startsWith("http")?host:`https://${host}`;
  const routes=["/","/about","/faq","/contact","/opportunities","/matches","/chat","/profile","/dashboard","/applications","/saved"];
  const now=new Date();
  return routes.map(r=>({url:`${base}${r}`,lastModified:now,changeFrequency:"weekly"as const,priority:r==="/"?1:.7}));
}
