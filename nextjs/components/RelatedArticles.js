import { Fragment } from "react";
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

// API: article.related[] { link, image, tag, heading, date, readTime } —
// reuses the `.story` card markup/styling from Latest.js so "You may also
// like" cards stay visually consistent with the homepage's story grid.
// 2026-10-19: fed by WordPress (getWpRelatedPosts) — tags and read time
// are optional, the logo placeholder is used for posts without an image,
// and the section is skipped when there is nothing to suggest.
export default function RelatedArticles({ related }) {
  if (!related?.length) return null;
  return (
    <section className="related" aria-label="You may also like">
      <p className="eyebrow">You may also like</p>
      <Reveal as="div" className="related__grid" stagger>
        {related.map((story) => (
          <article className="story" key={story.link}>
            <a className="story__link" href={story.link}>
              <figure className={`story__media${story.image.isFallback ? " story__media--fallback" : ""}`}>
                <FadeImg src={story.image.src} alt={story.image.alt} removeOnError={!story.image.isFallback} />
              </figure>
              <div className="story__body">
                {story.tag?.length > 0 && (
                  <p className="story__tag">
                    {story.tag.map((t, i) => (
                      <Fragment key={t}>
                        {i > 0 && <span>·</span>} {t}{" "}
                      </Fragment>
                    ))}
                  </p>
                )}
                <h3 className="story__heading">{story.heading}</h3>
                <p className="story__meta">
                  <span>
                    {story.date}
                    {story.readTime && (
                      <>
                        {" "}
                        <i>·</i> {story.readTime}
                      </>
                    )}
                  </span>
                  <svg className="story__arrow" width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
                  </svg>
                </p>
              </div>
            </a>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
