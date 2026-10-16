// API: programme.reports { eyebrow, title, text, cta { label, href } }
// "Reports from this programme" strip (retours équipe com #11, 2026-10-16):
// the live site files its reports under the programme they belong to, so
// each programme page that has one deep-links into /reports on the matching
// grouping (see ReportsGrid's `initialCategory`).
import Reveal from "./Reveal";
import { ARROW_RIGHT } from "./AboutIcons";

export default function ProgrammeReports({ data }) {
  return (
    <section className="ab-section ab-prog-reports" id="reports">
      <div className="ab-wrap">
        <Reveal as="div" className="ab-prog-reports__panel">
          <div className="ab-prog-reports__copy">
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 className="ab-h2 ab-h2--sm">{data.title}</h2>
            <p className="ab-prog-reports__text">{data.text}</p>
          </div>
          <a className="ab-prog-reports__link" href={data.cta.href}>
            {data.cta.label}
            {ARROW_RIGHT}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
