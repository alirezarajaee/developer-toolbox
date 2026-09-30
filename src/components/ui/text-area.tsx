"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  id?: string;
};

/** Consistent labeled textarea for tool input/output areas. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, id, className = "", ...props }, ref) {
    const areaId = id ?? (label ? `area-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
    return (
      <div className="flex flex-col gap-1.5 min-w-0">
        {label ? (
          <label htmlFor={areaId} className="text-xs font-medium text-muted-foreground">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={areaId}
          spellCheck={false}
          className={`min-h-28 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--input)] p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--ring)] focus:outline-none ${className}`}
          {...props}
        />
      </div>
    );
  },
);
