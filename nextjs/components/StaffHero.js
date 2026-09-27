// API: staff.hero { crumbs[], eyebrow, titleLines[], lede, primary, secondary }
// Same frame as AboutHero (copy left, right-hand grid slot) — the right
// side used to be a tile grid of team head-counts (still is on BoardHero,
// which shares the .ab-tiles/.st-tiles/.st-tile CSS below — left
// untouched there), but at Yv's call (2026-09-27) this one is now a
// single real staff photo instead: the per-team counts already live in
// StaffDirectory just below on this same page, so nothing is lost by
// dropping them from the hero. `teams` is no longer used here (still
// passed to StaffDirectory by app/about-us/our-staff/page.js).
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";
import { ARROW_RIGHT } from "./AboutIcons";

export default function StaffHero({ data }) {
  return (
    <section className="ab-hero">
      <div className="ab-wrap ab-hero__grid">
        <div className="ab-hero__copy">
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

        <Reveal as="div" className="ab-tiles st-photo">
          <FadeImg
            className="st-photo__img"
            src="/images/staff-image.jpg"
            alt="The MFWA team"
            removeOnError
          />
        </Reveal>
      </div>
    </section>
  );
}
