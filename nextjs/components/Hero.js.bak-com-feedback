"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import FadeImg from "./FadeImg";

// Ports initHeroCarousel() (the editorial hero__intro slides) and
// initArticleGallery() (the independent hero__feature > news__thumb
// gallery) from assets/js/main.js. Both are plain React state + effects
// instead of DOM querying: the active slide/thumb is driven by index
// state and rendered via the "is-active" class, and each autoplay effect
// re-schedules its own setTimeout whenever its index (manual nav included)
// or pause/visibility/reduced-motion state changes — the same "restart the
// countdown after a user action" behaviour as the original's
// goTo(target, fromUser).

const AUTOPLAY_DELAY = 7000; // ms — matches main.js (0 disables autoplay)
const GALLERY_DELAY = 4500; // ms — matches main.js's initArticleGallery()
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

// API: hero.eyebrow, hero.slides[] { title, lede, cta } — see getHero()
// API: hero.featuredArticle { image, region, country, eyebrow, title,
//      excerpt, link, linkLabel, gallery[] } — see getHero()
export default function Hero({ data }) {
  const slides = data.slides;
  const total = slides.length;
  const gallery = data.featuredArticle.gallery;
  const galleryTotal = gallery.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryPaused, setGalleryPaused] = useState(false);

  // prefers-reduced-motion and tab visibility, shared by both autoplay
  // effects below — matches the single reducedMotion/visibilitychange
  // listeners in main.js, which both initHeroCarousel() and
  // initArticleGallery() read from.
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

  // Featured-article inner gallery: independent autoplay, own pause state,
  // no controls — matches initArticleGallery() exactly.
  useEffect(() => {
    if (galleryTotal < 2 || galleryPaused || tabHidden || reducedMotion) return undefined;
    const timer = window.setTimeout(() => {
      setGalleryIndex((i) => (i + 1) % galleryTotal);
    }, GALLERY_DELAY);
    return () => window.clearTimeout(timer);
  }, [galleryIndex, galleryPaused, tabHidden, reducedMotion, galleryTotal]);

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
      className="hero"
      id="hero"
      data-hero
      aria-roledescription="carrousel"
      aria-label="À la une"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartX.current = null;
      }}
    >
      {/* Colonne 1 : accroche */}
      <div className="hero__intro">
        <p className="eyebrow">{data.eyebrow}</p>

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
      </div>

      {/* Bloc fusionné : article en vogue (indépendant du carrousel ci-dessus) */}
      <div className="hero__feature">
        <div className="hero__media">
          <figure className="hero__shot is-active">
            <FadeImg src={data.featuredArticle.image.src} alt={data.featuredArticle.image.alt} removeOnError />
            <figcaption className="hero__caption">
              {data.featuredArticle.region} <span></span> {data.featuredArticle.country}
            </figcaption>
          </figure>
        </div>

        <aside className="hero__news" aria-label="Article en vogue">
          <p className="eyebrow">{data.featuredArticle.eyebrow}</p>

          <h2 className="news__title">{data.featuredArticle.title}</h2>

          <p className="news__text">{data.featuredArticle.excerpt}</p>

          <a className="news__link" href={data.featuredArticle.link}>
            {data.featuredArticle.linkLabel}
            {NEWS_ARROW}
          </a>

          <div
            className="news__thumb"
            data-article-gallery
            aria-label="Images de l'article"
            onMouseEnter={() => setGalleryPaused(true)}
            onMouseLeave={() => setGalleryPaused(false)}
          >
            {gallery.map((img, i) => {
              const active = i === galleryIndex;
              return (
                <figure
                  className={`news__thumb-slide${active ? " is-active" : ""}`}
                  key={img.src}
                  aria-hidden={active ? "false" : "true"}
                >
                  <FadeImg src={img.src} alt={img.alt} removeOnError />
                </figure>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
