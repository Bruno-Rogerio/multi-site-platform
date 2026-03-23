"use client";

import { useEffect } from "react";

// Drop into any public platform page to track a view.
// Runs once on mount, fire-and-forget.
export function PlatformPageTracker({ path }: { path: string }) {
  useEffect(() => {
    fetch("/api/analytics/platform-pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  }, [path]);

  return null;
}
