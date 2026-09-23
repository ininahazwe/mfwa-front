import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import InvolvedWays from "@/components/InvolvedWays";

import { getHeader, getFooter, getGetInvolvedPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Get Involved — Media Foundation for West Africa",
    description:
      "Support press freedom and media development in West Africa: make a donation, join the MFWA team as an intern, or volunteer your time and skills.",
  };
}

export default async function GetInvolvedPage() {
  const [header, footer, involved] = await Promise.all([getHeader(), getFooter(), getGetInvolvedPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={involved.hero} tiles={involved.tiles} />
          <InvolvedWays data={involved.ways} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
