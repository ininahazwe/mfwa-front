// API: involved.hero { crumbs[], eyebrow, titleLines[], lede, primary, secondary }
//      tiles? [] { id, label, variant, tone, href } — omit for a lighter,
//      full-width hero (the Intern/Volunteer detail pages); pass it for a
//      tile grid of clickable ways to get involved (the hub page).
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ARROW_RIGHT } from "./AboutIcons";

export default function InvolvedHero({ data, tiles }) {
  return (
    <section className="ab-hero">
      <div className="ab-wrap ab-hero__grid">
        <div className={`ab-hero__copy${tiles ? "" : " ab-hero__copy--wide"}`}>
          <nav className="ab-crumbs" aria-label="Fil d’Ariane">
            {data.crumbs.map((crumb, i) =>
              crumb.href ? (
                <a key={crumb.label} href={crumb.href}>
                  {crumb.label}
                </a>
              ) : (
                <span key={crumb.label} aria-current="page">
                  {i > 0 && <i aria-hidden="true">/</i>}
                  {crumb.label}
                </span>
              )
            )}
          </nav>

          <p className="eyebrow">{data.eyebrow}</p>

          <Reveal as="h1" className="ab-hero__title ab-stagger" stagger>
            {data.titleLines.map((line) => (
              <span className="ab-hero__line" key={line}>
                {line}{" "}
              </span>
            ))}
          </Reveal>

          <Reveal as="div" className="ab-hero__foot">
            <p className="ab-hero__lede">{data.lede}</p>
            <div className="ab-hero__actions">
              <a className="btn btn--cta" href={data.primary.href}>
                {data.primary.label}
                {ARROW_RIGHT}
              </a>
              <a className="ab-link" href={data.secondary.href}>
                {data.secondary.label}
                {ARROW_RIGHT}
              </a>
            </div>
          </Reveal>
        </div>

        {tiles && (
          <Reveal as="ul" className="ab-tiles st-tiles ab-stagger" stagger aria-label="Ways to get involved">
            {tiles.map((tile) => (
              <li key={tile.id}>
                <a className={`ab-tile ab-tile--${tile.tone} st-tile ab-tile--link`} href={tile.href}>
                  <Motif variant={tile.variant} className="st-tile__motif" />
                  <span className="st-tile__label">{tile.label}</span>
                </a>
              </li>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
