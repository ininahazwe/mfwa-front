// API: work_areas[] (custom post type WordPress) — image { src, alt }, number, title,
// description, href (links through to the matching /programmes page)
// (2026-11-05, at Yv's call: the number + icon row became a rectangular photo.)
import Reveal from "./Reveal";

export default function Work({ data }) {
  return (
    <section className="work" id="our-work">
      <div className="work__head">
        <Reveal as="div" className="work__intro">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="work__title">{data.title}</h2>
        </Reveal>

        <div className="work__summary">
          <p className="work__text">{data.text}</p>
          <a className="work__link" href={data.link.href}>
            {data.link.label}
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
            </svg>
          </a>
        </div>
      </div>

      <Reveal as="div" className="work__grid" stagger>
        {data.items.map((item) => (
          <a className="work__item" href={item.href} key={item.num}>
            <div className="work__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image.src} alt={item.image.alt} loading="lazy" />
            </div>
            <h3 className="work__heading">{item.heading}</h3>
            <p className="work__desc">{item.desc}</p>
          </a>
        ))}
      </Reveal>
    </section>
  );
}
