"use client";

import { useEffect, useRef } from "react";

// Shared filter-tab row (2026-10-18, at Yv's call: "adapte ce look à toutes
// les grilles avec filtres"). Same visual language as the /reports tabs
// (components/ReportsGrid.js): icon + label (+ optional count), no pill or
// filled background, the active tab marked by a red bar along its bottom
// edge, a grey bar on hover, a hairline under the row. Desktop: the row
// wraps if needed; ≤900px: one horizontally scrolling row (edge fade), with
// the active tab brought into view. Used by the homepage topics (Latest.js),
// the staff directory teams (StaffDirectory.js) and the Where We Work issue
// filters (WhereWeWorkList.js).

export function FilterTabs({ className = "", label, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const row = ref.current;
    const btn = row?.querySelector(".is-active");
    if (btn && row.scrollWidth > row.clientWidth) row.scrollLeft = Math.max(0, btn.offsetLeft - row.offsetLeft - 16);
  });
  return (
    <nav className={`ftabs ${className}`.trim()} aria-label={label} ref={ref}>
      {children}
    </nav>
  );
}

// Renders a <button> (client-side filters) or an <a> (filters that are real
// navigations, e.g. /where-we-work?category=…) depending on `href`.
export function FilterTab({ href, active, icon, label, count, onClick, className = "", ...rest }) {
  const cls = `ftab${active ? " is-active" : ""}${className ? ` ${className}` : ""}`;
  const inner = (
    <>
      <span className="ftab__icon" aria-hidden="true">
        {FILTER_ICONS[icon] ?? FILTER_ICONS.tag}
      </span>
      <span className="ftab__label">{label}</span>
      {count != null && <span className="ftab__count">{count}</span>}
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} aria-current={active ? "page" : undefined} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} aria-pressed={!!active} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}

// Keyword → icon, for filter lists that come from data (topics, WordPress
// categories, staff teams). Unknown labels get the generic "tag" icon.
export function filterIcon(slug = "", label = "") {
  const k = `${slug} ${label}`.toLowerCase();
  if (/^all(\b|-)/.test(k) || /\ball (issues|reports|stories|topics)\b/.test(k)) return "all";
  if (/everyone|people|staff/.test(k)) return "people";
  if (/now|latest|news-now/.test(k)) return "bolt";
  if (/general-news|newspaper|fourth estate|journalism-team/.test(k)) return "newspaper";
  if (/investigat|research/.test(k)) return "search";
  if (/digital|online|tech/.test(k)) return "orbit";
  if (/law|legal|impunity|justice/.test(k)) return "scales";
  if (/violation|attack|alert/.test(k)) return "alert";
  if (/safety|protect|security/.test(k)) return "shield";
  if (/assembly|protest|cohesion|peace/.test(k)) return "people";
  if (/access-to-information|information|foi/.test(k)) return "key";
  if (/transparen|accountab|monitor/.test(k)) return "eye";
  if (/regional|region|country|global/.test(k)) return "globe";
  if (/media-development|development|capacity/.test(k)) return "bars";
  if (/democra|election|governance|vote/.test(k)) return "ballot";
  if (/expression|speech|voice/.test(k)) return "mic";
  if (/opportunit|job|career|vacanc/.test(k)) return "star";
  if (/leadership|director|board/.test(k)) return "flag";
  if (/programme|program/.test(k)) return "target";
  if (/communicat|press|media relations/.test(k)) return "megaphone";
  if (/finance|operation|admin/.test(k)) return "briefcase";
  if (/journalis/.test(k)) return "newspaper";
  return "tag";
}

// Bold, geometric 24px icons — same set/weight as the /reports side-nav.
const ico = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
export const FILTER_ICONS = {
  all: (
    <svg {...ico}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  ),
  tag: (
    <svg {...ico}>
      <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z" />
      <circle cx="8.5" cy="8.5" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  bolt: (
    <svg {...ico}>
      <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" fill="currentColor" />
    </svg>
  ),
  mic: (
    <svg {...ico}>
      <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </svg>
  ),
  orbit: (
    <svg {...ico}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="8.5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  newspaper: (
    <svg {...ico}>
      <rect x="3" y="5" width="14" height="14" rx="1.5" />
      <path d="M17 8h4v9a2 2 0 0 1-2 2H7" />
      <path d="M6.5 9h6M6.5 12h6M6.5 15h3" />
    </svg>
  ),
  search: (
    <svg {...ico}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m19.5 19.5-4.6-4.6" />
    </svg>
  ),
  scales: (
    <svg {...ico}>
      <path d="M12 3.5v17M7 20.5h10M5 6.5h14" />
      <path d="m5 6.5-2.5 6a2.5 2.5 0 0 0 5 0zM19 6.5l-2.5 6a2.5 2.5 0 0 0 5 0z" />
    </svg>
  ),
  alert: (
    <svg {...ico}>
      <path d="M12 3.5 21.5 20h-19z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  shield: (
    <svg {...ico}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  people: (
    <svg {...ico}>
      <circle cx="9" cy="8" r="3.2" fill="currentColor" />
      <path d="M3 19.5c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5" />
      <circle cx="16.5" cy="9" r="2.4" />
      <path d="M16.5 14c2.3 0 4 1.6 4.5 4.3" />
    </svg>
  ),
  key: (
    <svg {...ico}>
      <circle cx="8" cy="15" r="4.5" />
      <path d="m11.3 11.7 8.2-8.2M16.5 6.5l2.5 2.5M14 9l2 2" />
    </svg>
  ),
  eye: (
    <svg {...ico}>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  bars: (
    <svg {...ico}>
      <path d="M4 20h16" />
      <rect x="5.5" y="11" width="3" height="6.5" rx=".8" fill="currentColor" />
      <rect x="10.5" y="6" width="3" height="11.5" rx=".8" fill="currentColor" />
      <rect x="15.5" y="9" width="3" height="8.5" rx=".8" fill="currentColor" />
    </svg>
  ),
  globe: (
    <svg {...ico}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5s1.2-6.1 3.6-8.5z" />
    </svg>
  ),
  ballot: (
    <svg {...ico}>
      <path d="M4 11h16v9.5H4z" />
      <path d="M8 11V4.5h8V11" />
      <path d="m9.8 7.8 1.6 1.6 3-3" />
      <path d="M9 15h6" />
    </svg>
  ),
  star: (
    <svg {...ico}>
      <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" fill="currentColor" />
    </svg>
  ),
  flag: (
    <svg {...ico}>
      <path d="M5 21V4" />
      <path d="M5 4.5h12l-2.5 4 2.5 4H5" fill="currentColor" />
    </svg>
  ),
  target: (
    <svg {...ico}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  ),
  megaphone: (
    <svg {...ico}>
      <path d="M3.5 10v4h3l8 4.5v-13l-8 4.5z" fill="currentColor" />
      <path d="M18 9.5a3.5 3.5 0 0 1 0 5M6.5 14l1 5.5" />
    </svg>
  ),
  briefcase: (
    <svg {...ico}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V4.5h6V7M3 12.5h18" />
    </svg>
  ),
};
