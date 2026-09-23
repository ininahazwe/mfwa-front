"use client";

// API: staff.directory { eyebrow, title, text, people[] }, staff.teams[]
//
// Filterable portrait grid + profile sheet. The filter bar reuses the
// homepage's .topics pills (Latest.js) so both pages filter the same way.
// Choosing a portrait opens StaffSheet, a bottom sheet covering 70vh;
// prev/next walk through whichever list is currently filtered. The open
// profile is mirrored in the URL hash (#abigail-larbi-odei) so a profile
// can be linked to directly, and reopened on load.
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import StaffSheet from "./StaffSheet";

export default function StaffDirectory({ data, teams }) {
  const teamLabel = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t.label])), [teams]);

  const [team, setTeam] = useState("all");
  const [openSlug, setOpenSlug] = useState(null);
  const lastTrigger = useRef(null);

  const people = useMemo(
    () => (team === "all" ? data.people : data.people.filter((p) => p.team === team)),
    [team, data.people]
  );

  // Open from the URL hash on load (and on manual hash edits).
  useEffect(() => {
    function fromHash() {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      if (data.people.some((p) => p.slug === slug)) setOpenSlug(slug);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [data.people]);

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

  // The sheet navigates within the filtered list; if the open person isn't
  // in it (e.g. opened from a hash while another filter is active) fall
  // back to the full list.
  const list = people.some((p) => p.slug === openSlug) ? people : data.people;
  const index = list.findIndex((p) => p.slug === openSlug);

  const go = useCallback(
    (step) => {
      if (index < 0) return;
      const next = list[(index + step + list.length) % list.length];
      setOpenSlug(next.slug);
      window.history.replaceState(null, "", `#${next.slug}`);
    },
    [index, list]
  );

  return (
    <section className="ab-section st-directory" id="team">
      <div className="ab-wrap">
        <Reveal as="header" className="ab-head ab-head--split">
          <div>
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 className="ab-h2">{data.title}</h2>
            <p className="ab-head__text">{data.text}</p>
          </div>
          <p className="st-count" aria-live="polite">
            <b>{people.length}</b> {people.length === 1 ? "person" : "people"}
          </p>
        </Reveal>

        <nav className="topics st-topics" aria-label="Filter staff by team">
          {teams.map((t, i) => (
            <Fragment key={t.id}>
              {i > 0 && (
                <span className="topics__sep" aria-hidden="true">
                  ·
                </span>
              )}
              <button
                type="button"
                className={`topics__item${team === t.id ? " is-active" : ""}`}
                aria-pressed={team === t.id}
                onClick={() => setTeam(t.id)}
              >
                {i === 0 && <span className="topics__dot" aria-hidden="true" />}
                {t.label}
                <span className="st-topics__n">{t.count}</span>
              </button>
            </Fragment>
          ))}
        </nav>

        <ul className="st-grid" key={team}>
          {people.map((person, i) => (
            <li className="st-grid__item" key={person.slug} style={{ "--i": Math.min(i, 12) }}>
              <button
                type="button"
                className="st-card"
                onClick={(e) => open(person.slug, e.currentTarget)}
                aria-haspopup="dialog"
              >
                <span className="st-card__media">
                  <img src={person.thumb} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="ab-tag st-card__team">{teamLabel[person.team]}</span>
                <span className="st-card__name">{person.name}</span>
                <span className="st-card__role">{person.role}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <StaffSheet
        person={index >= 0 ? list[index] : null}
        teamLabel={index >= 0 ? teamLabel[list[index].team] : ""}
        position={index + 1}
        total={list.length}
        neighbours={index >= 0 ? [list[(index - 1 + list.length) % list.length], list[(index + 1) % list.length]] : []}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onClose={close}
      />
    </section>
  );
}
