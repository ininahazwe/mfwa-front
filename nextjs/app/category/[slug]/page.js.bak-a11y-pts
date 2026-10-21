import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import Newsletter from "@/components/Newsletter";
import { getCategoryPage, isIssueCategory, getNewsletter, getHeader, getFooter } from "@/lib/content";

// Category page (back in use 2026-10-20, at Yv's call — first for
// "opportunities"). The 13 "Issues" categories still live in the Where We
// Work explorer: next.config.mjs redirects them before reaching this page,
// and the permanentRedirect() below is the fallback. Any other WordPress
// category gets this simple archive: title, intro, then the same card grid
// as Impact Stories with "load more" (app/api/category/[slug]/posts).
// Previous redirect-only version: page.js.bak-cat-page.
export const revalidate = 300;

const PAGE_SIZE = 12;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (isIssueCategory(slug)) return {};
  const page = await getCategoryPage(slug).catch(() => null);
  if (!page) return { title: "Category not found — Media Foundation for West Africa" };
  return { title: `${page.label} — Media Foundation for West Africa`, description: page.description };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  if (isIssueCategory(slug)) permanentRedirect(`/where-we-work?category=${slug}`);

  const [category, newsletter, header, footer] = await Promise.all([
    getCategoryPage(slug, PAGE_SIZE),
    getNewsletter(),
    getHeader(),
    getFooter(),
  ]);
  if (!category) notFound();

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
              <p className="eyebrow">{category.eyebrow}</p>
              <h1 className="category__title">{category.label}</h1>
              <p className="category__description">{category.description}</p>
            </header>
            {category.articles.length > 0 ? (
              <CategoryGrid
                slug={category.slug}
                apiBase="/api/category"
                initialItems={category.articles}
                initialTotalPages={category.totalPages}
                initialTotal={category.total}
                pageSize={PAGE_SIZE}
                endMessage={`You've reached the end of ${category.label}.`}
              />
            ) : (
              <p className="latest__empty">Nothing here yet — please check back soon.</p>
            )}
          </section>

          <Newsletter data={newsletter} />
        </main>
      </div>
      <Footer data={footer} />
    </>
  );
}
