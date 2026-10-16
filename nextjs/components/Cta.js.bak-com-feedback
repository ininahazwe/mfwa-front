// API: cta.title, cta.text, cta.button{label,link}
import FadeImg from "./FadeImg";

export default function Cta({ data }) {
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
            <a className="btn btn--cta" href={data.button.href}>
              {data.button.label}
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
              </svg>
            </a>
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
    </section>
  );
}
