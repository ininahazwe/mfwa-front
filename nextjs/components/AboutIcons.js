// Line icons shared by the About page sections — same 1.6 stroke,
// round-cap language as the icons in Work.js / Expertise.js, drawn at
// 24×24 and sized by CSS.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export const ICONS = {
  voice: (
    <svg {...base}>
      <path d="M4 10v4h3l6 4V6L7 10z" />
      <path d="M16.5 9a4 4 0 0 1 0 6" />
      <path d="M19 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  ),
  eye: (
    <svg {...base}>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  target: (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  ),
  compass: (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  ),
  spark: (
    <svg {...base}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  ),
  team: (
    <svg {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 8a3 3 0 1 0 0-6" />
      <path d="M22 20c0-2.6-1.7-4.8-4-5.6" />
    </svg>
  ),
  board: (
    <svg {...base}>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 20h18" />
    </svg>
  ),
  globe: (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </svg>
  ),
  quote: (
    <svg {...base}>
      <path d="M5 17c0-4 1-7 5-9" />
      <path d="M5 13h4v4H5z" fill="currentColor" stroke="none" />
      <path d="M14 17c0-4 1-7 5-9" />
      <path d="M14 13h4v4h-4z" fill="currentColor" stroke="none" />
    </svg>
  ),
  mic: (
    <svg {...base}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
    </svg>
  ),
  shield: (
    <svg {...base}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
    </svg>
  ),
};

export const ARROW_RIGHT = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

export const ARROW_DIAGONAL = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12 12 2M4.5 2H12v7.5" />
  </svg>
);

export const PLUS = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M7 1v12M1 7h12" />
  </svg>
);
