import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Setu AI Opportunity Bridge",
    short_name: "Setu AI",
    description:
      "AI-powered bridge between Indian seekers and jobs, internships, scholarships, government schemes & skilling.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#167946",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
