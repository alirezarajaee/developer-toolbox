/**
 * Pure, UI-free conversion helpers used by the Color, Case and Password
 * tools. All functions are deterministic and safe to run anywhere.
 */

// ---------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------

export interface Rgb {
  r: number;
  g: number;
  b: number;
}
export interface Hsl {
  h: number;
  s: number;
  l: number;
}

function clampByte(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

/** Parses #rgb, #rrggbb, rgb(...), rgba(...) into { r, g, b } or null. */
export function parseColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase();

  const hex = value.replace(/^#/, "");
  if (/^[0-9a-f]{3}$/.test(hex) || /^[0-9a-f]{6}$/.test(hex)) {
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
    };
  }

  const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(/[,\s/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const [r, g, b] = parts.slice(0, 3).map((p) => Number.parseFloat(p));
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r: clampByte(r), g: clampByte(g), b: clampByte(b) };
  }

  return null;
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b]
    .map((c) => clampByte(c).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;

  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const m = ln - c / 2;
  return {
    r: clampByte((r + m) * 255),
    g: clampByte((g + m) * 255),
    b: clampByte((b + m) * 255),
  };
}

export function formatRgb({ r, g, b }: Rgb): string {
  return `${r}, ${g}, ${b}`;
}

export function formatHsl({ h, s, l }: Hsl): string {
  return `${h}, ${s}%, ${l}%`;
}

// ---------------------------------------------------------------------------
// Case conversion
// ---------------------------------------------------------------------------

export type CaseName =
  | "uppercase"
  | "lowercase"
  | "title"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  /** CONSTANT_CASE */
  | "constant";

export const CASE_NAMES: CaseName[] = [
  "uppercase",
  "lowercase",
  "title",
  "camel",
  "pascal",
  "snake",
  "kebab",
  "constant",
];

export const CASE_LABELS: Record<CaseName, string> = {
  uppercase: "UPPERCASE",
  lowercase: "lowercase",
  title: "Title Case",
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
  constant: "CONSTANT_CASE",
};

/** Splits text into word tokens across common separators and casing. */
export function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")
    .replace(/([0-9])([a-zA-Z])/g, "$1 $2")
    .split(/[\s_\-.]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function toUpperFirst(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function convertCase(input: string, target: CaseName): string {
  const words = splitWords(input);
  switch (target) {
    case "uppercase":
      return input.toUpperCase();
    case "lowercase":
      return input.toLowerCase();
    case "title":
      return input.replace(/\w\S*/g, (word) => toUpperFirst(word));
    case "camel":
      return words
        .map((word, index) =>
          index === 0 ? word.toLowerCase() : toUpperFirst(word),
        )
        .join("");
    case "pascal":
      return words.map((word) => toUpperFirst(word)).join("");
    case "snake":
      return words.map((word) => word.toLowerCase()).join("_");
    case "kebab":
      return words.map((word) => word.toLowerCase()).join("-");
    case "constant":
      return words.map((word) => word.toUpperCase()).join("_");
  }
}

// ---------------------------------------------------------------------------
// Password strength
// ---------------------------------------------------------------------------

export interface PasswordCheck {
  id: string;
  label: string;
  passed: boolean;
}

export interface PasswordAnalysis {
  /** 0–4 score mapped to five strength bands. */
  level: 0 | 1 | 2 | 3 | 4;
  label: "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";
  checks: PasswordCheck[];
  warnings: string[];
}

const STRENGTH_LABELS: PasswordAnalysis["label"][] = [
  "Very weak",
  "Weak",
  "Fair",
  "Strong",
  "Very strong",
];

export function analyzePassword(password: string): PasswordAnalysis {
  const checks: PasswordCheck[] = [
    { id: "length", label: "12+ characters", passed: password.length >= 12 },
    { id: "upper", label: "Uppercase letter", passed: /[A-Z]/.test(password) },
    { id: "lower", label: "Lowercase letter", passed: /[a-z]/.test(password) },
    { id: "number", label: "Number", passed: /\d/.test(password) },
    { id: "symbol", label: "Symbol", passed: /[^A-Za-z0-9]/.test(password) },
  ];

  const warnings: string[] = [];

  if (/(.)\1{2,}/.test(password)) {
    warnings.push("Contains repeated characters (e.g. “aaa”).");
  }
  if (password.length > 0 && /^[a-z]+\d*$/i.test(password) && password.length < 16) {
    warnings.push("Looks like a common word + digits pattern.");
  }
  if (/^(0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf)/i.test(password)) {
    warnings.push("Starts with a common sequence.");
  }
  if (
    ["password", "letmein", "qwerty", "admin", "welcome", "iloveyou"].some(
      (weak) => password.toLowerCase().includes(weak),
    )
  ) {
    warnings.push("Contains a very common password word.");
  }

  const passedCount = checks.filter((check) => check.passed).length;
  let level: PasswordAnalysis["level"] = Math.max(
    0,
    Math.min(4, passedCount - 1),
  ) as PasswordAnalysis["level"];
  if (warnings.length >= 2) level = Math.min(level, 1) as PasswordAnalysis["level"];
  else if (warnings.length === 1) level = Math.min(level, 2) as PasswordAnalysis["level"];

  return {
    level,
    label: STRENGTH_LABELS[level],
    checks,
    warnings,
  };
}
