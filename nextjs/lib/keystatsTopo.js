// Contour lines for the key-figures band (2026-11-24, at Yv's call).
// Same format as lib/topoPaths.js ([level, "svg path"]) so <HeroTopo/> can draw
// and animate them, but with a shape of their own: two wide, flattened "hills"
// side by side (one left of centre, one right), each a stack of nested, softly
// wobbling rings — the band is short and wide, so the rings are ellipses, and
// the outer ones run off the edges. Generated once, deterministically (no
// randomness: server and client render the same markup).
export const KEYSTATS_TOPO_VIEWBOX = "0 0 1600 420";

const HILLS = [
  { cx: 430, cy: 215, phase: 0.7 },
  { cx: 1190, cy: 205, phase: 2.9 },
];
const LEVELS = 13;
const POINTS = 36;

function ring(hill, k) {
  const rx = 55 + k * 62;
  const ry = 18 + k * 19;
  const pts = [];
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2;
    const wobble =
      1 +
      0.07 * Math.sin(3 * a + hill.phase + k * 0.35) +
      0.045 * Math.sin(5 * a - hill.phase * 1.7 + k * 0.6) +
      0.03 * Math.sin(2 * a + k * 0.2);
    pts.push([hill.cx + Math.cos(a) * rx * wobble, hill.cy + Math.sin(a) * ry * wobble]);
  }
  // closed Catmull-Rom -> cubic Bézier
  const f = (n) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < POINTS; i++) {
    const p0 = pts[(i - 1 + POINTS) % POINTS];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % POINTS];
    const p3 = pts[(i + 2) % POINTS];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

export const KEYSTATS_TOPO_PATHS = HILLS.flatMap((hill) =>
  Array.from({ length: LEVELS }, (_, k) => [k, ring(hill, k)]),
);
