"use client";

import { useCallback, useState } from "react";
import { Eraser, Plus, Sparkles } from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextInput } from "@/components/ui/text-input";
import { Alert } from "@/components/ui/alert";

const tool = getTool("uuid");
const MIN_QTY = 1;
const MAX_QTY = 100;

function generateUuids(count: number): string[] {
  if (typeof crypto.randomUUID === "function") {
    return Array.from({ length: count }, () => crypto.randomUUID());
  }
  // Fallback for older browsers: getRandomValues-based v4.
  return Array.from({ length: count }, () => {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  });
}

export default function UuidGeneratorPage() {
  useTrackToolVisit(tool!.id);
  const [quantity, setQuantity] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = useCallback(() => {
    setUuids(generateUuids(quantity));
  }, [quantity]);

  return (
    <ToolLayout
      tool={tool!}
      notice={
        <Alert variant="info">
          Generated with the browser&apos;s cryptographic random number generator (crypto.randomUUID). Generated IDs are not stored.
        </Alert>
      }
    >
      <div className="flex flex-wrap items-end gap-2">
        <div className="w-32">
          <TextInput
            label="Quantity (1–100)"
            aria-label="Quantity of UUIDs to generate"
            type="number"
            min={MIN_QTY}
            max={MAX_QTY}
            value={quantity}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              setQuantity(Number.isNaN(parsed) ? MIN_QTY : Math.min(MAX_QTY, Math.max(MIN_QTY, parsed)));
            }}
          />
        </div>
        <Button onClick={generate}>
          <Sparkles className="size-4" aria-hidden="true" /> Generate
        </Button>
        <CopyButton
          value={uuids.join("\n")}
          label="Copy all"
          disabled={uuids.length === 0}
        />
        <Button variant="ghost" onClick={() => setUuids([])} disabled={uuids.length === 0}>
          <Eraser className="size-4" aria-hidden="true" /> Clear
        </Button>
        <Button variant="ghost" onClick={() => setUuids((prev) => [...prev, ...generateUuids(1)])}>
          <Plus className="size-4" aria-hidden="true" /> Add one
        </Button>
      </div>

      <section aria-label="Generated UUIDs" className="flex flex-col gap-2">
        {uuids.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Click “Generate” to create {quantity} UUID{quantity === 1 ? "" : "s"}.
          </p>
        ) : (
          uuids.map((uuid, index) => (
            <div
              key={uuid}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
            >
              <span className="truncate font-mono text-sm">{uuid}</span>
              <CopyButton value={uuid} label={`Copy UUID ${index + 1}`} variant="ghost" compact />
            </div>
          ))
        )}
      </section>
    </ToolLayout>
  );
}
