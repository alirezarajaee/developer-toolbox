"use client";

import { useMemo, useState } from "react";
import { Pipette } from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { CopyButton } from "@/components/ui/copy-button";
import { TextInput } from "@/components/ui/text-input";
import { Alert } from "@/components/ui/alert";
import {
  formatHsl,
  formatRgb,
  parseColor,
  rgbToHex,
  rgbToHsl,
} from "@/lib/converters";

const tool = getTool("color");

export default function ColorConverterPage() {
  useTrackToolVisit(tool!.id);
  const [input, setInput] = useState("#6366f1");

  const parsed = useMemo(() => parseColor(input), [input]);
  const hex = parsed ? rgbToHex(parsed) : "";
  const hsl = parsed ? rgbToHsl(parsed) : null;

  return (
    <ToolLayout tool={tool!}>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="flex flex-col gap-3">
          <TextInput
            label="Color (HEX or RGB)"
            aria-label="Color value"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="#6366f1"
            className="font-mono"
          />
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Pipette className="size-3.5" aria-hidden="true" />
            Pick visually:
            <input
              type="color"
              aria-label="Native color picker"
              value={hex || "#6366f1"}
              onChange={(event) => setInput(event.target.value)}
              className="size-8 cursor-pointer rounded border border-[var(--border)] bg-transparent"
            />
          </label>
        </div>

        <div
          className="h-24 w-full rounded-xl border border-[var(--border)] sm:w-40"
          style={{ backgroundColor: parsed ? hex : "transparent" }}
          aria-hidden="true"
        />
      </div>

      {!parsed && input.trim() ? (
        <Alert variant="error" title="Invalid color value">
          Use a HEX code like #6366f1 or rgb(99, 102, 241).
        </Alert>
      ) : null}

      {parsed && hsl ? (
        <dl className="flex flex-col divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] bg-[var(--card)]">
          {(
            [
              ["HEX", hex, hex],
              ["RGB", formatRgb(parsed), `rgb(${formatRgb(parsed)})`],
              ["HSL", formatHsl(hsl), `hsl(${formatHsl(hsl)})`],
            ] as Array<[string, string, string]>
          ).map(([label, display, copyValue]) => (
            <div key={label} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="flex min-w-0 items-center gap-2 font-mono text-sm">
                <span className="truncate">{display}</span>
                <CopyButton value={copyValue} label={`Copy ${label}`} variant="ghost" compact />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Accepts #rgb, #rrggbb, rgb() and rgba(). Alpha values are ignored —
        colors are treated as opaque.
      </p>
    </ToolLayout>
  );
}
