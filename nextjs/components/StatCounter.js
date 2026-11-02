// 2026-11-02 (design review I6, at Yv's call): the figure is shown as it
// is. It used to be rendered, reset to 0 when scrolled into view, then
// counted up over 1.2s — so for a moment the page showed wrong figures
// (620 articles, 10 partners). Same markup and props as before, so the
// pages using it don't change. Previous version (client component with
// useStatCounters from lib/hooks.js):
//
// "use client";
//
// import { useStatCounters } from "../lib/hooks";
//
// // Thin client wrapper around useStatCounters(). Renders the final,
// // pre-formatted value on first paint (matching the static mockup's
// // pre-rendered "16", "100+", etc.) and lets the hook animate it once the
// // element scrolls into view.
// export default function StatCounter({ count, suffix = "", className }) {
//   const ref = useStatCounters(count, suffix);
//   const initial = Math.round(count).toLocaleString("en-US") + suffix;
//   return (
//     <span ref={ref} className={className} data-count={count} data-suffix={suffix}>
//       {initial}
//     </span>
//   );
// }

export default function StatCounter({ count, suffix = "", className }) {
  return (
    <span className={className} data-count={count} data-suffix={suffix}>
      {Math.round(count).toLocaleString("en-US") + suffix}
    </span>
  );
}
