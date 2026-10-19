import FadeImg from "./FadeImg";
import CategoryMark, { categoryMark } from "./CategoryMark";

// Thumbnail of a story card (`.story__media`), shared by every story grid
// (2026-10-19): homepage « What's happening » (Latest.js), Where We Work
// (CategoryGrid.js), « You may also like » (RelatedArticles.js) and search.
// Adds the category watermark (CategoryMark.js) when the post's category
// has one; a post without image then gets a navy contour tile instead of
// the logo placeholder.
export default function StoryMedia({ story }) {
  const mark = categoryMark(story);
  const fallback = Boolean(story.image?.isFallback);
  const bare = Boolean(mark && fallback);
  const cls = [
    "story__media",
    fallback && !bare ? "story__media--fallback" : "",
    mark ? "story__media--marked" : "",
    bare ? "story__media--bare" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <figure className={cls}>
      {!bare && story.image?.src && <FadeImg src={story.image.src} alt={story.image.alt} removeOnError={!fallback} />}
      {mark && <CategoryMark mark={mark} uid={story.link} bare={bare} />}
    </figure>
  );
}
