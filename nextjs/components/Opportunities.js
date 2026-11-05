// API: opportunities { eyebrow, titleLines[2], text, link { label, href },
//      items[] { link, tag[], heading, date } } — see getHomeOpportunities()
//
// « Latest opportunities » — homepage band right after « What we do »
// (at Yv's call): intro on the left, the 4 most recent opportunities
// (calls, fellowships, trainings, vacancies) as a list on the right, blue
// background, intro dressed like « Our expertise ». Each row: date block, "CATEGORY · COUNTRY", title, arrow.
import Reveal from "./Reveal";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

// "16 Oct 2026" (formatWpDate) → day "16" + "Oct 2026"
function splitDate(date) {
  const [day = "", ...rest] = String(date ?? "").split(" ");
  return { day, monthYear: rest.join(" ") };
}

export default function Opportunities({ data }) {
  return (
    <section className="opps" id="opportunities" aria-labelledby="opps-title">
      <div className="opps__inner">
        <Reveal as="div" className="opps__intro">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="opps__title" id="opps-title">
            {data.titleLines[0]}
            <br />
            <span className="opps__title-soft">{data.titleLines[1]}</span>
          </h2>
          <p className="opps__text">{data.text}</p>
          <a className="opps__link" href={data.link.href}>
            {data.link.label}
            {ARROW}
          </a>
        </Reveal>

        {data.items.length > 0 ? (
          <Reveal as="ul" className="opps__list" stagger>
            {data.items.map((item) => {
              const { day, monthYear } = splitDate(item.date);
              return (
                <li key={item.link}>
                  <a className="opps__item" href={item.link}>
                    <span className="opps__date" aria-label={item.date}>
                      <span className="opps__day">{day}</span>
                      <span className="opps__month">{monthYear}</span>
                    </span>
                    <span className="opps__body">
                      {item.tag.length > 0 && <span className="opps__tag">{item.tag.join(" · ")}</span>}
                      <span className="opps__heading">{item.heading}</span>
                    </span>
                    <span className="opps__go" aria-hidden="true">
                      {ARROW}
                    </span>
                  </a>
                </li>
              );
            })}
          </Reveal>
        ) : (
          <p className="opps__empty">Our opportunities are temporarily unavailable — please check back shortly.</p>
        )}
      </div>
    </section>
  );
}
