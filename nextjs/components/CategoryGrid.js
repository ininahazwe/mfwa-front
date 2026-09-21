"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";

const PAGE_SIZE = 10;
const AUTO_LOAD_LIMIT = 3; // number of scroll-triggered batches before the button takes over
const SIMULATED_DELAY = 500; // ms — stands in for a future paginated fetch

// API: category.articles[] { link, image, tag, heading, date, readTime } —
// see getCategoryPage() in lib/content.js. The whole pool is already in
// memory (static-data phase), so "loading more" here just reveals the
// next PAGE_SIZE items; loadMore()'s shape (a function that resolves after
// a short delay) is what a real `fetch(...&page=N)` call would slot into
// later without changing the component's behaviour.
//
// Behaviour: the first AUTO_LOAD_LIMIT batches load automatically as a
// sentinel scrolls into view (infinite-scroll style); once that budget is
// used up, a manual "Load more" button takes over for the rest of the list.
export default function CategoryGrid({ articles }) {
  const total = articles.length;
  const [visibleCount, setVisibleCount] = useState(Math.min(PAGE_SIZE, total));
  const [autoLoadCount, setAutoLoadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false); // mirrors `loading` inside the observer's closure

  const hasMore = visibleCount < total;
  const autoExhausted = autoLoadCount >= AUTO_LOAD_LIMIT;

  function loadMore(isAuto) {
    if (loadingRef.current || visibleCount >= total) return;
    loadingRef.current = true;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((count) => Math.min(count + PAGE_SIZE, total));
      if (isAuto) setAutoLoadCount((count) => count + 1);
      loadingRef.current = false;
      setLoading(false);
    }, SIMULATED_DELAY);
  }

  useEffect(() => {
    if (autoExhausted || !hasMore) return undefined;
    const el = sentinelRef.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadMore(true);
        });
      },
      { rootMargin: "0px 0px 200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // Re-attach whenever the sentinel's visibility-relevant inputs change;
    // loadMore() itself is stable enough not to need listing here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExhausted, hasMore, visibleCount]);

  return (
    <>
      <p className="category__count">
        Showing {visibleCount} of {total} stories
      </p>

      <Reveal as="div" className="category__grid" stagger>
        {articles.slice(0, visibleCount).map((story) => (
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

      {hasMore && !autoExhausted && <div ref={sentinelRef} className="category__sentinel" aria-hidden="true" />}

      {loading && !autoExhausted && (
        <p className="category__loading" role="status">
          Loading more stories…
        </p>
      )}

      {hasMore && autoExhausted && (
        <div className="category__loadmore">
          <button type="button" className="btn btn--loadmore" onClick={() => loadMore(false)} disabled={loading}>
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

      {!hasMore && <p className="category__end">You’ve reached the end of this category.</p>}
    </>
  );
}
