"use client";

import { useEffect, useState } from "react";

/**
 * Renders `fallback` on the server and during the very first client render,
 * then swaps to `children` after mount. Use to wrap any UI that reads from
 * a localStorage-backed store (Zustand persist), since the server can't
 * see that storage and would otherwise hydrate with mismatched values.
 */
export function Hydrated({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <>{ready ? children : fallback}</>;
}

export function useHydrated(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
