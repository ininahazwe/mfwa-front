import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleBody from "@/components/ArticleBody";
import RelatedArticles from "@/components/RelatedArticles";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

import { getArticle, getNewsletter, getHeader, getFooter } from "@/lib/content";

// Article template, connected to WordPress 2026-10-19 (at Yv's call): any
// post slug is rendered on demand from the WordPress REST API, then cached
// and refreshed at most every 5 minutes (ISR) — no list of slugs to
// pre-build. An unknown slug gives the 404 page (./not-found.js).
// Previous placeholder-only version: page.js.bak-articles-wp.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found — Media Foundation for West Africa" };
  const images = article.heroImage?.src ? [{ url: article.heroImage.src, alt: article.heroImage.alt }] : undefined;
  return {
    title: `${article.title} — Media Foundation for West Africa`,
    description: article.excerpt || undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || undefined,
      url: article.share?.url,
      publishedTime: article.isoDate,
      modifiedTime: article.isoModified,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title: article.title, description: article.excerpt || undefined },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const [article, newsletter, header, footer] = await Promise.all([
    getArticle(slug),
    getNewsletter(),
    getHeader(),
    getFooter(),
  ]);
  if (!article) notFound();

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>

        <Header data={header} />

        <main id="main">
          <article className="article">
            <ArticleHeader article={article} />
            <ArticleBody body={article.body} html={article.html} share={article.share} />
            <RelatedArticles related={article.related} />
          </article>

          <Newsletter data={newsletter} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
