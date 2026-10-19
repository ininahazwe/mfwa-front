import { Fragment } from "react";
import Reveal from "./Reveal";
import FadeImg from "./FadeImg";
import ShareIcons from "./ShareIcons";

// API: article { tag[], tagLinks?[] { label, href }, title, date, isoDate?,
//      readTime?, heroImage | null, share } — see getArticle() in
//      lib/content.js. Works for both the WordPress articles (2026-10-19)
//      and the original placeholder article:
// - tags: category · country, as links into the Where We Work explorer
//   when WordPress provides them (tagLinks), plain text otherwise; either
//   half may be missing.
// - hero image: omitted when the post has no featured image (no logo
//   placeholder on an article page).
// - read time: estimated from the real word count, omitted if unknown.
export default function ArticleHeader({ article }) {
  const tags = article.tagLinks?.length ? article.tagLinks : (article.tag ?? []).map((label) => ({ label }));
  return (
    <>
      <Reveal as="header" className="article__head">
        {tags.length > 0 && (
          <p className="article__tag">
            {tags.map((t, i) => (
              <Fragment key={t.label}>
                {i > 0 && <span> · </span>}
                {t.href ? <a href={t.href}>{t.label}</a> : t.label}
              </Fragment>
            ))}
          </p>
        )}
        <h1 className="article__title">{article.title}</h1>
      </Reveal>

      {article.heroImage?.src && (
        <Reveal as="figure" className="article__hero">
          <FadeImg src={article.heroImage.src} alt={article.heroImage.alt} removeOnError />
        </Reveal>
      )}

      <Reveal as="div" className={`article__meta-row${article.heroImage?.src ? "" : " article__meta-row--no-hero"}`}>
        <p className="article__meta">
          {article.isoDate ? <time dateTime={article.isoDate}>{article.date}</time> : article.date}
          {article.readTime && (
            <>
              {" "}
              <i>·</i> {article.readTime}
            </>
          )}
        </p>
        <ShareIcons share={article.share} />
      </Reveal>
    </>
  );
}
