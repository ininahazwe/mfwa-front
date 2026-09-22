import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import AboutPillars from "@/components/AboutPillars";
import AboutPeople from "@/components/AboutPeople";
import AboutNetworks from "@/components/AboutNetworks";
import AboutGetInvolved from "@/components/AboutGetInvolved";

import { getHeader, getFooter, getAboutUs } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "About Us — Media Foundation for West Africa",
    description:
      "MFWA is the biggest and most influential media development and freedom of expression organisation in West Africa: our mission, vision, values, team and partners.",
  };
}

export default async function AboutUsPage() {
  const [header, footer, about] = await Promise.all([getHeader(), getFooter(), getAboutUs()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main">
          <AboutHero data={about.hero} />
          <AboutPillars data={about.pillars} />
          <AboutPeople data={about.people} />
          <AboutNetworks data={about.networks} />
          <AboutGetInvolved data={about.getInvolved} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
