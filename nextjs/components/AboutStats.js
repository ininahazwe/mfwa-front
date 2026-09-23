// API: about.glance { eyebrow, title, note, stats[] { label, count }, credentials[] }
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";
import Motif from "./Motif";

export default function AboutStats({ data }) {
  return (
    <section className="ab-glance">
      <div className="ab-wrap">
        <Reveal as="div" className="ab-glance__panel">
          <div className="ab-glance__intro">
            <div>
              <p className="eyebrow">{data.eyebrow}</p>
              <h2 className="ab-h2 ab-h2--sm">{data.title}</h2>
            </div>
            <Motif variant="dots" className="ab-glance__motif" />
            <p className="ab-glance__note">{data.note}</p>
          </div>

          <ul className="ab-glance__stats">
            {data.stats.map((stat) => (
              <li className="ab-glance__stat" key={stat.label}>
                <StatCounter className="ab-glance__num" count={stat.count} />
                <span className="ab-glance__label">{stat.label}</span>
              </li>
            ))}
          </ul>

          <ul className="ab-glance__creds" aria-label="Recognition and status">
            {data.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
