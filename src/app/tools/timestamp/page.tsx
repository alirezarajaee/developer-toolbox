"use client";

import { useState } from "react";
import { Clock4, RefreshCw } from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextInput } from "@/components/ui/text-input";
import { Alert } from "@/components/ui/alert";

const tool = getTool("timestamp");

interface UnixToDateTime {
  iso: string;
  utc: string;
  local: string;
  relative: string;
}

function unixToDate(value: number, unit: "s" | "ms"): UnixToDateTime | null {
  const ms = unit === "s" ? value * 1000 : value;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" }),
    relative: formatRelative(date),
  };
}

function formatRelative(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const absSeconds = Math.abs(diffMs) / 1000;
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, seconds] of units) {
    if (absSeconds >= seconds || unit === "second") {
      return formatter.format(Math.round(diffMs / 1000 / seconds), unit);
    }
  }
  return "";
}

function parseDateToUnix(input: string): { seconds: number; millis: number } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return { seconds: Math.floor(date.getTime() / 1000), millis: date.getTime() };
}

export default function TimestampPage() {
  useTrackToolVisit(tool!.id);
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [dateResult, setDateResult] = useState<{ seconds: number; millis: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UnixToDateTime | null>(null);

  function convertUnix() {
    const trimmed = unixInput.trim();
    setError(null);
    setResult(null);
    if (!trimmed) {
      setError("Enter a Unix timestamp.");
      return;
    }
    if (!/^-?\d+$/.test(trimmed)) {
      setError("Enter a valid integer Unix timestamp.");
      return;
    }
    const value = Number.parseInt(trimmed, 10);
    const digits = trimmed.replace("-", "").length;
    const unit = digits >= 13 ? "ms" : "s";
    const converted = unixToDate(value, unit);
    if (!converted) {
      setError("That timestamp is out of range for a JavaScript Date.");
      return;
    }
    setResult(converted);
  }

  function convertDate() {
    setError(null);
    setDateResult(null);
    const parsed = parseDateToUnix(dateInput);
    if (!parsed) {
      setError("Could not parse the date. Try an ISO format like 2026-01-31T12:00:00Z.");
      return;
    }
    setDateResult(parsed);
  }

  function useCurrentTime() {
    const now = new Date();
    setUnixInput(String(Math.floor(now.getTime() / 1000)));
    setDateInput(now.toISOString().slice(0, 19));
    setError(null);
    setResult(null);
    setDateResult(null);
  }

  return (
    <ToolLayout tool={tool!}>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Unix → Date</h2>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-full max-w-xs">
            <TextInput
              label="Unix timestamp (seconds or milliseconds)"
              aria-label="Unix timestamp"
              value={unixInput}
              onChange={(event) => setUnixInput(event.target.value)}
              placeholder="e.g. 1770000000"
            />
          </div>
          <Button onClick={convertUnix} disabled={!unixInput.trim()}>
            <Clock4 className="size-4" aria-hidden="true" /> Convert
          </Button>
          <Button variant="ghost" onClick={useCurrentTime}>
            <RefreshCw className="size-4" aria-hidden="true" /> Use Current Time
          </Button>
        </div>

        {result ? (
          <dl className="grid gap-x-4 gap-y-2 rounded-lg border border-[var(--border)] bg-[var(--input)] p-3 font-mono text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted-foreground">ISO 8601</dt>
              <dd className="break-all">{result.iso}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Relative</dt>
              <dd>{result.relative}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">UTC</dt>
              <dd className="break-all">{result.utc}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Local</dt>
              <dd className="break-all">{result.local}</dd>
            </div>
          </dl>
        ) : null}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Date → Unix</h2>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-full max-w-xs">
            <TextInput
              label="Date (ISO 8601 or parseable format)"
              aria-label="Date to convert to Unix time"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              placeholder="2026-01-31T12:00:00Z"
            />
          </div>
          <Button onClick={convertDate} disabled={!dateInput.trim()}>
            <Clock4 className="size-4" aria-hidden="true" /> Convert
          </Button>
        </div>
        {dateResult ? (
          <dl className="grid gap-x-4 gap-y-2 rounded-lg border border-[var(--border)] bg-[var(--input)] p-3 font-mono text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Unix seconds</dt>
              <dd className="flex items-center gap-1.5">
                <span>{dateResult.seconds}</span>
                <CopyButton value={String(dateResult.seconds)} label="Copy seconds" variant="ghost" compact />
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Unix milliseconds</dt>
              <dd className="flex items-center gap-1.5">
                <span>{dateResult.millis}</span>
                <CopyButton value={String(dateResult.millis)} label="Copy milliseconds" variant="ghost" compact />
              </dd>
            </div>
          </dl>
        ) : null}
      </section>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <p className="text-xs text-muted-foreground">
        Timestamps with 13 or more digits are interpreted as milliseconds. All
        conversion happens locally in your browser.
      </p>
    </ToolLayout>
  );
}
