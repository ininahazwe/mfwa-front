// API: board.hero { crumbs[], eyebrow, titleLines[], lede, primary, secondary }
//      board.tiles[] { id, label, count, variant, tone }
// Same frame as StaffHero/AboutHero (copy left, square tile grid right);
// here each tile is one governance role with its head-count.
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ARROW_RIGHT } from "./AboutIcons";

export default function BoardHero({ data, tiles }) {
  return (
    <section className="ab-hero">
      <div className="ab-wrap ab-hero__grid">
        <div className="ab-hero__copy">
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

        <Reveal as="ul" className="ab-tiles st-tiles ab-stagger" stagger aria-label="MFWA board by role">
          {tiles.map((tile) => (
            <li className={`ab-tile ab-tile--${tile.tone} st-tile`} key={tile.id}>
              <Motif variant={tile.variant} className="st-tile__motif" />
              <span className="st-tile__num">{tile.count}</span>
              <span className="st-tile__label">{tile.label}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
