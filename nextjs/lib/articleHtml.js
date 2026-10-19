// Prepares a WordPress post's `content.rendered` HTML for the article
// template (app/articles/[slug]/page.js — 2026-10-19, at Yv's call).
//
// The HTML comes from MFWA's own WordPress, where WordPress already filters
// what non-admin authors can write; this is a second, defensive pass so the
// page never runs anything it shouldn't, plus a few display fixes:
// - drops <script>, <style>, <noscript>, <form>, <object>, <embed>, <link>,
//   <meta>, <base> and HTML comments;
// - drops on* event handlers, inline `style` (the site's own typography
//   applies instead of whatever the editor pasted) and javascript: URLs;
// - keeps <iframe> only from known embed providers (YouTube, Vimeo,
//   SoundCloud, Spotify, Facebook, Google Docs/Drive/Maps, Archive.org…);
// - un-does "lazy-load" plugins (data-src / data-srcset → src / srcset),
//   then lets the browser lazy-load every image natively;
// - opens links to other sites in a new tab (rel="noopener noreferrer").
// It also returns an estimated reading time computed from the real word
// count of the article (≈220 words per minute).
//
// Regex-based on purpose (no extra npm dependency): it only has to handle
// WordPress's own, well-formed output.

const DROP_WITH_CONTENT = ["script", "style", "noscript", "form", "object", "template", "select", "textarea"];
const DROP_TAG_ONLY = ["embed", "link", "meta", "base", "input", "button"];

const IFRAME_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "w.soundcloud.com",
  "open.spotify.com",
  "www.facebook.com",
  "web.facebook.com",
  "docs.google.com",
  "drive.google.com",
  "www.google.com",
  "archive.org",
  "anchor.fm",
  "podcasters.spotify.com",
  "mfwa.org",
  "www.mfwa.org",
];

const SITE_HOSTS = new Set(["mfwa.org", "www.mfwa.org"]);

function hostOf(url) {
  try {
    return new URL(url, "https://mfwa.org").hostname.toLowerCase();
  } catch {
    return "";
  }
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4] ?? "") : null;
}

function removeAttr(tag, name) {
  return tag.replace(new RegExp(`\\s${name}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, "gi"), "");
}

function setAttr(tag, name, value) {
  const cleaned = removeAttr(tag, name);
  return cleaned.replace(/^<([a-z0-9-]+)/i, `<$1 ${name}="${value.replace(/"/g, "&quot;")}"`);
}

export function prepareArticleHtml(raw = "") {
  let html = String(raw);

  html = html.replace(/<!--[\s\S]*?-->/g, "");
  for (const tag of DROP_WITH_CONTENT) {
    html = html.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}\\s*>`, "gi"), "");
    html = html.replace(new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi"), "");
  }
  for (const tag of DROP_TAG_ONLY) {
    html = html.replace(new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi"), "");
  }

  // iframes: allow-listed providers only
  html = html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>|<iframe\b[^>]*\/?>/gi, (block) => {
    const src = attr(block, "src") || attr(block, "data-src") || "";
    const host = hostOf(src);
    if (!/^https:\/\//i.test(src) || !IFRAME_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return "";
    const open = block.match(/<iframe\b[^>]*>/i)[0];
    let tag = setAttr(open, "src", src);
    tag = removeAttr(tag, "data-src");
    if (!attr(tag, "loading")) tag = setAttr(tag, "loading", "lazy");
    return `${tag}</iframe>`;
  });

  // every remaining opening tag: strip handlers/styles/js: URLs, fix lazy images, links
  html = html.replace(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi, (tag, name) => {
    let t = tag;
    t = t.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    t = removeAttr(t, "style");
    t = t.replace(/\s(href|src|xlink:href|action|formaction)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi, "");

    const lower = name.toLowerCase();
    if (lower === "img" || lower === "source") {
      const lazySrc = attr(t, "data-lazy-src") || attr(t, "data-src");
      const lazySet = attr(t, "data-lazy-srcset") || attr(t, "data-srcset");
      if (lazySrc) t = setAttr(t, "src", lazySrc);
      if (lazySet) t = setAttr(t, "srcset", lazySet);
      for (const a of ["data-lazy-src", "data-src", "data-lazy-srcset", "data-srcset", "data-lazy-sizes"]) t = removeAttr(t, a);
      if (lower === "img") {
        if (!attr(t, "loading")) t = setAttr(t, "loading", "lazy");
        if (!attr(t, "decoding")) t = setAttr(t, "decoding", "async");
        if (attr(t, "alt") === null) t = setAttr(t, "alt", "");
      }
    }

    if (lower === "a") {
      const href = attr(t, "href") || "";
      if (/^https?:\/\//i.test(href) && !SITE_HOSTS.has(hostOf(href))) {
        t = setAttr(t, "target", "_blank");
        t = setAttr(t, "rel", "noopener noreferrer");
      }
    }
    return t;
  });

  // empty paragraphs left behind by the editor (&nbsp; only)
  html = html.replace(/<p[^>]*>(\s|&nbsp;|&#160;|<br\s*\/?>)*<\/p>/gi, "");

  const words = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));

  return { html: html.trim(), words, readTime: words > 0 ? `${minutes} min read` : undefined };
}
