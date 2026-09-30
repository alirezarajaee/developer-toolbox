"use client";

import { useState } from "react";
import {
  Braces,
  CheckCircle2,
  Eraser,
  FileJson,
  Minimize2,
  WandSparkles,
} from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextArea } from "@/components/ui/text-area";
import { Alert } from "@/components/ui/alert";
import { formatJson } from "@/lib/json";

const tool = getTool("json");

const EXAMPLE_JSON = `{
  "name": "developer-toolbox",
  "version": "1.0.0",
  "private": true,
  "features": ["format", "validate", "minify"],
  "stats": { "tools": 11, "stars": 42 }
}`;

export default function JsonFormatterPage() {
  useTrackToolVisit(tool!.id);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run(mode: "format" | "minify") {
    const result = formatJson(input, mode === "minify" ? 0 : 2);
    if (result.ok) {
      setOutput(result.value);
      setError(null);
    } else {
      setError(result.error.message);
      setOutput("");
    }
  }

  function validate() {
    const result = formatJson(input);
    setError(result.ok ? null : result.error.message);
    if (result.ok) {
      setOutput("✓ Valid JSON");
    } else {
      setOutput("");
    }
  }

  return (
    <ToolLayout
      tool={tool!}
      notice={
        <Alert variant="info">
          All JSON parsing happens locally in your browser. Nothing is uploaded.
        </Alert>
      }
    >
      <TextArea
        label="JSON input"
        aria-label="JSON input"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setError(null);
          if (output === "✓ Valid JSON") setOutput("");
        }}
        placeholder='{"paste": "your JSON here"}'
        className="min-h-48 font-mono"
      />

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => run("format")}>
          <WandSparkles className="size-4" aria-hidden="true" /> Format
        </Button>
        <Button variant="secondary" onClick={() => run("minify")}>
          <Minimize2 className="size-4" aria-hidden="true" /> Minify
        </Button>
        <Button variant="secondary" onClick={validate}>
          <CheckCircle2 className="size-4" aria-hidden="true" /> Validate
        </Button>
        <CopyButton value={output} label="Copy output" variant="outline" />
        <Button
          variant="ghost"
          onClick={() => {
            setInput(EXAMPLE_JSON);
            setError(null);
            setOutput("");
          }}
        >
          <FileJson className="size-4" aria-hidden="true" /> Example
        </Button>
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

      {error ? (
        <Alert variant="error" title="Invalid JSON">
          {error}
        </Alert>
      ) : null}

      <TextArea
        label="Output"
        aria-label="JSON output"
        value={output}
        readOnly
        className="min-h-48 font-mono"
      />

      <p className="text-xs text-muted-foreground">
        <Braces className="mr-1 inline size-3.5" aria-hidden="true" />
        Tip: Format uses 2-space indentation. Validate checks syntax without
        modifying the input.
      </p>
    </ToolLayout>
  );
}
