"use client";

import { useMemo, useState } from "react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { CopyButton } from "@/components/ui/copy-button";
import { TextArea } from "@/components/ui/text-area";
import {
  CASE_LABELS,
  CASE_NAMES,
  convertCase,
} from "@/lib/converters";

const tool = getTool("case");

export default function CaseConverterPage() {
  useTrackToolVisit(tool!.id);
  const [input, setInput] = useState("");

  const results = useMemo(() => {
    if (!input.trim()) return [];
    return CASE_NAMES.map((caseName) => ({
      caseName,
      value: convertCase(input, caseName),
    }));
  }, [input]);

  return (
    <ToolLayout tool={tool!}>
      <TextArea
        label="Text to convert"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="developer toolbox"
        className="min-h-24 font-mono"
      />

      <section aria-label="Converted cases" className="flex flex-col gap-2">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Type text above to see all case conversions.
          </p>
        ) : (
          results.map(({ caseName, value }) => (
            <div
              key={caseName}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
            >
              <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {CASE_LABELS[caseName]}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-sm">{value}</span>
              <CopyButton value={value} label={`Copy ${CASE_LABELS[caseName]}`} variant="ghost" compact />
            </div>
          ))
        )}
    </section>
    </ToolLayout>
  );
}
