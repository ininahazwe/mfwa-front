// API: about.drives { eyebrow, title, text, cards[] { id, num, icon, title, text } }
// Mission / Vision / Strategic Goal — the statements the live site repeats
// across three pages, stated once here. Card header (number + line icon)
// mirrors the homepage's "What we do" items (Work.js).
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ICONS } from "./AboutIcons";

export default function AboutPillars({ data }) {
  return (
    <section className="ab-section ab-drives" id="drives">
      <div className="ab-wrap">
        <Reveal as="header" className="ab-head ab-head--split">
          <div>
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 className="ab-h2">{data.title}</h2>
            <p className="ab-head__text">{data.text}</p>
          </div>
          <Motif variant="halfspin" className="ab-head__motif" />
        </Reveal>

        <Reveal as="div" className="ab-drives__grid ab-stagger" stagger>
          {data.cards.map((card) => (
            <article className="ab-card ab-drive" key={card.id}>
              <div className="ab-drive__top">
                <span className="ab-num">{card.num}</span>
                <span className="ab-drive__icon">{ICONS[card.icon]}</span>
              </div>
              <h3 className="ab-card__title">{card.title}</h3>
              <p className="ab-card__text">{card.text}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
