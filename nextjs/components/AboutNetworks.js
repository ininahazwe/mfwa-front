// API: about.networks { eyebrow, title, text, items[] { name, desc },
// partnersHref, partnersLinkLabel }. The scrolling name strip above the
// grid is decorative (aria-hidden, duplicated for a seamless loop) — the
// real, accessible content is the grid underneath.
import Reveal from "./Reveal";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

export default function AboutNetworks({ data }) {
  const names = data.items.map((item) => item.name);
  return (
    <section className="about-networks" id="networks">
      <div className="networks-marquee" aria-hidden="true">
        <div className="networks-marquee__track">
          {[...names, ...names].map((name, i) => (
            <span className="networks-marquee__item" key={`${name}-${i}`}>
              {name}
            </span>
          ))}
        </div>
      </div>

      <Reveal as="div" className="about-networks__head">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 className="about-networks__title">{data.title}</h2>
        <p className="about-networks__text">{data.text}</p>
        <a className="about-networks__link" href={data.partnersHref}>
          {data.partnersLinkLabel}
          {ARROW}
        </a>
      </Reveal>

      <Reveal as="ul" className="about-networks__grid" stagger>
        {data.items.map((item) => (
          <li className="network-card" key={item.name}>
            <h3 className="network-card__name">{item.name}</h3>
            <p className="network-card__desc">{item.desc}</p>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
