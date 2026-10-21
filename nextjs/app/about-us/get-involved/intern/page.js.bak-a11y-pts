import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import InvolvedBody from "@/components/InvolvedBody";

import { getHeader, getFooter, getInternPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Intern — Media Foundation for West Africa",
    description:
      "MFWA internships: 6–24 week placements with hands-on training in advocacy and media development, open to students and graduates.",
  };
}

export default async function InternPage() {
  const [header, footer, intern] = await Promise.all([getHeader(), getFooter(), getInternPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={intern.hero} />
          <InvolvedBody data={intern} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
