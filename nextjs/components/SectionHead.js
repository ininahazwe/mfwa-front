// API: { eyebrow, title, text? } — text is a string or string[]
// Centered header — eyebrow + h2 + optional paragraph(s) — the same
// "Overview" block used to lead into a section on AboutStrategy and the
// Intern/Volunteer detail pages; pulled out here so the Partners pages can
// reuse it too instead of re-typing the same markup.
import Reveal from "./Reveal";

export default function SectionHead({ eyebrow, title, text }) {
  const paras = Array.isArray(text) ? text : text ? [text] : [];
  return (
    <Reveal as="header" className="ab-head ab-head--center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="ab-h2">{title}</h2>
      {paras.map((para) => (
        <p className="ab-head__text" key={para.slice(0, 40)}>
          {para}
        </p>
      ))}
    </Reveal>
  );
}
