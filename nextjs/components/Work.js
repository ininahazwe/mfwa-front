// API: work_areas[] (custom post type WordPress) — icon (slug), number, title,
// description, href (links through to the matching /programmes page)
import Reveal from "./Reveal";

const ICONS = {
  shield: (
    <svg className="work__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
    </svg>
  ),
  network: (
    <svg className="work__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 8a3 3 0 1 0 0-6" />
      <path d="M22 20c0-2.6-1.7-4.8-4-5.6" />
    </svg>
  ),
  document: (
    <svg className="work__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M15 2v5h5" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  ),
  connections: (
    <svg className="work__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" />
      <line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
    </svg>
  ),
};

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
            <div className="work__top">
              <span className="work__num">{item.num}</span>
              {ICONS[item.icon]}
            </div>
            <h3 className="work__heading">{item.heading}</h3>
            <p className="work__desc">{item.desc}</p>
          </a>
        ))}
      </Reveal>
    </section>
  );
}
