// API: about.hero { eyebrow, titleLines[2], lede, credentials[], stats[] }
// See getAboutUs() in lib/content.js.
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";

export default function AboutHero({ data }) {
  return (
    <section className="about-hero">
      <div className="about-hero__inner">
        <p className="eyebrow">{data.eyebrow}</p>

        <Reveal as="h1" className="about-hero__title" stagger>
          <span className="about-hero__line">{data.titleLines[0]}</span>
          <span className="about-hero__line">{data.titleLines[1]}</span>
        </Reveal>

        <Reveal as="p" className="about-hero__lede">
          {data.lede}
        </Reveal>

        <Reveal as="ul" className="about-hero__credentials" stagger aria-label="Recognition and status">
          {data.credentials.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Reveal>
      </div>

      <Reveal as="ul" className="about-hero__stats" stagger>
        {data.stats.map((stat) => (
          <li className="about-hero__stat" key={stat.label}>
            <StatCounter className="about-hero__num" count={stat.count} suffix={stat.suffix} />
            <span className="about-hero__label">{stat.label}</span>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
