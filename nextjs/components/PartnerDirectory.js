// API: items: [{ id, country, name, text, href }]
// A grid of national-partner cards — same soft ab-card background as the
// rest of the About Us family, country as the tag, org name as the
// title, a one-line summary, and a link out to the partner's own page.
import Reveal from "./Reveal";
import { ARROW_RIGHT } from "./AboutIcons";

export default function PartnerDirectory({ items }) {
  return (
    <Reveal as="ul" className="ab-partners ab-stagger" stagger>
      {items.map((item) => (
        <li key={item.id}>
          <a className="ab-card ab-partner" href={item.href}>
            <span className="ab-tag">{item.country}</span>
            <span className="ab-card__title ab-card__title--sm">{item.name}</span>
            <span className="ab-card__text ab-partner__text">{item.text}</span>
            <span className="ab-network__arrow">{ARROW_RIGHT}</span>
          </a>
        </li>
      ))}
    </Reveal>
  );
}
