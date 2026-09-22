import Header from "@/components/Header";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleBody from "@/components/ArticleBody";
import RelatedArticles from "@/components/RelatedArticles";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

import { getArticle, getNewsletter, getHeader, getFooter } from "@/lib/content";

// Layout proposal: only this one demo slug is pre-rendered for now (see the
// note on getArticle() in lib/content.js). Once posts come from WordPress,
// generateStaticParams() will list real slugs (or the route will switch to
// on-demand rendering) and getArticle(slug) will fetch the matching post.
export async function generateStaticParams() {
  return [{ slug: "every-dollar-invested-millions-returned" }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  return { title: `${article.title} — Media Foundation for West Africa` };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const [article, newsletter, header, footer] = await Promise.all([
    getArticle(slug),
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
          <article className="article">
            <ArticleHeader article={article} />
            <ArticleBody body={article.body} share={article.share} />
            <RelatedArticles related={article.related} />
          </article>

          <Newsletter data={newsletter} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
