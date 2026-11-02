import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Latest from "@/components/Latest";
import KeyStats from "@/components/KeyStats";
import Expertise from "@/components/Expertise";
import ImpactStats, { FundersSection } from "@/components/ImpactStats";
import ImpactHighlights from "@/components/ImpactHighlights";
import Reach from "@/components/Reach";
import Work from "@/components/Work";
import HomeOpportunities from "@/components/HomeOpportunities";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

import { getHeader } from "@/lib/content";
import { getHero } from "@/lib/content";
import { getLatestStories } from "@/lib/content";
import { getKeyStats } from "@/lib/content";
import { getExpertise } from "@/lib/content";
import { getImpactStats } from "@/lib/content";
import { getImpactHighlights } from "@/lib/content";
import { getReach } from "@/lib/content";
import { getWork } from "@/lib/content";
import { getHomeOpportunities } from "@/lib/content";
import { getCta } from "@/lib/content";
import { getNewsletter } from "@/lib/content";
import { getFooter } from "@/lib/content";

// Note : la barre utilitaire (.utility-bar — badge NGOsource + switch EN/FR)
// est volontairement masquée sur le site statique actuel ; getUtilityBar()
// existe dans lib/content.js pour quand elle sera réactivée, mais n'est pas
// rendue ici.

// The "What's happening" stories now come from WordPress (getLatestStories):
// regenerate the homepage at most every 5 minutes, like the WordPress
// fetches themselves — and so a build made while WordPress was down
// doesn't keep showing "temporarily unavailable" forever (2026-10-19).
export const revalidate = 300;

export default async function Home() {
  const [
    header,
    hero,
    latest,
    keyStats,
    expertise,
    impactStats,
    impactHighlights,
    reach,
    work,
    opportunities,
    cta,
    newsletter,
    footer,
  ] = await Promise.all([
    getHeader(),
    getHero(),
    getLatestStories(),
    getKeyStats(),
    getExpertise(),
    getImpactStats(),
    getImpactHighlights(),
    getReach(),
    getWork(),
    getHomeOpportunities(),
    getCta(),
    getNewsletter(),
    getFooter(),
  ]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header data={header} />

        <main id="main">
          {/* Order revised 2026-10-21 (homepage UX review, at Yv's call): news
              first, then what we do (programmes) and how (expertise) side by
              side, then impact as one block (figures → stories), then reach,
              funders, and the call to action. Previous order: Hero, Latest,
              Expertise, ImpactStats (+ funders), ImpactHighlights, Reach,
              Work, Cta. */}
          {/* 2026-11-02 (design review N2, at Yv's call — options A + B):
              Mediascape moves up right after the news, as the homepage's
              signature, and carries the key figures; the expertise pillars
              joined « What we do » (undone the same day, see below).
              10 sections -> 9. Previous order: Hero,
              Latest, KeyStats, Work, HomeOpportunities, Expertise,
              ImpactHighlights, Reach, FundersSection, Cta. */}
          <Hero data={hero} />
          <Latest data={latest} />
          <Reach data={reach}>
            <KeyStats data={keyStats} embedded />
          </Reach>
          {/* 2026-11-02 (Yv): « Our expertise » back as its own section, at
              its former place after the opportunities — the merge into
              « What we do » (N2, option B) is undone. Work and Expertise
              still accept the embedded mode if it's ever wanted again. */}
          <Work data={work} />
          {/* 2026-10-30: 4 latest opportunities (dated list on a navy band) */}
          <HomeOpportunities data={opportunities} />
          <Expertise data={expertise} />
          {/*<ImpactStats data={impactStats} showFunders={false} />*/}
          {/* null when WordPress can't answer (design review I5) */}
          {impactHighlights && <ImpactHighlights data={impactHighlights} />}
          <FundersSection data={impactStats} />
          <Cta data={cta} newsletter={newsletter} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
