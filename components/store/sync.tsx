"use client";

import { useEffect, useRef } from "react";
import { useHydrated } from "@/components/store/hydrated";
import { useStore } from "@/lib/store";
import { isEmptyPersistedState, pickPersistedState, type PersistedState } from "@/lib/store/persist";

async function fetchUserData(): Promise<PersistedState | null> {
  const res = await fetch("/api/user/data", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

async function saveUserData(state: PersistedState) {
  await fetch("/api/user/data", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
}

export function StoreSync() {
  const hydrated = useHydrated();
  const hasLoaded = useRef(false);
  const saveTimer = useRef<number | null>(null);
  const lastSaved = useRef<string>("");

  useEffect(() => {
    if (!hydrated) return;
    let isMounted = true;

    const localState = pickPersistedState(useStore.getState());

    fetchUserData().then((serverData) => {
      if (!isMounted) return;
      if (serverData) {
        const serverEmpty = isEmptyPersistedState(serverData);
        const localEmpty = isEmptyPersistedState(localState);
        if (serverEmpty && !localEmpty) {
          useStore.setState({ ...localState, hydrated: true });
          lastSaved.current = JSON.stringify(localState);
          saveUserData(localState).catch(() => undefined);
        } else {
          useStore.setState({ ...serverData, hydrated: true });
          lastSaved.current = JSON.stringify(serverData);
        }
      }
      hasLoaded.current = true;
    }).catch(() => {
      hasLoaded.current = true;
    });

    return () => {
      isMounted = false;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const unsubscribe = useStore.subscribe((state) => {
      const next = pickPersistedState(state);
      if (!hasLoaded.current) return;
      const serialized = JSON.stringify(next);
      if (serialized === lastSaved.current) return;
      lastSaved.current = serialized;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        saveUserData(next).catch(() => undefined);
      }, 400);
    });
    return unsubscribe;
  }, [hydrated]);

  return null;
}
