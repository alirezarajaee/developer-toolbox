"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { TOOLS } from "@/lib/tools";

const FAVORITES_KEY = "toolbox-favorites";
const RECENT_KEY = "toolbox-recent";
const MAX_RECENT = 6;

const isToolId = (id: unknown): id is string =>
  typeof id === "string" && TOOLS.some((tool) => tool.id === id);

function parseStringArray(raw: string): string[] | undefined {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return undefined;
    const ids = parsed.filter(isToolId);
    return ids.length === parsed.length ? ids : undefined;
  } catch {
    return undefined;
  }
}

/** Favorite tool ids, persisted locally. */
export function useFavorites() {
  const [favorites, setFavorites, hydrated] = useLocalStorage<string[]>(
    FAVORITES_KEY,
    { defaultValue: [], parse: parseStringArray },
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (!isToolId(id)) return;
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
      );
    },
    [setFavorites],
  );

  return { favorites, isFavorite, toggleFavorite, hydrated };
}

/** Recently opened tool ids (most recent first), persisted locally. */
export function useRecentTools() {
  const [recent, setRecent] = useLocalStorage<string[]>(RECENT_KEY, {
    defaultValue: [],
    parse: parseStringArray,
  });

  const trackVisit = useCallback(
    (id: string) => {
      if (!isToolId(id)) return;
      setRecent((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECENT));
    },
    [setRecent],
  );

  return { recent, trackVisit };
}
