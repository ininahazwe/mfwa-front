"use client";

// Decorative, purely-CSS "carved stone" objects for the About page —
// sphere, ring, cube, stacked slabs and a navy token — drifting with the
// scroll (useParallax) and bobbing gently at rest. Always aria-hidden:
// they carry no content. Geometry lives in globals.css (.stone*); the
// cube/slab faces are real 3D planes (preserve-3d, orthographic), so they
// read as solid objects without any image assets.
import { useParallax } from "../lib/hooks";
import { ICONS } from "./AboutIcons";

function Cuboid({ className = "" }) {
  return (
    <span className={`cuboid ${className}`}>
      <span className="cuboid__face cuboid__face--top" />
      <span className="cuboid__face cuboid__face--front" />
      <span className="cuboid__face cuboid__face--left" />
    </span>
  );
}

function Shape({ shape, glyph }) {
  if (shape === "cube") {
    return (
      <span className="stone__iso">
        <Cuboid className="cuboid--cube" />
      </span>
    );
  }
  if (shape === "slabs") {
    return (
      <span className="stone__iso stone__iso--slabs">
        <Cuboid className="cuboid--slab cuboid--slab-1" />
        <Cuboid className="cuboid--slab cuboid--slab-2" />
        <Cuboid className="cuboid--slab cuboid--slab-3" />
      </span>
    );
  }
  if (shape === "token") {
    return <span className="stone__token">{glyph && ICONS[glyph]}</span>;
  }
  if (shape === "ring") {
    // Eight stacked annuli, offset in depth, give the ring real thickness
    // once the whole thing is tilted in 3D; only the front layer carries
    // the lit, polished shading.
    return (
      <span className="stone__ring">
        {Array.from({ length: 8 }, (_, i) => (
          <span className="stone__ring-layer" style={{ "--i": i }} key={i} />
        ))}
      </span>
    );
  }
  return <span className={`stone__solid stone__solid--${shape}`} />;
}

export default function Stone({ shape = "sphere", size = 120, speed = 0.1, glyph, className = "", style }) {
  const ref = useParallax(speed);
  return (
    <div
      ref={ref}
      className={`stone stone--${shape} ${className}`}
      style={{ "--stone-size": `${size}px`, ...style }}
      aria-hidden="true"
    >
      <div className="stone__float">
        <div className="stone__bob">
          <Shape shape={shape} glyph={glyph} />
        </div>
      </div>
    </div>
  );
}
