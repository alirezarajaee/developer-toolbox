"use client";

import Link from "next/link";
import { Github, Menu, TerminalSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
import { Button } from "@/components/ui/button";
import { REPO_URL } from "@/lib/site";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <Menu className="size-4" aria-hidden="true" />
        </Button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
        >
          <TerminalSquare className="size-5 text-[var(--accent)]" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-tight">
            Developer Toolbox
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          <GlobalSearch />
          <ThemeToggle />
          {REPO_URL ? (
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View project on GitHub"
              title="View project on GitHub"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[var(--muted)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              <Github className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
