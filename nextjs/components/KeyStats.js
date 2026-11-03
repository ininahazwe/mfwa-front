// "Stats" band — homepage, right after "The latest from MFWA" (2026-10-30).
// API: keyStats { label, stats[] { count, suffix?, label, href? } }
// 3 or 4 key figures in one horizontal row; getKeyStats() (lib/content.js)
// decides which ones, depending on what is available, and sends an empty
// list when fewer than 3 are — the band is then not rendered at all.
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";

// 2026-11-02 (design review N2): `embedded` renders the list alone, for
// the Mediascape section (components/Reach.js), instead of a band of its own.
// 2026-11-03 (retours com round 2): variant="bar" = thin dark band right
// after the Hero (number + label side by side).
export default function KeyStats({ data, embedded = false, variant }) {
  if (!data?.stats?.length) return null;
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
