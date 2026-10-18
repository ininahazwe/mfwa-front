"use client";

import { useEffect, useRef, useState } from "react";
import FadeImg from "./FadeImg";

// Mobile navigation (demande de Yv, 2026-10-17): below 1280px the desktop
// <nav> is hidden (globals.css), so this renders a burger button in the
// header's action row plus a full-width panel that drops under the header.
// (Breakpoint 1279px: the desktop nav + badge + actions don't fit below it.)
// It receives the same getHeader().nav the desktop nav uses, so both menus
// can never drift apart. Items with `children` become accordions: the
// label stays a link when it has an href (e.g. Publications → /reports),
// the chevron button opens its sub-list. Closes on Escape, on an outside
// tap, on any link tap and when the viewport grows back past 1279px; the
// page behind doesn't scroll while the panel is open.
const CHEVRON = (
  <svg width="12" height="7" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 1l4 4 4-4" />
  </svg>
);

const EXTERNAL = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 1h6v6M9 1 1 9" />
  </svg>
);

export default function MobileNav({ nav, donate, credential }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null); // label of the open accordion
  const rootRef = useRef(null);

  function close() {
    setOpen(false);
    setExpanded(null);
  }

  useEffect(() => {
    if (!open) return undefined;
    function onDocPointer(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    }
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    const mq = window.matchMedia("(min-width: 1280px)");
    function onMq(e) {
      if (e.matches) close();
    }
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="mobile-nav" ref={rootRef}>
      <button
        className="icon-btn mobile-nav__burger"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M5 5l12 12M17 5 5 17" /> : <path d="M3 6h16M3 11h16M3 16h16" />}
        </svg>
      </button>

      <nav className="mobile-nav__panel" id="mobile-nav-panel" aria-label="Menu principal (mobile)" hidden={!open}>
        <ul className="mobile-nav__list">
          {nav.map((item) => {
            if (!item.children) {
              return (
                <li key={item.href} className="mobile-nav__item">
                  <a className="mobile-nav__link" href={item.href} onClick={close}>
                    {item.label}
                  </a>
                </li>
              );
            }
            const isOpen = expanded === item.label;
            const subId = `mobile-sub-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return (
              <li key={item.label} className={`mobile-nav__item${isOpen ? " is-open" : ""}`}>
                <div className="mobile-nav__row">
                  {item.href ? (
                    <a className="mobile-nav__link" href={item.href} onClick={close}>
                      {item.label}
                    </a>
                  ) : (
                    <button
                      className="mobile-nav__link mobile-nav__link--button"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={subId}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                    >
                      {item.label}
                    </button>
                  )}
                  <button
                    className="mobile-nav__caret"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={subId}
                    aria-label={`${item.label} — more`}
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                  >
                    {CHEVRON}
                  </button>
                </div>
                <ul className="mobile-nav__sub" id={subId} hidden={!isOpen}>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <a
                        href={child.href}
                        onClick={close}
                        {...(child.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {child.label}
                        {child.external && EXTERNAL}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <div className="mobile-nav__foot">
          {donate && (
            <a className="btn btn--donate mobile-nav__donate" href={donate.href} onClick={close}>
              {donate.label}
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
              </svg>
            </a>
          )}
          {credential && (
            <span className="mobile-nav__credential" title={credential.caption}>
              <FadeImg
                className="mobile-nav__credential-img"
                src={credential.image.src}
                alt={credential.image.alt}
                removeOnError
              />
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}
