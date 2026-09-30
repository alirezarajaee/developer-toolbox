import type { LucideIcon } from "lucide-react";
import {
  Braces,
  Binary,
  Link2,
  KeyRound,
  Hash,
  ShieldCheck,
  Regex,
  Fingerprint,
  Clock,
  Palette,
  CaseSensitive,
} from "lucide-react";

export type ToolCategory = "Data" | "Security" | "Testing" | "Utilities";

export interface Tool {
  /** URL segment under /tools/, also used as the localStorage identifier. */
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  icon: LucideIcon;
  accent: string;
}

export const TOOLS: Tool[] = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format, validate and minify JSON.",
    category: "Data",
    keywords: ["json", "format", "pretty", "minify", "validate", "parse"],
    icon: Braces,
    accent: "#f59e0b",
  },
  {
    id: "base64",
    name: "Base64 Encoder / Decoder",
    description: "Encode and decode Base64 strings.",
    category: "Data",
    keywords: ["base64", "encode", "decode", "binary", "btoa", "atob"],
    icon: Binary,
    accent: "#38bdf8",
  },
  {
    id: "url",
    name: "URL Encoder / Decoder",
    description: "Encode and decode URL components.",
    category: "Data",
    keywords: ["url", "uri", "encode", "decode", "percent", "query", "escape"],
    icon: Link2,
    accent: "#2dd4bf",
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    description: "Inspect JWT header, payload and claims.",
    category: "Security",
    keywords: ["jwt", "token", "decode", "claims", "auth", "bearer", "oauth"],
    icon: KeyRound,
    accent: "#f472b6",
  },
  {
    id: "hash",
    name: "Hash Generator",
    description: "SHA-256, SHA-384 and SHA-512 hashing.",
    category: "Security",
    keywords: ["hash", "sha256", "sha384", "sha512", "checksum", "digest"],
    icon: Hash,
    accent: "#a78bfa",
  },
  {
    id: "password",
    name: "Password Strength Checker",
    description: "Analyze password strength, fully offline.",
    category: "Security",
    keywords: [
      "password",
      "strength",
      "checker",
      "security",
      "entropy",
      "zxcvbn",
    ],
    icon: ShieldCheck,
    accent: "#34d399",
  },
  {
    id: "regex",
    name: "Regex Tester",
    description: "Test regular expressions against text live.",
    category: "Testing",
    keywords: ["regex", "regexp", "pattern", "match", "test", "regular"],
    icon: Regex,
    accent: "#fb923c",
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate UUID v4 identifiers in bulk.",
    category: "Utilities",
    keywords: ["uuid", "guid", "generator", "v4", "random", "id"],
    icon: Fingerprint,
    accent: "#60a5fa",
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    description: "Convert Unix time and dates, UTC and local.",
    category: "Utilities",
    keywords: ["timestamp", "unix", "epoch", "date", "time", "utc", "iso"],
    icon: Clock,
    accent: "#facc15",
  },
  {
    id: "color",
    name: "Color Converter",
    description: "Convert between HEX, RGB and HSL.",
    category: "Utilities",
    keywords: ["color", "hex", "rgb", "hsl", "convert", "picker"],
    icon: Palette,
    accent: "#e879f9",
  },
  {
    id: "case",
    name: "Case Converter",
    description: "Convert text between eight naming cases.",
    category: "Utilities",
    keywords: [
      "case",
      "camel",
      "pascal",
      "snake",
      "kebab",
      "constant",
      "title",
      "convert",
    ],
    icon: CaseSensitive,
    accent: "#4ade80",
  },
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Data",
  "Security",
  "Testing",
  "Utilities",
];

export function getTool(id: string): Tool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function toolHref(id: string): string {
  return `/tools/${id}/`;
}

/** Case-insensitive search across name, description, category and keywords. */
export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  const terms = q.split(/\s+/);
  return TOOLS.filter((tool) => {
    const haystack = [
      tool.name,
      tool.description,
      tool.category,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
