"use client";

// Barely-visible topographic lines for the homepage hero (2026-10-21, at
// Yv's call — "hero relooking", revised the same day). Same contour lines as
// the « Impact » section (lib/topoPaths.js), mirrored, drawn in navy at a
// few percent opacity. They no longer fill the whole background: CSS places
// them in a band straddling the boundary between the intro text and the
// news card (.hero-topo in globals.css).
//
// Hover: while the pointer is over the hero, the lines slowly change shape —
// an SVG turbulence field displaces them, its strength easing in over ~2 s
// and its pattern drifting continuously; on leave they ease back to their
// rest shape. Nothing runs while the hero isn't hovered. Disabled under
// prefers-reduced-motion.
import { useEffect, useRef } from "react";
import { TOPO_PATHS } from "../lib/topoPaths";

// A square window on the (mirrored) relief, around its summit rings — the
// band is roughly square, so this keeps the lines dense instead of a sparse
// crop of the 1650 × 500 terrain.
const VIEWBOX = "300 0 500 500";

const MAX_SCALE = 16; // displacement, in viewBox units
const EASE = 0.018; // per frame — ≈2 s to reach full strength

export default function HeroTopo() {
  const svgRef = useRef(null);
  const turbRef = useRef(null);
  const dispRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const hero = svg?.closest(".hero");
    if (!svg || !hero) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (!window.matchMedia("(hover: hover)").matches) return undefined;

    let target = 0;
    let strength = 0;
    let t = Math.random() * 100;
    let raf = 0;

    const frame = () => {
      raf = 0;
      strength += (target - strength) * EASE;
      t += 0.004;
      const fx = 0.0042 + 0.0016 * Math.sin(t * 0.9);
      const fy = 0.0068 + 0.0018 * Math.cos(t * 0.7);
      turbRef.current?.setAttribute("baseFrequency", `${fx.toFixed(5)} ${fy.toFixed(5)}`);
      dispRef.current?.setAttribute("scale", (strength * MAX_SCALE).toFixed(2));
      svg.classList.toggle("is-morphing", strength > 0.002);
      if (target > 0 || strength > 0.002) raf = requestAnimationFrame(frame);
      else dispRef.current?.setAttribute("scale", "0");
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const enter = () => {
      target = 1;
      start();
    };
    const leave = () => {
      target = 0;
      start();
    };
    hero.addEventListener("pointerenter", enter);
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointerenter", enter);
      hero.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={svgRef} className="hero-topo" viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <filter id="hero-topo-morph" x="-5%" y="-10%" width="110%" height="120%" filterUnits="objectBoundingBox">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.0042 0.0068" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#hero-topo-morph)">
        <g transform="translate(1650 0) scale(-1 1)">
          {[0, 1].map((parity) => (
            <g key={parity} className={`hero-topo__layer hero-topo__layer--${parity ? "b" : "a"}`}>
              {TOPO_PATHS.filter(([lvl]) => lvl % 2 === parity).map(([lvl, d], i) => (
                <path key={i} d={d} className={lvl % 4 === 0 ? "is-index" : undefined} />
              ))}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
