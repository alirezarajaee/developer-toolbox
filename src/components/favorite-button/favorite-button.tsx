"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/lib/hooks/use-tool-history";

interface FavoriteButtonProps {
  toolId: string;
  toolName: string;
  /** Fills the star on card hover when not yet favorited. */
  fillOnHover?: boolean;
  className?: string;
}

/** Favorite toggle persisted in localStorage (tool id only, never inputs). */
export function FavoriteButton({
  toolId,
  toolName,
  fillOnHover = false,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const active = hydrated && isFavorite(toolId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${toolName} from favorites`
          : `Add ${toolName} to favorites`
      }
      title={active ? "Remove from favorites" : "Add to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(toolId);
      }}
      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--border)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${className}`}
    >
      <Star
        className={`size-4 ${active ? "fill-[var(--warning)] text-[var(--warning)]" : ""} ${
          fillOnHover && !active ? "group-hover:fill-[var(--muted-foreground)]" : ""
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
