"use client";

import { usePathname } from "next/navigation";

// This app is English-only for now — no French copy, no /fr/ routing of
// its own. "Switching to French" therefore means leaving it for the
// equivalent page on the live, WPML-powered mfwa.org site, the same idea
// as Reach.js's country links pointing at the live site rather than a
// page this app builds. The /fr/ prefix was confirmed directly against
// mfwa.org (homepage, a category archive, and a country archive all
// resolve correctly under /fr/), so it's mirrored here rather than
// guessed at.
function frenchHref(pathname) {
  const categoryMatch = pathname.match(/^\/category\/([^/]+)\/?$/);
  if (categoryMatch) return `https://mfwa.org/fr/${categoryMatch[1]}/`;
  // Everything else — the homepage, and the demo /articles/[slug] page
  // (not backed by a real WordPress post yet) — falls back to the French
  // homepage rather than claim a specific mapping we can't verify.
  return "https://mfwa.org/fr/";
}

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <div className="lang-switch" aria-label="Language">
      <span className="lang-switch__lang is-current" aria-current="true">
        EN
      </span>
      <span className="lang-switch__divider" aria-hidden="true">/</span>
      <a className="lang-switch__lang" href={frenchHref(pathname)} lang="fr" hrefLang="fr">
        FR
      </a>
    </div>
  );
}
