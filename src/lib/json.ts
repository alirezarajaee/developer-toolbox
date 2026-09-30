/**
 * JSON formatting helpers with precise, user-friendly error reporting.
 */

export type JsonResult =
  | { ok: true; value: string }
  | { ok: false; error: { message: string; line?: number; column?: number } };

function describeError(raw: string, text: string): {
  message: string;
  line?: number;
  column?: number;
} {
  const match = raw.match(/position (\d+)/i);
  if (match) {
    const index = Number.parseInt(match[1], 10);
    const before = text.slice(0, index);
    const lines = before.split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    const excerpt = text.split("\n")[line - 1]?.trim().slice(0, 60);
    return {
      message: `Unexpected token near line ${line}${excerpt ? `: ${excerpt}` : "."}`,
      line,
      column,
    };
  }
  return { message: raw };
}

export function formatJson(
  input: string,
  indent: number | null = 2,
): JsonResult {
  if (!input.trim()) {
    return { ok: false, error: { message: "Input is empty. Paste some JSON first." } };
  }
  try {
    const parsed: unknown = JSON.parse(input);
    const output = indent === null ? String(parsed) : JSON.stringify(parsed, null, indent);
    return { ok: true, value: output };
  } catch (error) {
    return {
      ok: false,
      error: describeError(
        error instanceof Error ? error.message : String(error),
        input,
      ),
    };
  }
}
