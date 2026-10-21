import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaffHero from "@/components/StaffHero";
import StaffDirectory from "@/components/StaffDirectory";
import AboutGetInvolved from "@/components/AboutGetInvolved";

import { getHeader, getFooter, getAboutUs, getStaffPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Our Staff — Media Foundation for West Africa",
    description:
      "Meet the MFWA team: programme specialists, investigative journalists, communicators and operations staff working for free expression across West Africa.",
  };
}

export default async function OurStaffPage() {
  const [header, footer, about, staff] = await Promise.all([getHeader(), getFooter(), getAboutUs(), getStaffPage()]);

  // Same closing band as /about-us, reframed for people reading about the team.
  const joinUs = {
    ...about.getInvolved,
    eyebrow: "Work with us",
    title: "Join the team",
    text: "Contribute to our work by joining our team as a staff member, a volunteer or an intern — or support it with a donation.",
  };

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <StaffHero data={staff.hero} teams={staff.teams} />
          <StaffDirectory data={staff.directory} teams={staff.teams} />
          <AboutGetInvolved data={joinUs} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
