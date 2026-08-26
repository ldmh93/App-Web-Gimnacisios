"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";

/**
 * Ejercicios marcados como favoritos, por id.
 * Se guarda como array (no Set) para que serialice a JSON sin conversiones.
 */
export function useFavorites() {
  const [ids, setIds, hydrated] = useLocalStorage<string[]>(
    STORAGE_KEYS.favorites,
    []
  );

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [setIds]
  );

  return { favorites: ids, isFavorite, toggleFavorite, hydrated };
}
