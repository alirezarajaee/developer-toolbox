"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { TOOLS, type Tool } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card/tool-card";
import { useFavorites } from "@/lib/hooks/use-tool-history";

export default function FavoritesPage() {
  const { favorites, hydrated } = useFavorites();

  const favoriteTools = favorites
    .map((id) => TOOLS.find((tool) => tool.id === id))
    .filter((tool): tool is Tool => Boolean(tool));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Favorites</h1>
        <p className="text-muted-foreground">
          Your starred tools, stored only in this browser via localStorage.
        </p>
      </header>

      {!hydrated ? (
        <p className="text-sm text-muted-foreground">Loading favorites…</p>
      ) : favoriteTools.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--border)] p-10 text-center">
          <Star className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="font-medium">No favorites yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Click the star on any tool card or tool page to pin it here for quick access.
          </p>
          <Link
            href="/"
            className="mt-1 rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:brightness-110"
          >
            Browse tools
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favoriteTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
