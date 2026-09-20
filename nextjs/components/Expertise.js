// API: expertise.pillars[] { icon, title, text, link }
import Reveal from "./Reveal";

const ICONS = {
  research: (
    <svg className="expertise__icon" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="13" r="9" />
      <path d="M19.5 19.5 27 27" />
    </svg>
  ),
  policy: (
    <svg className="expertise__icon" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14v4l4 1v-6z" />
      <path d="M7 13.2 22 7v14L7 14.8" />
      <path d="M9 19.5 10.5 26.5c.2 1 1.6 1 2 0L11.5 19" />
      <path d="M22 12.5c1.8.4 3 1.6 3 3s-1.2 2.6-3 3" />
    </svg>
  ),
  capacity: (
    <svg className="expertise__icon" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6 2 12l13 6 13-6z" />
      <path d="M8 15v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      <path d="M28 12v8" />
    </svg>
  ),
  innovation: (
    <svg className="expertise__icon" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="6" width="20" height="13" rx="1.2" />
      <path d="M2 23h26l-2.5-4h-21z" />
    </svg>
  ),
};

export default function Expertise({ data }) {
  return (
    <section className="expertise" id="expertise">
      <div className="expertise__inner">
        <Reveal as="div" className="expertise__intro">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="expertise__title">{data.title}</h2>
          <p className="expertise__text">{data.text}</p>
          <a className="expertise__link" href={data.link.href}>
            {data.link.label}
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
            </svg>
          </a>
        </Reveal>

        <Reveal as="div" className="expertise__grid" stagger>
          {data.items.map((item) => (
            <div className="expertise__item" key={item.icon}>
              {ICONS[item.icon]}
              <h3 className="expertise__heading">
                {item.headingLines[0]}
                <br />
                {item.headingLines[1]}
              </h3>
              <p className="expertise__desc">{item.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
