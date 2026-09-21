import ShareIcons from "./ShareIcons";

// API: article.body[] { type: "paragraph" | "heading" | "quote", text,
//      attribution? } — see getArticle() in lib/content.js.
export default function ArticleBody({ body, share }) {
  return (
    <div className="article__body">
      {body.map((block, i) => {
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
      })}

      <div className="article__body-share">
        <ShareIcons share={share} label="Share this article" />
      </div>
    </div>
  );
}
