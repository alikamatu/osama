import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.APP_URL ??
  "https://assistant.alikamatu.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        // Keep authed/transactional areas out of search results.
        disallow: [
          "/today", "/inbox", "/tasks", "/projects", "/habits", "/goals",
          "/calendar", "/reviews", "/notes", "/stats", "/assistant",
          "/search", "/settings", "/onboarding", "/trash", "/admin",
          "/verify", "/verify-request", "/signout", "/unsubscribe",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
