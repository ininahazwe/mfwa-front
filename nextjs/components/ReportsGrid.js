"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";
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
export default function ReportsGrid({ articles, filters }) {
  const [activeFilter, setActiveFilter] = useState(null);

  const visible = useMemo(() => {
    if (!activeFilter) return articles;
    return articles.filter((story) => story.filterTerms.some((f) => f.slug === activeFilter));
  }, [activeFilter, articles]);

  const grid = (
    <>
      <Reveal as="div" className="reports-grid" stagger>
        {visible.map((story, i) => (
          <ReportCard story={story} key={`${story.link}-${i}`} />
        ))}
      </Reveal>
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
