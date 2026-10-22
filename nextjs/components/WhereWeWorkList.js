"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import CategoryGrid from "./CategoryGrid";
import { FilterTabs, FilterTab, filterIcon } from "./FilterTabs";

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
// one filter never drops the other — clicking a COUNTRY is a normal
// navigation (plain <a>); issues switch in place since 2026-10-19 (see
// applyCategory() below). The parent page mounts this
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
// In-place issue switching (2026-10-19, at Yv's call): clicking an issue
// in the side column no longer reloads the whole page (map included). The
// link is intercepted: the URL is updated with history.pushState (so it
// stays shareable and Back/Forward work), and only two things are fetched
// — page 1 of the story grid (/api/where-we-work/posts) and the map's
// per-country coverage for that issue (/api/where-we-work/coverage), which
// recolours the map in place. Country links, "Clear filters" and
// modified clicks (new tab…) still do a normal navigation. If a fetch
// fails, it falls back to a normal navigation to the same URL.
function buildHref(country, category) {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (category) params.set("category", category);
  const qs = params.toString();
  return `/where-we-work${qs ? `?${qs}` : ""}`;
}

export default function WhereWeWorkList({ data: initialData, initialItems, initialTotalPages, initialTotal }) {
  const [activeCountry, setActiveCountry] = useState(null);
  const [categorySlug, setCategorySlug] = useState(initialData.activeCategorySlug);
  const [coverage, setCoverage] = useState(null); // { [countrySlug]: { count, severity, recent } }
  const [grid, setGrid] = useState({ key: 0, items: initialItems, totalPages: initialTotalPages, total: initialTotal });
  const [switching, setSwitching] = useState(false);
  const requestRef = useRef(0);
  const countrySlug = initialData.activeCountrySlug;

  // Everything below keeps reading `data.*` as before; this view just
  // overlays the client-side issue + coverage on the server's first render.
  const data = useMemo(
    () => ({
      ...initialData,
      activeCategorySlug: categorySlug,
      allIssuesHref: buildHref(countrySlug, null),
      categories: initialData.categories.map((c) => ({
        ...c,
        href: buildHref(countrySlug, c.slug === categorySlug ? null : c.slug),
      })),
      countries: initialData.countries.map((c) => ({
        ...c,
        ...(coverage?.[c.slug] ?? {}),
        href: buildHref(c.slug === countrySlug ? null : c.slug, categorySlug),
      })),
    }),
    [initialData, categorySlug, coverage, countrySlug]
  );

  async function applyCategory(next, { push }) {
    const href = buildHref(countrySlug, next);
    const req = ++requestRef.current;
    setSwitching(true);
    setCategorySlug(next);
    if (push) window.history.pushState({ wwCategory: next ?? "" }, "", href);
    try {
      const qs = new URLSearchParams({ page: "1", perPage: "12" });
      if (countrySlug) qs.set("country", countrySlug);
      if (next) qs.set("category", next);
      const [postsRes, covRes] = await Promise.all([
        fetch(`/api/where-we-work/posts?${qs}`),
        fetch(`/api/where-we-work/coverage${next ? `?category=${encodeURIComponent(next)}` : ""}`),
      ]);
      if (!postsRes.ok || !covRes.ok) throw new Error("request-failed");
      const [posts, cov] = await Promise.all([postsRes.json(), covRes.json()]);
      if (req !== requestRef.current) return; // a newer click won
      setGrid((g) => ({ key: g.key + 1, items: posts.items, totalPages: posts.totalPages, total: posts.total }));
      setCoverage(cov.coverage);
      setSwitching(false);
    } catch {
      if (req === requestRef.current) window.location.assign(href);
    }
  }

  function onIssueClick(e, slug) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const next = slug === categorySlug ? null : slug;
    if (next === categorySlug) return;
    applyCategory(next, { push: true });
  }

  // Back/Forward between issues chosen in place.
  useEffect(() => {
    function onPop() {
      const params = new URLSearchParams(window.location.search);
      if ((params.get("country") || null) !== (countrySlug || null)) {
        window.location.reload();
        return;
      }
      applyCategory(params.get("category") || null, { push: false });
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countrySlug]);

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

        <div className="reach__inner ww-countries-row" id="country-info">
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

          <div className={`reach__map${switching ? " is-switching" : ""}`} data-reach-map onMouseLeave={clearActive}>
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
                      {/* No SVG <title> tooltip here: React 19 treats ANY
                          <title> element as document-metadata and hoists
                          it into <head>, regardless of SVG namespace — so
                          during SSR every one of these renders empty
                          (only the real page title survives), while the
                          client's first paint keeps the text, producing a
                          hydration mismatch on every marker. The name/
                          severity/count this would have shown are already
                          fully covered by the <a>'s aria-label above and
                          by the live .ww-map-detail hover panel below. */}
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

        {/* Issue filters: vertical side column next to the story grid
            (2026-10-19, at Yv's call — 14 issues read better as a list than
            as a wrapping row). Same FilterTabs look (icon + label, red bar
            on the active one — on the left edge here); still real links, so
            switching issue keeps the country filter. ≤900px: back to one
            horizontally scrolling row above the grid. */}
        <div className="ww-explore">
          <aside className="ww-explore__side">
            <div className="ww-explore__head">
              <p className="ww-explore__title">Issues</p>
              <p className="ww-explore__sub">{data.categories.length} themes</p>
            </div>
            <FilterTabs className="ww-ftabs ftabs--vertical" label="Filtrer par thématique">
              <FilterTab
                href={data.allIssuesHref}
                active={!data.activeCategorySlug}
                icon="all"
                label="All issues"
                onClick={(e) => onIssueClick(e, null)}
              />
              {data.categories.map((category) => (
                <FilterTab
                  key={category.slug}
                  href={category.href}
                  onClick={(e) => onIssueClick(e, category.slug)}
                  active={category.slug === data.activeCategorySlug}
                  icon={filterIcon(category.slug, category.name)}
                  label={category.name}
                />
              ))}
            </FilterTabs>
          </aside>

          <div className={`ww-explore__main${switching ? " is-switching" : ""}`} aria-busy={switching}>
            {hasFilter && (
              <p className="ww-filter-summary">
                Showing stories{filterLabel ? `: ${filterLabel}` : ""} —{" "}
                <Link href="/where-we-work">Clear filters</Link>
              </p>
            )}

            <div className="ww-results">
              <CategoryGrid
                key={grid.key}
                apiBase="/api/where-we-work"
                initialItems={grid.items}
                initialTotalPages={grid.totalPages}
                initialTotal={grid.total}
                pageSize={12}
                extraParams={{ country: data.activeCountrySlug, category: data.activeCategorySlug }}
                endMessage="You've reached the end of these stories."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
