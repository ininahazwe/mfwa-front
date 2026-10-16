"use client";

import { useEffect, useRef, useState } from "react";

// API: item { label, href?, children: [{ label, href, external? }] } — one
// entry of getHeader().nav that carries `children` (see content.js; never
// more than 3 children, per the com team's "minimal dropdowns" note,
// 2026-10-16). Opens on hover, focus-within or click/tap (the chevron is a
// real <button>, so keyboard and touch work too — a mouse click only ever
// opens, since hover has usually opened it already), closes on Escape, on an
// outside click and when focus leaves the item. An item with an `href` (e.g.
// Publications) keeps its own link next to the chevron; one without (Data)
// is a single button.
const CHEVRON = (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 1l4 4 4-4" />
  </svg>
);

const EXTERNAL = (
  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 1h6v6M9 1 1 9" />
  </svg>
);

export default function NavDropdown({ item }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onDocPointer(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      className={`nav__item${open ? " is-open" : ""}`}
      ref={rootRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      {item.href ? (
        <>
          <a className="nav__link" href={item.href}>
            {item.label}
          </a>
          <button
            className="nav__caret"
            type="button"
            aria-expanded={open}
            aria-haspopup="true"
            aria-label={`${item.label} — more`}
            onClick={(e) => setOpen(e.nativeEvent.pointerType === "mouse" ? true : (v) => !v)}
          >
            {CHEVRON}
          </button>
        </>
      ) : (
        <button
          className="nav__link nav__toggle"
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={(e) => setOpen(e.nativeEvent.pointerType === "mouse" ? true : (v) => !v)}
        >
          {item.label}
          {CHEVRON}
        </button>
      )}

      <div className="nav__menu" hidden={!open}>
        <ul>
          {item.children.map((child) => (
            <li key={child.href}>
              <a
                href={child.href}
                {...(child.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {child.label}
                {child.external && EXTERNAL}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
