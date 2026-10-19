// Category watermark for story thumbnails — « étiquette de carte »
// (2026-10-19, design C chosen by Yv). A bundle of contour lines crosses the
// lower part of the thumbnail (darkened for contrast); the category's word is
// written along one of them, like an altitude on a topographic map, with a
// red marker — the same visual language as the homepage « Our impact »
// background (components/ImpactTopo.js).
//
// Hover (CSS only, see globals.css « Filigrane de catégorie »): the lines
// redraw themselves from left to right, one after the other, and the bundle
// spreads apart around the labelled line; the marker rises.
//
// To watermark another category, add an entry to MARKS: `test` is matched
// against the post's first category slug AND name, `word` is the text drawn.
// Each word gets its own curve shape (seeded by the word), so two categories
// never look identical.
const MARKS = [
  { test: /opportunit/i, word: "opportunity" },
  // { test: /investigat/i, word: "investigation" },
  // { test: /safety/i, word: "safety" },
];

export function categoryMark(story) {
  const keys = [story?.categorySlug, story?.categoryName, story?.tag?.[0]].filter(Boolean).join(" ");
  if (!keys) return null;
  return MARKS.find((m) => m.test.test(keys)) ?? null;
}

// -- geometry (viewBox 0 0 400 300, sliced to the 4:3 thumbnail) -----------
const W = 400;
const BASE_Y = 214;
const OFFSETS = [-62, -48, -35, -23, -12, 0, 11, 23, 36, 50, 65, 81];
const BG_OFFSETS = [-200, -184, -168, -152, -137, -122, -107, -92, -78];

function seedOf(word) {
  return [...word].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 7) / 997;
}

function points(dy, phase, seed) {
  const pts = [];
  for (let x = -20; x <= W + 20; x += 10) {
    const y =
      BASE_Y +
      dy +
      18 * Math.sin(x / (66 + seed * 14) + phase + seed * 6) +
      9 * Math.sin(x / (29 + seed * 6) + phase * 2 + seed * 3) +
      dy * 0.25 * Math.sin(x / 55 + seed);
    pts.push([x, y]);
  }
  return pts;
}

const toD = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(1)}`).join("");

function pointAt(pts, dist) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    if (acc + seg >= dist) {
      const t = (dist - acc) / seg;
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
    }
    acc += seg;
  }
  return pts[pts.length - 1];
}

function lengthOf(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
}

const cacheByWord = new Map();
function geometry(word) {
  if (cacheByWord.has(word)) return cacheByWord.get(word);
  const seed = seedOf(word);
  const base = points(0, 0, seed);
  const lines = OFFSETS.map((o, i) => ({ o, d: toD(points(o, i * 0.06, seed)) }));
  const bg = BG_OFFSETS.map((o, i) => toD(points(o, i * 0.11 + 1.3, seed)));
  const start = 0.22;
  const [mx, my] = pointAt(base, lengthOf(base) * start - 16);
  const g = { baseD: toD(base), lines, bg, start, marker: [mx, my] };
  cacheByWord.set(word, g);
  return g;
}

function hash(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

// `bare`: the post has no image — the watermark then fills a navy tile
// (faint extra contour lines in the upper part) instead of the logo.
export default function CategoryMark({ mark, uid, bare = false }) {
  const g = geometry(mark.word);
  const id = `cm-${hash(`${uid}|${mark.word}`)}`;
  const label = (
    <textPath href={`#${id}-p`} startOffset={`${g.start * 100}%`}>
      {mark.word}
    </textPath>
  );
  return (
    <svg className={`cmark${bare ? " cmark--bare" : ""}`} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <path id={`${id}-p`} d={g.baseD} />
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.28" stopColor="#08121e" stopOpacity="0" />
          <stop offset="0.62" stopColor="#08121e" stopOpacity="0.45" />
          <stop offset="1" stopColor="#08121e" stopOpacity="0.8" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="-50" y="0" width="500" height="300">
          <rect x="-50" width="500" height="300" fill="#fff" />
          <text className="cmark__word" dy="7.5" stroke="#000" strokeWidth="12" fill="#000">
            {label}
          </text>
        </mask>
      </defs>

      {!bare && <rect className="cmark__shade" width="400" height="300" fill={`url(#${id}-shade)`} />}
      {bare && (
        <g className="cmark__bg">
          {g.bg.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}

      <g className="cmark__lines">
        {g.lines.map(({ o, d }, i) => (
          <path
            key={o}
            d={d}
            pathLength="1"
            className={o === 0 ? "cmark__line cmark__line--label" : "cmark__line"}
            mask={o === 0 ? `url(#${id}-m)` : undefined}
            style={{ "--i": i, "--spread": `${(o / 12).toFixed(2)}px` }}
          />
        ))}
      </g>

      <text className="cmark__word" dy="7.5" fill="#fff">
        {label}
      </text>
      <g transform={`translate(${g.marker[0].toFixed(1)} ${(g.marker[1] - 1).toFixed(1)})`}>
        <path className="cmark__marker" d="M0 -6 L5.5 4 L-5.5 4Z" />
      </g>
    </svg>
  );
}
