import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import CardNav from "@/components/CardNav";
import AboutGetInvolved from "@/components/AboutGetInvolved";

import { getHeader, getFooter, getProgrammesPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Programmes — Media Foundation for West Africa",
    description:
      "The five programmes through which the MFWA defends freedom of expression, digital rights, media democracy, peace and institutional development across West Africa.",
  };
}

export default async function ProgrammesPage() {
  const [header, footer, programmes] = await Promise.all([getHeader(), getFooter(), getProgrammesPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={programmes.hero} tiles={programmes.hero.tiles} />
          <CardNav data={programmes.nav} />
          <AboutGetInvolved data={programmes.involve} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
