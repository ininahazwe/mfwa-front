import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import ContactBody from "@/components/ContactBody";

import { getHeader, getFooter, getContactPage } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Contact — Media Foundation for West Africa",
    description:
      "Get in touch with the Media Foundation for West Africa — our Accra head office address, phone numbers and email.",
  };
}

export default async function ContactPage() {
  const [header, footer, contact] = await Promise.all([getHeader(), getFooter(), getContactPage()]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main" className="about">
          <InvolvedHero data={contact.hero} />
          <ContactBody data={contact} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
