"use client";

import { useMemo, useState } from "react";
import { Eraser } from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextInput } from "@/components/ui/text-input";
import { TextArea } from "@/components/ui/text-area";
import { Alert } from "@/components/ui/alert";

const tool = getTool("regex");

const FLAG_DEFINITIONS = [
  { flag: "g", description: "Global — find all matches" },
  { flag: "i", description: "Ignore case" },
  { flag: "m", description: "Multiline — ^ and $ match line boundaries" },
  { flag: "s", description: "DotAll — dot matches newlines" },
  { flag: "u", description: "Unicode — full unicode pattern semantics" },
  { flag: "y", description: "Sticky — match at exact lastIndex" },
] as const;

interface MatchRow {
  index: number;
  text: string;
  groups: string[];
}

function runRegex(pattern: string, flags: string, text: string): MatchRow[] {
  if (!pattern) return [];
  const effectiveFlags = flags.includes("g") ? flags : flags + "g";
  const regex = new RegExp(pattern, effectiveFlags);
  const rows: MatchRow[] = [];
  const MAX_MATCHES = 500;

  let match: RegExpExecArray | null;
  const re = new RegExp(regex);
  while ((match = re.exec(text)) !== null) {
    rows.push({
      index: match.index,
      text: match[0],
      groups: match.slice(1),
    });
    if (match[0] === "") {
      re.lastIndex++;
    }
    if (rows.length >= MAX_MATCHES) break;
    if (!re.global) break;
  }
  return rows;
}

function Highlighted({ text, rows }: { text: string; rows: MatchRow[] }) {
  if (!text || rows.length === 0) return null;

  const pieces: React.ReactNode[] = [];
  let cursor = 0;
  rows.forEach((row, i) => {
    if (row.index < cursor) return;
    if (row.index > cursor) pieces.push(<span key={`t${i}`}>{text.slice(cursor, row.index)}</span>);
    pieces.push(
      <mark key={`m${i}`} className="rounded-sm bg-[var(--accent)]/30 px-0.5 text-foreground">
        {text.slice(row.index, row.index + row.text.length)}
      </mark>,
    );
    cursor = row.index + row.text.length;
  });
  pieces.push(<span key="tail">{text.slice(cursor)}</span>);

  return (
    <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--input)] p-3 text-sm whitespace-pre-wrap break-words">
      {pieces}
    </pre>
  );
}

export default function RegexTesterPage() {
  useTrackToolVisit(tool!.id);
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string>("g");
  const [text, setText] = useState("");

  const { rows, error } = useMemo(() => {
    if (!pattern || !text) return { rows: [] as MatchRow[], error: null as string | null };
    try {
      return { rows: runRegex(pattern, flags, text), error: null };
    } catch {
      return {
        rows: [] as MatchRow[],
        error: "Invalid regular expression. Check for unbalanced brackets or quantifiers.",
      };
    }
  }, [pattern, flags, text]);

  function reset() {
    setPattern("");
    setText("");
  }

  return (
    <ToolLayout
      tool={tool!}
      notice={
        <Alert variant="info">
          The <code>g</code> flag is added automatically when missing so all matches are found.
        </Alert>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-64 flex-1">
            <TextInput
              label="Regular expression"
              aria-label="Regular expression pattern"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              placeholder="\\b\\w+@\\w+\\.\\w+\\b"
              className="font-mono"
            />
          </div>
          <CopyButton
            value={`/${pattern}/${flags}`}
            label="Copy regex"
            disabled={!pattern}
          />
          <Button variant="ghost" onClick={reset}>
            <Eraser className="size-4" aria-hidden="true" /> Clear
          </Button>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-xs font-medium text-muted-foreground">Flags</legend>
          <div className="flex flex-wrap gap-2">
            {FLAG_DEFINITIONS.map(({ flag, description }) => {
              const active = flags.includes(flag);
              return (
                <button
                  key={flag}
                  type="button"
                  aria-pressed={active}
                  title={description}
                  aria-label={`${description} (${flag} flag)`}
                  onClick={() =>
                    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, "") : prev + flag))
                  }
                  className={`h-8 min-w-9 rounded-md border px-2 font-mono text-sm transition-colors ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
                      : "border-[var(--border)] text-muted-foreground hover:border-[var(--muted-foreground)]/40"
                  }`}
                >
                  {flag}
                </button>
              );
            })}
          </div>
        </fieldset>

        <TextArea
          label="Test string"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste the text to test against…"
          className="min-h-36 font-mono"
        />

        {error ? (
          <Alert variant="error" title="Invalid regular expression">
            {error}
          </Alert>
        ) : null}

        <section aria-label="Matches" className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Matches {pattern && text ? `(${rows.length})` : ""}
            </h2>
            {rows.length > 0 ? (
              <span className="text-xs text-muted-foreground">
                0-indexed positions · max 500 shown
              </span>
            ) : null}
          </div>

          <Highlighted text={text} rows={rows} />

          {pattern && text && rows.length === 0 && !error ? (
            <p className="text-sm text-muted-foreground">No matches found.</p>
          ) : null}

          {rows.length > 0 ? (
            <ol className="flex flex-col divide-y divide-[var(--border)] rounded-lg border border-[var(--border)]">
              {rows.slice(0, 50).map((row, i) => (
                <li key={`${row.index}-${i}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 px-3 py-1.5 font-mono text-sm">
                  <span className="text-xs text-muted-foreground">#{i + 1} @ {row.index}</span>
                  <span className="min-w-0 break-all">{row.text}</span>
                  {row.groups.length > 0 ? (
                    <span className="text-xs text-muted-foreground">
                      groups: {row.groups.map((g, gi) => `$${gi + 1}=${g ?? "—"}`).join("  ")}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}
        </section>
      </div>
    </ToolLayout>
  );
}
