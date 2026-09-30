"use client";

import { useEffect } from "react";
import { useRecentTools } from "@/lib/hooks/use-tool-history";

/** Records the given tool id in localStorage after the page hydrates. */
export function useTrackToolVisit(toolId: string) {
  const { trackVisit } = useRecentTools();
  useEffect(() => {
    trackVisit(toolId);
  }, [toolId, trackVisit]);
}
