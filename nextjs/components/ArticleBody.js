import ShareIcons from "./ShareIcons";

// Two sources (2026-10-19):
// - `html`: a WordPress post's body, already cleaned by lib/articleHtml.js
//   (getArticle() in lib/content.js). Rendered as-is inside `.wp-content`,
//   which globals.css styles to match the article typography (paragraphs,
//   headings, quotes, lists, images + captions, embeds, tables, files…).
// - `body[]` { type: "paragraph" | "heading" | "quote", text, attribution? }:
//   the original placeholder article.
export default function ArticleBody({ body, html, share }) {
  return (
    <div className="article__body">
      {html ? (
        <div className="wp-content" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        (body ?? []).map((block, i) => {
          if (block.type === "heading") {
            return (
              <h2 className="article__subheading" key={i}>
                {block.text}
              </h2>
            );
          }
          if (block.type === "quote") {
            return (
              <blockquote className="article__quote" key={i}>
                <p>{block.text}</p>
                {block.attribution && <cite>{block.attribution}</cite>}
              </blockquote>
            );
          }
          return (
            <p className="article__paragraph" key={i}>
              {block.text}
            </p>
          );
        })
      )}

      <div className="article__body-share">
        <ShareIcons share={share} label="Share this article" />
      </div>
    </div>
  );
}
