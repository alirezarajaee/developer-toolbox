"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { TOOLS, searchTools, type Tool } from "@/lib/tools";
import { useRecentTools } from "@/lib/hooks/use-tool-history";
import { Kbd } from "@/components/ui/kbd";

/** Global tool search. Opens with Ctrl/Cmd + K or by clicking the trigger. */
export function GlobalSearch() {
  const router = useRouter();
  const { recent } = useRecentTools();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo<Tool[]>(() => {
    if (query.trim()) return searchTools(query).slice(0, 8);
    const recentTools = recent
      .map((id) => TOOLS.find((tool) => tool.id === id))
      .filter((tool): tool is Tool => Boolean(tool))
      .slice(0, 4);
    return recentTools.length > 0 ? recentTools : TOOLS.slice(0, 6);
  }, [query, recent]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  // Global shortcut: Ctrl/Cmd + K focuses/opens search.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    if (open) {
      // Defer so the dialog exists before focus.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const go = useCallback(
    (tool: Tool) => {
      close();
      router.push(`/tools/${tool.id}/`);
    },
    [close, router],
  );

  const onSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex]);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search tools"
        className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 text-sm text-muted-foreground transition-colors hover:border-[var(--muted-foreground)]/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search tools…</span>
        <span className="ml-2 hidden sm:flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search tools">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/50"
        onClick={close}
      />
      <div className="absolute left-1/2 top-16 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder="Search tools… (name, keyword, category)"
            aria-label="Search tools"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="shrink-0"
          >
            <Kbd>Esc</Kbd>
          </button>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto p-1.5" role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No tools match “{query}”.
            </div>
          ) : (
            results.map((tool, index) => (
              <button
                key={tool.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(tool)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                  index === activeIndex ? "bg-[var(--muted)]" : ""
                }`}
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)]"
                  style={{ backgroundColor: `${tool.accent}1f` }}
                >
                  <tool.icon className="size-4" style={{ color: tool.accent }} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{tool.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                </span>
                {index === activeIndex ? (
                  <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                ) : null}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--border)] px-3 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span className="flex items-center gap-1"><Kbd>↵</Kbd> open</span>
          <span className="flex items-center gap-1"><Kbd>Esc</Kbd> close</span>
        </div>
      </div>
    </div>
  );
}
