// "Stats" band — homepage, right after "The latest from MFWA" (2026-10-30).
// API: keyStats { label, stats[] { count, suffix?, label, href? } }
// 3 or 4 key figures in one horizontal row; getKeyStats() (lib/content.js)
// decides which ones, depending on what is available, and sends an empty
// list when fewer than 3 are — the band is then not rendered at all.
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";
import HeroTopo from "./HeroTopo";
import { PAGE_TOPO } from "../lib/pageTopo";

// Relief of the /programmes hero (lib/pageTopo.js), cropped to its lower, flowing
// part: the band is short and wide, so only a strip of the square terrain shows.
const TOPO_STRIP = "0 405 600 170";

// 2026-11-02 (design review N2): `embedded` renders the list alone, for
// the Mediascape section (components/Reach.js), instead of a band of its own.
// 2026-11-03 (retours com round 2): variant="bar" = thin dark band right
// after the Hero (number + label side by side).
// 2026-11-20 (at Yv's call): TWO versions of the "statement" band — pick one:
//   "inline"  : one centred sentence with the figures woven into it
//               (data.statement);
//   "figures" : the same centred sentence WITHOUT the figures
//               (data.statementPlain), and the figures pulled out below it,
//               in a horizontal row, each with its description line.
const KEY_FIGURES_VARIANT = "figures"; // "inline" | "figures"

export default function KeyStats({ data, embedded = false, variant }) {
  if (!data?.stats?.length) return null;
  if (variant === "statement" && KEY_FIGURES_VARIANT === "figures" && data.statementPlain) {
    return (
      <section className="keystats keystats--statement keystats--figures" id="key-figures" aria-label={data.label}>
        <HeroTopo paths={PAGE_TOPO.programmes.paths} viewBox={TOPO_STRIP} mirror={false} host=".keystats" className="keystats-topo" />
        <Reveal as="h2" className="keystats__statement">
          {data.statementPlain.map((part, i) =>
            typeof part === "string" ? (
              <span key={i} className="title-soft">{part}</span>
            ) : (
              <span key={i}>{part.strong}</span>
            ),
          )}
        </Reveal>
        <Reveal as="ul" className="keystats__figures" style={{ "--keystats-n": data.stats.length }}>
          {data.stats.map((stat) => (
            <li className="keystats__figure" key={stat.label}>
              <StatCounter className="keystats__figure-num" count={stat.count} suffix={stat.suffix} />
              <span className="keystats__figure-label">{stat.label}</span>
            </li>
          ))}
        </Reveal>
      </section>
    );
  }
  // 2026-11-04 (step D, at Yv's call): variant="statement" replaces the thin
  // bar by one large centred sentence; the figures are woven into it.
  // data.statement = array of strings and stat indexes (numbers).
  if (variant === "statement" && data.statement) {
    return (
      <section className="keystats keystats--statement" id="key-figures" aria-label={data.label}>
        <Reveal as="h2" className="keystats__statement">
          {data.statement.map((part, i) =>
            typeof part === "number" ? (
              <StatCounter
                key={i}
                className="keystats__inline-num"
                count={data.stats[part].count}
                suffix={data.stats[part].suffix}
              />
            ) : (
              <span key={i} className="title-soft">{part}</span>
            ),
          )}
        </Reveal>
      </section>
    );
  }
  const list = (
      <Reveal
        as="ul"
        className={`keystats__list${embedded ? " keystats__list--embedded" : ""}`}
        style={{ "--keystats-n": data.stats.length }}
        aria-label={embedded ? data.label : undefined}
      >
        {data.stats.map((stat) => {
          const body = (
            <>
              <StatCounter className="keystats__num" count={stat.count} suffix={stat.suffix} />
              <span className="keystats__label">{stat.label}</span>
            </>
          );
          return (
            <li className="keystats__item" key={stat.label}>
              {stat.href ? <a className="keystats__link" href={stat.href}>{body}</a> : body}
            </li>
          );
        })}
      </Reveal>
  );
  if (embedded) return list;
  return (
    <section className={`keystats${variant === "bar" ? " keystats--bar" : ""}`} id="key-figures" aria-label={data.label}>
      {list}
    </section>
  );
}
