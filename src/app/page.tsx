"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";
import { TOOLS, searchTools, type Tool } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card/tool-card";
import { useRecentTools } from "@/lib/hooks/use-tool-history";
import { SITE_TAGLINE } from "@/lib/site";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const { recent } = useRecentTools();

  const filtered = useMemo(
    () => (query.trim() ? searchTools(query) : TOOLS),
    [query],
  );

  const recentTools = recent
    .map((id) => TOOLS.find((tool) => tool.id === id))
    .filter((tool): tool is Tool => Boolean(tool))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Developer Toolbox
        </h1>
        <p className="max-w-2xl text-muted-foreground">{SITE_TAGLINE}</p>

        <div className="relative mt-1 max-w-md">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools…  (Ctrl/Cmd + K opens global search)"
            aria-label="Search tools"
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--input)] pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:border-[var(--ring)] focus:outline-none"
          />
        </div>
      </section>

      {recentTools.length > 0 ? (
        <section aria-label="Recently used tools" className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Clock className="size-4" aria-hidden="true" /> Recently Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}/`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-[var(--accent)] hover:text-foreground"
              >
                <tool.icon className="size-3.5" style={{ color: tool.accent }} aria-hidden="true" />
                {tool.name}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70">
            Only tool identifiers are stored locally — never your inputs.
          </p>
        </section>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="font-medium">No tools match “{query}”.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a keyword like “encode”, “hash” or “color”.
          </p>
        </div>
      ) : (
        <section aria-label="All tools" className="flex flex-col gap-5">
          {(["Data", "Security", "Testing", "Utilities"] as const).map((category) => {
            const categoryTools = filtered.filter((tool) => tool.category === category);
            if (categoryTools.length === 0) return null;
            return (
              <div key={category} className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-muted-foreground">{category}</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
