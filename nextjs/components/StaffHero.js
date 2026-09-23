// API: staff.hero { crumbs[], eyebrow, titleLines[], lede, primary, secondary }
//      staff.teams[] { id, label, count }
// Same frame as AboutHero (copy left, square tile grid right); here each
// tile is one team of the directory with its head-count and a journalism
// motif, the dark tile carrying the total.
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ARROW_RIGHT } from "./AboutIcons";

const TILE_STYLE = {
  all: { variant: "press", tone: "dark" },
  leadership: { variant: "mic", tone: "pale" },
  programmes: { variant: "tower", tone: "white" },
  journalism: { variant: "search", tone: "pale" },
  communications: { variant: "camera", tone: "white" },
  operations: { variant: "newspaper", tone: "pale" },
};

export default function StaffHero({ data, teams }) {
  // Total first, then the teams — reads as "37 people, of whom…"
  const tiles = [...teams.filter((t) => t.id === "all"), ...teams.filter((t) => t.id !== "all")];

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

        <Reveal as="ul" className="ab-tiles st-tiles ab-stagger" stagger aria-label="Our staff by team">
          {tiles.map((team) => {
            const style = TILE_STYLE[team.id] ?? { variant: "dots", tone: "white" };
            return (
              <li className={`ab-tile ab-tile--${style.tone} st-tile`} key={team.id}>
                <Motif variant={style.variant} className="st-tile__motif" />
                <span className="st-tile__num">{team.count}</span>
                <span className="st-tile__label">{team.id === "all" ? "People" : team.label}</span>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
