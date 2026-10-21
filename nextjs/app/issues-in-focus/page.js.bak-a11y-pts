import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import Newsletter from "@/components/Newsletter";
import { getIssuesInFocusPage, ISSUES_IN_FOCUS_PAGE_SIZE, getNewsletter, getHeader, getFooter } from "@/lib/content";

// Issues in Focus archive (2026-10-20, at Yv's call) — same address and
// content as https://mfwa.org/issues-in-focus/, target of the homepage
// « What's happening » « View all stories ». Same layout as Impact Stories:
// title, intro, card grid with "load more" (app/api/issues-in-focus/posts).
export const revalidate = 300;

export const metadata = {
  title: "Issues in Focus — Media Foundation for West Africa",
  description:
    "News, statements and analysis from the MFWA on freedom of expression, press freedom, digital rights and democratic governance across West Africa.",
};

export default async function IssuesInFocusPage() {
  const [page, newsletter, header, footer] = await Promise.all([
    getIssuesInFocusPage(),
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
              <p className="eyebrow">{page.eyebrow}</p>
              <h1 className="category__title">{page.label}</h1>
              <p className="category__description">{page.description}</p>
            </header>
            {page.articles.length > 0 ? (
              <CategoryGrid
                apiBase="/api/issues-in-focus"
                initialItems={page.articles}
                initialTotalPages={page.totalPages}
                initialTotal={page.total}
                pageSize={ISSUES_IN_FOCUS_PAGE_SIZE}
                endMessage="You've reached the end of Issues in Focus."
              />
            ) : (
              <p className="latest__empty">Our stories are temporarily unavailable — please check back shortly.</p>
            )}
          </section>

          <Newsletter data={newsletter} />
        </main>
      </div>
      <Footer data={footer} />
    </>
  );
}
