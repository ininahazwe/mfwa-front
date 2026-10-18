"use client";

// API: board.directory { eyebrow, title, text, people[] }
//
// Portrait grid + profile sheet — reuses StaffSheet as-is: its `person`
// shape (slug/name/role/photo/bio) already matches board data. Six board
// members don't need a filter bar, so unlike StaffDirectory this always
// browses the full list; the open profile is still mirrored in the URL
// hash so a member can be linked to directly, e.g. #sophie-ly-sow.
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import StaffSheet from "./StaffSheet";

export default function BoardDirectory({ data }) {
  const people = data.people;
  const [openSlug, setOpenSlug] = useState(null);
  const lastTrigger = useRef(null);

  // Open from the URL hash on load (and on manual hash edits).
  useEffect(() => {
    function fromHash() {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      if (people.some((p) => p.slug === slug)) setOpenSlug(slug);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [people]);

  const open = useCallback((slug, trigger) => {
    lastTrigger.current = trigger ?? null;
    setOpenSlug(slug);
    window.history.replaceState(null, "", `#${slug}`);
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    // Return focus to the portrait that opened the sheet.
    const trigger = lastTrigger.current;
    if (trigger) window.requestAnimationFrame(() => trigger.focus());
  }, []);

  const index = people.findIndex((p) => p.slug === openSlug);
  const go = useCallback(
    (step) => {
      if (index < 0) return;
      const next = people[(index + step + people.length) % people.length];
      setOpenSlug(next.slug);
      window.history.replaceState(null, "", `#${next.slug}`);
    },
    [index, people]
  );

  return (
    <section className="ab-section st-directory" id="board">
      <div className="ab-wrap">
        <Reveal as="header" className="ab-head ab-head--split">
          <div>
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 className="ab-h2">{data.title}</h2>
            <p className="ab-head__text">{data.text}</p>
          </div>
          <p className="st-count">
            <b>{people.length}</b> {people.length === 1 ? "person" : "people"}
          </p>
        </Reveal>

        <ul className="st-grid">
          {people.map((person, i) => (
            <li className="st-grid__item" key={person.slug} style={{ "--i": i }}>
              <button
                type="button"
                className="st-card"
                onClick={(e) => open(person.slug, e.currentTarget)}
                aria-haspopup="dialog"
              >
                <span className="st-card__media">
                  <img src={person.thumb} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="ab-tag st-card__team">{person.role}</span>
                <span className="st-card__name">{person.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <StaffSheet
        person={index >= 0 ? people[index] : null}
        teamLabel={index >= 0 ? people[index].role : ""}
        position={index + 1}
        total={people.length}
        neighbours={
          index >= 0
            ? [people[(index - 1 + people.length) % people.length], people[(index + 1) % people.length]]
            : []
        }
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onClose={close}
      />
    </section>
  );
}
