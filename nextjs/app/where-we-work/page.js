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

export default async function WhereWeWorkPage() {
  const [header, footer, page] = await Promise.all([
    getHeader(),
    getFooter(),
    getWhereWeWorkPage(),
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
          <WhereWeWorkList
            data={{
              eyebrow: "The 16 countries",
              title: "Find a country",
              text: page.intro,
              countries: page.countries,
              map: page.map,
            }}
          />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
