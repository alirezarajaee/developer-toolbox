"use client";

import { useState } from "react";
import { Eraser, FileKey2 } from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/text-area";
import { Alert } from "@/components/ui/alert";
import { base64UrlDecode } from "@/lib/base64url";

const tool = getTool("jwt");

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("A JWT must have three dot-separated parts (header.payload.signature).");
  }

  function parsePart(raw: string, name: string): Record<string, unknown> {
    try {
      const json = JSON.parse(base64UrlDecode(raw)) as unknown;
      if (json === null || typeof json !== "object" || Array.isArray(json)) {
        throw new Error("not an object");
      }
      return json as Record<string, unknown>;
    } catch {
      throw new Error(`The ${name} part is not valid Base64URL-encoded JSON.`);
    }
  }

  return {
    header: parsePart(parts[0], "header"),
    payload: parsePart(parts[1], "payload"),
    signature: parts[2],
  };
}

const DATE_CLAIMS = ["exp", "iat", "nbf", "auth_time"] as const;

function formatClaimValue(key: string, value: unknown): string | null {
  if (typeof value === "number" && (DATE_CLAIMS as readonly string[]).includes(key)) {
    const date = new Date(value * 1000);
    if (!Number.isNaN(date.getTime())) {
      return date.toUTCString();
    }
  }
  return null;
}

function ClaimList({ claims }: { claims: Record<string, unknown> }) {
  const entries = Object.entries(claims);
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No claims.</p>;
  }
  return (
    <dl className="flex flex-col divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] bg-[var(--input)] font-mono text-sm">
      {entries.map(([key, value]) => {
        const hint = formatClaimValue(key, value);
        return (
          <div key={key} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-3 py-2">
            <dt className="font-semibold text-[var(--accent)]">{key}</dt>
            <dd className="min-w-0 break-all text-foreground">
              {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </dd>
            {hint ? (
              <dd className="text-xs text-muted-foreground">({hint})</dd>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}

const EXAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldiBUb29sYm94IiwiaWF0IjoxNTE2MjM5MDIyfQ.dBjftJeZ4CVPmB92K27uhbUJU1p1r_wW1gFWFOEjXk";

export default function JwtDecoderPage() {
  useTrackToolVisit(tool!.id);
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState<string | null>(null);

  function decode() {
    try {
      setDecoded(decodeJwt(token));
      setError(null);
    } catch (err) {
      setDecoded(null);
      setError(err instanceof Error ? err.message : "Invalid token.");
    }
  }

  return (
    <ToolLayout
      tool={tool!}
      notice={
        <Alert variant="warning" title="Security notice">
          Decoding a JWT does <strong>not verify its signature</strong>. Anyone
          can craft a token with arbitrary claims — never trust the contents
          without verification on your backend.
        </Alert>
      }
    >
      <TextArea
        label="JWT token"
        value={token}
        onChange={(event) => {
          setToken(event.target.value);
          setError(null);
          setDecoded(null);
        }}
        placeholder="eyJhbGciOi…"
        className="min-h-24 font-mono"
      />

      <div className="flex flex-wrap gap-2">
        <Button onClick={decode} disabled={!token.trim()}>
          <FileKey2 className="size-4" aria-hidden="true" /> Decode
        </Button>
        <Button variant="ghost" onClick={() => setToken(EXAMPLE_JWT)}>
          <FileKey2 className="size-4" aria-hidden="true" /> Example
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setToken("");
            setDecoded(null);
            setError(null);
          }}
        >
          <Eraser className="size-4" aria-hidden="true" /> Clear
        </Button>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {decoded ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold">Header</h2>
            <ClaimList claims={decoded.header} />
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold">Payload claims</h2>
            <ClaimList claims={decoded.payload} />
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold">Signature</h2>
            <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--input)] p-3 text-xs break-all">
              {decoded.signature}
            </pre>
            <p className="text-xs text-muted-foreground">
              Provided as-is; it cannot be validated without the secret key.
            </p>
          </section>
        </div>
      ) : null}
    </ToolLayout>
  );
}
