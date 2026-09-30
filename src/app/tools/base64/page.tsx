"use client";

import { useState } from "react";
import { ArrowDownUp, Eraser, Lock, Unlock } from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextArea } from "@/components/ui/text-area";
import { Alert } from "@/components/ui/alert";

const tool = getTool("base64");

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(value: string): string {
  const normalized = value.trim().replace(/\s+/g, "");
  // Strict-ish validation before touching atob, which throws cryptic errors.
  if (!normalized || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error("Invalid Base64 input.");
  }
  if (normalized.length % 4 === 1) {
    throw new Error("Invalid Base64 input.");
  }
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export default function Base64Page() {
  useTrackToolVisit(tool!.id);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  function handleEncode() {
    try {
      setOutput(encodeBase64(input));
      setError(null);
      setMode("encode");
    } catch {
      setError("Unable to encode input.");
    }
  }

  function handleDecode() {
    try {
      setOutput(decodeBase64(input));
      setError(null);
      setMode("decode");
    } catch {
      setError("Invalid Base64 input.");
      setOutput("");
    }
  }

  function swap() {
    setInput(output);
    setOutput(input);
    setError(null);
  }

  return (
    <ToolLayout tool={tool!}>
      <TextArea
        label="Input"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setError(null);
        }}
        placeholder={mode === "decode" ? "Paste Base64 to decode…" : "Type text to encode…"}
        className="min-h-36 font-mono"
      />

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleEncode}>
          <Lock className="size-4" aria-hidden="true" /> Encode
        </Button>
        <Button variant="secondary" onClick={handleDecode}>
          <Unlock className="size-4" aria-hidden="true" /> Decode
        </Button>
        <Button variant="ghost" onClick={swap} disabled={!output && !input}>
          <ArrowDownUp className="size-4" aria-hidden="true" /> Swap
        </Button>
        <CopyButton value={output} label="Copy output" disabled={!output} />
        <Button
          variant="ghost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
        >
          <Eraser className="size-4" aria-hidden="true" /> Clear
        </Button>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <TextArea
        label="Output"
        value={output}
        readOnly
        placeholder="Result appears here…"
        className="min-h-36 font-mono"
      />

      <p className="text-xs text-muted-foreground">
        Encoding handles Unicode text via UTF-8. Decoding validates the input
        and rejects malformed Base64.
      </p>
    </ToolLayout>
  );
}
