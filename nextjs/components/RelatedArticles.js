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
export default function RelatedArticles({ related }) {
  return (
    <section className="related" aria-label="You may also like">
      <p className="eyebrow">You may also like</p>
      <Reveal as="div" className="related__grid" stagger>
        {related.map((story) => (
          <article className="story" key={story.link}>
            <a className="story__link" href={story.link}>
              <figure className="story__media">
                <FadeImg src={story.image.src} alt={story.image.alt} removeOnError />
              </figure>
              <div className="story__body">
                <p className="story__tag">
                  {story.tag[0]} <span>·</span> {story.tag[1]}
                </p>
                <h3 className="story__heading">{story.heading}</h3>
                <p className="story__meta">
                  <span>
                    {story.date} <i>·</i> {story.readTime}
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
