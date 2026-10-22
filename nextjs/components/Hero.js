"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import FadeImg from "./FadeImg";
import HeroTopo from "./HeroTopo";

// Ports initHeroCarousel() (the editorial hero__intro slides) from
// assets/js/main.js. It is plain React state + effects instead of DOM
// querying: the active slide is driven by index state and rendered via the
// "is-active" class, and the autoplay effect re-schedules its own
// setTimeout whenever its index (manual nav included) or
// pause/visibility/reduced-motion state changes — the same "restart the
// countdown after a user action" behaviour as the original's
// goTo(target, fromUser).
//
// 2026-10-16 (retours équipe com #1): the right-hand "Latest news" block
// (one featured article + initArticleGallery()'s auto-rotating thumbnail)
// is now a swipe-through carousel of four stories — a native
// CSS scroll-snap track, so touch swipe, trackpad and keyboard scrolling
// need no JS — with arrows and dots for mouse users, and no "Latest news"
// label. Its original single-article/gallery version is in git history
// (and components/Hero.js.bak-com-feedback).

// 2026-10-22 (at Yv's call): the news carousel now uses the transition of
// the CodePen "veronicadev/yjgjvL" — slides are stacked in the same cell, the
// photo sweeps in from the right while the title, excerpt and link rise and
// fade in (CSS: "Carrousel d'actualités : transition « pile »" in
// globals.css). The active slide is React state (storyIndex); touch swipe
// (≥45px), the arrows, the dots and the arrow keys all just change it. The
// previous scroll-snap version is in components/Hero.js.bak-carousel.

const AUTOPLAY_DELAY = 7000; // ms — matches main.js (0 disables autoplay)
const SWIPE_THRESHOLD = 45; // px — matches main.js

const HERO_ARROW = (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 5h14M10.2 1 14 5l-3.8 4" />
  </svg>
);

const NEWS_ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

const CHEVRON_PREV = (
  <svg width="17" height="11" viewBox="0 0 17 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 5.5H1M5.2 1 1 5.5 5.2 10" />
  </svg>
);

const CHEVRON_NEXT = (
  <svg width="17" height="11" viewBox="0 0 17 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 5.5h16M11.8 1 16 5.5 11.8 10" />
  </svg>
);

function pad(n) {
  return String(n).padStart(2, "0");
}

// prefers-reduced-motion and document visibility are external browser
// state, not state React owns — useSyncExternalStore subscribes to their
// "change"/"visibilitychange" events without the cascading-render setState
// call that a plain useEffect(() => setState(...)) would need.
function subscribeReducedMotion(callback) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (typeof mq.addEventListener === "function") mq.addEventListener("change", callback);
  return () => {
    if (typeof mq.removeEventListener === "function") mq.removeEventListener("change", callback);
  };
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

function subscribeTabHidden(callback) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
function getTabHiddenSnapshot() {
  return document.hidden;
}
function getTabHiddenServerSnapshot() {
  return false;
}

// API: hero.eyebrow? (omitted — see getHero()), hero.slides[] { title, lede,
//      cta }, hero.news { ariaLabel, stories[] { image, region, country,
//      title, excerpt, link, linkLabel } } — see getHero()

// Hero excerpt fitting (2026-10-21, at Yv's call). On wide screens the news
// panel has a fixed height (the hero row); each story's excerpt gets exactly
// the number of lines its title leaves free — a long title means a shorter
// excerpt — so the hero never grows or jumps from one story to the next.
// Below 901px the panel is stacked and sized by its content: the excerpt
// keeps the CSS default (4 lines).
const FIT_QUERY = "(min-width: 901px)";
function fitExcerpts(root) {
  if (!root) return;
  const wide = window.matchMedia(FIT_QUERY).matches;
  root.querySelectorAll(".hero__news").forEach((panel) => {
    const text = panel.querySelector(".news__text");
    if (!text) return;
    if (!wide) {
      text.style.removeProperty("--news-lines");
      text.hidden = false;
      return;
    }
    // Measure with the excerpt reduced to one line so it can't push the
    // panel taller than the row while we measure.
    text.hidden = false;
    text.style.setProperty("--news-lines", "1");
    const cs = getComputedStyle(panel);
    const inner = panel.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    let used = 0;
    for (const child of panel.children) {
      if (child === text) continue;
      const m = getComputedStyle(child);
      used += child.getBoundingClientRect().height + parseFloat(m.marginTop) + parseFloat(m.marginBottom);
    }
    const tm = getComputedStyle(text);
    const lineHeight = parseFloat(tm.lineHeight) || 24;
    const avail = inner - used - parseFloat(tm.marginTop) - parseFloat(tm.marginBottom);
    const lines = Math.max(0, Math.floor(avail / lineHeight));
    if (lines < 1) text.hidden = true;
    else text.style.setProperty("--news-lines", String(lines));
  });
}

// Hero relooking (2026-10-21, at Yv's call): white background with
// barely-visible contour lines (HeroTopo) and the news carousel as a
// floating card that no longer touches the right edge of the page.
// Revert: FLOAT = false (CSS: .hero--float block in globals.css).
const FLOAT = true;

export default function Hero({ data }) {
  // 2026-10-19 (at Yv's call): one carousel only in the hero. With
  // `data.intro` (see getHero()) the left column is a fixed statement —
  // no rotating slides, no autoplay, no slider controls, no swipe
  // handling — and only the news carousel on the right moves. Without
  // `intro`, the original rotating slides come back unchanged.
  const intro = data.intro ?? null;
  const slides = intro ? [] : data.slides;
  const total = slides.length;
  const stories = data.news.stories;
  const storyTotal = stories.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const storiesRef = useRef(null);

  // prefers-reduced-motion and tab visibility, used by the autoplay effect
  // below — matches the reducedMotion/visibilitychange listeners in
  // main.js.
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const tabHidden = useSyncExternalStore(subscribeTabHidden, getTabHiddenSnapshot, getTabHiddenServerSnapshot);

  const pointerStartX = useRef(null);

  function prev() {
    setIndex((i) => (i - 1 + total) % total);
  }
  function next() {
    setIndex((i) => (i + 1) % total);
  }

  // Editorial carousel autoplay. Re-armed on every index change (manual or
  // automatic) and on any pause/visibility/reduced-motion change.
  useEffect(() => {
    if (total < 2 || !AUTOPLAY_DELAY || paused || tabHidden || reducedMotion) return undefined;
    const timer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [index, paused, tabHidden, reducedMotion, total]);

  // News carousel: storyIndex is the source of truth.
  // Fit each story's excerpt to the room its title leaves (see fitExcerpts).
  useLayoutEffect(() => {
    const root = storiesRef.current;
    if (!root) return undefined;
    const run = () => fitExcerpts(root);
    run();
    document.fonts?.ready?.then(run);
    const ro = new ResizeObserver(run);
    ro.observe(root);
    return () => ro.disconnect();
  }, [storyTotal]);

  // Stacked layout (≤900px): the carousel is as tall as the story on screen
  // — no empty band under "Read more" when a shorter story follows a longer
  // one. The height eases from one story to the next. On wide screens the
  // stack is as tall as its tallest story (CSS), so the hero never jumps.
  const storyHeightRef = useRef(null);
  useLayoutEffect(() => {
    const el = storiesRef.current;
    if (!el) return undefined;
    const slide = el.children[storyIndex];
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = (animate) => {
      if (!mq.matches || !slide) {
        el.style.removeProperty("height");
        storyHeightRef.current = null;
        return;
      }
      const h = slide.offsetHeight;
      if (!h) return;
      if (animate && !reducedMotion && storyHeightRef.current != null) {
        el.style.height = `${storyHeightRef.current}px`;
        el.getBoundingClientRect(); // commit the starting height before easing to the new one
      }
      el.style.height = `${h}px`;
      storyHeightRef.current = h;
    };
    apply(true);
    const ro = new ResizeObserver(() => apply(false));
    if (slide) ro.observe(slide);
    const onMq = () => apply(false);
    mq.addEventListener("change", onMq);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, [storyIndex, storyTotal, reducedMotion]);

  function goToStory(i) {
    if (!storyTotal) return;
    setStoryIndex(((i % storyTotal) + storyTotal) % storyTotal);
  }
  // Swipe on the news carousel (touch / pen), arrow keys when it has focus.
  // These stop propagation so they never also drive the left-hand slides.
  const storySwipeX = useRef(null);
  function onStoriesPointerDown(e) {
    e.stopPropagation();
    if (e.pointerType === "mouse") return;
    storySwipeX.current = e.clientX;
  }
  function onStoriesPointerUp(e) {
    e.stopPropagation();
    if (storySwipeX.current === null) return;
    const dx = e.clientX - storySwipeX.current;
    storySwipeX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    goToStory(storyIndex + (dx < 0 ? 1 : -1));
  }
  function onStoriesKeyDown(e) {
    e.stopPropagation();
    if (e.key === "ArrowLeft") goToStory(storyIndex - 1);
    else if (e.key === "ArrowRight") goToStory(storyIndex + 1);
  }
  // The section-level pointer handlers below drive the left-hand hero slides on touch swipes.

  function handlePointerDown(e) {
    if (e.pointerType === "mouse") return;
    pointerStartX.current = e.clientX;
  }
  function handlePointerUp(e) {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) next();
    else prev();
  }
  function handleKeyDown(e) {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  }

  return (
    <section
      className={`hero${intro ? " hero--static-intro" : ""}${storyTotal === 0 ? " hero--no-news" : ""}${FLOAT ? " hero--float" : ""}`}
      id="hero"
      data-hero
      aria-label="Featured"
      {...(intro
        ? {}
        : {
            "aria-roledescription": "carrousel",
            onMouseEnter: () => setPaused(true),
            onMouseLeave: () => setPaused(false),
            onFocus: () => setPaused(true),
            onBlur: (e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
            },
            onKeyDown: handleKeyDown,
            onPointerDown: handlePointerDown,
            onPointerUp: handlePointerUp,
            onPointerCancel: () => {
              pointerStartX.current = null;
            },
          })}
    >
      {FLOAT && <HeroTopo />}

      {/* Colonne 1 : accroche */}
      <div className="hero__intro">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}

        {intro ? (
          <div className="hero__slides hero__slides--static">
            <div className="hero-slide is-active">
              <h1 className="hero__title">{intro.title}</h1>
              <p className="hero__lede">{intro.lede}</p>
              <div className="hero__actions">
                <a className="btn btn--hero hero__cta" href={intro.primary.href}>
                  {intro.primary.label}
                  {HERO_ARROW}
                </a>
                {intro.secondary && (
                  <a className="hero__secondary" href={intro.secondary.href}>
                    {intro.secondary.label}
                    {NEWS_ARROW}
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
          <div className="hero__slides" data-hero-slides>
            {slides.map((slide, i) => {
              const active = i === index;
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <article
                  className={`hero-slide${active ? " is-active" : ""}`}
                  key={slide.title}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}`}
                  aria-hidden={active ? "false" : "true"}
                  inert={!active}
                >
                  <Heading className="hero__title">{slide.title}</Heading>
                  <p className="hero__lede">{slide.lede}</p>
                  <a className="btn btn--hero hero__cta" href={slide.cta.href}>
                    {slide.cta.label}
                    {HERO_ARROW}
                  </a>
                </article>
              );
            })}
          </div>

          <div className="slider">
            <p className="slider__count" aria-live="polite">
              <b data-hero-current>{pad(index + 1)}</b>
              {"/ "}
              <span data-hero-total>{pad(total)}</span>
            </p>
            <div className="slider__nav">
              <button className="slider__btn" type="button" onClick={prev} data-hero-prev aria-label="Previous slide">
                {CHEVRON_PREV}
              </button>
              <button className="slider__btn" type="button" onClick={next} data-hero-next aria-label="Next slide">
                {CHEVRON_NEXT}
              </button>
            </div>
          </div>
          </>
        )}
      </div>

      {/* No pinned/recent WordPress story available (e.g. WordPress down):
          no empty carousel — the intro takes the full width (.hero--no-news). */}
      {storyTotal > 0 && (
      <>
      {/* Carrousel d actualités : 4 articles empilés, transition photo/texte (voir globals.css) ; balayage tactile, flèches, points */}
      <div
        className="hero__carousel"
        role="group"
        aria-roledescription="carousel"
        aria-label={data.news.ariaLabel}
      >
        <div
          className="hero__stories"
          ref={storiesRef}
          onPointerDown={onStoriesPointerDown}
          onPointerUp={onStoriesPointerUp}
          onPointerCancel={() => {
            storySwipeX.current = null;
          }}
          onKeyDown={onStoriesKeyDown}
          tabIndex={0}
          aria-label={data.news.ariaLabel}
          data-news-track
        >
          {stories.map((story, i) => {
            const active = i === storyIndex;
            return (
              <article
                className={`hero__feature hero__story${active ? " is-active" : ""}`}
                key={story.title}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${storyTotal}`}
                aria-hidden={active ? "false" : "true"}
                inert={!active}
              >
                <div className="hero__media">
                  <figure className="hero__shot is-active">
                    <FadeImg src={story.image.src} alt={story.image.alt} removeOnError />
                    <figcaption className="hero__caption">
                      {story.region}
                      {story.country && (
                        <>
                          {" "}
                          <span></span> {story.country}
                        </>
                      )}
                    </figcaption>
                  </figure>
                </div>

                <div className="hero__news">
                  <h2 className="news__title">{story.title}</h2>
                  {story.excerpt && <p className="news__text">{story.excerpt}</p>}
                  <a className="news__link" href={story.link}>
                    {story.linkLabel}
                    {NEWS_ARROW}
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="news-controls">
          <p className="news-controls__count" aria-live="polite">
            <b>{pad(storyIndex + 1)}</b> / {pad(storyTotal)}
          </p>
          <div className="news-controls__dots" role="group" aria-label="Choose a story">
            {stories.map((story, i) => (
              <button
                key={story.title}
                type="button"
                className={`news-controls__dot${i === storyIndex ? " is-active" : ""}`}
                aria-label={`Story ${i + 1}`}
                aria-current={i === storyIndex ? "true" : "false"}
                onClick={() => goToStory(i)}
              />
            ))}
          </div>
          <div className="news-controls__nav">
            <button className="news-controls__btn" type="button" onClick={() => goToStory(storyIndex - 1)} aria-label="Previous story">
              {CHEVRON_PREV}
            </button>
            <button className="news-controls__btn" type="button" onClick={() => goToStory(storyIndex + 1)} aria-label="Next story">
              {CHEVRON_NEXT}
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </section>
  );
}
