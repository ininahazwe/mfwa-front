/** @type {import('next').NextConfig} */
const nextConfig = {
  // /where-we-work/<slug> and /category/<slug> used to be their own
  // static archives; both are now the merged Where We Work × Issues
  // explorer at /where-we-work (see getWhereWeWorkPage() in
  // lib/content.js), filtered via query params instead of a route
  // segment. Redirecting here (rather than only inside those old page
  // components) keeps any bookmarked/inbound link to the old URLs
  // working with a proper permanent redirect, before Next even reaches
  // the app router.
  async redirects() {
    return [
      {
        source: "/where-we-work/:slug",
        destination: "/where-we-work?country=:slug",
        permanent: true,
      },
      // Opportunities are WordPress' regular posts, listed at /opportunities
      // (2026-10-20) — not a category.
      {
        source: "/category/opportunities",
        destination: "/opportunities",
        permanent: true,
      },
      // Only the 13 "Issues" categories (same list as ISSUE_CATEGORY_SLUGS
      // in lib/content.js) — any other category, e.g. /category/opportunities,
      // now has its own page (app/category/[slug]/page.js, 2026-10-20).
      {
        source:
          "/category/:slug(access-to-information|digital-rights|free-expression-and-the-law|free-expression-violations|freedom-of-assembly|freedom-of-expression|general-news|impunity|investigative-journalism|media-development|regional-development|transparency-and-accountability|safety-of-journalists)",
        destination: "/where-we-work?category=:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
