import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import InvolvedBody from "@/components/InvolvedBody";

import { getHeader, getFooter, getVolunteerPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Volunteer — Media Foundation for West Africa",
    description:
      "Volunteer with MFWA: contribute your time and skills to press freedom and media development across West Africa, remotely or from our Accra office.",
  };
}

export default async function VolunteerPage() {
  const [header, footer, volunteer] = await Promise.all([getHeader(), getFooter(), getVolunteerPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={volunteer.hero} />
          <InvolvedBody data={volunteer} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
