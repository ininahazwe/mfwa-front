// API: the 3 most recent WordPress impact stories (getImpactHighlights).
// 2026-11-02 (design review I5): tags joined from the list (a story may
// have no country), read time and excerpt shown only when present.
import { Fragment } from "react";
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

function Tags({ tag }) {
  return (
    <p className="impact-story__tag">
      {tag.map((t, i) => (
        <Fragment key={t}>
          {i > 0 && (
            <>
              {" "}
              <span>·</span>{" "}
            </>
          )}
          {t}
        </Fragment>
      ))}
    </p>
  );
}

function Meta({ story }) {
  return (
    <p className="impact-story__meta">
      <span>
        {story.date}
        {story.readTime && (
          <>
            {" "}
            <i>·</i> {story.readTime}
          </>
        )}
      </span>
    </p>
  );
}

export default function ImpactHighlights({ data }) {
  return (
    <section className="impact-highlights" id="impact-highlights">
      {/* 2026-11-02 (design review N2): no eyebrow when it would repeat the
          title ("Impact" / "Impact stories") — the title moves into the head
          row, next to "View all stories". */}
      <div className="impact-highlights__head">
        {data.eyebrow ? (
          <p className="eyebrow">{data.eyebrow}</p>
        ) : (
          <Reveal as="h2" className="impact-highlights__title">
            {data.title}
          </Reveal>
        )}
        <a className="impact-highlights__all" href={data.viewAll.href}>
          <span>{data.viewAll.label}</span>
          {data.viewAll.srSuffix && <span className="visually-hidden">{data.viewAll.srSuffix}</span>}
          {ARROW}
        </a>
      </div>

      {data.eyebrow && (
        <Reveal as="h2" className="impact-highlights__title">
          {data.title}
        </Reveal>
      )}

      <Reveal as="div" className="impact-highlights__grid" stagger>
        <article className="impact-story impact-story--featured">
          <a className="impact-story__link" href={data.featured.link}>
            <figure className="impact-story__media">
              <FadeImg src={data.featured.image.src} alt={data.featured.image.alt} removeOnError />
            </figure>
            <div className="impact-story__body">
              <Tags tag={data.featured.tag} />
              <h3 className="impact-story__heading">{data.featured.heading}</h3>
              <Meta story={data.featured} />
              {data.featured.excerpt && <p className="impact-story__excerpt">{data.featured.excerpt}</p>}
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
                  <Tags tag={story.tag} />
                  <h3 className="impact-story__heading">{story.heading}</h3>
                  <Meta story={story} />
                </div>
              </a>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
