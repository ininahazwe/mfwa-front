// Flat, animated motifs for the About page — geometric accents plus a
// small journalism iconography set (mic, camera, newspaper, pen, press
// card, broadcast tower, megaphone, magnifier, video) — pure SVG + CSS
// keyframes (see .motif* in globals.css), no JavaScript. Colours come from
// three CSS custom properties set by the surrounding tile/section
// (--m-a primary, --m-b accent, --m-c secondary), so the same motif works
// on white, pale-blue and dark backgrounds. Always decorative
// (aria-hidden); animations stop under prefers-reduced-motion.

const DOTS = Array.from({ length: 36 }, (_, i) => ({ x: 15 + (i % 6) * 14, y: 15 + Math.floor(i / 6) * 14, d: (i % 6) + Math.floor(i / 6) }));
const BARS = [18, 32, 46, 60, 74];

function Shapes({ variant }) {
  switch (variant) {
    case "broadcast":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <circle key={i} className="m-stroke-a motif__ping" cx="50" cy="50" r="30" style={{ animationDelay: `${i * 1}s` }} />
          ))}
          <circle className="m-fill-b" cx="50" cy="50" r="7" />
        </>
      );
    case "equalizer":
      return BARS.map((x, i) => (
        <rect
          key={x}
          className={`${i % 2 ? "m-fill-b" : "m-fill-a"} motif__bar`}
          x={x}
          y="18"
          width="8"
          height="64"
          style={{ animationDelay: `${[-0.2, -0.9, -0.5, -1.2, -0.3][i]}s` }}
        />
      ));
    case "orbit":
      return (
        <>
          <circle className="m-stroke-a" cx="50" cy="50" r="34" strokeWidth="1" />
          <circle className="m-fill-c motif__breathe" cx="50" cy="50" r="15" />
          <g className="motif__spin">
            <circle className="m-fill-b" cx="50" cy="16" r="5" />
          </g>
        </>
      );
    case "dots":
      return DOTS.map((dot) => (
        <circle key={`${dot.x}-${dot.y}`} className="m-fill-a motif__blink" cx={dot.x} cy={dot.y} r="2.6" style={{ animationDelay: `${dot.d * 0.18}s` }} />
      ));
    case "halfspin":
      return (
        <g className="motif__flip">
          <path className="m-fill-b" d="M50 14a36 36 0 0 0 0 72z" />
          <path className="m-fill-c" d="M50 14a36 36 0 0 1 0 72z" />
        </g>
      );
    case "quote":
      return (
        <g className="motif__bob">
          <path className="m-fill-b" d="M22 66V50c0-13 6-21 18-25l3 7c-7 3-10 8-10 14h10v20z" />
          <path className="m-fill-b" d="M55 66V50c0-13 6-21 18-25l3 7c-7 3-10 8-10 14h10v20z" />
        </g>
      );
    // -- Journalism iconography (hero tiles) --------------------------
    case "mic":
      return (
        <>
          <path className="m-stroke-b motif__arc" d="M28 26a18 18 0 0 0 0 24" strokeWidth="3" />
          <path className="m-stroke-b motif__arc motif__arc--late" d="M20 18a30 30 0 0 0 0 40" strokeWidth="3" />
          <path className="m-stroke-b motif__arc" d="M72 26a18 18 0 0 1 0 24" strokeWidth="3" />
          <path className="m-stroke-b motif__arc motif__arc--late" d="M80 18a30 30 0 0 1 0 40" strokeWidth="3" />
          <rect className="m-fill-a" x="40" y="16" width="20" height="36" rx="10" />
          <rect className="m-fill-bg" x="40" y="32" width="20" height="3" />
          <path className="m-stroke-a" d="M32 42a18 18 0 0 0 36 0M50 60v18M38 80h24" strokeWidth="4" />
        </>
      );
    case "camera":
      return (
        <>
          <g className="motif__flash">
            <path className="m-stroke-b" d="M80 14v6M88 22h-6M86 16l-4 4" strokeWidth="3" />
          </g>
          <rect className="m-fill-a" x="34" y="24" width="22" height="10" rx="2" />
          <rect className="m-fill-a" x="14" y="32" width="72" height="46" rx="4" />
          <circle className="m-fill-bg" cx="50" cy="55" r="16" />
          <circle className="m-fill-c motif__iris" cx="50" cy="55" r="10" />
          <circle className="m-fill-bg" cx="46" cy="51" r="2.5" />
          <circle className="m-fill-b motif__blink" cx="24" cy="40" r="3" />
        </>
      );
    case "newspaper":
      return (
        <>
          <rect className="m-stroke-a" x="18" y="18" width="64" height="66" strokeWidth="2.5" />
          <rect className="m-fill-b" x="26" y="26" width="48" height="8" />
          <rect className="m-fill-c" x="26" y="41" width="20" height="18" />
          {[
            [50, 42, 24], [50, 49, 24], [50, 56, 16], [26, 65, 48], [26, 72, 36],
          ].map(([x, y, w], i) => (
            <rect key={y} className="m-fill-a motif__type" x={x} y={y} width={w} height="3" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </>
      );
    case "pen":
      return (
        <>
          <path className="m-stroke-a motif__draw" pathLength="100" d="M14 76c7-10 12-10 18 0s11 10 17 0 11-10 17 0 11 10 17 0" strokeWidth="3" />
          <g className="motif__scribble">
            <path className="m-fill-c" d="M72 12l14 14-30 30-14-14z" />
            <path className="m-fill-b" d="M72 12l14 14-5 5-14-14z" />
            <path className="m-fill-a" d="M42 42l14 14-19 5z" />
          </g>
        </>
      );
    case "press":
      return (
        <>
          <path className="m-stroke-b" d="M36 6l14 22 14-22" strokeWidth="3" />
          <g className="motif__sway">
            <rect className="m-fill-a" x="26" y="28" width="48" height="60" rx="4" />
            <rect className="m-fill-c" x="36" y="36" width="28" height="22" />
            <text className="m-fill-bg motif__label" x="50" y="74" textAnchor="middle">PRESS</text>
            <rect className="m-fill-b" x="26" y="80" width="48" height="8" />
          </g>
        </>
      );
    case "tower":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <circle key={i} className="m-stroke-b motif__ping" cx="50" cy="30" r="22" style={{ animationDelay: `${i * 1}s` }} />
          ))}
          <path className="m-stroke-a" d="M50 34 34 88M50 34l16 54M40 70h20M44 54h12" strokeWidth="3.5" />
          <circle className="m-fill-b" cx="50" cy="30" r="5" />
        </>
      );
    case "megaphone":
      return (
        <>
          <g className="motif__shake">
            <path className="m-fill-a" d="M18 42h14l30-18v52L32 58H18z" />
            <rect className="m-fill-c" x="26" y="58" width="9" height="18" />
          </g>
          {[
            "M70 34l12-8", "M72 50h14", "M70 66l12 8",
          ].map((d, i) => (
            <path key={d} className="m-stroke-b motif__shout" d={d} strokeWidth="4" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </>
      );
    case "search":
      return (
        <>
          {[24, 36, 48, 60, 72].map((y) => (
            <rect key={y} className="m-fill-c motif__faint" x="14" y={y} width={y % 24 ? 56 : 72} height="4" />
          ))}
          <g className="motif__scan">
            <circle className="m-lens" cx="42" cy="44" r="14" strokeWidth="4" />
            <path className="m-stroke-a" d="M52 54l14 14" strokeWidth="6" />
          </g>
        </>
      );
    case "video":
      return (
        <>
          <rect className="m-stroke-a" x="12" y="20" width="76" height="52" rx="4" strokeWidth="3" />
          <path className="m-fill-a motif__breathe" d="M44 34v22l18-11z" />
          <circle className="m-fill-b motif__blink" cx="22" cy="30" r="3.5" />
          <text className="m-fill-a motif__label motif__label--sm" x="29" y="33">REC</text>
          <rect className="m-fill-a motif__faint" x="20" y="62" width="60" height="2.5" />
          <rect className="m-fill-a motif__progress" x="20" y="62" width="60" height="2.5" />
          <path className="m-stroke-a" d="M50 72v10M38 84h24" strokeWidth="3" />
        </>
      );
    default:
      return null;
  }
}

export default function Motif({ variant, className = "" }) {
  return (
    <svg className={`motif motif--${variant} ${className}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <Shapes variant={variant} />
    </svg>
  );
}
