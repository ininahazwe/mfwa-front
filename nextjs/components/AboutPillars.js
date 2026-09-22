"use client";

// API: about.pillars { eyebrow, title, text, tabs[] } — each tab is either
// kind:"statement" (heading + body) or kind:"list" (heading + intro? +
// items[], optionally `ordered`). See getAboutUs() in lib/content.js.
//
// Interaction pattern deliberately mirrors Latest.js's .topics filter
// (button list with is-active / aria-current, same underline-reveal
// language as .nav__link) rather than inventing a new one — dressed up as
// a proper ARIA tablist since here the buttons swap content instead of
// filtering a grid in place. The sliding underline's position/width is
// measured off the active button's own box (offsetLeft/offsetWidth,
// .pillar-tabs is its offsetParent) rather than guessed from CSS alone,
// since the five labels are different widths — same measure-then-publish
// approach as useFooterReveal() in lib/hooks.js, just kept local here
// since (like Latest.js's topic filter) it's page-specific interactivity
// rather than a ported main.js behaviour.
import { useEffect, useId, useRef, useState } from "react";
import Reveal from "./Reveal";

export default function AboutPillars({ data }) {
  const [activeId, setActiveId] = useState(data.tabs[0]?.id);
  const activeIndex = Math.max(0, data.tabs.findIndex((tab) => tab.id === activeId));
  const active = data.tabs[activeIndex] ?? data.tabs[0];
  const baseId = useId();
  const tabsRef = useRef(null);
  const indicatorRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    const tabsEl = tabsRef.current;
    const indicator = indicatorRef.current;
    if (!tabsEl || !indicator) return undefined;

    function place() {
      const btn = tabRefs.current[activeIndex];
      if (!btn) return;
      indicator.style.width = `${btn.offsetWidth}px`;
      indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
    }

    place();

    if (!("ResizeObserver" in window)) {
      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    }
    const observer = new ResizeObserver(place);
    observer.observe(tabsEl);
    return () => observer.disconnect();
  }, [activeIndex]);

  function focusTab(index) {
    const wrapped = (index + data.tabs.length) % data.tabs.length;
    setActiveId(data.tabs[wrapped].id);
    tabRefs.current[wrapped]?.focus();
  }

  function onKeyDown(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusTab(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusTab(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(data.tabs.length - 1);
    }
  }

  return (
    <section className="about-pillars" id="pillars">
      <Reveal as="div" className="about-pillars__head">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 className="about-pillars__title">{data.title}</h2>
        <p className="about-pillars__text">{data.text}</p>
      </Reveal>

      <Reveal as="div" className="about-pillars__body">
        <div className="pillar-tabs" role="tablist" aria-label={data.title} ref={tabsRef} onKeyDown={onKeyDown}>
          {data.tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${tab.id}`}
              className={`pillar-tabs__item${tab.id === activeId ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={tab.id === activeId}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={tab.id === activeId ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <span className="pillar-tabs__indicator" ref={indicatorRef} aria-hidden="true" />
        </div>

        <div
          key={active.id}
          id={`${baseId}-panel-${active.id}`}
          className="pillar-panel"
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.id}`}
          tabIndex={0}
        >
          <h3 className="pillar-panel__heading">{active.heading}</h3>
          {active.kind === "list" ? (
            <>
              {active.intro && <p className="pillar-panel__intro">{active.intro}</p>}
              {active.ordered ? (
                <ol className="pillar-panel__list pillar-panel__list--ordered">
                  {active.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              ) : (
                <ul className="pillar-panel__list">
                  {active.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="pillar-panel__body">{active.body}</p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
