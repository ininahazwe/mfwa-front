import { redirect } from "next/navigation";

// Retired: the category archives merged into the Where We Work × Issues
// explorer at /where-we-work?category=<slug> (see getWhereWeWorkPage()
// in lib/content.js). next.config.mjs already redirects this whole path
// before Next reaches the app router, so this file is normally
// unreachable — this redirect() is just a fallback in case that config
// redirect is ever removed or bypassed. Not deleted outright since this
// session has no file-delete access on Yv's machine; safe to delete by
// hand once redirects() above is trusted.
export default async function LegacyCategoryPageRedirect({ params }) {
  const { slug } = await params;
  redirect(`/where-we-work?category=${slug}`);
}
