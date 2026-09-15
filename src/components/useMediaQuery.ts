"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tracks a media query. matchMedia is an external store, so it is read through
 * useSyncExternalStore rather than mirrored into state via an effect.
 *
 * Returns false during server render and hydration, so anything branching on
 * it must render correctly in the false state first.
 */
export default function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
