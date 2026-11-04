"use client";

import { useEffect, useRef, useState } from "react";

// Horizontal rail that can be dragged with the mouse (2026-10-30, funders
// logos on the homepage). Touch and trackpads keep their native scrolling;
// only a mouse drag is handled here. A drag of more than a few pixels
// swallows the click that follows, so letting go over a logo doesn't open
// its link. The rail is keyboard-focusable (arrow keys scroll it natively)
// and exposes its state as classes for the CSS:
//   is-scrollable  content wider than the rail
//   can-left / can-right  there is more to see on that side (edge fades)
//   is-dragging   a mouse drag is in progress
const DRAG_THRESHOLD = 6; // px

// 2026-11-04 (at Yv's call): `autoplay` makes the rail drift slowly to the
// right once it is on screen, then back to the left (ping-pong, so the DOM
// stays as it is — no duplicated logos for screen readers). It pauses while
// the pointer is over the rail, while it has focus, during a drag, and after
// the visitor scrolls it by hand until the pointer leaves; it never runs
// with prefers-reduced-motion.
const AUTO_SPEED = 28; // px per second
const AUTO_PAUSE_AT_END = 1200; // ms

export default function DragScroll({ className = "", label, children, autoplay = false }) {
  const ref = useRef(null);
  const [state, setState] = useState({ scrollable: false, left: false, right: false });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    function measure() {
      const max = el.scrollWidth - el.clientWidth;
      setState({ scrollable: max > 2, left: el.scrollLeft > 2, right: el.scrollLeft < max - 2 });
    }

    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    function onPointerDown(e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    }
    function onPointerMove(e) {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        setDragging(true);
        el.setPointerCapture?.(e.pointerId);
      }
      if (moved) {
        e.preventDefault();
        el.scrollLeft = startScroll - dx;
      }
    }
    function onPointerUp(e) {
      if (!down) return;
      down = false;
      if (moved) {
        el.releasePointerCapture?.(e.pointerId);
        setDragging(false);
        // swallow the click fired right after a drag
        const block = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("click", block, { capture: true, once: true });
        setTimeout(() => el.removeEventListener("click", block, { capture: true }), 0);
      }
    }
    function onDragStart(e) {
      e.preventDefault(); // no native ghost image of links / logos
    }

    measure();
    el.addEventListener("scroll", measure, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("dragstart", onDragStart);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener("load", measure);

    return () => {
      el.removeEventListener("scroll", measure);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("dragstart", onDragStart);
      ro?.disconnect();
      window.removeEventListener("load", measure);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!autoplay || !el || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    let visible = false;
    let paused = false;
    let raf = 0;
    let last = 0;
    let pos = el.scrollLeft;
    let set = pos; // last value we wrote, to tell our scrolls from the visitor's
    let dir = 1;
    let holdUntil = 0;

    function tick(now) {
      raf = 0;
      if (!visible || paused) return;
      const dt = Math.min(64, now - (last || now));
      last = now;
      const max = el.scrollWidth - el.clientWidth;
      if (max > 2 && now >= holdUntil) {
        // the visitor moved the rail: continue from where it is now
        if (Math.abs(el.scrollLeft - Math.round(set)) > 2) pos = el.scrollLeft;
        pos += (dir * AUTO_SPEED * dt) / 1000;
        if (pos >= max) { pos = max; dir = -1; holdUntil = now + AUTO_PAUSE_AT_END; }
        else if (pos <= 0) { pos = 0; dir = 1; holdUntil = now + AUTO_PAUSE_AT_END; }
        set = pos;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    }
    function run() {
      if (!raf && visible && !paused) {
        last = 0;
        pos = el.scrollLeft;
        set = pos;
        raf = requestAnimationFrame(tick);
      }
    }
    const pause = () => { paused = true; };
    const resume = () => { paused = false; run(); };
    const onTouchEnd = () => { setTimeout(resume, 2500); };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [autoplay]);

  const classes = [
    className,
    state.scrollable && "is-scrollable",
    state.left && "can-left",
    state.right && "can-right",
    dragging && "is-dragging",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes} role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
