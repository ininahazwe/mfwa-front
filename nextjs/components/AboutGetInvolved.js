// API: about.getInvolved { eyebrow, title, text, actions[] { label, desc,
// href }, contact { label, href } }
import Reveal from "./Reveal";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

export default function AboutGetInvolved({ data }) {
  return (
    <section className="about-cta" id="get-involved">
      <Reveal as="div" className="about-cta__head">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 className="about-cta__title">{data.title}</h2>
        <p className="about-cta__text">{data.text}</p>
      </Reveal>

      <Reveal as="div" className="about-cta__grid" stagger>
        {data.actions.map((action) => (
          <a className="about-cta__card" href={action.href} key={action.label}>
            <span className="about-cta__card-label">
              {action.label}
              {ARROW}
            </span>
            <span className="about-cta__card-desc">{action.desc}</span>
          </a>
        ))}
      </Reveal>

      <p className="about-cta__contact">
        Partnership or collaboration enquiries:{" "}
        <a href={data.contact.href}>{data.contact.label}</a>
      </p>
    </section>
  );
}
