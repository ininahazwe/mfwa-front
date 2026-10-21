import { Fragment } from "react";
import Reveal from "./Reveal";
import StoryMedia from "./StoryMedia";

// "What's happening" — homepage (reworked 2026-10-19, at Yv's call).
// - The 3 most recent posts come from WordPress (getLatestStories() →
//   getWpFilteredPosts), not hand-written sample stories any more.
// - The topics row no longer filters these 3 cards in place (with so few
//   cards, most topics showed 0 or 1 story and the grid jumped). Each topic
//   is now a plain link to the page that holds the full, paginated list —
//   the Where We Work explorer filtered by that issue — so the row works as
//   a way into the archive instead of a filter.
// - The topics row keeps its ORIGINAL design (pill bar, dots between items,
//   red dot on the first item) — the shared FilterTabs look was reverted
//   for this one component only.
// Previous client-side filter version: Latest.js.bak-home.

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

// API: latest { eyebrow, title, viewAll { label, href }, opportunities? { label, href },
//      topics[] { label, href },
//      stories[] { link, image { src, alt, isFallback? }, tag[], heading, date, readTime? } }
export default function Latest({ data }) {
  return (
    <section className="latest" id="stories">

      <div className="latest__head">
        <p className="eyebrow">{data.eyebrow}</p>
      </div>

      <Reveal as="h2" className="latest__title">
        {data.title}
      </Reveal>

      {/* 2026-10-21 (homepage UX review, point 5): same pill look, but under
          the title, introduced by a label, and without the red dot on the
          first topic (it read as "Free Expression is selected"). The row is
          links into the archive, not a filter of the 3 cards below. */}
      <nav className="topics topics--labelled" aria-label="Browse stories by topic" data-topics>
        <span className="topics__label">Browse by topic</span>
        {data.topics.map((topic, i) => (
          <Fragment key={topic.href}>
            {i > 0 && (
              <span className="topics__sep" aria-hidden="true">
                ·
              </span>
            )}
            <a className="topics__item" href={topic.href}>
              {topic.label}
            </a>
          </Fragment>
        ))}
      </nav>

      {data.stories.length > 0 ? (
        <Reveal as="div" className="latest__grid" stagger>
          {data.stories.map((story) => (
            <article className="story" key={story.link}>
              <a className="story__link" href={story.link}>
                <StoryMedia story={story} />
                <div className="story__body">
                  {story.tag.length > 0 && (
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
                    <svg
                      className="story__arrow"
                      width="15"
                      height="9"
                      viewBox="0 0 15 9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
                    </svg>
                  </p>
                </div>
              </a>
            </article>
          ))}
        </Reveal>
      ) : (
        <p className="latest__empty">Our latest stories are temporarily unavailable — please check back shortly.</p>
      )}

      <div className="latest__more">
        {data.opportunities && (
          <a className="latest__all latest__all--secondary" href={data.opportunities.href}>
            <span>{data.opportunities.label}</span>
            {ARROW}
          </a>
        )}
        <a className="latest__all" href={data.viewAll.href}>
          <span>{data.viewAll.label}</span>
          {ARROW}
        </a>
      </div>
    </section>
  );
}
