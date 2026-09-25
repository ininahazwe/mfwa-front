import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import AboutNetworks from "@/components/AboutNetworks";

import { getHeader, getFooter, getNetworksPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Our Networks — Media Foundation for West Africa",
    description:
      "The national, regional and international networks the MFWA belongs to, from IFEX to the African Freedom of Information Centre.",
  };
}

export default async function OurNetworksPage() {
  const [header, footer, networks] = await Promise.all([getHeader(), getFooter(), getNetworksPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={networks.hero} />
          <AboutNetworks data={networks.networks} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
