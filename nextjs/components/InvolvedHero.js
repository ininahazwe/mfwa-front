"use client";

// API: involved.hero { crumbs[], eyebrow, titleLines[], lede, primary, secondary }
//      tiles? [] { id, label, variant, tone, href } — omit for a lighter,
//      full-width hero (the Intern/Volunteer detail pages); pass it for a
//      tile grid of clickable ways to get involved (the hub page).
// "use client" (2026-09-30): needed for the useParallax() ref below, which
// powers the decorative blob behind the tiles on programme pages (see
// .ab-hero__blob* in globals.css) — this file has no server-only work of
// its own, so the switch is a no-op for everything except that blob.
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ARROW_RIGHT } from "./AboutIcons";
import { useParallax } from "../lib/hooks";

export default function InvolvedHero({ data, tiles, tone }) {
  const blobRef = useParallax(0.15);
  return (
    <section className="ab-wrap">
      {/*<section className={`ab-hero${tone ? ` ab-hero--${tone}` : ""}`}>*/}
      <div className="ab-wrap ab-hero__grid">
        <div className={`ab-hero__copy${tiles ? "" : " ab-hero__copy--wide"}`}>
          <nav className="ab-crumbs" aria-label="Fil d’Ariane">
            {data.crumbs.map((crumb, i) =>
              crumb.href ? (
                <a key={crumb.label} href={crumb.href}>
                  {crumb.label}
                </a>
              ) : (
                <span key={crumb.label} aria-current="page">
                  {i > 0 && <i aria-hidden="true">/</i>}
                  {crumb.label}
                </span>
              )
            )}
          </nav>

          <p className="eyebrow">{data.eyebrow}</p>

          <Reveal as="h1" className="ab-hero__title ab-stagger" stagger>
            {data.titleLines.map((line) => (
              <span className="ab-hero__line" key={line}>
                {line}{" "}
              </span>
            ))}
          </Reveal>

          <Reveal as="div" className="ab-hero__foot">
            <p className="ab-hero__lede">{data.lede}</p>
            <div className="ab-hero__actions">
              <a className="btn btn--cta" href={data.primary.href}>
                {data.primary.label}
                {ARROW_RIGHT}
              </a>
              <a className="ab-link" href={data.secondary.href}>
                {data.secondary.label}
                {ARROW_RIGHT}
              </a>
            </div>
          </Reveal>
        </div>

        {tiles && (
          <div className="ab-hero__tiles-slot">
            {/* Decorative colour-blob behind the tiles (2026-09-30, at
                Yv's call): only on programme pages that pass a "tone"
                (the hub itself represents all 5 programmes at once, so it
                gets no single blob colour — unchanged, exactly as
                before). Sits as a sibling of the tile <ul>, not a child of
                it, specifically so it never picks up the
                [data-reveal="stagger"] fade/slide transition that applies
                to the ul's own direct children — its position is driven
                entirely by useParallax() instead. Revert: delete this
                block and the wrapping <div className="ab-hero__tiles-slot">
                (unwrap the <Reveal> back to being tiles' direct parent),
                drop useParallax()/blobRef above, and the three
                .ab-hero__tiles-slot / .ab-hero__blob* rules in
                globals.css. */}
            {tone && <div ref={blobRef} className={`ab-hero__blob ab-hero__blob--${tone}`} aria-hidden="true" />}
            <Reveal as="ul" className="ab-tiles st-tiles ab-stagger" stagger aria-label="Ways to get involved">
              {tiles.map((tile) => (
                <li key={tile.id}>
                  <a className={`ab-tile ab-tile--${tile.tone} st-tile ab-tile--link`} href={tile.href}>
                    <Motif variant={tile.variant} className="st-tile__motif" />
                    <span className="st-tile__label">{tile.label}</span>
                  </a>
                </li>
              ))}
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
