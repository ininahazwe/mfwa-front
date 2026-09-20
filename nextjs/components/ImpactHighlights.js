// API: taxonomy filter — les 3 derniers articles de la catégorie WordPress "Impact"
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

export default function ImpactHighlights({ data }) {
  return (
    <section className="impact-highlights" id="impact-highlights">
      <div className="impact-highlights__head">
        <p className="eyebrow">{data.eyebrow}</p>
        <a className="impact-highlights__all" href={data.viewAll.href}>
          <span>{data.viewAll.label}</span>
          {ARROW}
        </a>
      </div>

      <Reveal as="h2" className="impact-highlights__title">
        {data.title}
      </Reveal>

      <Reveal as="div" className="impact-highlights__grid" stagger>
        <article className="impact-story impact-story--featured">
          <a className="impact-story__link" href={data.featured.link}>
            <figure className="impact-story__media">
              <FadeImg src={data.featured.image.src} alt={data.featured.image.alt} removeOnError />
            </figure>
            <div className="impact-story__body">
              <p className="impact-story__tag">
                {data.featured.tag[0]} <span>·</span> {data.featured.tag[1]}
              </p>
              <h3 className="impact-story__heading">{data.featured.heading}</h3>
              <p className="impact-story__meta">
                <span>
                  {data.featured.date} <i>·</i> {data.featured.readTime}
                </span>
              </p>
              <p className="impact-story__excerpt">{data.featured.excerpt}</p>
              <span className="impact-story__cta">
                {data.featured.ctaLabel}
                {ARROW}
              </span>
            </div>
          </a>
        </article>

        <div className="impact-highlights__stack">
          {data.compact.map((story) => (
            <article className="impact-story impact-story--compact" key={story.link}>
              <a className="impact-story__link" href={story.link}>
                <figure className="impact-story__media">
                  <FadeImg src={story.image.src} alt={story.image.alt} removeOnError />
                </figure>
                <div className="impact-story__body">
                  <p className="impact-story__tag">
                    {story.tag[0]} <span>·</span> {story.tag[1]}
                  </p>
                  <h3 className="impact-story__heading">{story.heading}</h3>
                  <p className="impact-story__meta">
                    <span>
                      {story.date} <i>·</i> {story.readTime}
                    </span>
                  </p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
