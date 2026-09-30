"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";

const META: Record<Theme, { label: string; next: Theme; Icon: typeof Moon }> = {
  dark: { label: "Dark", next: "light", Icon: Moon },
  light: { label: "Light", next: "system", Icon: Sun },
  system: { label: "System", next: "dark", Icon: Monitor },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Avoid rendering the wrong icon during the first (server) render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? theme : "dark";
  const { label, next, Icon } = META[current];

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Theme: ${label}. Switch to ${META[next].label.toLowerCase()} theme`}
      title={`Theme: ${label} (switch to ${META[next].label})`}
      onClick={() => setTheme(next)}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}
