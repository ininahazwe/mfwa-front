import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportsGrid from "@/components/ReportsGrid";
import Newsletter from "@/components/Newsletter";
import { getReportsPage, getNewsletter, getHeader, getFooter } from "@/lib/content";

// Sidebar-filtered layout (2026-09-27, at Yv's call) — see the note above
// ReportsGrid for what it mirrors on the live site and why filtering is
// client-side. Replaced the earlier CategoryGrid-based "load more" layout
// (that component's paginated-load-more UI has no sidebar; this page now
// fetches every report up front instead — see getReportsPage()).

export async function generateMetadata() {
  return {
    title: "Reports — Media Foundation for West Africa",
    description:
      "Annual reports, policy papers and research from MFWA on media freedom, digital rights and democratic governance across West Africa.",
  };
}

export default async function ReportsPage() {
  const [reports, newsletter, header, footer] = await Promise.all([
    getReportsPage(),
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
              <p className="eyebrow">{reports.eyebrow}</p>
              <h1 className="category__title">{reports.label}</h1>
              <p className="category__description">{reports.description}</p>
            </header>
            <ReportsGrid articles={reports.articles} filters={reports.filters} />
          </section>

          <Newsletter data={newsletter} />
        </main>
      </div>
      <Footer data={footer} />
    </>
  );
}
