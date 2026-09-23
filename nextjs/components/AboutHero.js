// API: about.hero { eyebrow, titleLines[], lede, primary, secondary }
// The right-hand composition is a 3×3 grid of square tiles, each holding
// one flat animated piece of journalism iconography (components/Motif.js)
// — decorative only.
import Reveal from "./Reveal";
import Motif from "./Motif";
import { ARROW_RIGHT } from "./AboutIcons";

const TILES = [
  { variant: "mic", tone: "pale" },
  { variant: "camera", tone: "white" },
  { variant: "newspaper", tone: "white" },
  { variant: "pen", tone: "white" },
  { variant: "press", tone: "dark" },
  { variant: "tower", tone: "pale" },
  { variant: "megaphone", tone: "pale" },
  { variant: "search", tone: "white" },
  { variant: "video", tone: "red" },
];

export default function AboutHero({ data }) {
  return (
    <section className="ab-hero">
      <div className="ab-wrap ab-hero__grid">
        <div className="ab-hero__copy">
          <p className="eyebrow">{data.eyebrow}</p>

          <Reveal as="h1" className="ab-hero__title ab-stagger" stagger>
            {data.titleLines.map((line) => (
              <span className="ab-hero__line" key={line}>
                {line}{" "}
              </span>
            ))}
          </Reveal>

          <Reveal as="div" className="ab-hero__foot">
            <p className="ab-hero__lede">{data.lede}</p>
            <div className="ab-hero__actions">
              <a className="btn btn--cta" href={data.primary.href}>
                {data.primary.label}
                {ARROW_RIGHT}
              </a>
              <a className="ab-link" href={data.secondary.href}>
                {data.secondary.label}
                {ARROW_RIGHT}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal as="div" className="ab-tiles ab-stagger" stagger aria-hidden="true">
          {TILES.map((tile) => (
            <div className={`ab-tile ab-tile--${tile.tone}`} key={tile.variant}>
              <Motif variant={tile.variant} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
