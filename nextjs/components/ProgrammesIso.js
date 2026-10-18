"use client";

import { useState } from "react";

// Isometric hero illustration for /programmes (2026-10-17, at Yv's call):
// four cubes — one per programme — floating over a slab. Pure inline SVG,
// no canvas: every shape is generated from one projection function below,
// so the drawing stays crisp at any size, costs nothing to load and can be
// styled/animated with CSS. The cubes are real links (same hrefs as the
// old tile grid); hovering or focusing one (or its legend entry) lifts
// that cube higher and spreads the others away — the "exploded view".
// prefers-reduced-motion disables the transitions (see globals.css).
//
// Geometry: true isometric axes (30°). World x runs down-right, world y
// down-left, z up. proj() turns a world point into SVG user units.
// Top faces / slab faces are drawn as rounded rects inside an affine
// <g> that lays the plane flat on the isometric grid, with
// vector-effect:non-scaling-stroke so line widths stay uniform.
const S = 32; // world unit → px
const K = Math.cos(Math.PI / 6); // 0.866
const proj = (x, y, z) => [(x - y) * K * S, (x + y) * 0.5 * S - z * S];
const pt = (x, y, z) => proj(x, y, z).map((n) => n.toFixed(2)).join(",");
const PLANE = `matrix(${(K * S).toFixed(3)} ${(0.5 * S).toFixed(3)} ${(-K * S).toFixed(3)} ${(0.5 * S).toFixed(3)}`;
const planeAt = (x, y, z) => {
  const [tx, ty] = proj(x, y, z);
  return `${PLANE} ${tx.toFixed(2)} ${ty.toFixed(2)})`;
};

const W = 6.8; // slab footprint
const H = 0.9; // slab thickness
const C = 2.4; // cube footprint
const CH = 1.8; // cube height
const MARGIN = 0.5;
const GAP = W - 2 * MARGIN - 2 * C; // 1.0 between cubes

// Line icons (24×24 grid, same family as components/AboutIcons.js).
const GLYPHS = {
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  newspaper: (
    <>
      <rect x="3" y="5" width="14" height="14" rx="1.5" />
      <path d="M17 8h4v9a2 2 0 0 1-2 2H7" />
      <path d="M6.5 9h6M6.5 12h6M6.5 15h3" />
    </>
  ),
  quote: (
    <>
      <path d="M5 17c0-4 1-7 5-9" />
      <path d="M5 13h4v4H5z" fill="currentColor" stroke="none" />
      <path d="M14 17c0-4 1-7 5-9" />
      <path d="M14 13h4v4h-4z" fill="currentColor" stroke="none" />
    </>
  ),
};

// Painter's order: back (small x+y) to front.
const CUBES = [
  { id: "foe", tone: "red", glyph: "mic", ox: MARGIN, oy: MARGIN },
  { id: "digital", tone: "lavender", glyph: "orbit", ox: MARGIN + C + GAP, oy: MARGIN },
  { id: "governance", tone: "navy", glyph: "newspaper", ox: MARGIN, oy: MARGIN + C + GAP },
  { id: "peace", tone: "green", glyph: "quote", ox: MARGIN + C + GAP, oy: MARGIN + C + GAP },
];

const REST_LIFT = 0.3; // cubes float slightly above the slab at rest
const SPREAD_LIFT = 1.3; // …rise when the figure is being explored
const ACTIVE_LIFT = 2.1; // …and the chosen one rises most

function Cube({ cube, tile, lift, active, onActivate, onDeactivate }) {
  const { ox, oy, tone, glyph } = cube;
  const zb = H; // base height; the lift is applied as a CSS translate
  const zt = zb + CH;
  const cx = ox + C / 2;
  const cy = oy + C / 2;
  const inset = 0.16;
  const gs = 1.7 / 24; // glyph scale: ~1.7 world units wide
  return (
    <a
      className={`iso-cube iso-cube--${tone}${active ? " is-active" : ""}`}
      href={tile.href}
      aria-label={tile.label}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      style={{ "--lift": lift }}
    >
      <g className="iso-cube__body">
        {/* faces */}
        <polygon
          className="iso-face iso-face--left"
          points={[pt(ox, oy + C, zt), pt(ox + C, oy + C, zt), pt(ox + C, oy + C, zb), pt(ox, oy + C, zb)].join(" ")}
        />
        <polygon
          className="iso-face iso-face--right"
          points={[pt(ox + C, oy, zt), pt(ox + C, oy + C, zt), pt(ox + C, oy + C, zb), pt(ox + C, oy, zb)].join(" ")}
        />
        <g transform={planeAt(ox, oy, zt)}>
          <rect className="iso-face iso-face--top" width={C} height={C} rx="0.42" />
          <rect className="iso-line" x={inset} y={inset} width={C - 2 * inset} height={C - 2 * inset} rx="0.3" />
          {/* glyph lying flat on the top face */}
          <g
            className="iso-glyph"
            transform={`translate(${(C / 2 - 12 * gs).toFixed(3)} ${(C / 2 - 12 * gs).toFixed(3)}) scale(${gs.toFixed(5)})`}
          >
            {GLYPHS[glyph]}
          </g>
        </g>
        {/* bevel line along the top of the two visible side faces */}
        <polyline
          className="iso-line"
          points={[pt(ox + 0.12, oy + C, zt - 0.2), pt(ox + C, oy + C, zt - 0.2), pt(ox + C, oy + 0.12, zt - 0.2)].join(" ")}
        />
        {/* generous invisible hit area so the whole cube is easy to hover */}
        <polygon
          className="iso-hit"
          points={[pt(ox, oy, zt), pt(ox + C, oy, zt), pt(ox + C, oy + C, zt), pt(ox + C, oy + C, zb), pt(ox, oy + C, zb), pt(ox, oy + C, zt)].join(" ")}
        />
      </g>
    </a>
  );
}

export default function ProgrammesIso({ tiles }) {
  const [activeId, setActiveId] = useState(null);
  const byId = Object.fromEntries(tiles.map((t) => [t.id, t]));
  const cubes = CUBES.filter((c) => byId[c.id]);
  const explored = activeId !== null;

  // network glyph on the slab, joining the cube positions (revealed as the cubes lift)
  const mid = W / 2;
  const centres = cubes.map((c) => [c.ox + C / 2, c.oy + C / 2]);

  return (
    <figure className={`iso${explored ? " is-exploring" : ""}`}>
      <svg
        className="iso__svg"
        viewBox="-205 -150 410 420"
        role="group"
        aria-label="The MFWA programmes"
        focusable="false"
      >
        {/* slab */}
        <g className="iso-slab">
          <polygon
            className="iso-face iso-face--left"
            points={[pt(0, W, H), pt(W, W, H), pt(W, W, 0), pt(0, W, 0)].join(" ")}
          />
          <polygon
            className="iso-face iso-face--right"
            points={[pt(W, 0, H), pt(W, W, H), pt(W, W, 0), pt(W, 0, 0)].join(" ")}
          />
          <g transform={planeAt(0, 0, H)}>
            <rect className="iso-face iso-face--slab" width={W} height={W} rx="0.55" />
            <rect className="iso-line" x="0.22" y="0.22" width={W - 0.44} height={W - 0.44} rx="0.4" />
            <rect className="iso-line iso-line--dashed" x="0.5" y="0.5" width={W - 1} height={W - 1} rx="0.3" />
            <g className="iso-network">
              {centres.map(([x, y], i) => (
                <g key={i}>
                  <line x1={mid} y1={mid} x2={x} y2={y} />
                  <circle cx={x} cy={y} r="0.3" />
                </g>
              ))}
              <circle className="iso-network__hub" cx={mid} cy={mid} r="0.5" />
            </g>
          </g>
        </g>

        {/* cubes */}
        {cubes.map((cube) => {
          const active = activeId === cube.id;
          const lift = !explored ? REST_LIFT : active ? ACTIVE_LIFT : SPREAD_LIFT;
          return (
            <Cube
              key={cube.id}
              cube={cube}
              tile={byId[cube.id]}
              lift={lift}
              active={active}
              onActivate={() => setActiveId(cube.id)}
              onDeactivate={() => setActiveId((cur) => (cur === cube.id ? null : cur))}
            />
          );
        })}
      </svg>

      <figcaption className="iso__legend">
        <ul>
          {cubes.map((cube) => (
            <li key={cube.id}>
              <a
                className={`iso__legend-link iso__legend-link--${cube.tone}${activeId === cube.id ? " is-active" : ""}`}
                href={byId[cube.id].href}
                onMouseEnter={() => setActiveId(cube.id)}
                onMouseLeave={() => setActiveId((cur) => (cur === cube.id ? null : cur))}
                onFocus={() => setActiveId(cube.id)}
                onBlur={() => setActiveId((cur) => (cur === cube.id ? null : cur))}
              >
                <i aria-hidden="true" />
                {byId[cube.id].label}
              </a>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
