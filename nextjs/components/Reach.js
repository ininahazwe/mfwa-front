"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";

// Ports initReachMap() from assets/js/main.js. A single piece of state —
// the active country's name (or null) — is synced two ways between the
// SVG hit regions and the two-column country list, replacing the
// original's manual classList.toggle() pass over both node lists.
//
// Judgment call: content.js's `countries[]` is alphabetical (documented
// there as matching the two-column list order, which it does — sliced
// 8/8 below). The original SVG draws its <ellipse> hit regions in a
// different, geography-grouped order, which matters because several
// regions overlap (e.g. Guinea / Guinea-Bissau / Sierra Leone) and SVG
// paint order decides which element is on top for hover/click. HIT_ORDER
// reproduces that exact original stacking by re-sequencing the same
// country objects for the map only, so hover precedence on overlapping
// countries matches the static mockup instead of changing when
// content.js's data order changes.
const HIT_ORDER = [
  "Mauritania",
  "Mali",
  "Niger",
  "Burkina Faso",
  "Senegal",
  "The Gambia",
  "Guinea-Bissau",
  "Guinea",
  "Sierra Leone",
  "Liberia",
  "Côte d’Ivoire",
  "Ghana",
  "Togo",
  "Benin",
  "Nigeria",
  "Cabo Verde",
];

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

// API: reach.eyebrow, reach.titleLines[], reach.text, reach.link,
//      reach.map { viewBox, ariaLabel, contextPath, contextLines[],
//      islands[], silhouettePath, borders[] }, reach.countries[]
//      { name, cx, cy, rx, ry } — see getReach()
export default function Reach({ data }) {
  const [activeCountry, setActiveCountry] = useState(null);

  const hits = useMemo(
    () => HIT_ORDER.map((name) => data.countries.find((c) => c.name === name)).filter(Boolean),
    [data.countries]
  );
  const col1 = data.countries.slice(0, 8);
  const col2 = data.countries.slice(8, 16);

  function clearActive() {
    setActiveCountry(null);
  }

  return (
    <section className="reach" id="reach">
      <div className="reach__inner">
        <Reveal as="div" className="reach__intro">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="reach__title">
            {data.titleLines[0]}
            <br />
            {data.titleLines[1]}
          </h2>
          <p className="reach__text">{data.text}</p>
          <a className="reach__link" href={data.link.href}>
            {data.link.label}
            {ARROW}
          </a>
        </Reveal>

        <div className="reach__map" data-reach-map onMouseLeave={clearActive}>
          <svg viewBox={data.map.viewBox} role="img" aria-label={data.map.ariaLabel}>
            {/* Reste du continent (non couvert), simplifié, décoratif */}
            <path className="reach__context" d={data.map.contextPath} />
            <g className="reach__context-lines">
              {data.map.contextLines.map((d) => (
                <path d={d} key={d} />
              ))}
            </g>

            {/* Cabo Verde (archipel, au large) */}
            <g className="reach__islands">
              {data.map.islands.map((island, i) => (
                <circle key={i} cx={island.cx} cy={island.cy} r={island.r} />
              ))}
            </g>

            {/* Silhouette Afrique de l'Ouest (16 pays) */}
            <path className="reach__silhouette" d={data.map.silhouettePath} />

            {/* Frontières internes (décoratives) */}
            <g className="reach__borders">
              {data.map.borders.map((d) => (
                <path d={d} key={d} />
              ))}
            </g>

            {/* Zones cliquables (une par pays) */}
            <g className="reach__hits" data-reach-hits>
              {hits.map((country) => {
                const active = activeCountry === country.name;
                return (
                  <ellipse
                    className={`reach__hit${active ? " is-active" : ""}`}
                    data-country={country.name}
                    key={country.name}
                    cx={country.cx}
                    cy={country.cy}
                    rx={country.rx}
                    ry={country.ry}
                    tabIndex={0}
                    role="button"
                    aria-label={country.name}
                    onMouseEnter={() => setActiveCountry(country.name)}
                    onFocus={() => setActiveCountry(country.name)}
                    onClick={() => setActiveCountry(country.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveCountry(country.name);
                      }
                    }}
                  >
                    <title>{country.name}</title>
                  </ellipse>
                );
              })}
            </g>
          </svg>
        </div>

        <div className="reach__list" onMouseLeave={clearActive}>
          <ul className="reach__col">
            {col1.map((country) => (
              <li
                key={country.name}
                data-country={country.name}
                className={activeCountry === country.name ? "is-active" : undefined}
                onMouseEnter={() => setActiveCountry(country.name)}
              >
                {country.name}
              </li>
            ))}
          </ul>
          <ul className="reach__col">
            {col2.map((country) => (
              <li
                key={country.name}
                data-country={country.name}
                className={activeCountry === country.name ? "is-active" : undefined}
                onMouseEnter={() => setActiveCountry(country.name)}
              >
                {country.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
