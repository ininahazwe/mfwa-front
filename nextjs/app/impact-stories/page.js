import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import Newsletter from "@/components/Newsletter";
import { getImpactStoriesPage, getNewsletter, getHeader, getFooter } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Impact Stories — Media Foundation for West Africa",
    description:
      "Documented outcomes from MFWA's investigative journalism, advocacy and capacity-building work across West Africa.",
  };
}

export default async function ImpactStoriesPage() {
  const [impact, newsletter, header, footer] = await Promise.all([
    getImpactStoriesPage(),
    getNewsletter(),
    getHeader(),
    getFooter(),
  ]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>
        <Header data={header} />
        <main id="main">
          <section className="category" id="category">
            <header className="category__head">
              <p className="eyebrow">{impact.eyebrow}</p>
              <h1 className="category__title">{impact.label}</h1>
              <p className="category__description">{impact.description}</p>
            </header>
            <CategoryGrid
              apiBase="/api/impact-stories"
              initialItems={impact.articles}
              initialTotalPages={impact.totalPages}
              initialTotal={impact.total}
              pageSize={12}
              endMessage="You've reached the end of our impact stories."
            />
          </section>

          <Newsletter data={newsletter} />
        </main>
      </div>
      <Footer data={footer} />
    </>
  );
}
