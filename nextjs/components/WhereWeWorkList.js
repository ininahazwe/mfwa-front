"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import CategoryGrid from "./CategoryGrid";

// API: {
//   eyebrow, title, text (from getWhereWeWorkPage()'s intro),
//   map: { ariaLabel, geographyUrl, projection, projectionConfig },
//   countries: [{ name, id, slug, href, coordinates, count, severity, recent }],
//   categories: [{ name, slug, href }],
//   stats: { total, totalCountries, countriesReporting, busiestCountry },
//   activeCountrySlug, activeCategorySlug, allIssuesHref,
// } — see getWhereWeWorkPage(). Plus initialItems/initialTotalPages/
// initialTotal, passed straight through to CategoryGrid.
//
// This file used to be just the country map + list; it's now the merged
// "Where We Work × Issues" explorer (kept the old filename since this
// session can't delete/rename files on Yv's machine — see the note in
// next.config.mjs). A row of category chips sits between the map/list
// and the results grid, and both axes filter the same grid. Every
// country/category href already carries the OTHER axis's current
// selection (computed server-side in getWhereWeWorkPage()), so switching
// one filter never drops the other — clicking is a normal navigation
// (plain <a>, not client-side fetch), and the parent page mounts this
// with a `key` derived from the active filters, so a filter change
// remounts this component fresh with the server's new data instead of
// trying to reconcile local hover/pagination state across an unrelated
// filter switch.
//
// Map restyle (2026-09-25, at Yv's call): adopts the LOOK of
// pressattack.africa/tracker — a choropleth shaded by how much has been
// published per country, a legend, a hover panel with "recent stories",
// a small stat strip — while keeping MFWA's existing WordPress content
// model (country.severity/count/recent come pre-computed from
// getWhereWeWorkPage(), scoped to the active category filter; see that
// function's note on why there's no per-incident data to draw on here).
// Fill/stroke for the map's countries/markers is set via inline `style`
// (not CSS classes) so it can't leak into the homepage Reach section,
// which shares the .reach__geo/.reach__marker markup and stays on its
// original flat styling — see app/globals.css's note above .ww-stats.
const SEVERITY_COLOR = {
  none: "#e9edf1",
  low: "#f7dcd8",
  moderate: "#f0a9a1",
  high: "#e2695c",
  critical: "var(--red-dark)",
};
const SEVERITY_LABEL = {
  none: "No coverage yet",
  low: "Light coverage",
  moderate: "Moderate coverage",
  high: "High coverage",
  critical: "Most covered",
};
const SEVERITY_STEPS = ["none", "low", "moderate", "high", "critical"];
// Short forms of SEVERITY_LABEL for the legend row, where space is tight
// and every step is already listed together (so "coverage" need not be
// repeated on each one).
const SEVERITY_LEGEND_LABEL = {
  none: "No data",
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

// `activeCountry` below is hover-preview state ONLY (mirrors the
// original Reach-style behaviour) — it's separate from
// data.activeCountrySlug/activeCategorySlug, which is the actual applied
// filter and drives the "is-selected" styling.
export default function WhereWeWorkList({ data, initialItems, initialTotalPages, initialTotal }) {
  const [activeCountry, setActiveCountry] = useState(null);

  const col1 = data.countries.slice(0, 8);
  const col2 = data.countries.slice(8, 16);
  const coveredIds = new Set(data.countries.map((c) => c.id));

  // What the hover/detail panel below the map shows: whichever country
  // is currently hovered/focused, falling back to the applied country
  // filter (if any) so the panel isn't empty right after a click.
  const detailCountry =
    data.countries.find((c) => c.name === activeCountry) ??
    data.countries.find((c) => c.slug === data.activeCountrySlug) ??
    null;

  function clearActive() {
    setActiveCountry(null);
  }

  const activeCategoryName = data.categories.find((c) => c.slug === data.activeCategorySlug)?.name;
  const activeCountryName = data.countries.find((c) => c.slug === data.activeCountrySlug)?.name;
  const filterLabel = [activeCategoryName, activeCountryName].filter(Boolean).join(" · ");
  const hasFilter = Boolean(data.activeCountrySlug || data.activeCategorySlug);

  function countryClass(country) {
    return (
      [
        activeCountry === country.name ? "is-active" : null,
        country.slug === data.activeCountrySlug ? "is-selected" : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  }

  return (
    <section className="ab-section" id="countries">
      <div className="ab-wrap">
        <SectionHead eyebrow={data.eyebrow} title={data.title} text={data.text} />

        <div className="reach__inner ww-countries-row">
          <Reveal as="div" className="reach__list ww-list ab-stagger" stagger>
            <ul className="reach__col" onMouseLeave={clearActive}>
              {col1.map((country) => (
                <li key={country.name} className={countryClass(country)} onMouseEnter={() => setActiveCountry(country.name)}>
                  <a href={country.href} onFocus={() => setActiveCountry(country.name)}>
                    <span className="ww-sev-dot" style={{ background: SEVERITY_COLOR[country.severity] }} aria-hidden="true" />
                    {country.name}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="reach__col" onMouseLeave={clearActive}>
              {col2.map((country) => (
                <li key={country.name} className={countryClass(country)} onMouseEnter={() => setActiveCountry(country.name)}>
                  <a href={country.href} onFocus={() => setActiveCountry(country.name)}>
                    <span className="ww-sev-dot" style={{ background: SEVERITY_COLOR[country.severity] }} aria-hidden="true" />
                    {country.name}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="reach__map" data-reach-map onMouseLeave={clearActive}>
            <ComposableMap
              width={480}
              height={320}
              projection={data.map.projection}
              projectionConfig={data.map.projectionConfig}
              role="img"
              aria-label={data.map.ariaLabel}
            >
              <Geographies geography={data.map.geographyUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const covered = coveredIds.has(geo.id);
                    const country = covered ? data.countries.find((c) => c.id === geo.id) : null;
                    const selected = country && country.slug === data.activeCountrySlug;
                    // Fill always reflects the country's severity — even
                    // on hover/press — so the data-driven color never
                    // gets swapped out for a flat "hovered" tint; hover
                    // feedback comes from the stroke instead.
                    const fill = country ? SEVERITY_COLOR[country.severity] : "#e9edf1";
                    const stroke = selected ? "var(--navy-ink)" : "#fff";
                    const strokeWidth = selected ? 2 : 0.75;
                    const geoNode = (
                      <Geography
                        key={country ? undefined : geo.rsmKey}
                        geography={geo}
                        className={`reach__geo${covered ? " is-covered" : ""}`}
                        tabIndex={-1}
                        onMouseEnter={() => country && setActiveCountry(country.name)}
                        onClick={() => country && setActiveCountry(country.name)}
                        style={{
                          default: { fill, stroke, strokeWidth, outline: "none" },
                          hover: { fill, stroke: "var(--navy-ink)", strokeWidth: 1.6, outline: "none" },
                          pressed: { fill, stroke: "var(--navy-ink)", strokeWidth: 1.6, outline: "none" },
                        }}
                      />
                    );

                    if (!country) return geoNode;

                    return (
                      <a
                        key={geo.rsmKey}
                        href={country.href}
                        aria-label={`${country.name}: ${SEVERITY_LABEL[country.severity]}, ${country.count} ${country.count === 1 ? "story" : "stories"} — read our latest coverage`}
                      >
                        {geoNode}
                      </a>
                    );
                  })
                }
              </Geographies>

              {data.countries.map((country) => {
                const active = activeCountry === country.name;
                const selected = country.slug === data.activeCountrySlug;
                return (
                  <Marker
                    key={country.name}
                    coordinates={country.coordinates}
                    data-country={country.name}
                    className={`reach__marker${active ? " is-active" : ""}${selected ? " is-selected" : ""}`}
                    onMouseEnter={() => setActiveCountry(country.name)}
                  >
                    <a
                      href={country.href}
                      aria-label={`${country.name}: ${SEVERITY_LABEL[country.severity]}, ${country.count} ${country.count === 1 ? "story" : "stories"} — read our latest coverage`}
                      onFocus={() => setActiveCountry(country.name)}
                      onClick={() => setActiveCountry(country.name)}
                    >
                      <circle className="reach__marker-ring" r={active || selected ? 8 : 6} />
                      <circle
                        className="reach__marker-dot"
                        r={active || selected ? 4.5 : 3}
                        style={{ fill: SEVERITY_COLOR[country.severity] }}
                      />
                      <title>
                        {country.name} — {SEVERITY_LABEL[country.severity]} ({country.count})
                      </title>
                    </a>
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>
          <div className="ww-map-panel">
            <ul className="ww-legend" aria-hidden="true">
              {SEVERITY_STEPS.map((step) => (
                  <li key={step}>
                    <span className="ww-legend__swatch" style={{ background: SEVERITY_COLOR[step] }} />
                    {SEVERITY_LEGEND_LABEL[step]}
                  </li>
              ))}
            </ul>

            <div className="ww-map-detail">
              {detailCountry ? (
                  <>
                    <p className="ww-map-detail__name">{detailCountry.name}</p>
                    <p className="ww-map-detail__meta">
                      <span className="ww-sev-dot" style={{ background: SEVERITY_COLOR[detailCountry.severity] }} aria-hidden="true" />
                      {SEVERITY_LABEL[detailCountry.severity]} — {detailCountry.count}{" "}
                      {detailCountry.count === 1 ? "story" : "stories"}
                    </p>
                    {detailCountry.recent.length > 0 ? (
                        <ul className="ww-map-detail__recent">
                          {detailCountry.recent.map((story) => (
                              <li key={story.link}>
                                <a href={story.link}>{story.heading}</a>
                                <span>{story.date}</span>
                              </li>
                          ))}
                        </ul>
                    ) : (
                        <p className="ww-map-detail__empty">No stories yet for this filter.</p>
                    )}
                  </>
              ) : (
                  <p className="ww-map-detail__hint">Hover a country to see its recent stories.</p>
              )}
            </div>
          </div>
          {/*{data.stats && (
              <Reveal as="ul" className="ww-stats ab-stagger" stagger>
                <li className="ww-stat">
                  <span className="ww-stat__num">{data.stats.total}</span>
                  <span className="ww-stat__label">{data.stats.total === 1 ? "Story in view" : "Stories in view"}</span>
                </li>
                <li className="ww-stat">
              <span className="ww-stat__num">
                {data.stats.countriesReporting}/{data.stats.totalCountries}
              </span>
                  <span className="ww-stat__label">Countries reporting</span>
                </li>
                <li className="ww-stat">
                  <span className="ww-stat__num">{data.stats.busiestCountry ?? "—"}</span>
                  <span className="ww-stat__label">Most-covered country</span>
                </li>
              </Reveal>
          )}*/}

        </div>

        <div className="ww-issues" role="group" aria-label="Filtrer par thématique">
          <a className={`ww-chip${!data.activeCategorySlug ? " is-selected" : ""}`} href={data.allIssuesHref}>
            All issues
          </a>
          {data.categories.map((category) => (
            <a
              key={category.slug}
              className={`ww-chip${category.slug === data.activeCategorySlug ? " is-selected" : ""}`}
              href={category.href}
            >
              {category.name}
            </a>
          ))}
        </div>

        {hasFilter && (
          <p className="ww-filter-summary">
            Showing stories{filterLabel ? `: ${filterLabel}` : ""} —{" "}
            <Link href="/where-we-work">Clear filters</Link>
          </p>
        )}

        <div className="ww-results">
          <CategoryGrid
            apiBase="/api/where-we-work"
            initialItems={initialItems}
            initialTotalPages={initialTotalPages}
            initialTotal={initialTotal}
            pageSize={12}
            extraParams={{ country: data.activeCountrySlug, category: data.activeCategorySlug }}
            endMessage="You've reached the end of these stories."
          />
        </div>
      </div>
    </section>
  );
}
