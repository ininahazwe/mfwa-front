// API: about.people { eyebrow, title, text, rows[] { icon, label, count, text, href, linkLabel } }
// Staff/Board have no local routes yet, so — like Reach.js's country
// links — each row links to the matching live mfwa.org page.
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";
import Motif from "./Motif";
import { ICONS, ARROW_RIGHT } from "./AboutIcons";

export default function AboutPeople({ data }) {
  return (
    <section className="ab-section ab-people" id="people">
      <div className="ab-wrap ab-aside-grid">
        <Reveal as="header" className="ab-aside-grid__head">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="ab-h2">{data.title}</h2>
          <p className="ab-head__text">{data.text}</p>
          <Motif variant="orbit" className="ab-aside-grid__motif" />
        </Reveal>

        <Reveal as="ul" className="ab-aside-grid__main ab-people__rows ab-stagger" stagger>
          {data.rows.map((row) => (
            <li key={row.label}>
              <a className="ab-row" href={row.href}>
                <span className="ab-circle">{ICONS[row.icon]}</span>
                <span className="ab-row__body">
                  <StatCounter className="ab-row__num" count={row.count} />
                  <span className="ab-row__label">{row.label}</span>
                  <span className="ab-row__text">{row.text}</span>
                  <span className="ab-link">
                    {row.linkLabel}
                    {ARROW_RIGHT}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
