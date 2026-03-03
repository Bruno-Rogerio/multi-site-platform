"use client";

import { useState, useCallback } from "react";

/** Hook for locked items: shows hint toast when clicking a locked item */
export function usePremiumHint() {
  const [hint, setHint] = useState(false);

  const showHint = useCallback(() => {
    setHint(true);
    setTimeout(() => setHint(false), 2500);
  }, []);

  return { hint, showHint };
}
