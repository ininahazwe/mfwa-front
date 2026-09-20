import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Latest from "@/components/Latest";
import Expertise from "@/components/Expertise";
import ImpactStats from "@/components/ImpactStats";
import ImpactHighlights from "@/components/ImpactHighlights";
import Reach from "@/components/Reach";
import Work from "@/components/Work";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

import { getHeader } from "@/lib/content";
import { getHero } from "@/lib/content";
import { getLatestStories } from "@/lib/content";
import { getExpertise } from "@/lib/content";
import { getImpactStats } from "@/lib/content";
import { getImpactHighlights } from "@/lib/content";
import { getReach } from "@/lib/content";
import { getWork } from "@/lib/content";
import { getCta } from "@/lib/content";
import { getFooter } from "@/lib/content";

// Note : la barre utilitaire (.utility-bar — badge NGOsource + switch EN/FR)
// est volontairement masquée sur le site statique actuel ; getUtilityBar()
// existe dans lib/content.js pour quand elle sera réactivée, mais n'est pas
// rendue ici.

export default async function Home() {
  const [
    header,
    hero,
    latest,
    expertise,
    impactStats,
    impactHighlights,
    reach,
    work,
    cta,
    footer,
  ] = await Promise.all([
    getHeader(),
    getHero(),
    getLatestStories(),
    getExpertise(),
    getImpactStats(),
    getImpactHighlights(),
    getReach(),
    getWork(),
    getCta(),
    getFooter(),
  ]);

  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu principal
      </a>

      <Header data={header} />

      <main id="main">
        <Hero data={hero} />
        <Latest data={latest} />
        <Expertise data={expertise} />
        <ImpactStats data={impactStats} />
        <ImpactHighlights data={impactHighlights} />
        <Reach data={reach} />
        <Work data={work} />
        <Cta data={cta} />
      </main>

      <Footer data={footer} />
    </>
  );
}
