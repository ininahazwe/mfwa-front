"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";

const PAGE_SIZE = 10;
const AUTO_LOAD_LIMIT = 3; // number of scroll-triggered batches before the button takes over

export default function CategoryGrid({ slug, initialItems, initialTotalPages, initialTotal }) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [autoLoadCount, setAutoLoadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  const hasMore = page < totalPages;
  const autoExhausted = autoLoadCount >= AUTO_LOAD_LIMIT;

  function loadMore(isAuto) {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const nextPage = page + 1;
    fetch(`/api/category/${slug}/posts?page=${nextPage}&perPage=${PAGE_SIZE}`)
      .then((res) => {
        if (!res.ok) throw new Error("request-failed");
        return res.json();
      })
      .then((data) => {
        setItems((prev) => [...prev, ...data.items]);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        if (isAuto) setAutoLoadCount((count) => count + 1);
      })
      .catch(() => {
        setError("We couldn't load more stories. Please try again.");
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
  }

  useEffect(() => {
    if (autoExhausted || !hasMore || error) return undefined;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExhausted, hasMore, error, page]);

  return (
    <>
      <p className="category__count">Showing {items.length} of {total} stories</p>
      <Reveal as="div" className="category__grid" stagger>
        {items.map((story, i) => (
          <article className="story" key={`${story.link}-${i}`}>
            <a className="story__link" href={story.link}>
              <figure className={`story__media${story.image.isFallback ? " story__media--fallback" : ""}`}>
                <FadeImg src={story.image.src} alt={story.image.alt} removeOnError={!story.image.isFallback} />
              </figure>
              <div className="story__body">
                {story.tag.length > 0 && (
                  <p className="story__tag">
                    {story.tag[0]}
                    {story.tag[1] && <><span>·</span> {story.tag[1]}</>}
                  </p>
                )}
                <h3 className="story__heading">{story.heading}</h3>
                <p className="story__meta">
                  <span>
                    {story.date}
                    {story.readTime && <><i>·</i> {story.readTime}</>}
                  </span>
                  <svg className="story__arrow" width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" /></svg>
                </p>
              </div>
            </a>
          </article>
        ))}
      </Reveal>

      {hasMore && !autoExhausted && !error && (
        <div ref={sentinelRef} className="category__sentinel" aria-hidden="true" />
      )}

      {loading && !error && <p className="category__loading" role="status">Loading more stories…</p>}

      {error && (
        <div className="category__error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn--loadmore category__retry" onClick={() => loadMore(false)}>
            Try again
          </button>
        </div>
      )}

      {hasMore && autoExhausted && !error && (
        <div className="category__loadmore">
          <button type="button" className="btn btn--loadmore" onClick={() => loadMore(false)} disabled={loading}>
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

      {!hasMore && !error && <p className="category__end">You&apos;ve reached the end of this category.</p>}
    </>
  );
}
