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
      {
        source: "/category/:slug",
        destination: "/where-we-work?category=:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
