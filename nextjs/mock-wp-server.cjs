const http = require("http");
const { URL } = require("url");
const PORT = 8960;
function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}
http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === "/wp-json/wp/v2/categories") {
    // getWpCategories() (lib/wp.js) requests several slugs at once
    // (comma-separated) to build the Where We Work explorer's Issues
    // chips — return one mock category per slug rather than the single
    // generic "Demo" the other single-slug lookups use.
    const slugParam = url.searchParams.get("slug") || "demo";
    const slugs = slugParam.split(",");
    return send(
      res,
      200,
      slugs.map((slug, i) => ({
        id: i + 1,
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
        description: "",
        count: 1,
      }))
    );
  }
  if (url.pathname === "/wp-json/wp/v2/country") {
    // getWpCountriesBySlug() (lib/wp.js) requests all 16 country slugs at
    // once (comma-separated), the same way getWpCategories() does above —
    // return one mock country per slug rather than the single generic
    // "Demo" a plain single-slug lookup (getWpCountryBySlug) also hits.
    const slugParam = url.searchParams.get("slug") || "demo";
    const slugs = slugParam.split(",");
    return send(
      res,
      200,
      slugs.map((slug, i) => ({
        id: i + 1,
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
        description: "",
        count: 1,
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
        _links: {},
        _embedded: {},
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
        _links: {},
        _embedded: { "wp:term": [[{ taxonomy: "country", name: "Ghana" }]] },
      }],
      { "X-WP-TotalPages": "1", "X-WP-Total": "1" }
    );
  }
  if (url.pathname === "/wp-json/wp/v2/report") {
    const page = Number(url.searchParams.get("page") || "1");
    const perPage = Number(url.searchParams.get("per_page") || "12");
    const total = 45; // >40 (getAllWpReports' batch size) on purpose, to exercise its multi-page loop
    // Cycles through 3 mock "report-type" terms (+ a couple with none, to
    // simulate real reports that don't carry the taxonomy) so the sidebar
    // filter UI (ReportsGrid.js) has more than one button to test against.
    const MOCK_TYPES = [
      { taxonomy: "report-type", slug: "annual-reports", name: "Annual Reports" },
      { taxonomy: "report-type", slug: "policy-briefs", name: "Policy Briefs/Papers" },
      { taxonomy: "report-type", slug: "research-reports", name: "Research Reports" },
    ];
    return send(
      res,
      200,
      Array.from({ length: Math.min(perPage, Math.max(0, total - (page - 1) * perPage)) }, (_, i) => {
        const n = (page - 1) * perPage + i + 1;
        const type = MOCK_TYPES[n % (MOCK_TYPES.length + 1)];
        return {
          id: n,
          date: "2026-07-30T09:00:00",
          link: `https://mfwa.org/report/mock-report-${n}/`,
          title: { rendered: `Mock report ${n}` },
          _links: {},
          _embedded: { "wp:term": type ? [[type]] : [] },
        };
      }),
      { "X-WP-TotalPages": String(Math.max(1, Math.ceil(total / perPage))), "X-WP-Total": String(total) }
    );
  }
  send(res, 404, {});
}).listen(PORT, () => console.log("mock on", PORT));
