"use client";

import { useEffect, useRef, useState } from "react";

// Site-wide search (retours équipe com #13, 2026-10-16). The magnifier in
// the header (every page renders <Header>) opens a small popover with a
// plain GET form to /search?q=… — no client-side fetching, so it works
// without JS once the page has loaded and the results page (app/search)
// is an ordinary server-rendered page. Escape / outside click closes it.
export default function HeaderSearch({ label }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
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
    <div className="header-search" ref={rootRef}>
      <button
        className="icon-btn"
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls="site-search"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="8.6" cy="8.6" r="6.2" />
          <path d="M13.2 13.2 18 18" />
        </svg>
      </button>

      <form className="header-search__panel" id="site-search" role="search" action="/search" method="get" hidden={!open}>
        <label className="header-search__label" htmlFor="site-search-input">
          Search MFWA
        </label>
        <div className="header-search__row">
          <input
            ref={inputRef}
            id="site-search-input"
            className="header-search__input"
            type="search"
            name="q"
            placeholder="Stories, reports, countries, programmes…"
            autoComplete="off"
            required
          />
          <button className="header-search__submit" type="submit">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
