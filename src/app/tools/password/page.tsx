"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getTool } from "@/lib/tools";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { useTrackToolVisit } from "@/components/tool-layout/use-track-tool-visit";
import { TextInput } from "@/components/ui/text-input";
import { Alert } from "@/components/ui/alert";
import { analyzePassword } from "@/lib/converters";

const tool = getTool("password");

const LEVEL_COLORS: Record<number, string> = {
  0: "var(--danger)",
  1: "var(--danger)",
  2: "var(--warning)",
  3: "var(--success)",
  4: "var(--success)",
};

const LEVEL_WIDTHS: Record<number, string> = {
  0: "10%",
  1: "30%",
  2: "50%",
  3: "75%",
  4: "100%",
};

export default function PasswordStrengthPage() {
  useTrackToolVisit(tool!.id);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const isEmpty = password.length === 0;
  const color = LEVEL_COLORS[analysis.level];

  return (
    <ToolLayout
      tool={tool!}
      notice={
        <Alert variant="success" title="Analyzed locally">
          Your password is analyzed locally and is never uploaded, stored, or logged.
        </Alert>
      }
    >
      <div className="relative">
        <TextInput
          label="Password"
          aria-label="Password to analyze"
          type={visible ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Type or paste a password to check"
          autoComplete="off"
          // 1Password etc. should not offer to save this value.
          data-1p-ignore
          data-lpignore="true"
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-[30px] right-2 flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-[var(--muted)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>

      {!isEmpty ? (
        <section aria-label="Password strength" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold">Password Strength</h2>
              <span
                aria-live="polite"
                className="text-sm font-semibold"
                style={{ color }}
              >
                {analysis.label}
              </span>
            </div>
            <div
              role="meter"
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={analysis.level}
              aria-label={`Password strength: ${analysis.label}`}
              className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]"
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: LEVEL_WIDTHS[analysis.level], backgroundColor: color }}
              />
            </div>
            {/* Redundant text so state is not communicated by color alone. */}
            <p className="text-xs text-muted-foreground">
              Strength: {analysis.level + 1} / 5 — {analysis.label}
            </p>
          </div>

          <ul className="flex flex-col gap-1.5">
            {analysis.checks.map((check) => (
              <li key={check.id} className="flex items-center gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className={`flex size-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    check.passed
                      ? "bg-[var(--success)]/15 text-[var(--success)]"
                      : "bg-[var(--muted)] text-muted-foreground"
                  }`}
                >
                  {check.passed ? "✓" : "○"}
                </span>
                <span className={check.passed ? "" : "text-muted-foreground"}>
                  {check.label}
                </span>
                <span className="sr-only">{check.passed ? "(passed)" : "(not met)"}</span>
              </li>
            ))}
          </ul>

          {analysis.warnings.length > 0 ? (
            <Alert variant="warning" title="Warnings">
              <ul className="list-disc pl-4">
                {analysis.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </Alert>
          ) : null}
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">
          Enter a password above to see its strength analysis.
        </p>
      )}
    </ToolLayout>
  );
}
