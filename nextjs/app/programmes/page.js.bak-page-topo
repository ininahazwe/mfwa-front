import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import ProgrammesFlat from "@/components/ProgrammesFlat";
import CardNav from "@/components/CardNav";
import AboutGetInvolved from "@/components/AboutGetInvolved";

import { getHeader, getFooter, getProgrammesPage } from "@/lib/content";
import ProgrammesIso from "@/components/ProgrammesIso";

export async function generateMetadata() {
  return {
    title: "Programmes — Media Foundation for West Africa",
    description:
      "The programmes through which the MFWA defends freedom of expression, digital rights, media democracy, and peace and social cohesion across West Africa.",
  };
}

export default async function ProgrammesPage() {
  const [header, footer, programmes] = await Promise.all([getHeader(), getFooter(), getProgrammesPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header data={header} />

        <main id="main" className="about">
          {/* Hero illustration (2026-10-17). 2D version (ProgrammesFlat); for the 3D isometric
              cubes, import and use ProgrammesIso instead (same props). Revert to the old tile grid: delete the
              `art=` line — the tiles, still passed through `tiles`, come back untouched. */}
          <InvolvedHero
            data={programmes.hero}
            tiles={programmes.hero.tiles}
            /*art={<ProgrammesIso tiles={programmes.hero.tiles} />}*/
          />
          <CardNav data={programmes.nav} />
          <AboutGetInvolved data={programmes.involve} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
