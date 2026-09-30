import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import SectionHead from "@/components/SectionHead";
import ProgrammeFocus from "@/components/ProgrammeFocus";
import AboutGetInvolved from "@/components/AboutGetInvolved";

import { getHeader, getFooter, getMediaGovernancePage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Media for Democracy & Good Governance — Media Foundation for West Africa",
    description:
      "Strengthening the media's capacity to contribute to participatory, responsive, transparent and accountable governance across West Africa.",
  };
}

export default async function MediaGovernancePage() {
  const [header, footer, programme] = await Promise.all([getHeader(), getFooter(), getMediaGovernancePage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={programme.hero} tiles={programme.hero.tiles} />

          <section className="ab-section" id="overview">
            <div className="ab-wrap">
              <SectionHead eyebrow={programme.overview.eyebrow} title={programme.overview.title} text={programme.intro} />
            </div>
          </section>

          <ProgrammeFocus data={programme.focus} />
          <AboutGetInvolved data={programme.involve} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
