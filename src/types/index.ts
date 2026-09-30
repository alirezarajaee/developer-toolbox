import type { LucideIcon } from "lucide-react";

export type ToolCategory = "Data" | "Security" | "Testing" | "Utilities";

export interface Tool {
  /** URL segment under /tools/, also used as the localStorage identifier. */
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  icon: LucideIcon;
  /** Accent color used for the icon chip; works on dark and light themes. */
  accent: string;
}

/** A labeled row of technical output, e.g. a decoded JWT claim. */
export interface LabeledValue {
  label: string;
  value: string;
  hint?: string;
}

/** A single regex match rendered by the Regex Tester. */
export interface RegexMatch {
  index: number;
  text: string;
  groups: string[];
}
