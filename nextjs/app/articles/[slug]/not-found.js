import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHeader, getFooter } from "@/lib/content";

// 404 for /articles/<slug> when WordPress has no post with that slug
// (2026-10-19). Keeps the site chrome and points to the archive.
export default async function ArticleNotFound() {
  const [header, footer] = await Promise.all([getHeader(), getFooter()]);
  return (
    <>
      <div className="page-shell">
        <Header data={header} />
        <main id="main" className="article-missing">
          <p className="eyebrow">Error 404</p>
          <h1 className="article-missing__title">This story could not be found</h1>
          <p className="article-missing__text">
            It may have been moved or unpublished. Browse all our stories by country and issue instead.
          </p>
          <p className="article-missing__actions">
            <Link className="btn" href="/where-we-work">Browse all stories</Link>
            <Link className="article-missing__home" href="/">Back to the homepage</Link>
          </p>
        </main>
      </div>
      <Footer data={footer} />
    </>
  );
}
