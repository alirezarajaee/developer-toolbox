"use client";

import { useCallback, useEffect, useState } from "react";

/** Options for useLocalStorage. */
interface Options<T> {
  /** Fallback when nothing is stored (or storage is unavailable). */
  defaultValue: T;
  /**
   * Validate/transform a raw stored value. Return undefined to reject it,
   * e.g. to guard against corrupted or tampered data.
   */
  parse?: (raw: string) => T | undefined;
}

function read<T>(key: string, options: Options<T>): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return options.defaultValue;
    const parsed = options.parse ? options.parse(raw) : (raw as unknown as T);
    return parsed === undefined ? options.defaultValue : parsed;
  } catch {
    return options.defaultValue;
  }
}

/**
 * Persisted state backed by localStorage, safe against SSR and blocked
 * storage. Only non-sensitive values (theme, favorites, recent tool ids)
 * may be stored here — never tool inputs like passwords or tokens.
 */
export function useLocalStorage<T>(key: string, options: Options<T>) {
  const [value, setValue] = useState<T>(options.defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read(key, options));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage may be unavailable; state still updates for this session.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set, hydrated] as const;
}
