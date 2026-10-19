"use client";

import { useEffect, useRef } from "react";
import { TOPO_PATHS, TOPO_LEVELS } from "../lib/topoPaths";

// Topographic background for the homepage « Impact » section (2026-10-19, at
// Yv's call — test, revertible: see TOPO_BG in ImpactStats.js). Contour
// lines generated once (lib/topoPaths.js) and drawn as inline SVG, so the
// background is crisp at any size, weighs ~19 KB and needs no image.
//
// Two distinct reactions:
// 1. Scroll — as the section enters the viewport the contour lines draw
//    themselves, lower levels first (stroke-dashoffset driven by --draw);
//    while it travels through the viewport the two halves of the relief
//    (even / odd levels) drift in opposite directions (parallax, --pass).
// 2. Hover (mouse only) — a soft "heat" lens follows the cursor: inside it
//    the same lines are redrawn thicker in MFWA red/orange, as if the map
//    revealed a hotspot. The lens grows on enter, trails the cursor slightly
//    and shrinks away on leave.
// prefers-reduced-motion: lines shown fully drawn, no parallax; the lens
// still follows the pointer but without the trailing easing.

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));

function Lines({ className }) {
  return (
    <>
      {[0, 1].map((parity) => (
        <g key={parity} className={`topo__layer topo__layer--${parity ? "b" : "a"} ${className}`}>
          {TOPO_PATHS.filter(([lvl]) => lvl % 2 === parity).map(([lvl, d], i) => (
            <path key={i} d={d} pathLength="1" style={{ "--d": (lvl / (TOPO_LEVELS - 1)).toFixed(3) }} />
          ))}
        </g>
      ))}
    </>
  );
}

export default function ImpactTopo() {
  const svgRef = useRef(null);
  const lensRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const lens = lensRef.current;
    const section = svg?.closest(".impact") ?? svg?.parentElement;
    if (!svg || !section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- 1. scroll -------------------------------------------------------
    let visible = false;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = section.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 when the top enters at the bottom, 1 when the section's middle reaches 55% of the viewport
        const draw = clamp((vh - r.top) / (vh * 0.45 + r.height * 0.5));
        // 0 entering → 1 leaving at the top
        const pass = clamp((vh - r.top) / (vh + r.height));
        svg.style.setProperty("--draw", reduce ? "1" : draw.toFixed(4));
        svg.style.setProperty("--pass", reduce ? "0.5" : pass.toFixed(4));
      });
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(section);
    const scrollHandler = () => visible && onScroll();
    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("resize", scrollHandler);
    onScroll();

    // --- 2. hover --------------------------------------------------------
    let target = null; // svg user-space point under the cursor
    let pos = null;
    let lensRaf = 0;
    const place = () => {
      lensRaf = 0;
      if (!target) return;
      if (!pos || reduce) pos = { ...target };
      else {
        pos.x += (target.x - pos.x) * 0.16;
        pos.y += (target.y - pos.y) * 0.16;
      }
      lens.setAttribute("transform", `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`);
      if (Math.abs(target.x - pos.x) > 0.5 || Math.abs(target.y - pos.y) > 0.5) lensRaf = requestAnimationFrame(place);
    };
    const toSvg = (e) => {
      const m = svg.getScreenCTM();
      if (!m) return null;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      target = toSvg(e);
      if (!lensRaf) lensRaf = requestAnimationFrame(place);
    };
    const onEnter = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      target = toSvg(e);
      pos = null;
      place();
      svg.classList.add("is-hot");
    };
    const onLeave = () => svg.classList.remove("is-hot");
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", scrollHandler);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(lensRaf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="topo"
      viewBox="40 30 1570 440"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="topo-lens-fade">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="topo-heat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#e11b22" />
        </linearGradient>
        <mask id="topo-lens" maskUnits="userSpaceOnUse" x="-200" y="-200" width="2050" height="900">
          <g ref={lensRef} transform="translate(-999 -999)">
            <circle className="topo__lens" r="190" fill="url(#topo-lens-fade)" />
          </g>
        </mask>
      </defs>

      <Lines className="topo__lines" />
      <g className="topo__hot" mask="url(#topo-lens)">
        <Lines className="topo__lines topo__lines--hot" />
      </g>
    </svg>
  );
}
