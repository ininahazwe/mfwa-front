"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import FadeImg from "./FadeImg";

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

  // News carousel: the scroll position is the source of truth (so a
  // finger swipe, trackpad or keyboard scroll all just work); storyIndex
  // only mirrors it for the dots/counter/aria state.
  function onStoriesScroll() {
    const el = storiesRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== storyIndex && i >= 0 && i < storyTotal) setStoryIndex(i);
  }
  function goToStory(i) {
    const el = storiesRef.current;
    if (!el) return;
    const target = (i + storyTotal) % storyTotal;
    el.scrollTo({ left: target * el.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
    setStoryIndex(target);
  }
  // The section-level pointer handlers below drive the left-hand hero
  // slides on touch swipes; a swipe that starts on the news carousel must
  // scroll that carousel only, not also advance the headline slides.
  function stopSwipePropagation(e) {
    e.stopPropagation();
  }

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
      className={`hero${intro ? " hero--static-intro" : ""}`}
      id="hero"
      data-hero
      aria-label="À la une"
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
                  aria-roledescription="diapositive"
                  aria-label={`${i + 1} sur ${total}`}
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
              <button className="slider__btn" type="button" onClick={prev} data-hero-prev aria-label="Diapositive précédente">
                {CHEVRON_PREV}
              </button>
              <button className="slider__btn" type="button" onClick={next} data-hero-next aria-label="Diapositive suivante">
                {CHEVRON_NEXT}
              </button>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Carrousel d'actualités : 4 articles, défilement par balayage (indépendant du carrousel ci-dessus) */}
      <div
        className="hero__carousel"
        role="group"
        aria-roledescription="carrousel"
        aria-label={data.news.ariaLabel}
      >
        <div
          className="hero__stories"
          ref={storiesRef}
          onScroll={onStoriesScroll}
          onPointerDown={stopSwipePropagation}
          onPointerUp={stopSwipePropagation}
          onKeyDown={stopSwipePropagation}
          tabIndex={0}
          aria-label={data.news.ariaLabel}
          data-news-track
        >
          {stories.map((story, i) => {
            const active = i === storyIndex;
            return (
              <article
                className="hero__feature hero__story"
                key={story.title}
                aria-roledescription="diapositive"
                aria-label={`${i + 1} sur ${storyTotal}`}
                aria-hidden={active ? "false" : "true"}
                inert={!active}
              >
                <div className="hero__media">
                  <figure className="hero__shot is-active">
                    <FadeImg src={story.image.src} alt={story.image.alt} removeOnError />
                    <figcaption className="hero__caption">
                      {story.region} <span></span> {story.country}
                    </figcaption>
                  </figure>
                </div>

                <div className="hero__news">
                  <h2 className="news__title">{story.title}</h2>
                  <p className="news__text">{story.excerpt}</p>
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
          <div className="news-controls__dots" role="group" aria-label="Choisir un article">
            {stories.map((story, i) => (
              <button
                key={story.title}
                type="button"
                className={`news-controls__dot${i === storyIndex ? " is-active" : ""}`}
                aria-label={`Article ${i + 1}`}
                aria-current={i === storyIndex ? "true" : "false"}
                onClick={() => goToStory(i)}
              />
            ))}
          </div>
          <div className="news-controls__nav">
            <button className="news-controls__btn" type="button" onClick={() => goToStory(storyIndex - 1)} aria-label="Article précédent">
              {CHEVRON_PREV}
            </button>
            <button className="news-controls__btn" type="button" onClick={() => goToStory(storyIndex + 1)} aria-label="Article suivant">
              {CHEVRON_NEXT}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
