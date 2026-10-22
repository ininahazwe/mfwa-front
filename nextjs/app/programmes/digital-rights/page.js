import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import ProgrammeTopo from "@/components/ProgrammeTopo";
import SectionHead from "@/components/SectionHead";
import ProgrammeFocus from "@/components/ProgrammeFocus";
import ProgrammeReports from "@/components/ProgrammeReports";
import AboutGetInvolved from "@/components/AboutGetInvolved";

import { getHeader, getFooter, getDigitalRightsPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Tech & Digital Rights — Media Foundation for West Africa",
    description:
      "Working toward a freer and safer online environment for expression and participation by all, especially women, across West Africa.",
  };
}

export default async function DigitalRightsPage() {
  const [header, footer, programme] = await Promise.all([getHeader(), getFooter(), getDigitalRightsPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header data={header} tone={programme.focus.tone} />

        <main id="main" className="about">
          <InvolvedHero
            data={programme.hero}
            tiles={programme.hero.tiles}
            tone={programme.focus.tone}
            topo={<ProgrammeTopo tone={programme.focus.tone} />}
          />

          <section className="ab-section" id="overview">
            <div className="ab-wrap">
              <SectionHead eyebrow={programme.overview.eyebrow} title={programme.overview.title} text={programme.intro} />
            </div>
          </section>

          <ProgrammeFocus data={programme.focus} />
          {programme.reports && <ProgrammeReports data={programme.reports} />}
          <AboutGetInvolved data={programme.involve} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
