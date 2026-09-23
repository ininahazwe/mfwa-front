// API: { id?, eyebrow, title, panels[] }
//   panel: { id, tone, motif, eyebrow, title, text?, chips?|items?, link? }
// Full-width pastel split, same frame as AboutStrategy's two panels — used
// both as the Get Involved hub's "two ways to join" teaser (each panel
// linking out to its own page) and, on the Intern/Volunteer detail pages,
// as the specifics section (no link needed, since it's already the detail
// page).
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ARROW_RIGHT } from "./AboutIcons";

export default function InvolvedWays({ data }) {
  return (
    <section className="ab-section ab-strategy" id={data.id || "ways"}>
      <div className="ab-wrap">
        <Reveal as="header" className="ab-head ab-head--center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="ab-h2">{data.title}</h2>
        </Reveal>

        <Reveal as="div" className="ab-split ab-stagger" stagger>
          {data.panels.map((panel) => (
            <article className={`ab-split__panel ab-split__panel--${panel.tone}`} key={panel.id}>
              <div className="ab-split__top">
                <p className="eyebrow">{panel.eyebrow}</p>
                <Motif variant={panel.motif} className="ab-split__motif" />
              </div>
              <div className="ab-split__body">
                <h3 className="ab-split__title">{panel.title}</h3>
                <p className="ab-split__text">{panel.text}</p>

                {panel.chips && (
                  <ul className="ab-split__chips">
                    {panel.chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                )}
                {panel.items && (
                  <ol className="ab-split__list">
                    {panel.items.map((item, i) => (
                      <li key={item}>
                        <span className="ab-num">{String(i + 1).padStart(2, "0")}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {panel.link && (
                  <a className="ab-link" href={panel.link.href}>
                    {panel.link.label}
                    {ARROW_RIGHT}
                  </a>
                )}
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
