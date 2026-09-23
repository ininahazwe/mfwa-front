// API: about.getInvolved { eyebrow, title, text, contact { label, href }, actions[] { num, label, desc, href } }
// Dark closing band, same treatment as the homepage's "Take action" CTA
// (Cta.js) so the page ends the way the homepage does, right above the
// footer.
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ARROW_RIGHT, ARROW_DIAGONAL } from "./AboutIcons";

export default function AboutGetInvolved({ data }) {
  return (
    <section className="ab-section ab-involve" id="get-involved">
      <div className="ab-wrap ab-aside-grid">
        <Reveal as="header" className="ab-aside-grid__head">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="ab-h2">{data.title}</h2>
          <p className="ab-head__text">{data.text}</p>
          <a className="ab-link" href={data.contact.href}>
            {data.contact.label}
            {ARROW_RIGHT}
          </a>
          <Motif variant="equalizer" className="ab-aside-grid__motif" />
        </Reveal>

        <Reveal as="ul" className="ab-aside-grid__main ab-involve__list ab-stagger" stagger>
          {data.actions.map((action) => (
            <li key={action.label}>
              <a className="ab-action" href={action.href}>
                <span className="ab-action__title">{action.label}</span>
                <span className="ab-action__arrow">{ARROW_DIAGONAL}</span>
                <span className="ab-num">{action.num}</span>
                <span className="ab-action__desc">{action.desc}</span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
