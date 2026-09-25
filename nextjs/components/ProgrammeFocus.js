// API: { eyebrow, title, motif?, contact? { label, href },
//   items: [ string | { label, href } ], initiatives?: [{ name, href }] }
// A programme page's focus-area list, laid out as the same asymmetric
// aside-grid used by AboutFaq/AboutGetInvolved — a left-hand header (with
// its own motif and an optional link) beside the list on the right —
// instead of a centered header over a narrow list. That centered layout
// left a wide empty margin on either side under this page's tile-filled
// hero; the aside-grid keeps the page feeling equally full top to bottom.
// A plain string item renders as text; an { label, href } renders as a
// link (some programmes' focus areas point to the matching article
// category). The optional initiatives list adds a few external links to
// in-house projects the programme runs.
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ARROW_RIGHT, ARROW_DIAGONAL } from "./AboutIcons";

export default function ProgrammeFocus({ data }) {
  return (
    <section className="ab-section ab-focus" id="focus">
      <div className="ab-wrap ab-aside-grid">
        <Reveal as="header" className="ab-aside-grid__head">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="ab-h2">{data.title}</h2>
          {data.contact && (
            <a className="ab-link" href={data.contact.href}>
              {data.contact.label}
              {ARROW_RIGHT}
            </a>
          )}
          <Motif variant={data.motif || "dots"} className="ab-aside-grid__motif" />
        </Reveal>

        <div className="ab-aside-grid__main">
          <Reveal as="ol" className="ab-split__list ab-focus__list">
            {data.items.map((item, i) => {
              const isLink = typeof item === "object";
              const text = isLink ? item.label : item;
              return (
                <li key={text}>
                  <span className="ab-num">{String(i + 1).padStart(2, "0")}</span>
                  {isLink ? <a href={item.href}>{text}</a> : <span>{text}</span>}
                </li>
              );
            })}
          </Reveal>

          {data.initiatives && (
            <div className="ab-focus__initiatives">
              <p className="ab-focus__initiatives-label">In-house initiatives</p>
              <ul>
                {data.initiatives.map((init) => (
                  <li key={init.name}>
                    <a className="ab-link" href={init.href}>
                      {init.name}
                      {ARROW_DIAGONAL}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
