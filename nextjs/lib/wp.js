// -- WordPress REST API client (mfwa.org) -----------------------------------
//
// Talks to the real MFWA WordPress site so the category pages can serve
// live content instead of demo data. Kept isolated in its own module (never
// imported directly by components) so lib/content.js stays the single
// place that shapes data for the UI — see getCategoryPage() there.

const WP_API_BASE = process.env.WP_API_BASE || "https://mfwa.org/wp-json/wp/v2";

// Revalidate periodically rather than on every request: this is public
// editorial content, not per-user data, so a short cache window keeps
// pages fast without serving stale content for long.
const REVALIDATE_SECONDS = 300;

async function fetchJson(path) {
  const res = await fetch(`${WP_API_BASE}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`WordPress API request failed (${res.status}): ${path}`);
  }
  const totalPages = Number(res.headers.get("X-WP-TotalPages") || "1");
  const total = Number(res.headers.get("X-WP-Total") || "0");
  const data = await res.json();
  return { data, totalPages, total };
}

// WordPress returns titles/excerpts as HTML with entities encoded
// (e.g. "West Africa &#8217;s"). We only ever use the plain text, so
// decode the handful of entities that actually show up in this content
// rather than pulling in a full HTML parser for it.
const HTML_ENTITIES = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => HTML_ENTITIES[name.toLowerCase()] ?? match);
}

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatWpDate(isoDate) {
  const d = new Date(isoDate);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTH_ABBR[d.getMonth()]} ${d.getFullYear()}`;
}

// Used whenever a post has no featured image — the story card falls back
// to the MFWA logo instead of a content photo. `isFallback` lets the UI
// switch to object-fit:contain styling and skip the "remove on error"
// treatment (there's no smaller image to fall back to further).
const FALLBACK_IMAGE = { src: "/images/mfwa-logo-01.png", isFallback: true };

// Maps a WP REST post (requested with _embed=wp:featuredmedia,wp:term) into
// the flat shape CategoryGrid/story cards already expect elsewhere on the
// site. wp:term's embedded array order mirrors _links.wp:term's taxonomy
// order for this site: [0] category, [1] post_tag, [2] country — the
// country term is what fills the second half of the existing two-part
// .story__tag pattern (e.g. "Digital Rights · Ghana").
function mapPost(post) {
  const title = decodeEntities(post.title?.rendered ?? "");
  const terms = post._embedded?.["wp:term"] ?? [];
  const categoryTerms = terms[0] ?? [];
  const countryTerms = terms[2] ?? [];
  const primaryTag = categoryTerms[0]?.name ?? null;
  const secondaryTag = countryTerms[0]?.name ?? null;

  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const mediaSrc =
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.source_url;

  return {
    link: post.link,
    image: mediaSrc
      ? { src: mediaSrc, alt: media.alt_text || title }
      : { ...FALLBACK_IMAGE, alt: title },
    // Filter out the missing half rather than rendering an empty "·" —
    // WordPress posts aren't guaranteed to carry a country term.
    tag: [primaryTag, secondaryTag].filter(Boolean),
    heading: title,
    date: formatWpDate(post.date),
    // WordPress has no "read time" field for this site — never fabricate
    // one; the UI treats this as optional.
    readTime: undefined,
  };
}

export async function getWpCategoryBySlug(slug) {
  const { data } = await fetchJson(
    `/categories?slug=${encodeURIComponent(slug)}&_fields=id,name,slug,description,count`
  );
  const category = data[0];
  if (!category) return null;
  return {
    id: category.id,
    name: decodeEntities(category.name),
    slug: category.slug,
    description: decodeEntities(category.description || ""),
    count: category.count,
  };
}

export async function getWpCategoryPosts(categoryId, { page = 1, perPage = 10 } = {}) {
  const { data, totalPages, total } = await fetchJson(
    `/posts?categories=${categoryId}&page=${page}&per_page=${perPage}&orderby=date&order=desc` +
      `&_embed=wp:featuredmedia,wp:term&_fields=id,date,link,title,_links,_embedded`
  );
  return { items: data.map(mapPost), totalPages, total };
}
