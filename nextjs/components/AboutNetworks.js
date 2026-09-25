// API: about.networks { eyebrow, title, text, all { label, href }, href?,
//   items[] { name, scope, desc, href?, id? } }
// Each card links to its own item.href when given (the real Our Networks
// directory page), falling back to the shared data.href (used by the
// About Us hub, where every card points to the same teaser page). An
// item.id, when given, anchors the card so another page can deep-link
// to it.
import Reveal from "./Reveal";
import { ICONS, ARROW_RIGHT } from "./AboutIcons";

export default function AboutNetworks({ data }) {
  return (
    <section className="ab-section ab-networks" id="networks">
      <div className="ab-wrap">
        <Reveal as="header" className="ab-head ab-head--split">
          <div>
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 className="ab-h2">{data.title}</h2>
            <p className="ab-head__text">{data.text}</p>
          </div>
          <a className="ab-all" href={data.all.href}>
            <span>{data.all.label}</span>
            {ARROW_RIGHT}
          </a>
        </Reveal>

        <Reveal as="ul" className="ab-networks__grid ab-stagger" stagger>
          {data.items.map((item) => (
            <li key={item.name} id={item.id}>
              <a className="ab-card ab-network" href={item.href || data.href}>
                <span className="ab-network__top">
                  <span className="ab-tag">{item.scope}</span>
                  <span className="ab-network__icon">{ICONS.globe}</span>
                </span>
                <span className="ab-card__title">{item.name}</span>
                <span className="ab-card__text">{item.desc}</span>
                <span className="ab-network__arrow">{ARROW_RIGHT}</span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
