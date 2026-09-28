const http = require("http");
const { URL } = require("url");
const PORT = 8960;
function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

// Fixed, stateless id<->slug schemes (2026-09-28 rewrite — see the note
// atop lib/wp.js's getWpMediaByIds()/getWpTermsByIds() for why: the real
// site never actually embeds data via `_embed`, so every fetch now reads
// plain id fields off each post and resolves them with a SEPARATE
// `include=id1,id2,...` lookup per taxonomy/media — this mock has to
// support both directions (resolve a batch of slugs to ids, AND resolve
// a batch of ids back to names) consistently, without any server-side
// state, so `id = index + 1` in a fixed list works both ways.
const COUNTRY_SLUGS = [
  "benin", "burkina-faso", "cote-divoire", "cape-verde", "gambia", "ghana",
  "guinea", "guinea-bissau", "liberia", "mali", "niger", "nigeria",
  "senegal", "sierra-leone", "togo", "mauritania",
];
const ISSUE_CATEGORY_SLUGS = [
  "access-to-information", "digital-rights", "free-expression-and-the-law",
  "free-expression-violations", "freedom-of-assembly", "freedom-of-expression",
  "general-news", "impunity", "investigative-journalism", "media-development",
  "regional-development", "transparency-and-accountability", "safety-of-journalists",
];
const REPORT_TYPES = [
  { slug: "annual-reports", name: "Annual Reports" },
  { slug: "policy-briefs", name: "Policy Briefs/Papers" },
  { slug: "research-reports", name: "Research Reports" },
];

function titleCase(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Shared handler for any "resolve by slug OR by id" taxonomy endpoint —
// getWpCategories()/getWpCountriesBySlug() request by `slug` (comma-
// separated), getWpTermsByIds() requests by `include` (comma-separated
// ids) — mirroring the real /categories and /country endpoints, which
// both support either query shape.
function taxonomyList(res, url, fixedSlugs) {
  const slugParam = url.searchParams.get("slug");
  const includeParam = url.searchParams.get("include");
  if (includeParam) {
    const ids = includeParam.split(",").map(Number);
    return send(
      res,
      200,
      ids
        .map((id) => {
          const slug = fixedSlugs[id - 1];
          if (!slug) return null;
          return { id, name: titleCase(slug), slug, description: "", count: 1 };
        })
        .filter(Boolean)
    );
  }
  const slugs = (slugParam || "demo").split(",");
  return send(
    res,
    200,
    slugs.map((slug) => {
      const idx = fixedSlugs.indexOf(slug);
      const id = idx >= 0 ? idx + 1 : fixedSlugs.length + 1; // unknown slugs still get *a* stable-ish id
      return { id, name: titleCase(slug), slug, description: "", count: 1 };
    })
  );
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/wp-json/wp/v2/categories") {
    return taxonomyList(res, url, ISSUE_CATEGORY_SLUGS);
  }
  if (url.pathname === "/wp-json/wp/v2/country") {
    return taxonomyList(res, url, COUNTRY_SLUGS);
  }
  if (url.pathname === "/wp-json/wp/v2/report-type") {
    const includeParam = url.searchParams.get("include");
    const ids = includeParam ? includeParam.split(",").map(Number) : REPORT_TYPES.map((_, i) => i + 1);
    return send(
      res,
      200,
      ids
        .map((id) => {
          const t = REPORT_TYPES[id - 1];
          return t ? { id, name: t.name, slug: t.slug, count: 1 } : null;
        })
        .filter(Boolean)
    );
  }
  if (url.pathname === "/wp-json/wp/v2/media") {
    // getWpMediaByIds() — one mock image per requested id, standing in
    // for the real site's `media_details.sizes.medium_large.source_url`.
    const includeParam = url.searchParams.get("include") || "";
    const ids = includeParam.split(",").filter(Boolean).map(Number);
    return send(
      res,
      200,
      ids.map((id) => ({
        id,
        source_url: `https://mock.mfwa.test/media-${id}-full.jpg`,
        alt_text: "",
        media_details: {
          sizes: {
            medium_large: { source_url: `https://mock.mfwa.test/media-${id}-medium.jpg` },
            large: { source_url: `https://mock.mfwa.test/media-${id}-large.jpg` },
          },
        },
      }))
    );
  }
  if (url.pathname === "/wp-json/wp/v2/posts") {
    // Echo the requested country/categories filter params into the mock
    // post's title so tests can assert the explorer's fetch actually
    // carried the current filter, without needing a real filtering
    // engine here. `total` is derived deterministically from BOTH params
    // (never 0 once a country id is given, so existing single-country
    // assertions still get at least one story) so the Where We Work map
    // restyle's per-country severity bucketing has a genuinely varied
    // spread of counts to render against — including across the active
    // category filter, since a real WP site's country+category totals
    // would differ too — instead of a flat 1 everywhere.
    //
    // Flat `featured_media`/`categories`/`country` fields (2026-09-28,
    // no more `_embedded` — see lib/wp.js's note) let mapPost() resolve a
    // real image/tag through getWpMediaByIds()/getWpTermsByIds() just
    // like it would against the real site.
    const country = url.searchParams.get("country") || "-";
    const categories = url.searchParams.get("categories") || "-";
    const perPage = Number(url.searchParams.get("per_page") || "10");
    const seed = `${country}|${categories}`.split("").reduce((n, ch) => n + ch.charCodeAt(0), 0);
    const total = country === "-" ? 1 : 1 + (seed % 12);
    const count = Math.min(perPage, total);
    return send(
      res,
      200,
      Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        date: "2026-09-01T09:00:00",
        link: `https://mfwa.org/x-${country}-${i + 1}/`,
        title: { rendered: `Mock post ${i + 1} (country=${country}, categories=${categories})` },
        featured_media: 9000 + i,
        categories: categories !== "-" ? [Number(categories)] : [],
        country: country !== "-" ? [Number(country)] : [],
      })),
      { "X-WP-TotalPages": String(Math.max(1, Math.ceil(total / perPage))), "X-WP-Total": String(total) }
    );
  }
  if (url.pathname === "/wp-json/wp/v2/impact-stories") {
    return send(
      res,
      200,
      [{
        id: 1,
        date: "2026-09-01T09:00:00",
        link: "https://mfwa.org/impact-stories/mock-impact-story/",
        title: { rendered: "Mock impact story" },
        featured_media: 9500,
        country: [COUNTRY_SLUGS.indexOf("ghana") + 1],
      }],
      { "X-WP-TotalPages": "1", "X-WP-Total": "1" }
    );
  }
  if (url.pathname === "/wp-json/wp/v2/report") {
    const page = Number(url.searchParams.get("page") || "1");
    const perPage = Number(url.searchParams.get("per_page") || "12");
    const total = 45; // >40 (getAllWpReports' batch size) on purpose, to exercise its multi-page loop
    // Cycles through the 3 mock report-type ids (+ a couple with none, to
    // simulate real reports that don't carry the taxonomy) so the sidebar
    // filter UI (ReportsGrid.js) has more than one button to test against.
    return send(
      res,
      200,
      Array.from({ length: Math.min(perPage, Math.max(0, total - (page - 1) * perPage)) }, (_, i) => {
        const n = (page - 1) * perPage + i + 1;
        const typeId = n % (REPORT_TYPES.length + 1); // 0 means "no type"
        return {
          id: n,
          date: "2026-07-30T09:00:00",
          link: `https://mfwa.org/report/mock-report-${n}/`,
          title: { rendered: `Mock report ${n}` },
          featured_media: 9700 + n,
          "report-type": typeId ? [typeId] : [],
        };
      }),
      { "X-WP-TotalPages": String(Math.max(1, Math.ceil(total / perPage))), "X-WP-Total": String(total) }
    );
  }
  send(res, 404, {});
}).listen(PORT, () => console.log("mock on", PORT));
