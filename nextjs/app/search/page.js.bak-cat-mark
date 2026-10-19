import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import FadeImg from "@/components/FadeImg";
import { getSearchResults, getNewsletter, getHeader, getFooter } from "@/lib/content";

// Site search results (retours équipe com #13, 2026-10-16) — the target of
// the header's search popover (components/HeaderSearch.js). Server-rendered
// from ?q=, so results are plain HTML and shareable by URL.

export const metadata = {
  title: "Search — Media Foundation for West Africa",
  robots: { index: false },
};

function StoryCard({ story }) {
  return (
    <article className="story">
      <a className="story__link" href={story.link}>
        <figure className="story__media">
          <FadeImg src={story.image.src} alt={story.image.alt} removeOnError />
        </figure>
        <div className="story__body">
          {story.tag?.length > 0 && <p className="story__tag">{story.tag.join(" · ")}</p>}
          <h3 className="story__heading">{story.heading}</h3>
          <p className="story__meta">
            <span>{story.date}</span>
          </p>
        </div>
      </a>
    </article>
  );
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const [results, newsletter, header, footer] = await Promise.all([
    getSearchResults(Array.isArray(q) ? q[0] : q),
    getNewsletter(),
    getHeader(),
    getFooter(),
  ]);
  const { query, pages, posts, reports } = results;
  const nothing =
    query && pages.length === 0 && (posts?.length ?? 0) === 0 && (reports?.length ?? 0) === 0;

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>
        <Header data={header} />
        <main id="main">
          <section className="category search" id="search">
            <header className="category__head">
              <p className="eyebrow">Search</p>
              <h1 className="category__title">{query ? `Results for “${query}”` : "Search MFWA"}</h1>
              <form className="search__form" role="search" action="/search" method="get">
                <label className="visually-hidden" htmlFor="search-page-input">
                  Search MFWA
                </label>
                <input
                  id="search-page-input"
                  className="header-search__input"
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Stories, reports, countries, programmes…"
                  required
                />
                <button className="header-search__submit" type="submit">
                  Search
                </button>
              </form>
            </header>

            {!query && <p className="search__note">Type a word above to search stories, reports and pages.</p>}
            {nothing && <p className="search__note">Nothing matched “{query}”. Try a shorter or different word.</p>}

            {pages.length > 0 && (
              <div className="search__block">
                <h2 className="search__h">Pages</h2>
                <ul className="search__pages">
                  {pages.map((page) => (
                    <li key={page.href}>
                      <a
                        href={page.href}
                        {...(page.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {page.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {query && posts && posts.length > 0 && (
              <div className="search__block">
                <h2 className="search__h">Stories</h2>
                <div className="reports-grid">
                  {posts.map((story, i) => (
                    <StoryCard story={story} key={`${story.link}-${i}`} />
                  ))}
                </div>
              </div>
            )}
            {query && posts === null && (
              <p className="search__note">Stories are temporarily unavailable — please try again in a moment.</p>
            )}

            {query && reports && reports.length > 0 && (
              <div className="search__block">
                <h2 className="search__h">Reports</h2>
                <div className="reports-grid">
                  {reports.map((story, i) => (
                    <StoryCard story={story} key={`${story.link}-${i}`} />
                  ))}
                </div>
              </div>
            )}
            {query && reports === null && (
              <p className="search__note">Reports are temporarily unavailable — please try again in a moment.</p>
            )}
          </section>

          <Newsletter data={newsletter} />
        </main>
      </div>
      <Footer data={footer} />
    </>
  );
}
