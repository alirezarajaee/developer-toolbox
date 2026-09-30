"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/types";
import { FavoriteButton } from "@/components/favorite-button/favorite-button";

/** Dashboard card for a single tool. The whole card is a link. */
export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <div className="group relative">
      <Link
        href={`/tools/${tool.id}/`}
        className="flex h-full flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--muted-foreground)]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        <div className="flex items-start justify-between">
          <span
            className="flex size-10 items-center justify-center rounded-lg border border-[var(--border)]"
            style={{ backgroundColor: `${tool.accent}1f` }}
            aria-hidden="true"
          >
            <Icon className="size-5" style={{ color: tool.accent }} />
          </span>
          <FavoriteButton toolId={tool.id} toolName={tool.name} fillOnHover />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold tracking-tight">{tool.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {tool.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-[var(--accent)]">
            Open Tool
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </div>
  );
}
