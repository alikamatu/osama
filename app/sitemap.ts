import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.APP_URL ??
  "https://assistant.alikamatu.com";

const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/changelog",
  "/docs",
  "/docs/getting-started",
  "/docs/habits",
  "/docs/goals",
  "/docs/assistant",
  "/docs/api",
  "/privacy",
  "/terms",
  "/signin",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PUBLIC_PATHS.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/pricing" ? 0.9 : 0.7,
  }));
}
