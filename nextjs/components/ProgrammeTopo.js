// Contour lines of a programme page's hero (2026-10-22). Server component:
// picks the relief of the programme from its tone (lib/pageTopo.js) and hands
// it to <HeroTopo>; only that relief travels to the browser. The line colour
// comes from the tone (.hero-topo--<tone> in globals.css).
import HeroTopo from "./HeroTopo";
import { PAGE_TOPO } from "../lib/pageTopo";

export default function ProgrammeTopo({ tone }) {
  const relief = PAGE_TOPO[tone];
  if (!relief) return null;
  return <HeroTopo {...relief} host=".ab-hero" className={`hero-topo--page hero-topo--tone hero-topo--${tone}`} />;
}
