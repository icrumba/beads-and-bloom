"use client";

import { useState, useEffect } from "react";

/**
 * Prevents hydration mismatch when reading from Zustand persisted stores.
 * During SSR, returns the fallback value. After hydration, returns the real store value.
 */
export function useHydratedStore<T>(store: () => T, fallback: T): T {
  const [hydrated, setHydrated] = useState(false);
  const storeValue = store();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? storeValue : fallback;
}
