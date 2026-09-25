import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import CardNav from "@/components/CardNav";
import AboutGetInvolved from "@/components/AboutGetInvolved";

import { getHeader, getFooter, getOurPartnersPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Our Partners — Media Foundation for West Africa",
    description:
      "The funding partners, national partners and networks the MFWA works with in pursuing free expression and media development across West Africa.",
  };
}

export default async function OurPartnersPage() {
  const [header, footer, partners] = await Promise.all([getHeader(), getFooter(), getOurPartnersPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={partners.hero} />
          <CardNav data={partners.nav} />
          <AboutGetInvolved data={partners.involve} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
