"use client";

import { useMemo, useState } from "react";
import FadeImg from "./FadeImg";

// Sidebar-filtered reports grid (2026-09-27, at Yv's call) — mirrors the
// live site's Publications archive layout (e.g.
// https://mfwa.org/publications/foedr-reports/): a left-hand list of
// report-type filters next to a grid of cards. Every report is fetched
// up front by getReportsPage() and filtering happens entirely
// client-side here — same pattern as the homepage's "topics" filter in
// Latest.js — so clicking a filter is instant, no API round trip.
// `filters` only lists types that actually have at least one matching
// report right now (computed in getReportsPage() from the fetched data,
// not a hardcoded list): a type with zero reports simply never renders a
// button, and reappears on its own once a report using it is published.
// See the note above getWpReports()/mapReport() in lib/wp.js for what
// "filterTerms" actually are and what's still unconfirmed about them.
//
// Found and fixed (2026-09-28) — the actual "grid stays empty" bug: this
// used to wrap the grid in <Reveal stagger>, the same scroll-reveal
// fade-in every other grid on the site uses (CategoryGrid.js). Reveal
// only adds its "is-visible" class (the one thing that takes opacity
// from 0 to 1) once an IntersectionObserver reports the element at
// least 15% inside the viewport. That works for CategoryGrid because it
// paginates ("load more"), so its grid stays short. Reports deliberately
// loads its WHOLE corpus at once for instant client-side filtering (Yv's
// original ask) — with 45+ cards that makes the grid several times
// taller than the screen, so even a full viewport's worth of it in view
// is well under 15% of its TOTAL height, and the 15% threshold is never
// crossed: the grid sat at opacity:0 forever, invisible but fully
// present in the DOM (which is why `.reports-grid .story` always
// counted correctly in tests, and why disabling the filters or fixing
// the data fetch — see lib/wp.js's retry/522 and 2MB-cache fixes —
// never helped: neither one touched this). Fix: this grid no longer
// uses Reveal at all — it renders as a plain div, visible immediately,
// which also suits a fully-loaded, instantly-filterable list better
// than a scroll-in animation anyway.
export default function ReportsGrid({ articles, filters }) {
  const [activeFilter, setActiveFilter] = useState(null);

  const visible = useMemo(() => {
    if (!activeFilter) return articles;
    return articles.filter((story) => story.filterTerms.some((f) => f.slug === activeFilter));
  }, [activeFilter, articles]);

  const grid = (
    <>
      <div className="reports-grid">
        {visible.map((story, i) => (
          <ReportCard story={story} key={`${story.link}-${i}`} />
        ))}
      </div>
      {visible.length === 0 && <p className="reports-empty">No reports in this category yet.</p>}
    </>
  );

  // No taxonomy data at all (e.g. the local mock server, which doesn't
  // simulate report types) — just the plain grid, no empty sidebar.
  if (filters.length === 0) return grid;

  return (
    <div className="reports-layout">
      <nav className="reports-filters" aria-label="Filter reports by type">
        <button
          type="button"
          className={`reports-filters__btn${!activeFilter ? " is-active" : ""}`}
          onClick={() => setActiveFilter(null)}
        >
          All
        </button>
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            className={`reports-filters__btn${activeFilter === f.slug ? " is-active" : ""}`}
            onClick={() => setActiveFilter(f.slug)}
          >
            {f.name}
          </button>
        ))}
      </nav>

      <div className="reports-main">{grid}</div>
    </div>
  );
}

function ReportCard({ story }) {
  return (
    <article className="story">
      <a className="story__link" href={story.link}>
        <figure className={`story__media${story.image.isFallback ? " story__media--fallback" : ""}`}>
          <FadeImg src={story.image.src} alt={story.image.alt} removeOnError={!story.image.isFallback} />
        </figure>
        <div className="story__body">
          <h3 className="story__heading">{story.heading}</h3>
          <p className="story__meta">
            <span>{story.date}</span>
            <svg
              className="story__arrow"
              width="15"
              height="9"
              viewBox="0 0 15 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
            </svg>
          </p>
        </div>
      </a>
    </article>
  );
}
