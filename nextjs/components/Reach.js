"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import Reveal from "./Reveal";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

// Pastel, semi-transparent fill per covered country (2026-10-20, Yv): each
// country takes the colour most representative of its flag, no two the same
// (palette checked for uniqueness / distance in lib/content.js getReach()).
// Hover or focus raises the opacity (CSS: .reach__geo.is-covered in
// globals.css reads --geo-soft / --geo-strong). Where We Work keeps its own severity
// fills (WhereWeWorkList.js), untouched.
const SOFT = 0.55;
const STRONG = 0.9;
// Cabo Verde's islands are too small to exist in the 110m geometry: its
// colour is shown as a halo behind its marker instead.
const NO_POLYGON = new Set(["132"]);
function tint(hex, alpha) {
  if (!hex) return undefined;
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}

// Colour swatch before each country in the list (2026-10-21, homepage UX
// review, point 6): ties the list to the map's pastel fills — and shows Cabo
// Verde's colour, whose islands are outside the map frame.
function Swatch({ color }) {
  if (!color) return null;
  return <span className="reach__swatch" style={{ "--swatch": color }} aria-hidden="true" />;
}

// API: reach.eyebrow, reach.titleLines[], reach.text, reach.link,
//      reach.map { ariaLabel, geographyUrl, projection, projectionConfig },
//      reach.countries[] { name, id, link, coordinates } — see getReach()
//
// Real country geometries (react-simple-maps + a self-hosted Natural Earth
// topojson) replace the old hand-drawn silhouette, framed on West Africa.
// A single piece of state — the active country's name, or null — stays
// synced three ways: the country's map polygon, its marker dot, and its
// entry in the two-column list, same idea as the original initReachMap().
// Each of those three now also doubles as a real link (country.link) to
// that country's archive on mfwa.org — the map polygon and marker are
// wrapped in an <a>, hover/focus still drives the shared active state.
export default function Reach({ data }) {
  const [activeCountry, setActiveCountry] = useState(null);

  const col1 = data.countries.slice(0, 8);
  const col2 = data.countries.slice(8, 16);
  const coveredIds = new Set(data.countries.map((c) => c.id));

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
          <div className="reach__links">
            <a className="reach__link" href={data.link.href}>
              {data.link.label}
              {ARROW}
            </a>
            {/* 2026-10-21 (homepage UX review, point 4): the heading
                "Mediascape" (com team #20) is also the name of MFWA's media
                data platform — the section now leads there too. */}
            {data.secondaryLink && (
              <a className="reach__link reach__link--ext" href={data.secondaryLink.href} target="_blank" rel="noopener noreferrer">
                {data.secondaryLink.label}
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 1h6v6M9 1 1 9" />
                </svg>
              </a>
            )}
          </div>
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
                  const active = country && activeCountry === country.name;
                  const geoNode = (
                    <Geography
                      key={country ? undefined : geo.rsmKey}
                      geography={geo}
                      className={`reach__geo${covered ? " is-covered" : ""}${active ? " is-active" : ""}`}
                      tabIndex={-1}
                      onMouseEnter={() => country && setActiveCountry(country.name)}
                      onClick={() => country && setActiveCountry(country.name)}
                      style={
                        country?.color
                          ? { "--geo-soft": tint(country.color, SOFT), "--geo-strong": tint(country.color, STRONG) }
                          : undefined
                      }
                    />
                  );

                  if (!country) return geoNode;

                  return (
                    <a key={geo.rsmKey} href={country.link} aria-label={`${country.name}: read our latest coverage`}>
                      {geoNode}
                    </a>
                  );
                })
              }
            </Geographies>

            {data.countries.map((country) => {
              const active = activeCountry === country.name;
              return (
                <Marker
                  key={country.name}
                  coordinates={country.coordinates}
                  data-country={country.name}
                  className={`reach__marker${active ? " is-active" : ""}`}
                  onMouseEnter={() => setActiveCountry(country.name)}
                >
                  <a
                    href={country.link}
                    aria-label={`${country.name}: read our latest coverage`}
                    onFocus={() => setActiveCountry(country.name)}
                    onClick={() => setActiveCountry(country.name)}
                  >
                    {NO_POLYGON.has(country.id) && country.color && (
                      <circle className="reach__marker-halo" r={active ? 11 : 9} fill={tint(country.color, active ? STRONG : SOFT)} />
                    )}
                    <circle className="reach__marker-ring" r={active ? 8 : 6} />
                    <circle className="reach__marker-dot" r={active ? 4.5 : 3} />
                    <title>{country.name}</title>
                  </a>
                </Marker>
              );
            })}
          </ComposableMap>
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
                <a href={country.link} onFocus={() => setActiveCountry(country.name)}>
                  <Swatch color={country.color} />
                  {country.name}
                </a>
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
                <a href={country.link} onFocus={() => setActiveCountry(country.name)}>
                  <Swatch color={country.color} />
                  {country.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
