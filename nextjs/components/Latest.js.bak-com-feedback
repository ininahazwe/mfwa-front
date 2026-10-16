"use client";

import { Fragment, useMemo, useState } from "react";
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";

// Ports initTopicsFilter() from assets/js/main.js. The original only moved
// the "is-active" state around (the real filtering was left as a WordPress
// extension point — see the comment above initTopicsFilter()); this
// version genuinely filters .latest__grid by matching each story's tag(s)
// against the clicked topic's slug, since content.js's stories already
// carry the same display tags the topics nav uses.
//
// Judgment call: "MFWA Now" (the first topic, active by default) has no
// matching story tag by design — it is the unfiltered/"everything" feed in
// the static mockup, so it shows every story rather than filtering to a
// literal "mfwa-now" tag. A topic with no matching story (e.g. "Freedom of
// Expression", not yet used as a tag on any of the four sample stories)
// simply renders an empty grid, same as a real WordPress category with no
// posts yet.
function slugifyTag(tag) {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

// API: latest.topics[] { label, slug, active }, latest.stories[] { link,
//      image, tag[], heading, date, readTime } — see getLatestStories()
export default function Latest({ data }) {
  const defaultTopic = data.topics[0]?.slug;
  const [activeTopic, setActiveTopic] = useState(
    data.topics.find((topic) => topic.active)?.slug ?? defaultTopic
  );

  const visibleStories = useMemo(() => {
    if (!activeTopic || activeTopic === defaultTopic) return data.stories;
    return data.stories.filter((story) => story.tag.some((t) => slugifyTag(t) === activeTopic));
  }, [activeTopic, defaultTopic, data.stories]);

  return (
    <section className="latest" id="stories">
      <nav className="topics" aria-label="Filtrer les actualités par thème" data-topics>
        {data.topics.map((topic, i) => (
          <Fragment key={topic.slug}>
            {i > 0 && (
              <span className="topics__sep" aria-hidden="true">
                ·
              </span>
            )}
            <button
              className={`topics__item${activeTopic === topic.slug ? " is-active" : ""}`}
              type="button"
              data-topic={topic.slug}
              aria-current={activeTopic === topic.slug ? "true" : "false"}
              onClick={() => setActiveTopic(topic.slug)}
            >
              {i === 0 && <span className="topics__dot" aria-hidden="true"></span>}
              {topic.label}
            </button>
          </Fragment>
        ))}
      </nav>

      <div className="latest__head">
        <p className="eyebrow">{data.eyebrow}</p>
        <a className="latest__all" href={data.viewAll.href}>
          <span>{data.viewAll.label}</span>
          {ARROW}
        </a>
      </div>

      <Reveal as="h2" className="latest__title">
        {data.title}
      </Reveal>

      <Reveal as="div" className="latest__grid" stagger>
        {visibleStories.map((story) => (
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
    </section>
  );
}
