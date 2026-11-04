// "Latest opportunities" — homepage, between "What we do" and "Our expertise"
// (2026-10-30, at Yv's call).
// API: opportunities { eyebrow, title, text, viewAll { label, href },
//      items[] { id, link, heading, date ("DD Mon YYYY"), tag[] } } — the 4
//      most recent WordPress opportunities, see getHomeOpportunities().
// Deliberately NOT image cards (the format of "What's happening" and
// "Impact stories"): a navy band with the intro on the left and a dated
// list on the right — date block, type · country, title, arrow.
// Rendered only when there is at least one opportunity to show.
import Reveal from "./Reveal";

const ARROW = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
  </svg>
);

function DateBlock({ date }) {
  const [day, month, year] = String(date || "").split(" ");
  if (!day || !month) return <span className="opps__date" aria-hidden="true" />;
  return (
    <span className="opps__date" aria-hidden="true">
      <span className="opps__day">{day}</span>
      <span className="opps__month">
        {month} {year}
      </span>
    </span>
  );
}

export default function HomeOpportunities({ data }) {
  if (!data?.items?.length) return null;
  return (
    <section className="opps" id="opportunities" aria-labelledby="opps-title">
      <div className="opps__inner">
        <Reveal as="div" className="opps__intro">
          <h2 className="opps__title" id="opps-title">
            {data.titleLines ? (
              <>
                {data.titleLines[0]}
                <br />
                <span className="title-soft">{data.titleLines[1]}</span>
              </>
            ) : (
              data.title
            )}
          </h2>
          <p className="opps__text">{data.text}</p>
          <a className="opps__all" href={data.viewAll.href}>
            {data.viewAll.label}
            {ARROW}
          </a>
        </Reveal>

        <Reveal as="ol" className="opps__list" stagger>
          {data.items.map((item) => (
            <li className="opps__item" key={item.id ?? item.link}>
              <a className="opps__link" href={item.link}>
                <DateBlock date={item.date} />
                <span className="opps__body">
                  {item.tag?.length > 0 && <span className="opps__tag">{item.tag.join(" · ")}</span>}
                  <span className="opps__heading">{item.heading}</span>
                  <span className="visually-hidden">, published {item.date}</span>
                </span>
                <span className="opps__go">{ARROW}</span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
