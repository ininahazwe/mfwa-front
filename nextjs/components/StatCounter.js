"use client";

import { useStatCounters } from "../lib/hooks";

// Thin client wrapper around useStatCounters(). Renders the final,
// pre-formatted value on first paint (matching the static mockup's
// pre-rendered "16", "100+", etc.) and lets the hook animate it once the
// element scrolls into view.
export default function StatCounter({ count, suffix = "", className }) {
  const ref = useStatCounters(count, suffix);
  const initial = Math.round(count).toLocaleString("en-US") + suffix;
  return (
    <span ref={ref} className={className} data-count={count} data-suffix={suffix}>
      {initial}
    </span>
  );
}
