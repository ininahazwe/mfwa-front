import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import SectionHead from "@/components/SectionHead";
import PartnerLogos from "@/components/PartnerLogos";

import { getHeader, getFooter, getFundingPartnersPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Funding Partners — Media Foundation for West Africa",
    description:
      "The foundations, agencies and companies whose support makes the MFWA's work across West Africa possible.",
  };
}

export default async function FundingPartnersPage() {
  const [header, footer, funding] = await Promise.all([getHeader(), getFooter(), getFundingPartnersPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={funding.hero} />

          <section className="ab-section" id="overview">
            <div className="ab-wrap">
              <SectionHead eyebrow={funding.overview.eyebrow} title={funding.overview.title} text={funding.intro} />
              <PartnerLogos items={funding.logos} />
            </div>
          </section>
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
