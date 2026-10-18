// lib/hooks.js
//
// Client-side behaviour ported from assets/js/main.js. These are plain
// React hooks (no 'use client' directive here — that belongs on whatever
// component file actually calls them) that each return a ref to attach to
// the DOM node the original vanilla-JS function used to query directly.

import { useEffect, useRef } from "react";

/**
 * Ports initScrollReveal(): adds the "is-visible" class to the element once
 * it enters the viewport. Used for both plain [data-reveal] elements and
 * [data-reveal="stagger"] containers — CSS handles the staggered timing of
 * the children in either case, this hook only ever toggles the class on the
 * element it is attached to.
 *
 * Matches the original: threshold 0.15, rootMargin "0px 0px -8% 0px",
 * observed once then unobserved, and an immediate reveal (no animation)
 * when IntersectionObserver is unavailable or the user prefers reduced
 * motion — so content is never left invisible.
 */
export function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      el.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Ports the fade-in-on-load half of initImageFade(). The broken-image case
 * is already handled inline on every <img> via
 * onError={(e) => e.currentTarget.remove()}, so this hook only needs to
 * add/remove the "is-loading" class (main.css: img.is-loading{opacity:0}).
 * If the image is already loaded from cache (img.complete), it is left
 * alone exactly like the original — no flash of "is-loading".
 */
export function useImageFade() {
  const ref = useRef(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return undefined;
    if (img.complete) return undefined;

    img.classList.add("is-loading");

    function handleLoad() {
      img.classList.remove("is-loading");
    }

    img.addEventListener("load", handleLoad, { once: true });
    img.addEventListener("error", handleLoad, { once: true });

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleLoad);
    };
  }, []);

  return ref;
}

/**
 * Powers the "reveal" footer effect (.site-footer is position:fixed,
 * .page-shell scrolls over it — see globals.css): measures the footer's
 * own rendered height and publishes it as the --footer-h custom property
 * on the root element, so the spacer that gives scrolling enough room to
 * fully uncover the footer always matches its real height instead of a
 * guessed, breakpoint-fragile number. Re-measures via ResizeObserver
 * since that height changes at every responsive breakpoint (and falls
 * back to a resize listener on the rare browser without it — the CSS
 * default for --footer-h, set on :root, covers the case where neither
 * runs at all).
 */
export function useFooterReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    function setHeight() {
      // getBoundingClientRect (not offsetHeight, which rounds): with a
      // fractional footer height (e.g. 340.75px) the rounded-up value let
      // .page-shell scroll a fraction of a pixel too far, leaving a thin
      // white line above the footer (2026-10-18). See also the -1px overlap
      // on .page-shell's margin-bottom in globals.css.
      document.documentElement.style.setProperty("--footer-h", `${el.getBoundingClientRect().height}px`);
    }

    setHeight();

    if (!("ResizeObserver" in window)) {
      window.addEventListener("resize", setHeight);
      return () => window.removeEventListener("resize", setHeight);
    }

    const observer = new ResizeObserver(setHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Ports initStatCounters(): counts a .impact__num[data-count] element up
 * from 0 to `target` (formatted with `suffix`, thousands-separated the same
 * way as the original via toLocaleString("en-US")) once it scrolls into
 * view. Triggers once (threshold 0.4, then unobserved), 1200ms duration,
 * ease-out cubic easing, and shows the final value immediately when the
 * user prefers reduced motion or IntersectionObserver is unavailable.
 */
export function useStatCounters(target, suffix = "") {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const DURATION = 1200; // ms
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function format(value) {
      return Math.round(value).toLocaleString("en-US") + suffix;
    }

    function animate() {
      if (reducedMotion.matches) {
        el.textContent = format(target);
        return;
      }
      const start = performance.now();
      function tick(now) {
        const progress = Math.min(1, (now - start) / DURATION);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(target * eased);
        if (progress < 1) window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      el.textContent = format(target);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate();
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return ref;
}

/**
 * Scroll parallax (2026-09-30, at Yv's call): moves the element it's
 * attached to at a fraction of the page's scroll speed, the same core
 * effect the "rellax" library gives via data-rellax-speed, reimplemented
 * here as a plain hook rather than adding that dependency for one use —
 * consistent with every other hook in this file. Used by the decorative
 * hero "blob" on programme pages (components/InvolvedHero.js): the blob
 * stays centred (translate(-50%, -50%), set in CSS as the no-JS/
 * reduced-motion fallback) and this hook only adds a vertical drift on
 * top of that as the page scrolls, via requestAnimationFrame-throttled
 * scroll listener. Skipped entirely under prefers-reduced-motion, same
 * convention as useScrollReveal/useStatCounters — the element then just
 * keeps the CSS's static centred position.
 */
export function useParallax(speed = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    let ticking = false;

    function apply() {
      const offset = window.scrollY * speed;
      el.style.transform = `translate3d(-50%, calc(-50% + ${offset}px), 0)`;
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return ref;
}
