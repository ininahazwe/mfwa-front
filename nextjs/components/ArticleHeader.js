import Reveal from "./Reveal";
import FadeImg from "./FadeImg";
import ShareIcons from "./ShareIcons";

// API: article { tag, title, excerpt, author, date, readTime, heroImage,
//      share } — see getArticle() in lib/content.js.
export default function ArticleHeader({ article }) {
  return (
    <>
      <Reveal as="header" className="article__head">
        <p className="article__tag">
          {article.tag[0]} <span>·</span> {article.tag[1]}
        </p>
        <h1 className="article__title">{article.title}</h1>
        <p className="article__excerpt">{article.excerpt}</p>

        <div className="article__meta">
          <div className="article__author">
            <FadeImg
              className="article__author-avatar"
              src={article.author.avatar.src}
              alt={article.author.avatar.alt}
              removeOnError
            />
            <span className="article__author-info">
              <span className="article__author-name">{article.author.name}</span>
              <span className="article__author-role">{article.author.role}</span>
            </span>
          </div>
          <p className="article__meta-date">
            {article.date} <i>·</i> {article.readTime}
          </p>
        </div>

        <ShareIcons share={article.share} />
      </Reveal>

      <Reveal as="figure" className="article__hero">
        <FadeImg src={article.heroImage.src} alt={article.heroImage.alt} removeOnError />
      </Reveal>
    </>
  );
}
