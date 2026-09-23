"use client";

// Staff profile sheet: a modal dialog that slides up from the bottom of the
// viewport and covers 70vh. Portalled to <body> so it sits above the
// page-shell / fixed-footer stacking (see the footer reveal effect).
//
// - Arrow buttons (and ←/→ keys, and horizontal swipes) move to the
//   previous / next profile of the list the directory is showing.
// - Esc, the close button or a click on the backdrop close it; focus is
//   trapped inside while open and page scrolling is locked.
// - Neighbouring portraits are preloaded so paging feels instant.
// - The component stays mounted through the closing slide-down: `shown`
//   keeps the last person on screen until the exit animation ends. Entry
//   and exit are CSS keyframe animations keyed off mount / .is-closing, so
//   no state has to be flipped from an effect to trigger them.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ARROW_RIGHT } from "./AboutIcons";

const CLOSE_MS = 450;

const ARROW_LEFT = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 4.5H2M5.6 1 2 4.5 5.6 8" />
  </svg>
);
const CROSS = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M2 2l10 10M12 2 2 12" />
  </svg>
);

export default function StaffSheet({ person, teamLabel, position, total, neighbours, onPrev, onNext, onClose }) {
  const meta = person ? { person, teamLabel, position, total } : null;
  const [shown, setShown] = useState(meta);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);

  // Follow the requested person as soon as it changes (adjusting state
  // during render, React's recommended alternative to a syncing effect)…
  if (meta && (meta.person !== shown?.person || meta.position !== shown?.position || meta.total !== shown?.total)) {
    setShown(meta);
  }

  // …but on close, keep the last one rendered until the exit animation
  // has played, then unmount.
  const closing = !person && Boolean(shown);
  useEffect(() => {
    if (!closing) return undefined;
    const timer = window.setTimeout(() => setShown(null), CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  // Scroll lock (compensating for the scrollbar so the page doesn't jump)
  // and initial focus while the sheet is open.
  const isOpen = Boolean(person);
  useEffect(() => {
    if (!isOpen) return undefined;
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const prev = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = prev.overflow;
      root.style.paddingRight = prev.paddingRight;
    };
  }, [isOpen]);

  // Preload the previous / next portraits.
  useEffect(() => {
    neighbours.forEach((n) => {
      if (!n) return;
      const img = new Image();
      img.src = n.photo;
    });
  }, [neighbours]);

  // `shown` is only ever set in the browser (after a click or a hash
  // match), so document is always available past this point.
  if (!shown) return null;

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onPrev();
    } else if (event.key === "Tab") {
      const focusables = dialogRef.current?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function onTouchStart(event) {
    touchX.current = event.touches[0].clientX;
  }
  function onTouchEnd(event) {
    if (touchX.current == null) return;
    const dx = event.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0) onNext();
    else onPrev();
  }

  const current = shown.person;
  const titleId = `st-sheet-title-${current.slug}`;

  return createPortal(
    <div className={`st-sheet${closing ? " is-closing" : ""}`}>
      <div className="st-sheet__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="st-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <span className="st-sheet__grip" aria-hidden="true" />

        <div className="st-sheet__bar">
          <p className="st-sheet__count">
            <b>{String(shown.position).padStart(2, "0")}</b>
            <span> / {String(shown.total).padStart(2, "0")}</span>
          </p>
          <div className="st-sheet__nav">
            <button type="button" className="ab-circle" onClick={onPrev} aria-label="Previous profile">
              {ARROW_LEFT}
            </button>
            <button type="button" className="ab-circle" onClick={onNext} aria-label="Next profile">
              {ARROW_RIGHT}
            </button>
            <button type="button" className="ab-circle st-sheet__close" onClick={onClose} aria-label="Close profile" ref={closeRef}>
              {CROSS}
            </button>
          </div>
        </div>

        <div className="st-sheet__body" key={current.slug}>
          <figure className="st-sheet__photo">
            <img src={current.photo} alt={`Portrait of ${current.name}`} />
          </figure>
          <div className="st-sheet__text" tabIndex={0}>
            <p className="eyebrow">{shown.teamLabel}</p>
            <h2 className="st-sheet__name" id={titleId}>
              {current.name}
            </h2>
            <p className="st-sheet__role">{current.role}</p>
            <div className="st-sheet__bio">
              {current.bio.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
