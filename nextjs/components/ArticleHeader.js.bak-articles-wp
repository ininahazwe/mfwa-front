import Reveal from "./Reveal";
import FadeImg from "./FadeImg";
import ShareIcons from "./ShareIcons";

// API: article { tag, title, date, readTime, heroImage, share } — see
//      getArticle() in lib/content.js. article.author also exists in the
//      data layer but is intentionally not surfaced in this layout.
// Note: article.excerpt is not used here — the excerpt only belongs to
// the places that list/link to the article (story cards), not the
// article page itself, so getArticle() doesn't return one.
export default function ArticleHeader({ article }) {
  return (
    <>
      <Reveal as="header" className="article__head">
        <p className="article__tag">
          {article.tag[0]} <span>·</span> {article.tag[1]}
        </p>
        <h1 className="article__title">{article.title}</h1>
      </Reveal>

      <Reveal as="figure" className="article__hero">
        <FadeImg src={article.heroImage.src} alt={article.heroImage.alt} removeOnError />
      </Reveal>

      <Reveal as="div" className="article__meta-row">
        <p className="article__meta">
          {article.date} <i>·</i> {article.readTime}
        </p>
        <ShareIcons share={article.share} />
      </Reveal>
    </>
  );
}
