/* Cairn service worker — PWA shell cache + Web Push */

const VERSION = "osama-sw-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-rt`;

// Routes/assets we want available offline. Today is the priority.
const SHELL_PATHS = [
  "/",
  "/today",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-mask.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      try { await cache.addAll(SHELL_PATHS); } catch { /* a missing route shouldn't block install */ }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => k.startsWith(VERSION) ? null : caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

/**
 * Strategy:
 * - GET navigation requests: network-first, fall back to cache (stale-while-revalidate).
 * - GET static assets (_next/static, icon, manifest): cache-first.
 * - Everything else: passthrough.
 */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never intercept API calls — they must hit the network and bypass any cache.
  if (url.pathname.startsWith("/api/")) return;

  const isNav = req.mode === "navigate" || (req.headers.get("accept") ?? "").includes("text/html");

  if (isNav) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        if (cached) return cached;
        const fallback = await caches.match("/today");
        return fallback ?? Response.error();
      }
    })());
    return;
  }

  const isStatic = url.pathname.startsWith("/_next/static/") ||
                   url.pathname === "/manifest.webmanifest" ||
                   url.pathname.startsWith("/icon");

  if (isStatic) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok) {
          const cache = await caches.open(SHELL_CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        return cached ?? Response.error();
      }
    })());
  }
});

/* ─── Web Push ──────────────────────────────────────────────── */

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data ? event.data.text() : "" }; }

  const title = data.title || "Cairn";
  const opts = {
    body: data.body || "",
    icon: "/icon.svg",
    badge: "/icon-mask.svg",
    data: { url: data.url || "/today", kind: data.kind || "generic" },
    tag: data.tag || "osama-notification",
    renotify: Boolean(data.renotify),
    requireInteraction: false,
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/today";
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) {
      const u = new URL(c.url);
      if (u.origin === self.location.origin) {
        await c.focus();
        c.navigate(target).catch(() => undefined);
        return;
      }
    }
    await self.clients.openWindow(target);
  })());
});
