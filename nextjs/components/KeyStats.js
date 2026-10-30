// "Stats" band — homepage, right after "The latest from MFWA" (2026-10-30).
// API: keyStats { label, stats[] { count, suffix?, label, href? } }
// 3 or 4 key figures in one horizontal row; getKeyStats() (lib/content.js)
// decides which ones, depending on what is available, and sends an empty
// list when fewer than 3 are — the band is then not rendered at all.
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";

export default function KeyStats({ data }) {
  if (!data?.stats?.length) return null;
  return (
    <section className="keystats" id="key-figures" aria-label={data.label}>
      <Reveal as="ul" className="keystats__list" style={{ "--keystats-n": data.stats.length }}>
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
    </section>
  );
}
