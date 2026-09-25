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
    return send(res, 200, [{ id: 1, name: "Demo", slug: url.searchParams.get("slug") || "demo", description: "", count: 1 }]);
  }
  if (url.pathname === "/wp-json/wp/v2/country") {
    return send(res, 200, [{ id: 1, name: "Demo", slug: url.searchParams.get("slug") || "demo", description: "", count: 1 }]);
  }
  if (url.pathname === "/wp-json/wp/v2/posts") {
    return send(res, 200, [{ id: 1, date: "2026-09-01T09:00:00", link: "https://mfwa.org/x/", title: { rendered: "Mock" }, _links: {}, _embedded: {} }], { "X-WP-TotalPages": "1", "X-WP-Total": "1" });
  }
  send(res, 404, {});
}).listen(PORT, () => console.log("mock on", PORT));
