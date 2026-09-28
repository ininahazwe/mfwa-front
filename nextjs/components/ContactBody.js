// API: contact.cards[] { id, icon, title, lines?[], links?[]{ label, href } }
// Three plain info cards (address / telephone / email) — no form, see the
// note atop getContactPage() (lib/content.js) for why. Reuses the same
// .ab-card/.ab-circle/.ab-card__title building blocks AboutPillars.js
// already uses for its own icon cards, just in a dedicated 3-up grid
// sized for short content instead of .ab-drives__grid's taller ones.
import Reveal from "./Reveal";
import { ICONS } from "./AboutIcons";

export default function ContactBody({ data }) {
  return (
    <section className="ab-section contact-body">
      <div className="ab-wrap">
        <Reveal as="div" className="contact-cards ab-stagger" stagger>
          {data.cards.map((card) => (
            <article className="ab-card" key={card.id}>
              <span className="ab-circle">{ICONS[card.icon]}</span>
              <h2 className="ab-card__title">{card.title}</h2>
              <p className="ab-card__text">
                {card.lines &&
                  card.lines.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < card.lines.length - 1 && <br />}
                    </span>
                  ))}
                {card.links &&
                  card.links.map((link, i) => (
                    <span key={link.href}>
                      <a href={link.href}>{link.label}</a>
                      {i < card.links.length - 1 && " | "}
                    </span>
                  ))}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
