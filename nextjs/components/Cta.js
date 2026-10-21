// API: cta.titleLines, cta.text, cta.button? {label,href} (omitted since 2026-10-16), cta.links[], cta.sites { title, items[] { name, host, href } }
import FadeImg from "./FadeImg";
import Newsletter from "./Newsletter";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

// API: cta { eyebrow, titleLines[], text, cards?[] { label, text, href,
//      primary? }, contact? { label, href }, sites? } + `newsletter` prop.
// With `cards` (2026-10-21, homepage UX review): the band shows one card per
// way to act — the first (primary) in red — and the newsletter strip under
// them. Without `cards`, the previous layout (text + buttons + links) is
// rendered unchanged.
export default function Cta({ data, newsletter }) {
  if (data.cards) {
    return (
      <section className="cta cta--cards" id="take-action">
        <div className="cta__media" aria-hidden="true">
          <FadeImg src={data.media.src} alt={data.media.alt} removeOnError />
        </div>

        <div className="cta__inner">
          <div className="cta__head">
            <div className="cta__intro">
              <p className="eyebrow">{data.eyebrow}</p>
              <h2 className="cta__title">
                {data.titleLines[0]}
                <br />
                {data.titleLines[1]}
              </h2>
            </div>
            <div className="cta__head-aside">
              <p className="cta__text cta__text--head">{data.text}</p>
              {data.contact && (
                <p className="cta__contact">
                  Questions? <a href={data.contact.href}>{data.contact.label}</a>
                </p>
              )}
            </div>
          </div>

          <ul className="cta__cards">
            {data.cards.map((card) => (
              <li key={card.label}>
                <a className={`cta-card${card.primary ? " cta-card--primary" : ""}`} href={card.href}>
                  <span className="cta-card__title">{card.label}</span>
                  <span className="cta-card__text">{card.text}</span>
                  <span className="cta-card__go" aria-hidden="true">
                    {ARROW}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {newsletter && <Newsletter data={newsletter} variant="inline" />}

        </div>

        {data.sites && (
          <div className="cta__sites">
            <p className="cta__sites-title">{data.sites.title}</p>
            <ul className="cta__sites-list">
              {data.sites.items.map((site) => (
                <li key={site.href}>
                  <a href={site.href} target="_blank" rel="noopener noreferrer">
                    <span className="cta__site-name">{site.name}</span>
                    <span className="cta__site-host">{site.host}</span>
                    <svg className="cta__site-arrow" width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 1h6v6M9 1 1 9" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="cta" id="take-action">
      <div className="cta__media" aria-hidden="true">
        <FadeImg src={data.media.src} alt={data.media.alt} removeOnError />
      </div>

      <div className="cta__inner">
        <div className="cta__intro">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="cta__title">
            {data.titleLines[0]}
            <br />
            {data.titleLines[1]}
          </h2>
        </div>

        <div className="cta__aside">
          <p className="cta__text">{data.text}</p>
          <div className="cta__buttons">
            {data.button && (
              <a className="btn btn--cta" href={data.button.href}>
                {data.button.label}
                <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
                </svg>
              </a>
            )}
            <ul className="cta__link">
              {data.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {data.sites && (
        <div className="cta__sites">
          <p className="cta__sites-title">{data.sites.title}</p>
          <ul className="cta__sites-list">
            {data.sites.items.map((site) => (
              <li key={site.href}>
                <a href={site.href} target="_blank" rel="noopener noreferrer">
                  <span className="cta__site-name">{site.name}</span>
                  <span className="cta__site-host">{site.host}</span>
                  <svg className="cta__site-arrow" width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 1h6v6M9 1 1 9" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
