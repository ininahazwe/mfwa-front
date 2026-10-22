import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import HeroTopo from "@/components/HeroTopo";
import { PAGE_TOPO } from "@/lib/pageTopo";
import WhereWeWorkList from "@/components/WhereWeWorkList";
import WhereWeWorkSkeleton from "@/components/WhereWeWorkSkeleton";
import { Suspense } from "react";

import { getHeader, getFooter, getWhereWeWorkPage, getWhereWeWorkStatic } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Where We Work — Media Foundation for West Africa",
    description:
      "The MFWA works across 16 countries of West Africa — the 15 ECOWAS member states, and Mauritania — defending press freedom and digital rights.",
  };
}

// ?country=<slug> and/or ?category=<slug> drive the merged explorer below
// (see getWhereWeWorkPage()) — both /where-we-work/<slug> and
// /category/<slug> redirect here as one or the other (next.config.mjs).
// Reading searchParams makes this route dynamic (no static export for
// it), which is expected: it's a live filter, not fixed content.
const EXPLORER_HEAD = { eyebrow: "The 16 countries", title: "Find a country or an issue" };

// Streaming (2026-10-18, at Yv's call — the page was slow and sometimes
// failed): the header, hero, section heading, intro and the 16 country
// links need no WordPress request, so they are sent to the browser right
// away; the explorer's WordPress-backed parts (map coverage colours,
// issue filters, story grid) stream in afterwards through <Suspense>,
// with WhereWeWorkSkeleton standing in until then. If WordPress fails
// even after lib/wp.js's retries, the same skeleton turns into a short
// "couldn't load — try again" notice instead of an error page.
export default async function WhereWeWorkPage({ searchParams }) {
  const sp = await searchParams;
  const countrySlug = typeof sp?.country === "string" ? sp.country : undefined;
  const categorySlug = typeof sp?.category === "string" ? sp.category : undefined;

  const [header, footer, base] = await Promise.all([
    getHeader(),
    getFooter(),
    getWhereWeWorkStatic({ countrySlug, categorySlug }),
  ]);
  const skeletonData = { ...EXPLORER_HEAD, text: base.intro, countries: base.countries, activeCountrySlug: base.activeCountrySlug };
  const query = new URLSearchParams({ ...(countrySlug && { country: countrySlug }), ...(categorySlug && { category: categorySlug }) }).toString();

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero
            data={base.hero}
            tiles={base.hero.tiles}
            topo={<HeroTopo {...PAGE_TOPO["where-we-work"]} host=".ab-hero" className="hero-topo--page" />}
          />
          <Suspense key={query || "all"} fallback={<WhereWeWorkSkeleton data={skeletonData} />}>
            <WhereWeWorkExplorer
              countrySlug={countrySlug}
              categorySlug={categorySlug}
              skeletonData={skeletonData}
              retryHref={`/where-we-work${query ? `?${query}` : ""}`}
            />
          </Suspense>
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}

async function WhereWeWorkExplorer({ countrySlug, categorySlug, skeletonData, retryHref }) {
  let page;
  try {
    page = await getWhereWeWorkPage({ countrySlug, categorySlug });
  } catch (err) {
    console.error("WhereWeWorkExplorer: WordPress data unavailable —", err);
    return <WhereWeWorkSkeleton data={skeletonData} error retryHref={retryHref} />;
  }
  return (
    // Remounting on filter change (via the key below) resets the map's
    // hover state and the grid's pagination cleanly instead of trying to
    // reconcile them across an unrelated filter switch — see the note in
    // WhereWeWorkList.js.
    <WhereWeWorkList
      key={`${page.activeCountrySlug ?? "all"}-${page.activeCategorySlug ?? "all"}`}
      data={{
        eyebrow: EXPLORER_HEAD.eyebrow,
        title: EXPLORER_HEAD.title,
        text: page.intro,
        countries: page.countries,
        categories: page.categories,
        map: page.map,
        stats: page.stats,
        activeCountrySlug: page.activeCountrySlug,
        activeCategorySlug: page.activeCategorySlug,
        allIssuesHref: page.allIssuesHref,
      }}
      initialItems={page.articles}
      initialTotalPages={page.totalPages}
      initialTotal={page.total}
    />
  );
}
