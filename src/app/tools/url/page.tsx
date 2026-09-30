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

const tool = getTool("url");

export default function UrlToolPage() {
  useTrackToolVisit(tool!.id);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<"encode" | "decode" | null>(null);

  function encode() {
    try {
      setOutput(encodeURIComponent(input));
      setError(null);
      setLastAction("encode");
    } catch {
      setError("Unable to encode input (lone surrogate?).");
      setOutput("");
    }
  }

  function decode() {
    try {
      setOutput(decodeURIComponent(input));
      setError(null);
      setLastAction("decode");
    } catch {
      setError("Invalid URL-encoded input.");
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
        placeholder={lastAction === "encode" ? "https://example.com/path?q=hello world" : "https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world"}
        className="min-h-36 font-mono"
      />

      <div className="flex flex-wrap gap-2">
        <Button onClick={encode}>
          <Lock className="size-4" aria-hidden="true" /> Encode
        </Button>
        <Button variant="secondary" onClick={decode}>
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
            setLastAction(null);
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
        Uses the browser-native encodeURIComponent / decodeURIComponent. A lone
        “%” that is not part of a valid escape fails decoding with a clear error.
      </p>
    </ToolLayout>
  );
}
