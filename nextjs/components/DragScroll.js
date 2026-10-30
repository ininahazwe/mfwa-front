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

export default function DragScroll({ className = "", label, children }) {
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
