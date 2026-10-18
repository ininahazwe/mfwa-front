"use client";

import { useId, useState } from "react";

// Flat (2D) hero illustration for /programmes (2026-10-17, at Yv's call —
// "convertis les illustrations 3D en 2D, humanise-les, africanise-les si
// pertinent"). It replaces ProgrammesIso.js (the isometric cubes, kept
// unchanged in the repo) through the same `art` slot of InvolvedHero.
//
// Four panels, like squares of a patchwork, one per programme: each shows a
// person doing the work of that programme, over a textile band inspired by
// West African strip-weaving (kente-like blocks, bogolan-like dots and
// dashes, zigzags). Faces are deliberately featureless — the common
// convention of contemporary flat illustration, which keeps the figures
// dignified and avoids caricature; skin tones, hair and clothing vary.
// No specific or sacred symbol (e.g. adinkra) is used.
//
// Same API and behaviour as ProgrammesIso: each panel is a link to its
// programme page; hovering/focusing a panel or its legend entry lifts it
// (hard offset shadow) and plays a small motion on its prop. Revert to the
// cubes: in app/programmes/page.js, swap ProgrammesFlat back to
// ProgrammesIso. Revert to the old tiles: drop the `art` prop entirely.

const INK = "#13315c";

const TONES = {
  red: { bg: "#fce8e6", mid: "#f6d3cf", deep: "#e9a59d" },
  lavender: { bg: "#ece7fb", mid: "#ddd3f6", deep: "#b9a8ec" },
  navy: { bg: "#e4eefa", mid: "#cfdff3", deep: "#8fb2e0" },
  green: { bg: "#e3f3ea", mid: "#cbe7d6", deep: "#86cba5" },
};

// textile palette (strip-weave colours)
const GOLD = "#e8a33d";
const KGREEN = "#2f8f5b";
const KRED = "#c4141b";
const EARTH = "#3b2a20";
const CREAM = "#f6efe2";

const SIZE = 204; // panel size
const GAP = 14;
const BAND = 30; // textile band height
const BASE = SIZE - BAND; // figures stand on the band

/* ---------- people ---------- */

function Hair({ x, style, idp }) {
  switch (style) {
    case "afro":
      return <circle cx={x} cy={88} r={31} fill="#1d1714" stroke={INK} strokeWidth="1.5" />;
    case "locs":
      return (
        <g fill="#241a15" stroke={INK} strokeWidth="1.3">
          {[-26, -18, 18, 26].map((dx) => (
            <rect key={dx} x={x + dx - 4} y={86} width={8} height={40} rx={4} />
          ))}
        </g>
      );
    default:
      return null;
  }
}

function HairTop({ x, style, idp, wrap = "wrap" }) {
  switch (style) {
    case "short":
      return (
        <path
          d={`M${x - 22},90 C${x - 25},62 ${x + 25},62 ${x + 22},90 C${x + 15},78 ${x - 15},78 ${x - 22},90 Z`}
          fill="#1d1714"
          stroke={INK}
          strokeWidth="1.5"
        />
      );
    case "locs":
      return (
        <path
          d={`M${x - 23},96 C${x - 26},64 ${x + 26},64 ${x + 23},96 C${x + 14},80 ${x - 14},80 ${x - 23},96 Z`}
          fill="#241a15"
          stroke={INK}
          strokeWidth="1.5"
        />
      );
    case "wrap":
      // gele-style headwrap: a cap plus a fanned knot
      return (
        <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
          <path
            d={`M${x - 32},74 C${x - 28},38 ${x + 2},40 ${x},62 C${x + 8},36 ${x + 40},42 ${x + 30},76 Z`}
            fill={`url(#${idp}-${wrap})`}
          />
          <path
            d={`M${x - 24},94 C${x - 28},60 ${x + 28},60 ${x + 24},94 C${x + 14},80 ${x - 14},80 ${x - 24},94 Z`}
            fill={`url(#${idp}-${wrap})`}
          />
        </g>
      );
    default:
      return null;
  }
}

function Bust({ x, skin, shirt, hair, idp, scale = 1, wrap }) {
  const t = scale === 1 ? undefined : `translate(${x} ${BASE}) scale(${scale}) translate(${-x} ${-BASE})`;
  return (
    <g className="pf-person" transform={t}>
      <Hair x={x} style={hair} idp={idp} />
      {/* shoulders / garment */}
      <path
        d={`M${x - 58},${BASE} C${x - 58},${BASE - 34} ${x - 36},${BASE - 46} ${x},${BASE - 46} C${x + 36},${BASE - 46} ${x + 58},${BASE - 34} ${x + 58},${BASE} Z`}
        fill={shirt}
        stroke={INK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* neck + collar */}
      <rect x={x - 9} y={110} width={18} height={20} fill={skin} stroke={INK} strokeWidth="1.5" />
      <path d={`M${x - 14},${BASE - 45} L${x},${BASE - 30} L${x + 14},${BASE - 45}`} fill={skin} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      {/* head (featureless, by design) */}
      <ellipse cx={x} cy={94} rx={21} ry={24} fill={skin} stroke={INK} strokeWidth="1.6" />
      <ellipse cx={x - 21} cy={98} rx={3.5} ry={5} fill={skin} stroke={INK} strokeWidth="1.3" />
      <ellipse cx={x + 21} cy={98} rx={3.5} ry={5} fill={skin} stroke={INK} strokeWidth="1.3" />
      <HairTop x={x} style={hair} idp={idp} wrap={wrap} />
    </g>
  );
}

const Hand = ({ cx, cy, skin, r = 0 }) => (
  <ellipse cx={cx} cy={cy} rx={7} ry={9} transform={`rotate(${r} ${cx} ${cy})`} fill={skin} stroke={INK} strokeWidth="1.4" />
);

/* ---------- the four scenes ---------- */

function SceneFoe({ idp }) {
  const x = 84;
  const skin = "#7a4a2a";
  return (
    <>
      <circle cx={x} cy={100} r={60} fill={TONES.red.mid} />
      <Bust x={x} skin={skin} shirt={`url(#${idp}-wax-a)`} hair="wrap" idp={idp} />
      {/* microphone on a stand, at mouth height */}
      <g className="pf-prop">
        <path d={`M${x + 44},${BASE} L${x + 44},126 L${x + 34},114`} fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x={x + 22} y={92} width={16} height={26} rx={8} transform={`rotate(-38 ${x + 30} ${105})`} fill={INK} />
        <rect x={x + 25} y={95} width={10} height={12} rx={5} transform={`rotate(-38 ${x + 30} ${105})`} fill="#5d7aa6" />
      </g>
      <g className="pf-fx pf-fx--waves" fill="none" stroke={KRED} strokeWidth="2.6" strokeLinecap="round">
        <path d={`M${x + 60},84 q10,12 0,24`} />
        <path d={`M${x + 72},76 q16,20 0,40`} />
        <path d={`M${x + 84},68 q22,28 0,56`} />
      </g>
    </>
  );
}

function SceneDigital({ idp }) {
  const x = 96;
  const skin = "#4a2c1d";
  return (
    <>
      <circle cx={x} cy={100} r={60} fill={TONES.lavender.mid} />
      <Bust x={x} skin={skin} shirt="#2b8a84" hair="afro" idp={idp} />
      <g className="pf-prop">
        <rect x={x - 17} y={124} width={34} height={56} rx={6} fill={INK} stroke={INK} strokeWidth="1.5" />
        <rect x={x - 13} y={130} width={26} height={42} rx={3} fill="#f3f0fd" />
        {/* padlock on the screen: digital safety */}
        <path d={`M${x - 5},150 v-5 a5,5 0 0 1 10,0 v5`} fill="none" stroke={INK} strokeWidth="2" />
        <rect x={x - 8} y={149} width={16} height={12} rx={2} fill={GOLD} stroke={INK} strokeWidth="1.4" />
        <Hand cx={x - 18} cy={170} skin={skin} r={-20} />
        <Hand cx={x + 18} cy={170} skin={skin} r={20} />
      </g>
      <g className="pf-fx pf-fx--signal" fill="none" stroke="#6b4fc9" strokeWidth="2.6" strokeLinecap="round">
        <path d={`M${x + 36},62 a8,8 0 0 1 8,8`} />
        <path d={`M${x + 36},52 a18,18 0 0 1 18,18`} />
        <path d={`M${x + 36},42 a28,28 0 0 1 28,28`} />
        <circle cx={x + 37} cy={70} r={2.4} fill="#6b4fc9" stroke="none" />
      </g>
    </>
  );
}

function SceneGovernance({ idp }) {
  const x = 102;
  const skin = "#8d5a3b";
  return (
    <>
      <circle cx={x} cy={100} r={60} fill={TONES.navy.mid} />
      <Bust x={x} skin={skin} shirt={`url(#${idp}-wax-b)`} hair="short" idp={idp} />
      {/* open newspaper held in both hands */}
      <g className="pf-prop pf-prop--paper">
        <g transform={`rotate(-4 ${x} 150)`}>
          <rect x={x - 50} y={122} width={100} height={54} rx={2} fill="#ffffff" stroke={INK} strokeWidth="1.6" />
          <line x1={x} y1={122} x2={x} y2={176} stroke={INK} strokeWidth="1" />
          <rect x={x - 44} y={128} width={38} height={6} rx={1} fill={INK} />
          <line x1={x - 44} y1={141} x2={x - 8} y2={141} stroke="#8a9bb3" strokeWidth="2" />
          <line x1={x - 44} y1={148} x2={x - 8} y2={148} stroke="#8a9bb3" strokeWidth="2" />
          <line x1={x - 44} y1={155} x2={x - 16} y2={155} stroke="#8a9bb3" strokeWidth="2" />
          {/* picture box with a ballot tick: democracy */}
          <rect x={x + 6} y={128} width={36} height={26} fill={TONES.navy.mid} stroke={INK} strokeWidth="1.2" />
          <path d={`M${x + 15},141 l6,6 l12,-12`} fill="none" stroke={KGREEN} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1={x + 6} y1={162} x2={x + 42} y2={162} stroke="#8a9bb3" strokeWidth="2" />
          <line x1={x + 6} y1={168} x2={x + 32} y2={168} stroke="#8a9bb3" strokeWidth="2" />
        </g>
        <Hand cx={x - 51} cy={150} skin={skin} r={10} />
        <Hand cx={x + 51} cy={146} skin={skin} r={-10} />
      </g>
    </>
  );
}

function ScenePeace({ idp }) {
  const xa = 66;
  const xb = 140;
  return (
    <>
      <circle cx={103} cy={104} r={64} fill={TONES.green.mid} />
      {/* two speech bubbles that meet on hover: dialogue */}
      <g className="pf-fx pf-fx--talk-a">
        <path d="M30,22 h52 a10,10 0 0 1 10,10 v14 a10,10 0 0 1 -10,10 h-30 l-10,10 v-10 h-12 a10,10 0 0 1 -10,-10 v-14 a10,10 0 0 1 10,-10 z" fill="#ffffff" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx={44} cy={39} r={3} fill={INK} />
        <circle cx={56} cy={39} r={3} fill={INK} />
        <circle cx={68} cy={39} r={3} fill={INK} />
      </g>
      <g className="pf-fx pf-fx--talk-b">
        <path d="M124,14 h52 a10,10 0 0 1 10,10 v14 a10,10 0 0 1 -10,10 h-12 v10 l-10,-10 h-30 a10,10 0 0 1 -10,-10 v-14 a10,10 0 0 1 10,-10 z" fill={GOLD} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M146,31 c0,-5 7,-6 8,-1 c1,-5 8,-4 8,1 c0,5 -8,9 -8,9 c0,0 -8,-4 -8,-9 z" fill={KRED} />
      </g>
      <Bust x={xa} skin="#5c3a21" shirt={`url(#${idp}-wax-c)`} hair="locs" idp={idp} scale={0.86} />
      <Bust x={xb} skin="#a86b43" shirt={KGREEN} hair="wrap" wrap="wrap-b" idp={idp} scale={0.86} />
    </>
  );
}

const SCENES = { foe: SceneFoe, digital: SceneDigital, governance: SceneGovernance, peace: ScenePeace };

/* ---------- textile bands (one weave per panel) ---------- */

function Band({ kind, idp }) {
  return (
    <g>
      <rect x="0" y={BASE} width={SIZE} height={BAND} fill={`url(#${idp}-${kind})`} />
      <line x1="0" y1={BASE} x2={SIZE} y2={BASE} stroke={INK} strokeWidth="1.6" />
    </g>
  );
}

function Defs({ idp }) {
  return (
    <defs>
      {/* kente-like woven blocks */}
      <pattern id={`${idp}-kente`} width="36" height={BAND} patternUnits="userSpaceOnUse" y={BASE}>
        <rect width="36" height={BAND} fill={GOLD} />
        <rect x="0" width="6" height={BAND} fill={KGREEN} />
        <rect x="12" width="3" height={BAND} fill={EARTH} />
        <rect x="18" y="0" width="12" height="10" fill={KRED} />
        <rect x="18" y="20" width="12" height="10" fill={KRED} />
        <rect x="18" y="10" width="12" height="10" fill={EARTH} />
        <rect x="33" width="3" height={BAND} fill={KGREEN} />
      </pattern>
      {/* bogolan-like dots and dashes on earth ground */}
      <pattern id={`${idp}-bogolan`} width="24" height={BAND} patternUnits="userSpaceOnUse" y={BASE}>
        <rect width="24" height={BAND} fill={EARTH} />
        <circle cx="6" cy="8" r="2.2" fill={CREAM} />
        <circle cx="18" cy="8" r="2.2" fill={CREAM} />
        <rect x="3" y="15" width="18" height="2.4" rx="1.2" fill={CREAM} />
        <circle cx="12" cy="24" r="2.2" fill={CREAM} />
      </pattern>
      {/* zigzag weave */}
      <pattern id={`${idp}-zigzag`} width="20" height={BAND} patternUnits="userSpaceOnUse" y={BASE}>
        <rect width="20" height={BAND} fill="#6b4fc9" />
        <path d="M0,10 l5,-6 l5,6 l5,-6 l5,6 M0,22 l5,-6 l5,6 l5,-6 l5,6" fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinejoin="round" />
      </pattern>
      {/* checker/diamond weave */}
      <pattern id={`${idp}-diamond`} width="20" height={BAND} patternUnits="userSpaceOnUse" y={BASE}>
        <rect width="20" height={BAND} fill={KGREEN} />
        <path d="M10,3 l7,12 l-7,12 l-7,-12 z" fill={GOLD} stroke={EARTH} strokeWidth="1.2" />
        <circle cx="10" cy="15" r="2.2" fill={EARTH} />
      </pattern>
      {/* wax-print-like garment fills */}
      <pattern id={`${idp}-wax-a`} width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#f0a23a" />
        <circle cx="7" cy="7" r="4" fill="none" stroke={KRED} strokeWidth="1.8" />
        <circle cx="7" cy="7" r="1.4" fill={INK} />
        <circle cx="0" cy="0" r="2" fill={KGREEN} />
        <circle cx="14" cy="14" r="2" fill={KGREEN} />
      </pattern>
      <pattern id={`${idp}-wax-b`} width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#2e5fa8" />
        <path d="M0,8 q4,-6 8,0 t8,0" fill="none" stroke={GOLD} strokeWidth="2" />
        <circle cx="8" cy="14" r="1.6" fill={CREAM} />
      </pattern>
      <pattern id={`${idp}-wax-c`} width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#b8402d" />
        <path d="M6,1 l5,5 l-5,5 l-5,-5 z" fill="none" stroke={CREAM} strokeWidth="1.4" />
        <circle cx="6" cy="6" r="1.4" fill={GOLD} />
      </pattern>
      <pattern id={`${idp}-wrap`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <rect width="10" height="10" fill={KRED} />
        <rect width="4" height="10" fill={GOLD} />
        <circle cx="7" cy="5" r="1.3" fill={INK} />
      </pattern>
      <pattern id={`${idp}-wrap-b`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
        <rect width="12" height="12" fill={GOLD} />
        <rect width="5" height="12" fill={KGREEN} />
        <circle cx="8.5" cy="6" r="1.5" fill={EARTH} />
      </pattern>
    </defs>
  );
}

/* ---------- layout ---------- */

const PANELS = [
  { id: "foe", tone: "red", band: "kente", tilt: -1.6, col: 0, row: 0 },
  { id: "digital", tone: "lavender", band: "zigzag", tilt: 1.3, col: 1, row: 0 },
  { id: "governance", tone: "navy", band: "bogolan", tilt: 1.1, col: 0, row: 1 },
  { id: "peace", tone: "green", band: "diamond", tilt: -1.2, col: 1, row: 1 },
];

const VB = 2 * SIZE + GAP; // 422

export default function ProgrammesFlat({ tiles }) {
  const [activeId, setActiveId] = useState(null);
  const idp = `pf${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const byId = Object.fromEntries(tiles.map((t) => [t.id, t]));
  const panels = PANELS.filter((p) => byId[p.id]);
  const activate = (id) => () => setActiveId(id);
  const deactivate = (id) => () => setActiveId((cur) => (cur === id ? null : cur));

  return (
    <figure className={`pflat${activeId ? " is-exploring" : ""}`}>
      <svg className="pflat__svg" viewBox={`-10 -10 ${VB + 20} ${VB + 20}`} role="group" aria-label="The MFWA programmes" focusable="false">
        <Defs idp={idp} />
        {panels.map((p) => {
          const Scene = SCENES[p.id];
          const tx = p.col * (SIZE + GAP);
          const ty = p.row * (SIZE + GAP);
          const active = activeId === p.id;
          return (
            <a
              key={p.id}
              className={`pf-panel pf-panel--${p.tone}${active ? " is-active" : ""}`}
              href={byId[p.id].href}
              aria-label={byId[p.id].label}
              onMouseEnter={activate(p.id)}
              onMouseLeave={deactivate(p.id)}
              onFocus={activate(p.id)}
              onBlur={deactivate(p.id)}
            >
              <g transform={`translate(${tx} ${ty})`}>
                <g className="pf-panel__tilt" style={{ "--tilt": `${p.tilt}deg` }}>
                  {/* hard offset shadow, revealed when the panel lifts */}
                  <rect className="pf-panel__shadow" x="0" y="0" width={SIZE} height={SIZE} rx="16" />
                  <g className="pf-panel__card">
                    <clipPath id={`${idp}-clip-${p.id}`}>
                      <rect x="0" y="0" width={SIZE} height={SIZE} rx="16" />
                    </clipPath>
                    <g clipPath={`url(#${idp}-clip-${p.id})`}>
                      <rect x="0" y="0" width={SIZE} height={SIZE} fill={TONES[p.tone].bg} />
                      <Scene idp={idp} />
                      <Band kind={p.band} idp={idp} />
                    </g>
                    <rect className="pf-panel__frame" x="0" y="0" width={SIZE} height={SIZE} rx="16" />
                  </g>
                </g>
              </g>
            </a>
          );
        })}
      </svg>

      <figcaption className="iso__legend">
        <ul>
          {panels.map((p) => (
            <li key={p.id}>
              <a
                className={`iso__legend-link iso__legend-link--${p.tone}${activeId === p.id ? " is-active" : ""}`}
                href={byId[p.id].href}
                onMouseEnter={activate(p.id)}
                onMouseLeave={deactivate(p.id)}
                onFocus={activate(p.id)}
                onBlur={deactivate(p.id)}
              >
                <i aria-hidden="true" />
                {byId[p.id].label}
              </a>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
