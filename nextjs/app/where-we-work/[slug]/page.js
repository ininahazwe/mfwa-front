import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import { getCountryPage, getHeader, getFooter } from "@/lib/content";

// A left-pointing arrow for the "back to Where We Work" link — the same
// stroke language as the arrows in AboutIcons.js, just mirrored, since
// this link points back up a level rather than forward into content.
const ARROW_LEFT = (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 4.5H2M5.6 1 2 4.5 5.6 8" />
  </svg>
);

export async function generateStaticParams() {
  return [
    { slug: "benin" },
    { slug: "burkina-faso" },
    { slug: "cape-verde" },
    { slug: "cote-divoire" },
    { slug: "gambia" },
    { slug: "ghana" },
    { slug: "guinea" },
    { slug: "guinea-bissau" },
    { slug: "liberia" },
    { slug: "mali" },
    { slug: "mauritania" },
    { slug: "niger" },
    { slug: "nigeria" },
    { slug: "senegal" },
    { slug: "sierra-leone" },
    { slug: "togo" },
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const country = await getCountryPage(slug);
  if (!country) return {};
  return { title: `${country.label} — Media Foundation for West Africa` };
}

export default async function CountryPage({ params }) {
  const { slug } = await params;
  const [country, header, footer] = await Promise.all([
    getCountryPage(slug),
    getHeader(),
    getFooter(),
  ]);

  if (!country) notFound();

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">Aller au contenu principal</a>
        <Header data={header} />
        <main id="main">
          <section className="category" id="category">
            <header className="category__head">
              <Link className="ab-link category__back" href="/where-we-work">
                {ARROW_LEFT}
                Where we work
              </Link>
              <p className="eyebrow">{country.eyebrow}</p>
              <h1 className="category__title">{country.label}</h1>
              <p className="category__description">{country.description}</p>
            </header>
            <CategoryGrid
              slug={country.slug}
              initialItems={country.articles}
              initialTotalPages={country.totalPages}
              initialTotal={country.total}
              apiBase="/api/country"
              endMessage={`You've reached the end of our stories from ${country.label}.`}
            />
          </section>
        </main>
      </div>
      <Footer data={footer} />
    </>
  );
}
