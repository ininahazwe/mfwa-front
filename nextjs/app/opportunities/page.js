import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import Newsletter from "@/components/Newsletter";
import { getOpportunitiesPage, OPPORTUNITIES_PAGE_SIZE, getNewsletter, getHeader, getFooter } from "@/lib/content";

// Opportunities archive (2026-10-20, at Yv's call): every regular
// WordPress post — on mfwa.org the "posts" are the opportunities
// (fellowships, calls, vacancies; see OPPORTUNITIES in lib/wp.js). Target of
// the « Opportunities » topic on the homepage. Same layout as Impact
// Stories; every card carries the « opportunity » watermark.
export const revalidate = 300;

export const metadata = {
  title: "Opportunities — Media Foundation for West Africa",
  description:
    "Calls for applications, fellowships, grants, trainings and vacancies from the MFWA and its partners across West Africa.",
};

export default async function OpportunitiesPage() {
  const [page, newsletter, header, footer] = await Promise.all([
    getOpportunitiesPage(),
    getNewsletter(),
    getHeader(),
    getFooter(),
  ]);

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header data={header} />
        <main id="main">
          <section className="category" id="category">
            <header className="category__head">
              <p className="eyebrow">{page.eyebrow}</p>
              <h1 className="category__title">{page.label}</h1>
              <p className="category__description">{page.description}</p>
            </header>
            {page.articles.length > 0 ? (
              <CategoryGrid
                apiBase="/api/opportunities"
                initialItems={page.articles}
                initialTotalPages={page.totalPages}
                initialTotal={page.total}
                pageSize={OPPORTUNITIES_PAGE_SIZE}
                endMessage="You've reached the end of the opportunities."
              />
            ) : (
              <p className="latest__empty">Our opportunities are temporarily unavailable — please check back shortly.</p>
            )}
          </section>

          <Newsletter data={newsletter} />
        </main>
      </div>
      <Footer data={footer} />
    </>
  );
}
