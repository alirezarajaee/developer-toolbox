"use client";

import { useCallback, useState } from "react";
import { Eraser, FileText, Hash } from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextArea } from "@/components/ui/text-area";
import { Alert } from "@/components/ui/alert";

const tool = getTool("hash");

type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";
const ALGORITHMS: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

async function computeHash(algorithm: HashAlgorithm, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGeneratorPage() {
  useTrackToolVisit(tool!.id);
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Partial<Record<HashAlgorithm, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const generate = useCallback(async () => {
    if (!input) {
      setError("Enter some text to hash.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const results: Partial<Record<HashAlgorithm, string>> = {};
      await Promise.all(
        ALGORITHMS.map(async (algorithm) => {
          results[algorithm] = await computeHash(algorithm, input);
        }),
      );
      setHashes(results);
    } catch {
      setError("Hashing failed. Web Crypto requires a secure (HTTPS or localhost) context.");
    } finally {
      setBusy(false);
    }
  }, [input]);

  return (
    <ToolLayout
      tool={tool!}
      notice={
        <Alert variant="info" title="Hashing, not encryption">
          Hashing is a one-way function — digests cannot be decrypted back to
          the original text. Everything is computed locally with the Web Crypto
          API.
        </Alert>
      }
    >
      <TextArea
        label="Input text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Type or paste text to hash…"
        className="min-h-28 font-mono"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={generate} loading={busy} disabled={!input}>
          <Hash className="size-4" aria-hidden="true" /> Generate
        </Button>
        <CopyButton
          value={() =>
            ALGORITHMS.map((algorithm) =>
              hashes[algorithm] ? `${algorithm}: ${hashes[algorithm]}` : "",
            )
              .filter(Boolean)
              .join("\n")
          }
          label="Copy all"
          disabled={!hashes["SHA-256"]}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setInput("");
            setHashes({});
            setError(null);
          }}
        >
          <Eraser className="size-4" aria-hidden="true" /> Clear
        </Button>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="flex flex-col gap-3">
        {ALGORITHMS.map((algorithm) => {
          const digest = hashes[algorithm];
          return (
            <div key={algorithm} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{algorithm}</span>
                {digest ? <CopyButton value={digest} label={`Copy ${algorithm}`} variant="ghost" /> : null}
              </div>
              <pre
                aria-label={`${algorithm} digest`}
                className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--input)] p-3 text-xs break-all"
              >
                {digest ?? "—"}
              </pre>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        <FileText className="mr-1 inline size-3.5" aria-hidden="true" />
        The same input always produces the same digest. Use digests to verify
        file integrity or compare values without revealing them.
      </p>
    </ToolLayout>
  );
}
