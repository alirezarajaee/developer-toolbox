"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

interface CopyButtonProps {
  value: string | (() => string);
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Renders a borderless icon-only button for embedding in toolbars. */
  compact?: boolean;
  disabled?: boolean;
}

/** Reusable copy control with temporary "Copied" feedback (no alerts). */
export function CopyButton({
  value,
  label = "Copy",
  variant = "outline",
  size = "sm",
  className = "",
  compact = false,
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const text = typeof value === "function" ? value() : value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API can be denied (e.g. insecure context); fall back.
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        // Give up silently; the user can still select the text manually.
      }
      document.body.removeChild(area);
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1600);
  }, [value]);

  return (
    <Button
      variant={variant}
      size={compact ? "icon" : size}
      className={className}
      onClick={handleCopy}
      disabled={disabled}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
    >
      {copied ? (
        <Check className="size-4 text-[var(--success)]" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {!compact && <span aria-live="polite">{copied ? "Copied" : label}</span>}
    </Button>
  );
}
