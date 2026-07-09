"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadFromStorage,
  saveToStorage,
  type StorageKey,
} from "@/lib/storage";

/**
 * Estado React sincronizado con LocalStorage.
 * Arranca con `fallback` (coincide con el render del servidor) y se hidrata
 * con el valor guardado tras montar, evitando errores de hidratación.
 */
export function useLocalStorage<T>(key: StorageKey, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(loadFromStorage(key, fallback));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        saveToStorage(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update, hydrated] as const;
}
