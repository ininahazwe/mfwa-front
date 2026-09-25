import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import WhereWeWorkList from "@/components/WhereWeWorkList";

import { getHeader, getFooter, getWhereWeWorkPage } from "@/lib/content";

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
export default async function WhereWeWorkPage({ searchParams }) {
  const sp = await searchParams;
  const countrySlug = typeof sp?.country === "string" ? sp.country : undefined;
  const categorySlug = typeof sp?.category === "string" ? sp.category : undefined;

  const [header, footer, page] = await Promise.all([
    getHeader(),
    getFooter(),
    getWhereWeWorkPage({ countrySlug, categorySlug }),
  ]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={page.hero} tiles={page.hero.tiles} />
          {/* Remounting on filter change (via the key below) resets the
              map's hover state and the grid's pagination cleanly instead
              of trying to reconcile them across an unrelated filter
              switch — see the note in WhereWeWorkList.js. */}
          <WhereWeWorkList
            key={`${page.activeCountrySlug ?? "all"}-${page.activeCategorySlug ?? "all"}`}
            data={{
              eyebrow: "The 16 countries",
              title: "Find a country or an issue",
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
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
