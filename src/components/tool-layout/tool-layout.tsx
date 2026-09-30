"use client";

import type { Tool } from "@/types";
import { FavoriteButton } from "@/components/favorite-button/favorite-button";

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  /** Optional note shown under the header (privacy notices etc.). */
  notice?: React.ReactNode;
}

/**
 * Consistent tool page scaffold: icon, name, description, favorite control,
 * optional notice, then the tool-specific UI.
 */
export function ToolLayout({ tool, children, notice }: ToolLayoutProps) {
  const Icon = tool.icon;
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start gap-4">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border)]"
          style={{ backgroundColor: `${tool.accent}1f` }}
          aria-hidden="true"
        >
          <Icon className="size-6" style={{ color: tool.accent }} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {tool.name}
            </h1>
            <FavoriteButton toolId={tool.id} toolName={tool.name} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </header>

      {notice}

      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
