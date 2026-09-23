// API: about.strategy { eyebrow, title, objectives { label, title, items[] }, values { label, title, items[] } }
import Reveal from "./Reveal";
import Motif from "./Motif";

export default function AboutStrategy({ data }) {
  const { objectives, values } = data;
  return (
    <section className="ab-section ab-strategy" id="strategy">
      <div className="ab-wrap">
        <Reveal as="header" className="ab-head ab-head--center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="ab-h2">{data.title}</h2>
        </Reveal>

        <Reveal as="div" className="ab-split ab-stagger" stagger>
          <article className="ab-split__panel ab-split__panel--navy">
            <div className="ab-split__top">
              <p className="eyebrow">{objectives.label}</p>
              <Motif variant="orbit" className="ab-split__motif" />
            </div>
            <div className="ab-split__body">
              <h3 className="ab-split__title">{objectives.title}</h3>
              <ol className="ab-split__list">
                {objectives.items.map((item, i) => (
                  <li key={item}>
                    <span className="ab-num">{String(i + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </article>

          <article className="ab-split__panel ab-split__panel--red">
            <div className="ab-split__top">
              <p className="eyebrow">{values.label}</p>
              <Motif variant="broadcast" className="ab-split__motif" />
            </div>
            <div className="ab-split__body">
              <h3 className="ab-split__title">{values.title}</h3>
              <ul className="ab-split__chips">
                {values.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
