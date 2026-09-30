"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
};

/** Consistent labeled text input for tool pages. */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ label, id, className = "", ...props }, ref) {
    const inputId = id ?? (label ? `input-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--ring)] focus:outline-none ${className}`}
          {...props}
        />
      </div>
    );
  },
);
