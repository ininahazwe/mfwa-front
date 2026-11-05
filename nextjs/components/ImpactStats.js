// API: impact.media.image, impact.stats[] { number, label },
//      impact.funders { eyebrow, title, count, countLabel, link, items[] { name, href, logo } }
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";
import StatCounter from "./StatCounter";
import ImpactTopo from "./ImpactTopo";
import { ICONS, ARROW_RIGHT } from "./AboutIcons";

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
          {/* Bouton masqué (commenté) à la demande de Yv — retirer ce commentaire pour le réafficher.
          <a className="btn btn--light impact__cta" href={data.cta.href}>
            {data.cta.label}
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
            </svg>
          </a>
          */}
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

export function FundersSection({ data }) {
  return (
    <section className="funders" id="funders" aria-labelledby="funders-title">
      <div className="funders__inner">
        <Reveal as="div" className="funders__intro">
          <p className="eyebrow">{data.funders.eyebrow}</p>
          <h2 className="funders__title" id="funders-title">
            {data.funders.title}
          </h2>
          <p className="funders__count">
            <StatCounter className="funders__num" count={data.funders.count} />
            <span className="funders__count-label">{data.funders.countLabel}</span>
          </p>
          <a className="funders__link" href={data.funders.link.href}>
            {data.funders.link.label}
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
            </svg>
          </a>
        </Reveal>

        <div className="funders__main">
          {/* Same 3 cards as the « Explore » grid of /about-us/our-partners
            (components/CardNav.js), copied under the logos at Yv's call. */}
          {data.funders.explore?.length > 0 && (
              <Reveal as="ul" className="ab-networks__grid ab-stagger funders__explore" stagger>
                {data.funders.explore.map((item) => (
                    <li key={item.id}>
                      <a className="ab-card ab-network" href={item.href}>
                        <span className="ab-network__top">
                          <span className="ab-tag">{item.scope}</span>
                          <span className="ab-network__icon">{ICONS[item.icon] || ICONS.globe}</span>
                        </span>
                        <span className="ab-card__title">{item.name}</span>
                        <span className="ab-card__text">{item.desc}</span>
                        <span className="ab-network__arrow">{ARROW_RIGHT}</span>
                      </a>
                    </li>
                ))}
              </Reveal>
          )}

          {/* Logos: one single line scrolling slowly (CSS marquee), started when the
              section reaches the screen (Reveal adds .is-visible). The second set is
              an aria-hidden duplicate so the loop has no jump. */}
          <Reveal as="div" className="funders__marquee">
            <ul className="funders__logos funders__track" style={{ "--n": data.funders.items.length }}>
              {data.funders.items.map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" title={item.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logo} alt={item.name} loading="lazy" />
                  </a>
                </li>
              ))}
              {data.funders.items.map((item) => (
                <li key={`${item.name}-copy`} aria-hidden="true">
                  <a href={item.href} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logo} alt="" loading="lazy" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
