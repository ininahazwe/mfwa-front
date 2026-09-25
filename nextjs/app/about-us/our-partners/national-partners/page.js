import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import SectionHead from "@/components/SectionHead";
import PartnerDirectory from "@/components/PartnerDirectory";

import { getHeader, getFooter, getNationalPartnersPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "National Partners — Media Foundation for West Africa",
    description:
      "The leading freedom-of-expression and press-advocacy organisations the MFWA works with in each country of West Africa.",
  };
}

export default async function NationalPartnersPage() {
  const [header, footer, national] = await Promise.all([getHeader(), getFooter(), getNationalPartnersPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={national.hero} />

          <section className="ab-section" id="overview">
            <div className="ab-wrap">
              <SectionHead eyebrow={national.overview.eyebrow} title={national.overview.title} text={national.intro} />
              <PartnerDirectory items={national.partners} />
            </div>
          </section>
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
