"use client";

// API: about.faq { eyebrow, title, contact { label, href }, items[] { q, a } }
// Accordion: one item open at a time, all closed by default. Answers stay
// in the DOM (collapsed via grid-template-rows 0fr → 1fr, then hidden with
// `visibility` once the collapse finishes so closed answers are out of the
// tab order and the accessibility tree).
//
// The left-hand heading goes sticky only while the question list is taller
// than 80vh (measured with a ResizeObserver, so opening an answer that
// pushes the list past the threshold switches it on live). It is toggled
// through a data attribute rather than className because Reveal adds
// "is-visible" to the element imperatively — a className change from React
// would wipe it.
import { useEffect, useId, useRef, useState } from "react";
import Reveal from "./Reveal";
import Motif from "./Motif";
import { PLUS, ARROW_RIGHT } from "./AboutIcons";

export default function AboutFaq({ data }) {
  const [open, setOpen] = useState(-1);
  const [sticky, setSticky] = useState(false);
  const baseId = useId();
  const sectionRef = useRef(null);

  useEffect(() => {
    const list = sectionRef.current?.querySelector(".ab-faq__list");
    if (!list) return undefined;

    function measure() {
      setSticky(list.offsetHeight > window.innerHeight * 0.8);
    }

    measure();
    window.addEventListener("resize", measure);
    if (!("ResizeObserver" in window)) return () => window.removeEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="ab-section ab-faq" id="faq" ref={sectionRef}>
      <div className="ab-wrap ab-aside-grid">
        <Reveal as="header" className="ab-aside-grid__head" data-sticky={sticky ? "true" : "false"}>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="ab-h2">{data.title}</h2>
          <a className="ab-link" href={data.contact.href}>
            {data.contact.label}
            {ARROW_RIGHT}
          </a>
          <Motif variant="quote" className="ab-aside-grid__motif" />
        </Reveal>

        <Reveal as="ul" className="ab-aside-grid__main ab-faq__list">
          {data.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li className={`ab-faq__item${isOpen ? " is-open" : ""}`} key={item.q}>
                <h3 className="ab-faq__q">
                  <button
                    type="button"
                    id={`${baseId}-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${baseId}-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <span className="ab-circle ab-faq__icon">{PLUS}</span>
                  </button>
                </h3>
                <div className="ab-faq__panel" id={`${baseId}-a-${i}`} role="region" aria-labelledby={`${baseId}-q-${i}`}>
                  <div className="ab-faq__inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
