// API: about.networks { eyebrow, title, text, all { label, href }, href, items[] { name, scope, desc } }
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
            <li key={item.name}>
              <a className="ab-card ab-network" href={data.href}>
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
