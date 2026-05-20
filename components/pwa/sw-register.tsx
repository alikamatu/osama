"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production" && !window.location.search.includes("sw=1")) {
      // Skip registration during dev unless explicitly requested.
      return;
    }
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
      console.warn("[sw] registration failed", err);
    });
  }, []);
  return null;
}
