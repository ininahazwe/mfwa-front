// API: { id?, eyebrow, title, text, items: [{ id, name, scope, desc, href }] }
// A hub page's own "explore" grid — the same card styling as
// AboutNetworks' cards (ab-networks__grid / ab-network): a centered
// header, then a grid of cards linking down into the hub's own
// sub-pages. No "see all" link, since this page already is the top of
// that hierarchy. Used by both the Our Partners hub and the Programmes
// hub.
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { ICONS, ARROW_RIGHT } from "./AboutIcons";

export default function CardNav({ data }) {
  return (
    <section className="ab-section" id={data.id || "explore"}>
      <div className="ab-wrap">
        <SectionHead eyebrow={data.eyebrow} title={data.title} text={data.text} />

        <Reveal as="ul" className="ab-networks__grid ab-stagger" stagger>
          {data.items.map((item) => (
            <li key={item.id}>
              <a className="ab-card ab-network" href={item.href}>
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
