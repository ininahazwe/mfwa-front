import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BoardHero from "@/components/BoardHero";
import BoardDirectory from "@/components/BoardDirectory";
import AboutGetInvolved from "@/components/AboutGetInvolved";

import { getHeader, getFooter, getAboutUs, getBoardPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Our Board — Media Foundation for West Africa",
    description:
      "Meet the MFWA governing board: chaired by Sophie Ly Sow, bringing together the Executive Director and four independent board members.",
  };
}

export default async function OurBoardPage() {
  const [header, footer, about, board] = await Promise.all([getHeader(), getFooter(), getAboutUs(), getBoardPage()]);

  // Same closing band as /about-us, reframed for people reading about governance.
  const getInvolved = {
    ...about.getInvolved,
    eyebrow: "Get involved",
    title: "Support the mission",
    text: "The board sets the direction — you can support the work it oversees with a donation, or by joining the team as a volunteer or an intern.",
  };

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <BoardHero data={board.hero} tiles={board.tiles} />
          <BoardDirectory data={board.directory} />
          <AboutGetInvolved data={getInvolved} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
