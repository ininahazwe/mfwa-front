// API: shared shape for the Intern and Volunteer detail pages —
//   { overview: { eyebrow, title },
//     intro: string[],
//     split: { id?, eyebrow, title, panels[] }        (see InvolvedWays),
//     involve: { eyebrow, title, text, contact, actions[] } (see AboutGetInvolved) }
// Rather than one narrow prose column padded out with a decorative icon,
// this follows the same rhythm as the About Us page itself: a centered
// overview header (as on AboutStrategy), a full-width pastel split for
// the specifics (reusing InvolvedWays, same as the hub's own teaser), and
// the same dark closing band the other About Us pages use to invite the
// next action (reusing AboutGetInvolved with a single action).
import Reveal from "./Reveal";
import InvolvedWays from "./InvolvedWays";
import AboutGetInvolved from "./AboutGetInvolved";

export default function InvolvedBody({ data }) {
  return (
    <>
      <section className="ab-section" id="overview">
        <div className="ab-wrap">
          <Reveal as="header" className="ab-head ab-head--center">
            <p className="eyebrow">{data.overview.eyebrow}</p>
            <h2 className="ab-h2">{data.overview.title}</h2>
            {data.intro.map((para) => (
              <p className="ab-head__text" key={para.slice(0, 40)}>
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <InvolvedWays data={data.split} />
      <AboutGetInvolved data={data.involve} />
    </>
  );
}
