import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";

import { getCategoryPage, getHeader, getFooter } from "@/lib/content";

// Layout proposal: only these demo slugs are pre-rendered for now (see the
// note on getCategoryPage() in lib/content.js). Once posts come from
// WordPress, generateStaticParams() will list real category slugs (or the
// route will switch to on-demand rendering) and getCategoryPage(slug) will
// fetch the matching category's posts.
export async function generateStaticParams() {
  return [{ slug: "investigative-journalism" }, { slug: "digital-rights" }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryPage(slug);
  return { title: `${category.label} — Media Foundation for West Africa` };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [category, header, footer] = await Promise.all([
    getCategoryPage(slug),
    getHeader(),
    getFooter(),
  ]);

  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu principal
      </a>

      <Header data={header} />

      <main id="main">
        <section className="category" id="category">
          <header className="category__head">
            <p className="eyebrow">{category.eyebrow}</p>
            <h1 className="category__title">{category.label}</h1>
            <p className="category__description">{category.description}</p>
          </header>

          <CategoryGrid articles={category.articles} />
        </section>
      </main>

      <Footer data={footer} />
    </>
  );
}
