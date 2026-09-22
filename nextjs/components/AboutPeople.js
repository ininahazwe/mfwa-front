// API: about.people { eyebrow, title, cards[] { count, suffix, label,
// heading, text, href, linkLabel } }. Staff/Board don't have local routes
// yet, so — same out-linking pattern as Reach.js's country links — each
// card links straight to the matching live mfwa.org page.
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

export default function AboutPeople({ data }) {
  return (
    <section className="about-people" id="people">
      <Reveal as="div" className="about-people__head">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 className="about-people__title">{data.title}</h2>
      </Reveal>

      <Reveal as="div" className="about-people__grid" stagger>
        {data.cards.map((card) => (
          <a className="people-card" href={card.href} key={card.heading}>
            <StatCounter className="people-card__num" count={card.count} suffix={card.suffix} />
            <span className="people-card__num-label">{card.label}</span>
            <h3 className="people-card__heading">{card.heading}</h3>
            <p className="people-card__text">{card.text}</p>
            <span className="people-card__link">
              {card.linkLabel}
              {ARROW}
            </span>
          </a>
        ))}
      </Reveal>
    </section>
  );
}
