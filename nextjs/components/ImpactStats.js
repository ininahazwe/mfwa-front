// API: impact.media.image, impact.stats[] { number, label }
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";
import StatCounter from "./StatCounter";

export default function ImpactStats({ data }) {
  return (
    <section className="impact" id="impact">
      <div className="impact__media" aria-hidden="true">
        <FadeImg src={data.media.src} alt={data.media.alt} removeOnError />
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
  );
}
