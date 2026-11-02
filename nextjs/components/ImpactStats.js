// API: impact.media.image, impact.stats[] { number, label },
//      impact.funders { eyebrow, title, count, countLabel, railLabel, items[] { name, href, logo },
//                       nav[] { label, desc, href } }
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";
import StatCounter from "./StatCounter";
import ImpactTopo from "./ImpactTopo";
import DragScroll from "./DragScroll";

// Background of the impact section (2026-10-19 test, at Yv's call):
// true = animated topographic SVG (components/ImpactTopo.js),
// false = the original photo (data.media). One switch to go back.
const TOPO_BG = true;

// `showFunders` (2026-10-21): the homepage now shows the funders band further
// down (after « Our reach »), through <FundersSection/> below — other
// callers keep getting it right under the impact band, as before.
export default function ImpactStats({ data, showFunders = true }) {
  return (
    <>
    <section className={`impact${TOPO_BG ? " impact--topo" : ""}`} id="impact">
      <div className="impact__media" aria-hidden="true">
        {TOPO_BG ? <ImpactTopo /> : <FadeImg src={data.media.src} alt={data.media.alt} removeOnError />}
      </div>

      <div className="impact__inner">
        <Reveal as="div" className="impact__intro">
          <h2 className="impact__title">
            {data.titleLines[0]}
            <br />
            {data.titleLines[1]}
          </h2>
          <p className="impact__text">{data.text}</p>
          <a className="btn btn--light impact__cta" href={data.cta.href}>
            {data.cta.label}
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
            </svg>
          </a>
        </Reveal>

        <ul className="impact__stats">
          {data.stats.map((stat) => (
            <li className="impact__stat" key={stat.label}>
              <StatCounter className="impact__num" count={stat.count} suffix={stat.suffix} />
              <span className="impact__label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {showFunders && data.funders && <FundersSection data={data} />}
    </>
  );
}

// Funders band (reworked 2026-10-30, at Yv's call): original two-part
// layout kept — text on the left; on the right, three entries to the
// partner pages (funding partners, national partners, our networks) and,
// below them, the logos as one horizontal rail that runs past the right
// edge of the screen and can be dragged (components/DragScroll.js). The old
// single "Meet our funding partners" link is now the first entry.
export function FundersSection({ data }) {
  const f = data.funders;
  return (
    <section className="funders" id="funders" aria-labelledby="funders-title">
      <div className="funders__inner">
        <Reveal as="div" className="funders__intro">
          {/* N2 (2026-11-02): optional — dropped on the homepage, where it
              repeated the title */}
          {f.eyebrow && <p className="eyebrow">{f.eyebrow}</p>}
          <h2 className="funders__title" id="funders-title">
            {f.title}
          </h2>
          <p className="funders__count">
            <StatCounter className="funders__num" count={f.count} />
            <span className="funders__count-label">{f.countLabel}</span>
          </p>
        </Reveal>

        <div className="funders__side">
          {f.nav?.length > 0 && (
            <nav className="funders__nav" aria-label="Our partners">
              <ul>
                {f.nav.map((entry) => (
                  <li key={entry.href}>
                    <a className="funders__entry" href={entry.href}>
                      <span className="funders__entry-text">
                        <span className="funders__entry-label">{entry.label}</span>
                        <span className="funders__entry-desc">{entry.desc}</span>
                      </span>
                      <span className="funders__entry-go" aria-hidden="true">
                        <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <DragScroll className="funders__rail" label={f.railLabel}>
            <ul className="funders__logos">
              {f.items.map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" title={item.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logo} alt={item.name} loading="lazy" draggable="false" />
                  </a>
                </li>
              ))}
            </ul>
          </DragScroll>
        </div>
      </div>
    </section>
  );
}
