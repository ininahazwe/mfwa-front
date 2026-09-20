"use client";

import { useScrollReveal } from "../lib/hooks";

// Thin client wrapper around useScrollReveal() so section components that
// use it (Work, Expertise, ImpactStats, ImpactHighlights) can otherwise
// stay server components. Renders as `as` (default "div") and reproduces
// the original data-reveal / data-reveal="stagger" markup exactly.
export default function Reveal({ as: Tag = "div", stagger = false, className, children, ...rest }) {
  const ref = useScrollReveal();
  return (
    <Tag ref={ref} className={className} data-reveal={stagger ? "stagger" : ""} {...rest}>
      {children}
    </Tag>
  );
}
