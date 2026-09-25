"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

// API: { eyebrow, title, text (from getWhereWeWorkPage()'s intro),
//   map: { ariaLabel, geographyUrl, projection, projectionConfig },
//   countries: [{ name, id, href, coordinates }] } — see getWhereWeWorkPage()
//
// The hub's own country list, now with the same interactive map as the
// homepage's Reach section (components/Reach.js) — same markup
// (reach__list/reach__col/reach__map/reach__geo/reach__marker) and the
// same hover/focus-synced activeCountry state across map polygon, marker
// and list entry, just laid out as two columns (list, then map) under
// this page's own centered SectionHead instead of Reach's three-column
// [intro | map | list]. Kept a separate client component from Reach.js
// (rather than reusing it directly) so the homepage section stays
// untouched and self-contained.
export default function WhereWeWorkList({ data }) {
  const [activeCountry, setActiveCountry] = useState(null);

  const col1 = data.countries.slice(0, 8);
  const col2 = data.countries.slice(8, 16);
  const coveredIds = new Set(data.countries.map((c) => c.id));

  function clearActive() {
    setActiveCountry(null);
  }

  return (
    <section className="ab-section" id="countries">
      <div className="ab-wrap">
        <SectionHead eyebrow={data.eyebrow} title={data.title} text={data.text} />

        <div className="reach__inner ww-countries-row">
          <Reveal as="div" className="reach__list ww-list ab-stagger" stagger>
            <ul className="reach__col" onMouseLeave={clearActive}>
              {col1.map((country) => (
                <li
                  key={country.name}
                  className={activeCountry === country.name ? "is-active" : undefined}
                  onMouseEnter={() => setActiveCountry(country.name)}
                >
                  <a href={country.href} onFocus={() => setActiveCountry(country.name)}>
                    {country.name}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="reach__col" onMouseLeave={clearActive}>
              {col2.map((country) => (
                <li
                  key={country.name}
                  className={activeCountry === country.name ? "is-active" : undefined}
                  onMouseEnter={() => setActiveCountry(country.name)}
                >
                  <a href={country.href} onFocus={() => setActiveCountry(country.name)}>
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
                    const active = country && activeCountry === country.name;
                    const geoNode = (
                      <Geography
                        key={country ? undefined : geo.rsmKey}
                        geography={geo}
                        className={`reach__geo${covered ? " is-covered" : ""}${active ? " is-active" : ""}`}
                        tabIndex={-1}
                        onMouseEnter={() => country && setActiveCountry(country.name)}
                        onClick={() => country && setActiveCountry(country.name)}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );

                    if (!country) return geoNode;

                    return (
                      <a key={geo.rsmKey} href={country.href} aria-label={`${country.name}: read our latest coverage`}>
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
                      href={country.href}
                      aria-label={`${country.name}: read our latest coverage`}
                      onFocus={() => setActiveCountry(country.name)}
                      onClick={() => setActiveCountry(country.name)}
                    >
                      <circle className="reach__marker-ring" r={active ? 8 : 6} />
                      <circle className="reach__marker-dot" r={active ? 4.5 : 3} />
                      <title>{country.name}</title>
                    </a>
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>
        </div>
      </div>
    </section>
  );
}
