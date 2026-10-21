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

// mfwa.org sits behind a CDN/proxy (Cloudflare) in front of shared
// WordPress hosting — a heavier query across many posts occasionally
// makes the origin too slow to accept the CDN's connection in time,
// surfacing as a 522 "origin connection timed out" (or a sibling 5xx/52x
// code, or even a raw network error) rather than a real problem with the
// request itself. Retrying a couple of times with a short backoff clears
// these transient blips in practice, so a single flaky response doesn't
// take the whole page down with it. A real 4xx (bad request, not found)
// is NOT retried — that's a genuine error, retrying would just waste
// time. The same CDN/cache layer is also, separately, why `_embed` is
// never used below any more — see the note above mapPost() for why.
const FETCH_RETRIES = 2;
const RETRY_DELAY_MS = 600;

function isRetryableStatus(status) {
  return status === 429 || status === 502 || status === 503 || status === 504 || (status >= 520 && status <= 527);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(path, attempt = 0) {
  let res;
  try {
    res = await fetch(`${WP_API_BASE}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (err) {
    if (attempt < FETCH_RETRIES) {
      await sleep(RETRY_DELAY_MS * (attempt + 1));
      return fetchJson(path, attempt + 1);
    }
    throw err;
  }
  if (!res.ok) {
    if (isRetryableStatus(res.status) && attempt < FETCH_RETRIES) {
      await sleep(RETRY_DELAY_MS * (attempt + 1));
      return fetchJson(path, attempt + 1);
    }
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

// -- Resolving media/taxonomy terms WITHOUT `_embed` --------------------
//
// Fix (2026-09-28, at Yv's call): every fetch below used to ask for
// `_embed=wp:featuredmedia,wp:term` and read the result back from
// `post._embedded`. That worked perfectly against mock-wp-server.cjs,
// but confirmed dead against the real site (Yv pasted three separate
// live URLs, one per rel — /report, /posts, and a plain `_embed=true` —
// and NONE of them ever produced an `_embedded` key, only `_links`
// pointing at the un-fetched resources). Most likely explanation: mfwa.org
// sits behind a CDN/cache layer (see fetchJson()'s note on 522s) that
// caches these REST responses by path only, ignoring the `_embed` query
// param entirely and always serving the same un-embedded response. So in
// production, every function below was silently getting no cover image
// and no category/country/report-type name for every single post —
// invisible against the mock, which does support embedding, so nothing
// here ever failed a test; it only failed against the real API.
//
// The fix drops `_embed` completely and instead reads the plain id-array
// fields WordPress already puts directly on every post object regardless
// of embedding (confirmed on the real /report response: `"country":[..],
// "report-type":[762]` etc. are present with no `_embed` at all), then
// resolves those ids to names with one extra batched request per
// taxonomy/media — `include=id1,id2,...` is core REST API, works on
// /media and on any taxonomy's own collection endpoint. This also drops
// the old positional-index assumption ([0] category, [1] post_tag, [2]
// country) in mapPost() below in favour of named fields, which is more
// robust anyway.
async function getWpMediaByIds(ids) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (uniqueIds.length === 0) return new Map();
  const { data } = await fetchJson(
    `/media?include=${uniqueIds.join(",")}&per_page=100&_fields=id,source_url,alt_text,media_details`
  );
  return new Map(data.map((m) => [m.id, m]));
}

// `restBase` is the taxonomy's own REST collection path — "categories"
// (note the plural, unlike the `categories` post field which is also
// plural — WordPress is consistent here), "country", "report-type", etc.
async function getWpTermsByIds(restBase, ids) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (uniqueIds.length === 0) return new Map();
  const { data } = await fetchJson(
    `/${restBase}?include=${uniqueIds.join(",")}&per_page=100&_fields=id,name,slug`
  );
  return new Map(data.map((t) => [t.id, { id: t.id, name: decodeEntities(t.name), slug: t.slug }]));
}

function mediaToImage(media, alt) {
  const src =
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.source_url;
  return src ? { src, alt: media.alt_text || alt } : { ...FALLBACK_IMAGE, alt };
}

// Maps a WP REST post (requested with plain id fields, no `_embed` — see
// the note above) into the flat shape CategoryGrid/story cards already
// expect elsewhere on the site. `categoryMap`/`countryMap` are id→term
// lookups built by the caller from `getWpTermsByIds()` — every post in a
// single response shares one such map, resolved once per page of results
// rather than once per post.
// Regular posts open on this site's own article template
// (app/articles/[slug]/page.js, 2026-10-19 at Yv's call) instead of
// sending readers to the live mfwa.org permalink. `slug` is a core field
// of every WP post, so it only has to be listed in `_fields`; if it is ever
// missing the card falls back to the live permalink rather than a dead link.
export function articleHref(post) {
  return post?.slug ? `/articles/${post.slug}` : post?.link;
}

// -- Content types (CONFIRMED 2026-10-20 from /wp-json/wp/v2/types, pasted
// by Yv) ----------------------------------------------------------------
// - News stories are the "issues-in-focus" post type (archive
//   https://mfwa.org/issues-in-focus/, taxonomies category/post_tag/country).
// - WordPress' regular "posts" are the OPPORTUNITIES (fellowships, calls,
//   vacancies — taxonomies opportunity-category, staff-position, country).
// Until then every story feed of this site read /posts, i.e. showed
// opportunities. STORIES is now the default everywhere; OPPORTUNITIES is
// only used by /opportunities and by opportunity articles.
export const STORIES = "issues-in-focus";
export const OPPORTUNITIES = "posts";
const CARD_FIELDS = "id,date,slug,link,title,featured_media,categories,country,opportunity-category";

// id → term lookups for one batch of items (never one request per item).
async function termMaps(data, base) {
  const [mediaMap, categoryMap, countryMap, opportunityMap] = await Promise.all([
    getWpMediaByIds(data.map((p) => p.featured_media)),
    getWpTermsByIds("categories", data.flatMap((p) => p.categories ?? [])),
    getWpTermsByIds("country", data.flatMap((p) => p.country ?? [])),
    base === OPPORTUNITIES
      ? getWpTermsByIds("opportunity-category", data.flatMap((p) => p["opportunity-category"] ?? [])).catch(() => new Map())
      : new Map(),
  ]);
  return { mediaMap, categoryMap, countryMap, opportunityMap, base };
}

function mapPost(post, { mediaMap, categoryMap, countryMap, opportunityMap, base } = {}) {
  const title = decodeEntities(post.title?.rendered ?? "");
  const isOpportunity = base === OPPORTUNITIES;
  const primaryTag = isOpportunity
    ? opportunityMap?.get(post["opportunity-category"]?.[0])?.name ?? "Opportunity"
    : categoryMap?.get(post.categories?.[0])?.name ?? null;
  const secondaryTag = countryMap?.get(post.country?.[0])?.name ?? null;

  return {
    id: post.id,
    type: isOpportunity ? "opportunity" : "story",
    link: articleHref(post),
    sourceUrl: post.link,
    // first category, for the thumbnail watermark (components/CategoryMark.js);
    // every opportunity carries the "opportunities" watermark
    categorySlug: isOpportunity ? "opportunities" : categoryMap?.get(post.categories?.[0])?.slug ?? null,
    categoryName: primaryTag,
    image: mediaToImage(mediaMap?.get(post.featured_media), title),
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

// Fetches a page of /posts plus everything mapPost() needs to resolve
// each card's image/tags, in one batch (1 posts request + up to 3 lookup
// requests run in parallel, never one lookup per post).
async function fetchPostsWithTerms(query, base = STORIES) {
  const { data, totalPages, total } = await fetchJson(`/${base}?${query}&_fields=${CARD_FIELDS}`);
  const maps = await termMaps(data, base);
  const items = data.map((p) => mapPost(p, maps));
  return { items, totalPages, total };
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
  return fetchPostsWithTerms(
    `categories=${categoryId}&page=${page}&per_page=${perPage}&orderby=date&order=desc`
  );
}

// The "Where We Work" country pages are archives on the site's own custom
// "country" taxonomy (rest_base "country", confirmed against
// /wp-json/wp/v2/taxonomies), not the "category" one — same shape as
// getWpCategoryBySlug/Posts above, just a different taxonomy and the
// matching /posts?country=<id> filter param.
// A category AND its sub-categories (2026-10-20). WordPress' REST
// `categories=<id>` filter does NOT include posts filed only under a child
// category, so a parent like "Issues in Focus" can look empty through the
// API while its archive on the site is full. Returns the ids of the
// category + its children and grandchildren (null if the slug is unknown;
// if the slug is not found, falls back to a name search built from it,
// e.g. "issues-in-focus" → "issues in focus").
export async function getWpCategoryTree(slug) {
  let category = await getWpCategoryBySlug(slug);
  if (!category) {
    const { data } = await fetchJson(
      `/categories?search=${encodeURIComponent(slug.replace(/-/g, " "))}&per_page=5&_fields=id,name,slug,count`
    );
    const hit = data[0];
    if (!hit) return null;
    category = { id: hit.id, name: decodeEntities(hit.name), slug: hit.slug, count: hit.count };
  }
  const ids = [category.id];
  let level = [category.id];
  for (let depth = 0; depth < 2 && level.length; depth++) {
    const { data } = await fetchJson(`/categories?parent=${level.join(",")}&per_page=100&_fields=id`).catch(() => ({ data: [] }));
    level = data.map((c) => c.id).filter((id) => !ids.includes(id));
    ids.push(...level);
  }
  return { ...category, ids };
}

export async function getWpCountryBySlug(slug) {
  const { data } = await fetchJson(
    `/country?slug=${encodeURIComponent(slug)}&_fields=id,name,slug,description,count`
  );
  const country = data[0];
  if (!country) return null;
  return {
    id: country.id,
    name: decodeEntities(country.name),
    slug: country.slug,
    description: decodeEntities(country.description || ""),
    count: country.count,
  };
}

export async function getWpCountryPosts(countryId, { page = 1, perPage = 10 } = {}) {
  return fetchPostsWithTerms(
    `country=${countryId}&page=${page}&per_page=${perPage}&orderby=date&order=desc`
  );
}

// Batch-resolves several "country" taxonomy slugs to their WordPress term
// ids/names in one request — mirrors getWpCategories() below (same
// re-sort-by-input-order rationale: the `slug` param doesn't guarantee
// the API echoes results back in that order). Used by the Where We Work
// map restyle (getWhereWeWorkPage()) to look up all 16 countries' WP ids
// in one request instead of 16, before fetching each one's article
// count/recent stories to drive the choropleth.
export async function getWpCountriesBySlug(slugs) {
  const { data } = await fetchJson(
    `/country?slug=${slugs.map(encodeURIComponent).join(",")}&per_page=100` +
      `&_fields=id,name,slug,count`
  );
  const bySlug = new Map(data.map((c) => [c.slug, c]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .map((c) => ({ id: c.id, slug: c.slug, name: decodeEntities(c.name), count: c.count }));
}

// -- Where We Work × Issues explorer -----------------------------------
//
// The merged explorer (see getWhereWeWorkPage() in lib/content.js) filters
// posts by country AND/OR category at once, so it needs its own query
// builder rather than reusing getWpCategoryPosts/getWpCountryPosts above
// (each hard-codes a single taxonomy param). WordPress's /posts endpoint
// already accepts both `country` and `categories` together — no change
// needed on the WP side, just combining the two params here.
export async function getWpFilteredPosts({ countryId, categoryId, page = 1, perPage = 12 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    orderby: "date",
    order: "desc",
  });
  if (countryId) params.set("country", String(countryId));
  if (categoryId) params.set("categories", String(categoryId));

  return fetchPostsWithTerms(params.toString());
}

// Lean count + latest headlines for one country (2026-10-18, Where We Work
// speed-up). The map only needs each country's post total (X-WP-Total) and
// 2 recent titles — no image, no category/country tag — so this skips
// fetchPostsWithTerms()'s 3 extra resolution requests (media + 2 taxonomy
// lookups) per country: 16 requests for the whole map instead of up to 64.
export async function getWpPostTeasers({ countryId, categoryId, perPage = 2 } = {}) {
  const params = new URLSearchParams({ page: "1", per_page: String(perPage), orderby: "date", order: "desc" });
  if (countryId) params.set("country", String(countryId));
  if (categoryId) params.set("categories", String(categoryId));
  const { data, total } = await fetchJson(`/${STORIES}?${params}&_fields=id,date,slug,link,title`);
  return {
    total,
    items: data.map((p) => ({
      link: articleHref(p),
      heading: decodeEntities(p.title?.rendered ?? ""),
      date: formatWpDate(p.date),
    })),
  };
}

// Homepage news feed (2026-10-19; hero by tag since 2026-10-20 — below). Was: `sticky` maps to WordPress's own
// "Stick to the top of the blog" checkbox (REST `sticky=true|false`) — the
// editors' way of choosing the hero carousel's stories; `exclude` keeps
// "What's happening" from repeating them. Same card shape as mapPost(),
// plus `id`, a plain-text `excerpt` and the raw category/country names
// the hero caption needs.
function plainExcerpt(html = "", max = 190) {
  const text = decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s.,;:–—-]+$/, "")}…` : text;
}

// 2026-10-20: stories now come from the Issues in Focus type, which has no
// "sticky" flag (WordPress only offers it on regular posts) — the hero is
// chosen with a TAG instead (`tagId`, see getHomeFeed() in lib/content.js).
export async function getWpHomePosts({ perPage = 4, tagId, exclude = [], categoryId, base = STORIES } = {}) {
  const params = new URLSearchParams({ page: "1", per_page: String(perPage), orderby: "date", order: "desc" });
  if (tagId) params.set("tags", String(tagId));
  if (categoryId) params.set("categories", [categoryId].flat().join(","));
  if (exclude.length) params.set("exclude", exclude.join(","));
  const { data } = await fetchJson(`/${base}?${params}&_fields=${CARD_FIELDS},excerpt`);
  const maps = await termMaps(data, base);
  const { mediaMap, categoryMap, countryMap } = maps;
  return data.map((p) => ({
    ...mapPost(p, maps),
    id: p.id,
    hasImage: Boolean(p.featured_media && mediaMap?.get(p.featured_media)),
    // 420 chars (2026-10-21): the hero panel fits as many lines as its title
    // leaves room for (components/Hero.js), so it needs enough text to fill.
    excerpt: plainExcerpt(p.excerpt?.rendered, 420),
    categoryName: categoryMap?.get(p.categories?.[0])?.name ?? null,
    countryName: countryMap?.get(p.country?.[0])?.name ?? null,
  }));
}

// Hero excerpt fallback (2026-10-21, at Yv's call). The Issues in Focus
// type doesn't fill `excerpt` on the live site, so the hero panel showed a
// title and "Read more" over an empty block. For the (at most 4) hero
// stories without an excerpt, one request fetches their body and keeps the
// text of the first paragraphs — never captions, headings or embeds.
// Returns Map(id → plain text, ≤ max chars).
export async function getWpBodyExcerpts(ids, { base = STORIES, max = 420 } = {}) {
  const list = [...new Set(ids)].filter(Boolean);
  if (!list.length) return new Map();
  const { data } = await fetchJson(`/${base}?include=${list.join(",")}&per_page=${list.length}&_fields=id,content`);
  const out = new Map();
  for (const post of data) {
    const html = (post.content?.rendered ?? "").replace(/<figure\b[\s\S]*?<\/figure>/gi, "");
    const paras = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((m) =>
        decodeEntities(m[1].replace(/<\/?(a|strong|em|b|i|span|sup|sub|mark|abbr|code)\b[^>]*>/gi, "").replace(/<[^>]*>/g, " "))
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter((t) => t.length > 1);
    const text = paras.join(" ");
    if (text) out.set(post.id, text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s.,;:–—-]+$/, "")}…` : text);
  }
  return out;
}

// Resolves the 13 "Issues" category slugs (the live site's own menu,
// merged into the explorer above rather than kept as a separate hub —
// see getWhereWeWorkPage()'s note) to their WordPress term ids/names in
// one request. WP's `slug` param on /categories accepts a comma-separated
// list, but doesn't guarantee it echoes results back in that order, so
// this re-sorts to match the order `slugs` was given in (the live site's
// own Issues submenu order) rather than trusting the API's order.
// A tag by slug (e.g. "featured", the hero carousel's editorial pick).
export async function getWpTagBySlug(slug) {
  const { data } = await fetchJson(`/tags?slug=${encodeURIComponent(slug)}&_fields=id,name,slug,count`);
  return data[0] ? { id: data[0].id, name: decodeEntities(data[0].name), slug: data[0].slug, count: data[0].count } : null;
}

export async function getWpCategories(slugs) {
  const { data } = await fetchJson(
    `/categories?slug=${slugs.map(encodeURIComponent).join(",")}&per_page=100` +
      `&_fields=id,name,slug,count`
  );
  const bySlug = new Map(data.map((c) => [c.slug, c]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .map((c) => ({ id: c.id, slug: c.slug, name: decodeEntities(c.name), count: c.count }));
}

// -- Impact Stories -----------------------------------------------------
//
// "Impact Stories" is its own WordPress content, not a taxonomy filter on
// the regular "post" type: on the live site every story's URL is
// /impact-stories/<slug>/ (no /category/ segment), which is the rewrite
// shape of a custom post type with its own archive, not a category link.
// UNCONFIRMED: the rest_base "impact-stories" below is inferred from that
// URL, not verified against the REST API the way "country"/"report-type"
// were (see getWpReports() below) — verify against a live
// /wp-json/wp/v2/types response before this goes live, and fix the path
// below if the real rest_base differs. Separately, whether this post type
// actually carries the "country" taxonomy (assumed below, single tag per
// card e.g. "Ghana") is ALSO unconfirmed for the same reason — if it
// doesn't, `country` just comes back undefined per post and the card
// simply shows no tag (graceful, not a crash).
function mapImpactStory(post, { mediaMap, countryMap } = {}) {
  const title = decodeEntities(post.title?.rendered ?? "");
  const countryName = countryMap?.get(post.country?.[0])?.name ?? null;

  return {
    link: post.link,
    image: mediaToImage(mediaMap?.get(post.featured_media), title),
    tag: countryName ? [countryName] : [],
    heading: title,
    date: formatWpDate(post.date),
    readTime: undefined,
  };
}

export async function getWpImpactStories({ page = 1, perPage = 12 } = {}) {
  const { data, totalPages, total } = await fetchJson(
    `/impact-stories?page=${page}&per_page=${perPage}&orderby=date&order=desc` +
      `&_fields=id,date,link,title,featured_media,country`
  );
  const [mediaMap, countryMap] = await Promise.all([
    getWpMediaByIds(data.map((p) => p.featured_media)),
    getWpTermsByIds("country", data.flatMap((p) => p.country ?? [])),
  ]);
  const items = data.map((p) => mapImpactStory(p, { mediaMap, countryMap }));
  return { items, totalPages, total };
}

// "Reports" (nav, 2026-09-27) — the live site's Publications > Reports
// archive (https://mfwa.org/publications/reports/), a custom post type
// whose permalinks are /report/<slug> (confirmed by visiting several live
// report pages), separate from both regular posts and "impact-stories".
// Same card shape as an impact story (title/image/date/link) so it can
// reuse the same story__* card markup (see components/ReportsGrid.js).
//
// Sidebar filters (2026-09-27, at Yv's call — see
// https://mfwa.org/publications/foedr-reports/ for the reference layout: a
// left-hand list of report types — Analytical/Annual/Media Monitoring/
// Monthly/Policy Briefs/Quarterly/Research/Strategy & Framework — next to
// a 3-column grid). CONFIRMED 2026-09-28 (Yv pasted a live /report?_embed
// response, which — see the module note above — never actually embeds,
// but DOES show the raw taxonomy fields WordPress attaches to every
// report): the real taxonomy is `report-type` (rest_base "report-type",
// e.g. slug "policy-briefs-papers" on a report classed
// "Policy Briefs/Papers" — matches the reference page's own list
// exactly). Two more taxonomies exist on this post type but are NOT the
// sidebar's source: `report-category` (the 3 higher-level
// Annual/Freedom-of-Expression/Media-for-Democracy groupings, not ported
// — see the project doc's "Non traité" notes) and `publication-type`
// (empty on every report seen so far). `report-type` is used explicitly
// below now, replacing the old "read back whatever custom taxonomy
// WordPress embeds, whatever its name" fallback — that fallback existed
// only because embedding could never be verified as working in the first
// place, and it's now confirmed not to work at all (see above), so there
// was nothing to read back regardless of taxonomy name.
function mapReport(post, { mediaMap, reportTypeMap, reportCategoryMap } = {}) {
  const title = decodeEntities(post.title?.rendered ?? "");
  const filterTerms = (post["report-type"] ?? [])
    .map((id) => reportTypeMap?.get(id))
    .filter(Boolean)
    .map((t) => ({ slug: t.slug, name: t.name }));
  // 2026-10-16 (retours équipe com #11): the 3 higher-level groupings the
  // live site organises Publications > Reports by — Annual Reports,
  // Freedom of Expression & Digital Rights Reports, Media for Democracy &
  // Good Governance Reports — come from the `report-category` taxonomy
  // (see the note above, previously "not ported"). Empty when the
  // taxonomy can't be read, so /reports degrades to the old layout.
  const categoryTerms = (post["report-category"] ?? [])
    .map((id) => reportCategoryMap?.get(id))
    .filter(Boolean)
    .map((t) => ({ slug: t.slug, name: t.name }));

  return {
    link: post.link,
    image: mediaToImage(mediaMap?.get(post.featured_media), title),
    tag: [],
    heading: title,
    date: formatWpDate(post.date),
    readTime: undefined,
    filterTerms,
    categoryTerms,
  };
}

// `report-category`'s REST base is assumed to match its taxonomy name (the
// same pattern `report-type` follows, which IS confirmed) — if the live
// site registers it differently the request 404s, and this resolves to an
// empty Map instead of taking /reports down with it.
async function getWpReportCategoriesByIds(ids) {
  try {
    return await getWpTermsByIds("report-category", ids);
  } catch {
    return new Map();
  }
}

export async function getWpReports({ page = 1, perPage = 12 } = {}) {
  const { data, totalPages, total } = await fetchJson(
    `/report?page=${page}&per_page=${perPage}&orderby=date&order=desc` +
      `&_fields=id,date,link,title,featured_media,report-type,report-category`
  );
  const [mediaMap, reportTypeMap, reportCategoryMap] = await Promise.all([
    getWpMediaByIds(data.map((p) => p.featured_media)),
    getWpTermsByIds("report-type", data.flatMap((p) => p["report-type"] ?? [])),
    getWpReportCategoriesByIds(data.flatMap((p) => p["report-category"] ?? [])),
  ]);
  const items = data.map((p) => mapReport(p, { mediaMap, reportTypeMap, reportCategoryMap }));
  return { items, totalPages, total };
}

// -- Site search (retours équipe com #13, 2026-10-16) ---------------------
//
// Free-text search over the two content types the site actually lists:
// regular posts (stories) and reports. Uses WordPress' own `search=`
// parameter, so ranking/matching is whatever WP does — nothing is
// re-implemented here. Each half is independent: if one request fails the
// other still renders (the caller treats `null` as "unavailable").
export async function searchWp(query, { perPage = 8 } = {}) {
  const q = encodeURIComponent(query);
  const [posts, reports] = await Promise.all([
    fetchPostsWithTerms(`search=${q}&per_page=${perPage}&orderby=relevance`).then(
      (r) => r.items,
      () => null
    ),
    getWpReportsSearch(q, perPage).then(
      (r) => r,
      () => null
    ),
  ]);
  return { posts, reports };
}

async function getWpReportsSearch(encodedQuery, perPage) {
  const { data } = await fetchJson(
    `/report?search=${encodedQuery}&per_page=${perPage}&orderby=relevance` +
      `&_fields=id,date,link,title,featured_media`
  );
  const mediaMap = await getWpMediaByIds(data.map((p) => p.featured_media));
  return data.map((p) => mapReport(p, { mediaMap }));
}

// The new /reports page fetches every report up front and filters
// client-side (see ReportsGrid.js) instead of paginating per filter
// click, so it needs the whole set, not one page at a time. A single
// `per_page=100` request (WordPress REST's own ceiling) turned out to be
// the wrong way to get there in practice: 100 reports came back as 3.2MB
// from the real site, and Next.js's fetch data cache silently refuses to
// cache (and the page then fails to render, per Yv 2026-09-27) any
// single response over 2MB. Fetching in smaller batches keeps each
// individual request's cache entry well under that ceiling.
// Revisited 2026-09-28: that 3.2MB was originally blamed on
// `_embed=wp:featuredmedia` pulling every registered image size per
// cover photo — since confirmed `_embed` never actually did anything on
// this site (see the note above mapPost() in the previous section), so
// the real weight was almost certainly each report's own
// `content.rendered` (a PDF-viewer block's full HTML/JSON config, in the
// one example inspected) plus the very large `yoast_head`/
// `yoast_head_json` SEO blocks WordPress attaches by default — neither
// excluded by the `_fields` param if this same CDN/cache layer also
// ignores `_fields` the way it ignores `_embed` (not verified either
// way). getWpReports() now asks for far fewer fields regardless
// (`id,date,link,title,featured_media,report-type` — no `content`, no
// `_links`), which should help if `_fields` is honoured, and does no
// harm if it isn't. `maxPages` is a safety cap, not an expected limit —
// 40 reports/page × 10 pages is 400 reports, comfortably above the
// current archive size; if it's ever actually hit, reports beyond it
// just won't appear (better than an unbounded loop against a runaway
// total). perPage kept modest (not WP's max of 100) both to stay well
// under the 2MB ceiling even in the worst case (bloated, unfiltered
// responses — 20 reports at ~32KB/report worst case is still only
// ~640KB) and because the origin has shown it can time out (522) on a
// heavier query over too many posts at once — smaller, more numerous
// requests are individually cheaper for it to answer.
export async function getAllWpReports({ perPage = 20, maxPages = 20 } = {}) {
  let page = 1;
  let totalPages = 1;
  const items = [];
  do {
    const res = await getWpReports({ page, perPage });
    items.push(...res.items);
    totalPages = res.totalPages;
    page += 1;
  } while (page <= totalPages && page <= maxPages);
  return { items, total: items.length };
}

// -- Single article (2026-10-19, at Yv's call) ----------------------------
//
// One post by slug, for app/articles/[slug]/page.js. Same no-`_embed`
// approach as everything above: the post carries plain id fields, resolved
// with the batched media/term lookups. `content.rendered` is the HTML
// WordPress itself renders (blocks, shortcodes, autop already applied);
// it is cleaned up for display by lib/articleHtml.js, not here.
// Returns null when no post has that slug (→ 404 page).
function heroFromMedia(media, alt) {
  const src =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.source_url;
  return src ? { src, alt: media.alt_text || alt } : null;
}

// Looks in the stories (Issues in Focus) first, then in the opportunities
// (regular posts); `type` tells which, so related items match.
export async function getWpPostBySlug(slug) {
  const fields = `&_fields=${CARD_FIELDS},modified,content,excerpt`;
  let post = null;
  let base = STORIES;
  for (const b of [STORIES, OPPORTUNITIES]) {
    const { data } = await fetchJson(`/${b}?slug=${encodeURIComponent(slug)}${fields}`);
    if (data[0]) {
      post = data[0];
      base = b;
      break;
    }
  }
  if (!post) return null;
  const maps = await termMaps([post], base);
  const { mediaMap, categoryMap, countryMap } = maps;
  const card = mapPost(post, maps);
  return {
    id: post.id,
    type: card.type,
    base,
    slug: post.slug,
    sourceUrl: post.link,
    title: card.heading,
    date: card.date,
    isoDate: post.date,
    isoModified: post.modified,
    excerpt: plainExcerpt(post.excerpt?.rendered, 300),
    heroImage: heroFromMedia(mediaMap.get(post.featured_media), card.heading),
    tag: card.tag,
    category: categoryMap.get(post.categories?.[0]) ?? null,
    country: countryMap.get(post.country?.[0]) ?? null,
    html: post.content?.rendered ?? "",
  };
}

// "You may also like": latest posts sharing the article's first category,
// topped up with the latest posts overall when the category is too small.
// The current post is excluded (in the query AND defensively afterwards).
export async function getWpRelatedPosts({ excludeId, categoryId, perPage = 3, base = STORIES } = {}) {
  const query = `per_page=${perPage + 1}&orderby=date&order=desc${excludeId ? `&exclude=${excludeId}` : ""}`;
  const seen = new Set([excludeId]);
  const out = [];
  const take = (items) => {
    for (const it of items) {
      if (out.length >= perPage) break;
      if (seen.has(it.id)) continue;
      seen.add(it.id);
      out.push(it);
    }
  };
  if (categoryId) take((await fetchPostsWithTerms(`categories=${categoryId}&${query}`, base)).items);
  if (out.length < perPage) take((await fetchPostsWithTerms(query, base)).items);
  return out;
}

// -- Issues in Focus & Opportunities archives (2026-10-20) -----------------
// Pages /issues-in-focus (« View all stories ») and /opportunities.
function archiveQuery({ page, perPage, exclude = [] }) {
  return [`page=${page}`, `per_page=${perPage}`, "orderby=date", "order=desc", exclude.length ? `exclude=${exclude.join(",")}` : ""]
    .filter(Boolean)
    .join("&");
}

export async function getIssuesInFocusPosts({ page = 1, perPage = 12, exclude = [] } = {}) {
  return fetchPostsWithTerms(archiveQuery({ page, perPage, exclude }), STORIES);
}

export async function getOpportunityPosts({ page = 1, perPage = 12 } = {}) {
  return fetchPostsWithTerms(archiveQuery({ page, perPage }), OPPORTUNITIES);
}
