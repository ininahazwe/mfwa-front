// API: items: [{ name, href, logo }]
// A grid of external funding-partner logos — plain image tiles on the
// same soft ab-card background used across the About Us family, each
// opening the funder's own site.
import Reveal from "./Reveal";

export default function PartnerLogos({ items }) {
  return (
    <Reveal as="ul" className="ab-logos ab-stagger" stagger>
      {items.map((item) => (
        <li key={item.name}>
          <a className="ab-logo" href={item.href}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.logo} alt={item.name} loading="lazy" />
          </a>
        </li>
      ))}
    </Reveal>
  );
}
