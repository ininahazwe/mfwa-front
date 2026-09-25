// lib/content.js
//
// Content layer for the MFWA homepage. Each function below returns the
// data for one homepage section, in the shape implied by the
// `<!-- API: ... -->` comments found next to that section in the original
// static `index.html`. Right now every function returns the real,
// hand-authored copy that already lives in that mockup (no placeholder
// text). Once the WordPress REST API is available, only the body of each
// function needs to change — the shape returned should stay the same so
// the components that consume it do not need to change.

import {
  getWpCategoryBySlug,
  getWpCategoryPosts,
  getWpCountryBySlug,
  getWpCountryPosts,
  getWpImpactStories,
  getWpCategories,
  getWpCountriesBySlug,
  getWpFilteredPosts,
} from "./wp";
import { STAFF, STAFF_TEAMS } from "./staff";
import { BOARD, BOARD_ROLES } from "./board";

// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/menu?slug=primary`).then(r => r.json())
export async function getHeader() {
  return {
    logo: { src: "/images/mfwa-logo-01.png", alt: "" },
    homeAriaLabel: "Media Foundation for West Africa — accueil",
    brandNameLines: ["Media Foundation", "for West Africa"],
    // "Our Work" points at its own hub (/programmes), "Where We Work" and
    // "Our Impact" (the live site's own label for this item) are real
    // pages too now — none of the three existed yet when this nav was
    // first written. "Stories" still has no dedicated page, so it stays as
    // an anchor to its homepage section (components/Latest.js#stories) —
    // but as "/#slug" rather than a bare "#slug", so it still works when
    // the header renders on any other page instead of silently doing
    // nothing (a bare "#stories" only scrolls if you're already on "/").
    // Donate has a real destination too, matching the external link
    // already used elsewhere on the site (e.g. getCta, PROGRAMME_TILES'
    // "Donate" tile). "Where We Work" now also covers the live site's
    // "Issues" menu (its 13 categories are chips on that same page — see
    // getWhereWeWorkPage()) — deliberately no separate "Issues" entry.
    nav: [
      { label: "Our Work", href: "/programmes" },
      { label: "Where We Work", href: "/where-we-work" },
      { label: "Stories", href: "/#stories" },
      { label: "Our Impact", href: "/impact-stories" },
      { label: "About", href: "/about-us" },
    ],
    searchAriaLabel: "Rechercher",
    donate: { label: "Donate", href: "https://mfwa.org/donate" },
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/utility-bar`).then(r => r.json())
// Note: the utility bar is HTML-commented-out in the static mockup (hidden
// on purpose by the site owner). This function still extracts its data for
// completeness, but nothing currently renders it.
export async function getUtilityBar() {
  return {
    ngosource: {
      label: "NGOsource",
      badgeMark: { prefix: "NGO", emphasis: "source" },
      caption: "Equivalency Determination on File",
      url: "#ngosource",
    },
    languages: [
      { code: "en", label: "EN", href: "#lang-en", active: true },
      { code: "fr", label: "FR", href: "#lang-fr", active: false },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/hero-slides`).then(r => r.json())
export async function getHero() {
  return {
    eyebrow: "Media Foundation for West Africa",
    slides: [
      {
        title: "Media & Voices for Public Good",
        lede: "Strengthening media, freedom of expression and democratic participation across West Africa.",
        cta: { label: "Explore our work", href: "#our-work" },
      },
      {
        title: "Defending Journalists on the Front Line",
        lede: "Legal support, safety training and rapid response for reporters facing threats across the region.",
        cta: { label: "See how we help", href: "#safety" },
      },
      {
        title: "Fighting Disinformation with Facts",
        lede: "Fact-checking newsrooms and media literacy campaigns that help citizens tell truth from noise.",
        cta: { label: "See the initiative", href: "#fact-checking" },
      },
      {
        title: "Digital Rights Are Human Rights",
        lede: "Pushing back on internet shutdowns, surveillance and laws that silence people online.",
        cta: { label: "Read the campaign", href: "#digital-rights" },
      },
    ],
    // API: featured_article.image + .region + .country
    // API: featured_article.title + .excerpt + .link
    // API: featured_article.gallery[] — inner images of the featured article, auto-rotating
    featuredArticle: {
      image: {
        src: "/images/ghana1.jpg",
        alt: "Image d'illustration : une femme portant un grand bassin sur la tête sur un marché de rue au Ghana.",
      },
      region: "West Africa",
      country: "Ghana",
      eyebrow: "Latest news",
      title: "Journalists in Ghana demand stronger protection for media freedom",
      excerpt:
        "Media professionals are calling for urgent measures to ensure the safety and independence of journalists in the country.",
      link: "#article",
      linkLabel: "Read more",
      gallery: [
        {
          src: "/images/ghana2.jpg",
          alt: "Image d'illustration : danseurs en tenues traditionnelles kente lors d'un festival.",
        },
        {
          src: "/images/ghana3.jpg",
          alt: "Image d'illustration : vue aérienne de pirogues de pêche alignées sur une plage.",
        },
        {
          src: "/images/ghana4.jpg",
          alt: "Image d'illustration : rassemblement public au Black Star Square, à Accra.",
        },
      ],
    },
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/categories?parent=0`).then(r => r.json())
//         and    fetch(`${process.env.WP_API_BASE}/wp/v2/posts?_embed&per_page=4`).then(r => r.json())
export async function getLatestStories() {
  return {
    eyebrow: "What’s happening",
    title: "The latest from MFWA",
    viewAll: { label: "View all stories", href: "#stories-archive" },
    topics: [
      { label: "MFWA Now", slug: "mfwa-now", active: true },
      { label: "Freedom of Expression", slug: "freedom-of-expression" },
      { label: "Digital Rights", slug: "digital-rights" },
      { label: "Investigative Journalism", slug: "investigative-journalism" },
      { label: "Democracy", slug: "democracy" },
      { label: "Opportunities", slug: "opportunities" },
    ],
    stories: [
      {
        link: "/articles/every-dollar-invested-millions-returned",
        image: {
          src: "/images/ghana4.jpg",
          alt: "Image d'illustration : rassemblement public au Black Star Square, à Accra.",
        },
        tag: ["Ghana", "Investigative journalism"],
        heading: "Every Dollar Invested, Millions Returned",
        date: "12 Sep 2026",
        readTime: "4 min read",
      },
      {
        link: "#article-digital-rights",
        image: {
          src: "/images/ghana3.jpg",
          alt: "Image d'illustration : vue aérienne de pirogues de pêche alignées sur une plage.",
        },
        tag: ["Digital rights", "West Africa"],
        heading: "The digital rights challenges facing young people in West Africa",
        date: "10 Sep 2026",
        readTime: "5 min read",
      },
      {
        link: "#article-young-journalists",
        image: {
          src: "/images/ghana2.jpg",
          alt: "Image d'illustration : danseurs en tenues traditionnelles kente lors d'un festival.",
        },
        tag: ["Media", "Sierra Leone"],
        heading: "Supporting young journalists in Sierra Leone: from training to impact",
        date: "07 Sep 2026",
        readTime: "3 min read",
      },
      {
        link: "#article-community-radio",
        image: {
          src: "/images/ghana.jpg",
          alt: "Image d'illustration : une foule dans la rue lors d'un carnaval, avec des plumeaux colorés.",
        },
        tag: ["Democracy", "West Africa"],
        heading: "Why community radio remains vital for democracy in West Africa",
        date: "04 Sep 2026",
        readTime: "6 min read",
      },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/work-areas`).then(r => r.json())
export async function getWork() {
  return {
    eyebrow: "Our work",
    title: "What we do",
    text: "MFWA works to promote press freedom, strengthen independent media, and protect journalists through advocacy, capacity building and research.",
    link: { label: "Discover our work", href: "/programmes" },
    items: [
      {
        num: "01",
        icon: "shield",
        heading: "Freedom of Expression",
        desc: "Protecting journalists and media rights.",
        href: "/programmes/freedom-of-expression",
      },
      {
        num: "02",
        icon: "network",
        heading: "Digital Rights",
        desc: "Safer digital spaces for everyone.",
        href: "/programmes/digital-rights",
      },
      {
        num: "03",
        icon: "document",
        heading: "Media & Democracy",
        desc: "Stronger media for informed societies.",
        href: "/programmes/media-democracy-governance",
      },
      {
        num: "04",
        icon: "connections",
        heading: "Peace & Social Cohesion",
        desc: "Media for more inclusive and resilient communities.",
        href: "/programmes/media-peace-social-cohesion",
      },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/impact-stats`).then(r => r.json())
export async function getImpactStats() {
  return {
    media: { src: "/images/ghana5.jpg", alt: "" },
    titleLines: ["From story", "to change."],
    text: "Through investigative reporting, research and advocacy, MFWA has helped expose injustice, strengthen media and drive real change across West Africa.",
    cta: { label: "See our impact", href: "/impact-stories" },
    stats: [
      { count: 16, suffix: "", label: "countries" },
      { count: 100, suffix: "+", label: "partners" },
      { count: 1000, suffix: "+", label: "journalists supported" },
      { count: 300, suffix: "+", label: "stories with impact" },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/posts?category=impact&per_page=3&_embed`).then(r => r.json())
export async function getImpactHighlights() {
  return {
    eyebrow: "Impact",
    title: "Stories of impact",
    viewAll: { label: "View all stories", href: "/impact-stories" },
    featured: {
      link: "#article-advocacy-training",
      image: {
        src: "/images/ghana5.jpg",
        alt: "Image d'illustration : l'arche de l'indépendance du Ghana, portant l'inscription « Freedom and Justice ».",
      },
      tag: ["Ghana", "Impact"],
      heading: "How advocacy training helped protect 40 journalists across Ghana",
      date: "15 Sep 2026",
      readTime: "4 min read",
      excerpt:
        "A year after MFWA's safety and legal-support programme launched, newsroom leaders report fewer threats and faster response when journalists are at risk.",
      ctaLabel: "Read the story",
    },
    compact: [
      {
        link: "#article-digital-safety",
        image: {
          src: "/images/ghana4.jpg",
          alt: "Image d'illustration : rassemblement public au Black Star Square, Accra.",
        },
        tag: ["West Africa", "Impact"],
        heading: "Digital safety workshops cut online attacks on young reporters in half",
        date: "11 Sep 2026",
        readTime: "3 min read",
      },
      {
        link: "#article-community-radio-impact",
        image: {
          src: "/images/ghana1.jpg",
          alt: "Image d'illustration : scène de rue animée sur un marché ouest-africain.",
        },
        tag: ["Sierra Leone", "Impact"],
        heading: "Community radio partnerships reached 200,000 listeners with civic reporting",
        date: "08 Sep 2026",
        readTime: "3 min read",
      },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/reach`).then(r => r.json())
// Note: `countries` carries the map hit coordinates, the name used by the
// two-column country list, and the `link` each country's map shape /
// marker / list entry navigates to on click — now the matching
// /where-we-work/<slug> page (see getCountryPage), ported from the real
// mfwa.org "country" archive for that country (e.g. Benin:
// https://mfwa.org/benin/). Slugs were confirmed against the live site's
// own "country" taxonomy rather than guessed, since a couple don't follow
// the obvious pattern (Cabo Verde's term is "Cape Verde" → cape-verde;
// Côte d’Ivoire → cote-divoire; The Gambia → gambia, not the-gambia).
export async function getReach() {
  return {
    eyebrow: "Our reach",
    titleLines: ["16 countries.", "One region."],
    text: "We work across West Africa, supporting independent media and protecting press freedom in some of the region\u2019s most challenging environments.",
    link: { label: "Explore our countries", href: "/where-we-work" },
    map: {
      ariaLabel: "Carte des 16 pays d'Afrique de l'Ouest o\u00f9 intervient la MFWA",
      // Base country geometries (Natural Earth 1:110m via world-atlas),
      // self-hosted so the map never depends on a third-party CDN at runtime.
      geographyUrl: "/data/countries-110m.json",
      // Frames West Africa the way the reference design does. Tuned by eye
      // against the rendered map \u2014 adjust `scale`/`center` together if the
      // covered countries ever need to sit differently in the frame.
      projection: "geoMercator",
      projectionConfig: { scale: 950, center: [-4, 13] },
    },
    // Alphabetical, matching the order of the static two-column list
    // (8 per column when rendered). `id` is the ISO 3166-1 numeric code,
    // used to match this list against the topojson features \u2014 far more
    // reliable than matching on country name spelling, which varies by
    // dataset (it is NOT the WordPress "country" taxonomy term id \u2014 see
    // getWhereWeWorkPage()'s note on that distinction). `coordinates` is
    // [longitude, latitude] of the capital, used to place each country's
    // marker dot (Cabo Verde has no landmass in the 110m dataset at all,
    // so it renders as a marker only, matching the reference design where
    // it shows as a small offshore dot cluster). `link` now points at the
    // merged Where We Work \u00d7 Issues explorer (see getWhereWeWorkPage())
    // rather than a dedicated per-country page.
    countries: [
      { name: "Benin", id: "204", slug: "benin", link: "/where-we-work?country=benin", coordinates: [2.3912, 6.3703] },
      { name: "Burkina Faso", id: "854", slug: "burkina-faso", link: "/where-we-work?country=burkina-faso", coordinates: [-1.5197, 12.3714] },
      { name: "Cabo Verde", id: "132", slug: "cape-verde", link: "/where-we-work?country=cape-verde", coordinates: [-23.5133, 14.9330] },
      { name: "C\u00f4te d\u2019Ivoire", id: "384", slug: "cote-divoire", link: "/where-we-work?country=cote-divoire", coordinates: [-4.0083, 5.3599] },
      { name: "The Gambia", id: "270", slug: "gambia", link: "/where-we-work?country=gambia", coordinates: [-16.5790, 13.4549] },
      { name: "Ghana", id: "288", slug: "ghana", link: "/where-we-work?country=ghana", coordinates: [-0.1870, 5.6037] },
      { name: "Guinea", id: "324", slug: "guinea", link: "/where-we-work?country=guinea", coordinates: [-13.5784, 9.6412] },
      { name: "Guinea-Bissau", id: "624", slug: "guinea-bissau", link: "/where-we-work?country=guinea-bissau", coordinates: [-15.5977, 11.8636] },
      { name: "Liberia", id: "430", slug: "liberia", link: "/where-we-work?country=liberia", coordinates: [-10.7605, 6.2907] },
      { name: "Mali", id: "466", slug: "mali", link: "/where-we-work?country=mali", coordinates: [-8.0029, 12.6392] },
      { name: "Mauritania", id: "478", slug: "mauritania", link: "/where-we-work?country=mauritania", coordinates: [-15.9582, 18.0735] },
      { name: "Niger", id: "562", slug: "niger", link: "/where-we-work?country=niger", coordinates: [2.1128, 13.5127] },
      { name: "Nigeria", id: "566", slug: "nigeria", link: "/where-we-work?country=nigeria", coordinates: [7.3986, 9.0765] },
      { name: "Senegal", id: "686", slug: "senegal", link: "/where-we-work?country=senegal", coordinates: [-17.4677, 14.7167] },
      { name: "Sierra Leone", id: "694", slug: "sierra-leone", link: "/where-we-work?country=sierra-leone", coordinates: [-13.2317, 8.4657] },
      { name: "Togo", id: "768", slug: "togo", link: "/where-we-work?country=togo", coordinates: [1.2314, 6.1725] },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/expertise`).then(r => r.json())
export async function getExpertise() {
  return {
    eyebrow: "Our expertise",
    title: "Knowledge. Analysis. Impact.",
    text: "We generate evidence and share insights to inform better policies, stronger media and more resilient democracies.",
    link: { label: "Explore our expertise", href: "#expertise-detail" },
    items: [
      {
        icon: "research",
        headingLines: ["Research &", "Analysis"],
        desc: "Evidence for lasting change.",
      },
      {
        icon: "policy",
        headingLines: ["Policy &", "Advocacy"],
        desc: "Amplifying voices, shaping policy.",
      },
      {
        icon: "capacity",
        headingLines: ["Capacity", "Building"],
        desc: "Stronger skills, stronger media.",
      },
      {
        icon: "innovation",
        headingLines: ["Media", "Innovation"],
        desc: "Technology for media freedom.",
      },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/cta`).then(r => r.json())
export async function getCta() {
  return {
    media: { src: "/images/4.jpg", alt: "" },
    eyebrow: "Take action",
    titleLines: ["Stronger media", "Stronger voices"],
    text: "Support our work and help build a future where media, rights and democracy thrive.",
    button: { label: "Support MFWA", href: "#donate" },
    links: [
      { label: "Partner", href: "#partner" },
      { label: "Engage", href: "#engage" },
      { label: "Contact", href: "#contact" },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/menu?slug=footer`).then(r => r.json())
export async function getFooter() {
  return {
    logo: { src: "/images/mfwa-logo-01.png", alt: "MFWA" },
    homeAriaLabel: "Media Foundation for West Africa — accueil",
    brandNameLines: ["Media Foundation", "for West Africa"],
    // Mirrors getHeader()'s nav — see the note there.
    nav: [
      { label: "Our Work", href: "/programmes" },
      { label: "Where We Work", href: "/where-we-work" },
      { label: "Stories", href: "/#stories" },
      { label: "Our Impact", href: "/impact-stories" },
      { label: "About", href: "/about-us" },
    ],
    social: [
      { network: "LinkedIn", url: "#" },
      { network: "X (Twitter)", url: "#" },
      { network: "YouTube", url: "#" },
      { network: "Facebook", url: "#" },
      { network: "Instagram", url: "#" },
    ],
    taglineLines: ["For a free and independent media", "in West Africa."],
    copy: "© 2026 MFWA. All rights reserved.",
    legal: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Contact", href: "#contact" },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/posts?slug=${slug}&_embed`).then(r => r.json())
// Note: this is a layout proposal with placeholder ("fake") content — every
// slug currently resolves to the same demo article so the article-page
// design (hero, share icons, body, related stories, newsletter) can be
// reviewed before the WordPress API is wired in. generateStaticParams()
// only pre-renders this one demo slug for now.
// Note: `author` is kept in the data shape (WordPress will provide one)
// but is intentionally not surfaced by ArticleHeader.js in this layout.
// No `excerpt` here on purpose — that belongs to the story-card shape
// used by pages that list/link to the article (Latest, RelatedArticles),
// not to the article page itself.
export async function getArticle(slug) {
  return {
    slug,
    tag: ["Ghana", "Investigative journalism"],
    title: "Every Dollar Invested, Millions Returned",
    author: {
      name: "Ama Boateng",
      role: "Senior Investigative Reporter, MFWA",
      avatar: { src: "/images/ghana2.jpg", alt: "" },
    },
    date: "12 Sep 2026",
    readTime: "4 min read",
    heroImage: {
      src: "/images/ghana4.jpg",
      alt: "Image d'illustration : rassemblement public au Black Star Square, à Accra.",
    },
    share: {
      url: "https://mfwaonline.org/articles/every-dollar-invested-millions-returned",
      title: "Every Dollar Invested, Millions Returned",
    },
    body: [
      {
        type: "paragraph",
        text: "In 2023, MFWA quietly began funding a handful of community radio stations across three regions with a single condition: every grant had to fund original investigative reporting, not equipment or salaries. Two years on, that small bet has produced an outsized return.",
      },
      {
        type: "paragraph",
        text: "Across the six stations tracked for this report, journalists supported by the programme filed 214 original investigations. Thirty-one of them led directly to public inquiries, audits or policy reversals — a hit rate that surprised even the programme's own designers.",
      },
      {
        type: "heading",
        text: "A grant that kept paying back",
      },
      {
        type: "paragraph",
        text: "«We expected maybe one or two stories a year to really land,» says programme lead Kwame Asante. «What we underestimated was how much a small, reliable grant changes a newsroom's appetite for risk. Editors started assigning reporters to stories that would previously have been shelved for lack of budget.»",
      },
      {
        type: "quote",
        text: "The money was never the point. It was permission to spend three weeks on one story instead of covering three stories in three days.",
        attribution: "Community radio editor, Northern Region",
      },
      {
        type: "paragraph",
        text: "The clearest case is a station in the Northern Region, whose reporting on irregularities in a district water contract triggered an independent audit that recovered funds equivalent to more than 40 times the station's annual grant.",
      },
      {
        type: "heading",
        text: "What comes next",
      },
      {
        type: "paragraph",
        text: "MFWA is now expanding the model to four additional stations in 2027, with a lighter reporting requirement and a peer-mentoring component pairing newer investigative reporters with the programme's first cohort.",
      },
      {
        type: "paragraph",
        text: "The full dataset behind this report, including methodology and station-level outcomes, will be published alongside MFWA's annual impact report later this year.",
      },
    ],
    related: [
      {
        link: "#article-digital-rights",
        image: {
          src: "/images/ghana3.jpg",
          alt: "Image d'illustration : vue aérienne de pirogues de pêche alignées sur une plage.",
        },
        tag: ["Digital rights", "West Africa"],
        heading: "The digital rights challenges facing young people in West Africa",
        date: "10 Sep 2026",
        readTime: "5 min read",
      },
      {
        link: "#article-young-journalists",
        image: {
          src: "/images/ghana2.jpg",
          alt: "Image d'illustration : danseurs en tenues traditionnelles kente lors d'un festival.",
        },
        tag: ["Media", "Sierra Leone"],
        heading: "Supporting young journalists in Sierra Leone: from training to impact",
        date: "07 Sep 2026",
        readTime: "3 min read",
      },
      {
        link: "#article-community-radio",
        image: {
          src: "/images/ghana.jpg",
          alt: "Image d'illustration : une foule dans la rue lors d'un carnaval, avec des plumeaux colorés.",
        },
        tag: ["Democracy", "West Africa"],
        heading: "Why community radio remains vital for democracy in West Africa",
        date: "04 Sep 2026",
        readTime: "6 min read",
      },
    ],
  };
}

// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/newsletter`).then(r => r.json())
// The form itself will eventually POST to a subscribe endpoint (Mailchimp,
// Brevo, or a custom WP route) — see Newsletter.js for the placeholder
// submit handler.
export async function getNewsletter() {
  return {
    eyebrow: "Stay informed",
    titleLines: ["Get our stories", "in your inbox"],
    text: "A monthly digest of investigations, press-freedom alerts and impact stories from across West Africa.",
    placeholder: "you@email.com",
    buttonLabel: "Subscribe",
    privacyNote: "No spam. Unsubscribe anytime.",
  };
}

// -- Category / archive page ---------------------------------------------
//
// Superseded by the merged Where We Work × Issues explorer below —
// /category/<slug> now redirects to /where-we-work?category=<slug> (see
// next.config.mjs) instead of rendering this as its own page. Left in
// place (still correct, just unused) rather than deleted, in case a
// single-category archive without the map is ever wanted again.

const CATEGORY_PAGE_SIZE = 10;

// Returns null when the slug doesn't match a real WordPress category, so
// the page can call notFound() instead of rendering an empty archive.
export async function getCategoryPage(slug) {
  const category = await getWpCategoryBySlug(slug);
  if (!category) return null;

  const { items, totalPages, total } = await getWpCategoryPosts(category.id, {
    page: 1,
    perPage: CATEGORY_PAGE_SIZE,
  });

  return {
    slug: category.slug,
    label: category.name,
    eyebrow: "Category",
    description: category.description || `Reporting, updates and impact stories tagged ${category.name}.`,
    articles: items,
    totalPages,
    total,
  };
}

// -- Where We Work / country archive page -----------------------------------
//
// Superseded the same way as getCategoryPage() just above —
// /where-we-work/<slug> now redirects to /where-we-work?country=<slug>.
// Kept for the same reason (still correct, just unused).
export async function getCountryPage(slug) {
  const country = await getWpCountryBySlug(slug);
  if (!country) return null;

  const { items, totalPages, total } = await getWpCountryPosts(country.id, {
    page: 1,
    perPage: CATEGORY_PAGE_SIZE,
  });

  return {
    slug: country.slug,
    label: country.name,
    eyebrow: "Where we work",
    description: country.description || `Reporting, updates and impact stories from ${country.name}.`,
    articles: items,
    totalPages,
    total,
  };
}

// -- Where We Work × Issues explorer -----------------------------------
//
// Originally two separate destinations: this "Where We Work" hub (map +
// country list), and a not-yet-built "Issues" menu meant to wire up the
// 13 /category/<slug> archives. Merged into one explorer at Yv's call
// (2026-09-25): every article on the live site already carries both a
// country AND a category term (see mapPost()'s two-part "Category ·
// Country" tag in lib/wp.js), so browsing by only one axis at a time just
// loses the other. This page now combines the interactive map (country
// filter) with a row of chips for the 13 Issues categories, both
// filtering the same article grid — /where-we-work/<slug> and
// /category/<slug> redirect here as ?country=/?category= (see
// next.config.mjs) rather than staying separate static archives.
//
// Country data (map/list) still comes from getReach() — single source of
// truth for the 16-country dataset. Category data comes fresh from
// getWpCategories(). Slugs match the live site's taxonomies exactly
// (country verified against /wp-json/wp/v2/country; the 13 category
// slugs match the live "Issues" submenu, read from mfwa.org's own nav) —
// note "cote-divoire", "cape-verde" and "gambia" (not "the-gambia") don't
// follow the obvious pattern from their display names; see getReach()'s
// own note.
//
// Map restyle (2026-09-25, at Yv's call): adopts the look of
// pressattack.africa/tracker — a choropleth shaded by intensity, a hover
// panel with "recent stories", a small stat strip — without adopting its
// data model. That tracker is backed by a real per-incident database
// (state-level location, a severity bucket, gender/assailant fields per
// record); MFWA's WordPress content has none of that, only articles
// tagged by country + category at country-level granularity. So
// "severity" here is really "how much has been published on this
// country" (optionally scoped to the active Issue filter, so the map
// answers "where is THIS topic reported most" when a category chip is
// selected), bucketed relative to the busiest country CURRENTLY in view
// rather than fixed absolute thresholds — those would need retuning
// forever as the archive grows, where a relative scale doesn't.
function severityOf(count, maxCount) {
  if (!count) return "none";
  const ratio = maxCount > 0 ? count / maxCount : 0;
  if (ratio <= 0.25) return "low";
  if (ratio <= 0.5) return "moderate";
  if (ratio <= 0.75) return "high";
  return "critical";
}

const EXPLORE_PAGE_SIZE = 12;
// Small on purpose: this only feeds the map's hover panel ("recent
// stories" for that country), not a results grid — see countryStats
// below.
const MAP_RECENT_PER_COUNTRY = 2;

const ISSUE_CATEGORY_SLUGS = [
  "access-to-information",
  "digital-rights",
  "free-expression-and-the-law",
  "free-expression-violations",
  "freedom-of-assembly",
  "freedom-of-expression",
  "general-news",
  "impunity",
  "investigative-journalism",
  "media-development",
  "regional-development",
  "transparency-and-accountability",
  "safety-of-journalists",
];

export async function getWhereWeWorkPage({ countrySlug, categorySlug } = {}) {
  const [reach, categories] = await Promise.all([
    getReach(),
    getWpCategories(ISSUE_CATEGORY_SLUGS),
  ]);

  const activeCountry = countrySlug
    ? reach.countries.find((c) => c.slug === countrySlug) ?? null
    : null;
  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug) ?? null
    : null;

  // getReach()'s country `id` is the ISO 3166-1 numeric code used to
  // match the map's topojson (see its own note) — a different id space
  // from the WordPress "country" taxonomy term id actually needed to
  // filter /posts. All 16 are resolved here in one batched request
  // (getWpCountriesBySlug) rather than one lookup per country, since the
  // map restyle below (severity/recent stories) needs every country's WP
  // id anyway, not just the active one.
  const wpCountries = await getWpCountriesBySlug(reach.countries.map((c) => c.slug));
  const wpCountryBySlug = new Map(wpCountries.map((c) => [c.slug, c]));
  const activeWpCountry = activeCountry ? wpCountryBySlug.get(activeCountry.slug) ?? null : null;

  // One /posts request per country (small perPage — this only needs a
  // count and a couple of recent headlines, not a full page), scoped to
  // the active category so the choropleth reflects the current Issue
  // filter when one is set. Cached via wp.js's REVALIDATE_SECONDS like
  // every other WP call here, so this doesn't mean 16 live requests on
  // every render — see the note above severityOf().
  const countryStats = await Promise.all(
    reach.countries.map(async (c) => {
      const wpCountry = wpCountryBySlug.get(c.slug);
      if (!wpCountry) return { slug: c.slug, count: 0, recent: [] };
      const { items: recent, total: count } = await getWpFilteredPosts({
        countryId: wpCountry.id,
        categoryId: activeCategory?.id,
        page: 1,
        perPage: MAP_RECENT_PER_COUNTRY,
      });
      return { slug: c.slug, count, recent };
    })
  );
  const statsBySlug = new Map(countryStats.map((s) => [s.slug, s]));
  const maxCount = Math.max(0, ...countryStats.map((s) => s.count));
  const countriesReporting = countryStats.filter((s) => s.count > 0).length;
  const busiestSlug = maxCount > 0 ? countryStats.find((s) => s.count === maxCount)?.slug ?? null : null;
  const busiestCountry = busiestSlug
    ? reach.countries.find((c) => c.slug === busiestSlug)?.name ?? null
    : null;

  const { items, totalPages, total } = await getWpFilteredPosts({
    countryId: activeWpCountry?.id,
    categoryId: activeCategory?.id,
    page: 1,
    perPage: EXPLORE_PAGE_SIZE,
  });

  // Every filter link carries the OTHER axis's current selection along
  // with it (so switching country never drops the category filter, and
  // vice versa), and re-clicking an already-active filter clears it.
  function countryHref(slug) {
    const params = new URLSearchParams();
    if (slug !== activeCountry?.slug) params.set("country", slug);
    if (activeCategory) params.set("category", activeCategory.slug);
    const qs = params.toString();
    return `/where-we-work${qs ? `?${qs}` : ""}`;
  }

  function categoryHref(slug) {
    const params = new URLSearchParams();
    if (activeCountry) params.set("country", activeCountry.slug);
    if (slug !== activeCategory?.slug) params.set("category", slug);
    const qs = params.toString();
    return `/where-we-work${qs ? `?${qs}` : ""}`;
  }

  return {
    hero: {
      crumbs: [{ label: "Where we work" }],
      eyebrow: "Where we work",
      titleLines: ["16 countries.", "One region."],
      lede: "The MFWA works to promote freedom of expression, press freedom, access to information, internet freedom and media development throughout the 16 countries of West Africa — the 15 member states of ECOWAS, and Mauritania.",
      primary: { label: "About MFWA", href: "/about-us" },
      secondary: { label: "Our programmes", href: "/programmes" },
      // This hub's own children (the 16 countries + 13 issues) already
      // fill the full explorer section below, so — unlike
      // PROGRAMME_TILES, which cross-links a page to its four sibling
      // programmes — these tiles cross-link out to the other major site
      // destinations instead, the same "ab-tiles" treatment used on
      // /programmes to keep this hero from leaving the wide empty margin
      // a tile-less "ab-hero__copy--wide" hero otherwise does.
      tiles: [
        { id: "donate", label: "Donate", href: "https://mfwa.org/donate", variant: "halfspin", tone: "dark" },
        { id: "programmes", label: "Our Programmes", href: "/programmes", variant: "broadcast", tone: "pale" },
        { id: "about", label: "About MFWA", href: "/about-us", variant: "press", tone: "white" },
        { id: "involved", label: "Get Involved", href: "/about-us/get-involved", variant: "megaphone", tone: "pale" },
      ],
    },
    intro: [
      "In every country, we work through our national partner organisations, our in-country freedom of expression rights monitors, and members of our Network of Human Rights Lawyers, who offer pro-bono legal services in defence of victims of free expression rights violations.",
    ],
    map: reach.map,
    countries: reach.countries.map((c) => {
      const stats = statsBySlug.get(c.slug);
      const count = stats?.count ?? 0;
      return {
        name: c.name,
        id: c.id,
        slug: c.slug,
        href: countryHref(c.slug),
        coordinates: c.coordinates,
        // Map restyle fields (see the note above severityOf()): `count`
        // and `recent` are scoped to the active category filter, so they
        // change along with the chips, not just with the country map.
        count,
        severity: severityOf(count, maxCount),
        recent: stats?.recent ?? [],
      };
    }),
    categories: categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      href: categoryHref(c.slug),
    })),
    activeCountrySlug: activeCountry?.slug ?? null,
    activeCategorySlug: activeCategory?.slug ?? null,
    allIssuesHref: activeCountry ? `/where-we-work?country=${activeCountry.slug}` : "/where-we-work",
    articles: items,
    totalPages,
    total,
    // Small stat strip above the map, echoing the tracker's look with
    // numbers this data model actually has (no verified-deaths-style
    // figures to show, since there's no incident database — see the note
    // above severityOf()).
    stats: {
      total,
      totalCountries: reach.countries.length,
      countriesReporting,
      busiestCountry,
    },
  };
}

// -- Our Impact / Impact Stories --------------------------------------------
//
// A single archive page (not a hub with sub-pages, so this is a plain
// static route rather than a [slug] family): mirrors the live site's own
// /impact-stories/ page (hero title + tagline, straight into a paginated
// story grid, 12 per page — see getWpImpactStories in lib/wp.js for the
// data-model caveat) and its newsletter sign-up block, reusing the
// existing Newsletter component/getNewsletter() as-is rather than
// inventing page-specific copy.
const IMPACT_STORIES_PAGE_SIZE = 12;

export async function getImpactStoriesPage() {
  const { items, totalPages, total } = await getWpImpactStories({
    page: 1,
    perPage: IMPACT_STORIES_PAGE_SIZE,
  });

  return {
    eyebrow: "Our impact",
    label: "Impact Stories",
    description:
      "Documented outcomes from our investigative journalism, advocacy and capacity-building work across West Africa — policy reversals, recovered public funds, safer newsrooms and recognised journalism.",
    articles: items,
    totalPages,
    total,
  };
}

// -- About Us --------------------------------------------------------------
//
// Content audit (Sept 2026): on the live site, the intro paragraph, Mission,
// Vision and the 3 Strategic Objectives are duplicated verbatim across
// /about-us/, /about-us/vision-mission/ and /about-us/objectives/ — the
// latter is an entire page whose content is a strict subset of the other
// two. This page says each of those things exactly once: Mission / Vision
// / Strategic Goal as the three `drives` cards, Strategic Objectives and
// Core Values side by side in `strategy`. Everything below (statements,
// staff/board counts, network descriptions, statuses quoted in the FAQ) is
// taken from the live pages, read directly rather than guessed:
//   /about-us/, /about-us/our-staff/, /about-us/our-board/,
//   /about-us/our-partners/, /about-us/our-partners/our-networks/,
//   /about-us/get-involved/
// Sections that stay unique on the live site (the full staff directory,
// the board, partners, Intern/Volunteer detail) link out to mfwa.org — the
// same pattern as Reach.js's country links — until they are ported.
// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/about`).then(r => r.json())
export async function getAboutUs() {
  return {
    hero: {
      eyebrow: "About MFWA",
      titleLines: ["Defending the truth,", "and the people", "who tell it."],
      lede: "A regional independent NGO with national partner organisations in all 16 countries of West Africa — the region’s biggest media development and freedom of expression organisation.",
      primary: { label: "Get involved", href: "#get-involved" },
      secondary: { label: "Our mission", href: "#drives" },
    },

    glance: {
      eyebrow: "At a glance",
      title: "One organisation, sixteen countries",
      note: "Headquartered in Accra, Ghana",
      stats: [
        { label: "Countries covered", count: 16 },
        { label: "National partner organisations", count: 16 },
        { label: "Team members", count: 36 },
        { label: "Regional & global networks", count: 6 },
      ],
      credentials: [
        "UN ECOSOC Consultative Status",
        "AU Observer Status (ACHPR)",
        "NGOSource Equivalency Determination",
        "Secretariat of AFEX",
      ],
    },

    drives: {
      eyebrow: "What drives us",
      title: "Mission, vision & goal",
      text: "One mission, one vision and one goal for the 2025–2029 strategic period — said once, in one place.",
      cards: [
        {
          id: "mission",
          num: "01",
          icon: "voice",
          title: "Our Mission",
          text: "To empower, promote and defend media and civic voices for good governance and democratic development in West Africa.",
        },
        {
          id: "vision",
          num: "02",
          icon: "eye",
          title: "Our Vision",
          text: "A peaceful West Africa in which media freedom is fully exercised and all persons are able to express themselves and participate in governance processes without fear, threat or intimidation.",
        },
        {
          id: "goal",
          num: "03",
          icon: "target",
          title: "Strategic Goal",
          text: "Media and civic voices respected and defended in West Africa, and trust in democratic institutions and the media restored through professional journalism and empowered civic voices that hold power to account.",
        },
      ],
    },

    strategy: {
      eyebrow: "Strategic plan",
      title: "Our strategy, 2025–2029",
      objectives: {
        label: "Where we are heading",
        title: "Strategic Objectives",
        items: [
          "A freer and safer environment for independent journalism and expression, offline and online",
          "Strengthened media capacity that enables participatory, responsive, transparent and accountable governance",
          "Increased efficiency, influence and impact of MFWA and its partner organisations",
        ],
      },
      values: {
        label: "How we work",
        title: "Core Values",
        items: [
          "Equality, liberty & social justice",
          "Independence, non-partisanship & non-sectarianism",
          "Excellence & professionalism",
          "Resilience",
          "Digital inclusion",
          "Accountability, transparency & good stewardship",
          "Teamwork, collaboration, cooperation, partnership & solidarity",
        ],
      },
    },

    people: {
      eyebrow: "Who we are",
      title: "The people behind the work",
      text: "Journalists, researchers, lawyers and programme specialists — based in Accra, with correspondents in nearly every country of the region.",
      rows: [
        {
          icon: "team",
          label: "Team members",
          count: 36,
          text: "Full-time staff, fellows and interns at our Accra headquarters, plus correspondents, researchers and a network of lawyers across West Africa who provide legal assistance.",
          href: "/about-us/our-staff",
          linkLabel: "Meet the team",
        },
        {
          icon: "board",
          label: "Board members",
          count: 6,
          text: "Chaired by Sophie Ly Sow, the board brings together the Executive Director and four members who provide governance and strategic oversight.",
          href: "/about-us/our-board",
          linkLabel: "See the board",
        },
      ],
    },

    networks: {
      eyebrow: "Our networks",
      title: "Part of a wider movement",
      text: "We belong to national, regional and international networks that build synergies, mutual learning and broad collaborative advocacy.",
      all: { label: "All our partners", href: "/about-us/our-partners" },
      href: "/about-us/our-partners/our-networks",
      items: [
        { id: "ifex", name: "IFEX", scope: "Global", desc: "Local and international organisations defending free expression as a fundamental human right.", href: "/about-us/our-partners/our-networks#ifex" },
        { id: "afex", name: "AFEX", scope: "Continental", desc: "Africa’s most prominent free-expression organisations — MFWA serves as its Secretariat.", href: "/about-us/our-partners/our-networks#afex" },
        { id: "apai", name: "APAI", scope: "Continental", desc: "The African Platform on Access to Information, advancing the right to information.", href: "/about-us/our-partners/our-networks#apai" },
        { id: "wacsof", name: "WACSOF", scope: "Regional", desc: "The West African Civil Society Forum, uniting CSOs from the fifteen ECOWAS states.", href: "/about-us/our-partners/our-networks#wacsof" },
        { id: "rti-ghana", name: "RTI Ghana", scope: "National", desc: "The coalition behind Ghana’s Right to Information law and its implementation.", href: "/about-us/our-partners/our-networks#rti-ghana" },
        { id: "afic", name: "AFIC", scope: "Continental", desc: "The African Freedom of Information Centre, around 30 CSOs promoting access to information.", href: "/about-us/our-partners/our-networks#afic" },
      ],
    },

    getInvolved: {
      eyebrow: "Get involved",
      title: "Three ways to stand with us",
      text: "Contribute to our work by making a donation, or join our team as a volunteer or an intern.",
      contact: { label: "info@mfwa.org", href: "mailto:info@mfwa.org" },
      actions: [
        {
          num: "01",
          label: "Donate",
          desc: "Support investigations, legal aid for journalists and press-freedom advocacy across West Africa.",
          href: "https://mfwa.org/donate",
        },
        {
          num: "02",
          label: "Intern",
          desc: "Join the Accra team and work alongside our programme, research and investigative staff.",
          href: "/about-us/get-involved/intern",
        },
        {
          num: "03",
          label: "Volunteer",
          desc: "Lend your time and skills to campaigns for media freedom and civic participation.",
          href: "/about-us/get-involved/volunteer",
        },
      ],
    },

    faq: {
      eyebrow: "FAQ",
      title: "Questions, answered",
      contact: { label: "Contact us", href: "mailto:info@mfwa.org" },
      items: [
        {
          q: "What is the MFWA?",
          a: "The Media Foundation for West Africa is a regional independent non-governmental organisation with a network of national partner organisations in all 16 countries of West Africa. It is the biggest and most influential media development and freedom of expression organisation in the region.",
        },
        {
          q: "Where does the MFWA work?",
          a: "Across all 16 countries of West Africa. Our headquarters are in Accra, Ghana, and we have correspondents and researchers in nearly every country of the region, as well as a network of lawyers who provide legal assistance.",
        },
        {
          q: "What official status does the MFWA hold?",
          a: "The MFWA has UN ECOSOC Consultative Status and, at the African Union level, Observer Status with the African Commission on Human and Peoples’ Rights. It holds an Equivalency Determination from NGOSource certifying it as the equivalent of a US public charity, and has a partnership agreement with ECOWAS.",
        },
        {
          q: "What is AFEX?",
          a: "The Africa Freedom of Expression Exchange is the continental network of the most prominent free expression and media development organisations in Africa. The MFWA serves as its Secretariat.",
        },
        {
          q: "How can I support the MFWA?",
          a: "You can make a donation or join our team as a staff member, a volunteer or an intern. For partnership or collaboration, write to info@mfwa.org.",
        },
      ],
    },
  };
}

// -- About Us › Our Staff ------------------------------------------------
//
// Directory data lives in lib/staff.js (see the note there on why it isn't
// fetched from WordPress yet). Team counts for the hero tiles are derived
// from it so they can never drift from the grid.
// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/team`).then(r => r.json())
export async function getStaffPage() {
  const teams = STAFF_TEAMS.map((team) => ({
    ...team,
    count: team.id === "all" ? STAFF.length : STAFF.filter((p) => p.team === team.id).length,
  }));
  return {
    hero: {
      crumbs: [{ label: "About us", href: "/about-us" }, { label: "Our staff" }],
      eyebrow: "Our staff",
      titleLines: ["The people", "behind the work."],
      lede: "Our Accra headquarters brings together full-time staff, fellows and interns — supported by correspondents and researchers in nearly every country of West Africa, and a network of lawyers who provide legal assistance.",
      primary: { label: "Meet the team", href: "#team" },
      secondary: { label: "Work with us", href: "#get-involved" },
    },
    teams,
    directory: {
      eyebrow: "The team",
      title: "Meet our staff",
      text: "Select a portrait to read the full profile, then browse from one profile to the next.",
      people: STAFF,
    },
  };
}

// -- About Us › Our Board ------------------------------------------------
//
// Board data lives in lib/board.js. Unlike the staff directory, the board
// is small enough (6 people) that it doesn't need a team filter — the
// hero tiles below are read-only counts by governance role.
// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/board`).then(r => r.json())
export async function getBoardPage() {
  const countByRole = (key) => BOARD.filter((p) => p.roleKey === key).length;
  return {
    hero: {
      crumbs: [{ label: "About us", href: "/about-us" }, { label: "Our board" }],
      eyebrow: "Our board",
      titleLines: ["Governance,", "at a glance."],
      lede: "MFWA is governed by a six-member board chaired by Sophie Ly Sow, bringing together the Executive Director and four independent members who provide strategic oversight.",
      primary: { label: "Meet the board", href: "#board" },
      secondary: { label: "Meet the team", href: "/about-us/our-staff" },
    },
    tiles: [
      { id: "all", label: "Board", count: BOARD.length, variant: "press", tone: "dark" },
      { id: "chair", label: BOARD_ROLES.chair, count: countByRole("chair"), variant: "quote", tone: "pale" },
      { id: "director", label: BOARD_ROLES.director, count: countByRole("director"), variant: "mic", tone: "white" },
      { id: "member", label: "Board Members", count: countByRole("member"), variant: "orbit", tone: "pale" },
    ],
    directory: {
      eyebrow: "The board",
      title: "Meet our board",
      text: "Select a portrait to read the full profile, then browse from one profile to the next.",
      people: BOARD,
    },
  };
}

// -- About Us › Get Involved ---------------------------------------------
//
// Content audit (Sept 2026): the live hub page (/about-us/get-involved/)
// is three quick-link tabs — Donate, Intern, Volunteer. Donate goes to
// https://mfwa.org/donate, an actual payment form, which stays an
// external link rather than being rebuilt here. Intern and Volunteer are
// full pages (/about-us/get-involved/vacancy/ and /volunteer/) ported in
// full below; the hub only teases them.
// Future: return fetch(`${process.env.WP_API_BASE}/mfwa/v1/get-involved`).then(r => r.json())
export async function getGetInvolvedPage() {
  return {
    hero: {
      crumbs: [{ label: "About us", href: "/about-us" }, { label: "Get involved" }],
      eyebrow: "Get involved",
      titleLines: ["Put your energy", "where it counts."],
      lede: "You can contribute to our work by making a donation, or joining our team as a volunteer or an intern. For partnership or collaboration, write to info@mfwa.org.",
      primary: { label: "Donate", href: "https://mfwa.org/donate" },
      secondary: { label: "Explore the ways", href: "#ways" },
    },
    tiles: [
      { id: "donate", label: "Donate", variant: "halfspin", tone: "dark", href: "https://mfwa.org/donate" },
      { id: "intern", label: "Intern", variant: "tower", tone: "pale", href: "/about-us/get-involved/intern" },
      { id: "volunteer", label: "Volunteer", variant: "megaphone", tone: "white", href: "/about-us/get-involved/volunteer" },
    ],
    ways: {
      eyebrow: "Two ways to join the team",
      title: "Intern or volunteer",
      panels: [
        {
          id: "intern",
          tone: "navy",
          motif: "tower",
          eyebrow: "Internship",
          title: "Join as an intern",
          text: "Six to 24-week placements with hands-on training in advocacy and project management — open to students and graduates across West Africa and beyond.",
          chips: ["6–24 week placements", "Open to graduates & final-year students", "Working knowledge of MS Office"],
          link: { label: "Learn more about interning", href: "/about-us/get-involved/intern" },
        },
        {
          id: "volunteer",
          tone: "red",
          motif: "megaphone",
          eyebrow: "Volunteer",
          title: "Volunteer with us",
          text: "Contribute your time and skills from wherever you're based — or join us in Accra or with any of our national partners.",
          items: ["Fundraising & programme ideas", "Reports & website content", "Events, campaigns & outreach"],
          link: { label: "Learn more about volunteering", href: "/about-us/get-involved/volunteer" },
        },
      ],
    },
  };
}

// -- About Us › Get Involved › Intern -------------------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=vacancy`).then(r => r.json())
export async function getInternPage() {
  return {
    hero: {
      crumbs: [
        { label: "About us", href: "/about-us" },
        { label: "Get involved", href: "/about-us/get-involved" },
        { label: "Intern" },
      ],
      eyebrow: "Internship",
      titleLines: ["Learn by doing,", "on the front line."],
      lede: "Six to 24-week placements for students and graduates who want hands-on experience in advocacy and media development across West Africa.",
      primary: { label: "Apply by email", href: "mailto:recruitments@mfwa.org" },
      secondary: { label: "Volunteer instead", href: "/about-us/get-involved/volunteer" },
    },
    overview: { eyebrow: "Overview", title: "What the internship involves" },
    intro: [
      "If you have a passion or interest in contributing to making West Africa a better place where human rights, freedom of expression, access to information and assembly are respected, while transparent, accountable and participatory governance is practiced, then an internship at the Media Foundation for West Africa is for you.",
      "The MFWA internship offers you a rare opportunity to work in a diverse, multicultural and multinational environment with a dynamic team of people who are results-driven in pursuing freedom of expression and media development across West Africa. In addition to helping you understand the mandate of the organisation, the internship also gives you hands-on training in advocacy and project management, which can contribute to preparing you for your career.",
      "The duration of internships at the MFWA usually ranges between six and 24 weeks.",
    ],
    split: {
      id: "eligibility",
      eyebrow: "Before you apply",
      title: "Who we're looking for",
      panels: [
        {
          id: "who",
          tone: "navy",
          motif: "tower",
          eyebrow: "Eligibility",
          title: "Who can apply",
          text: "Open to anyone with an interest in promoting freedom of expression (online and offline) and media development, who has completed a first or second degree from a recognised university in a relevant field, or is enrolled in a graduate programme. Francophones, Anglophones with a good command of French, and non-Africans are all encouraged to apply.",
        },
        {
          id: "requirements",
          tone: "red",
          motif: "quote",
          eyebrow: "What we look for",
          title: "Requirements",
          chips: [
            "Open-minded and amenable",
            "Innovative, ready to take initiative",
            "Strong interpersonal & communication skills",
            "A team player who also works independently",
            "Working knowledge of Microsoft Office",
          ],
        },
      ],
    },
    involve: {
      eyebrow: "How to apply",
      title: "Ready to apply?",
      text: "We are unable to respond to every applicant. If you are selected, MFWA will contact you directly — no update within six months means the application was not successful this time.",
      contact: { label: "Prefer to volunteer instead?", href: "/about-us/get-involved/volunteer" },
      actions: [
        {
          num: "01",
          label: "Apply now",
          desc: "Submit your CV with a one-page motivation letter addressed to the Executive Director.",
          href: "mailto:recruitments@mfwa.org",
        },
      ],
    },
  };
}

// -- About Us › Get Involved › Volunteer ----------------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=volunteer`).then(r => r.json())
export async function getVolunteerPage() {
  return {
    hero: {
      crumbs: [
        { label: "About us", href: "/about-us" },
        { label: "Get involved", href: "/about-us/get-involved" },
        { label: "Volunteer" },
      ],
      eyebrow: "Volunteer",
      titleLines: ["Give your time,", "wherever you are."],
      lede: "Contribute your skills to press freedom and media development in West Africa — remotely, from our Accra office, or with any of our national partners.",
      primary: { label: "Write to us", href: "mailto:info@mfwa.org" },
      secondary: { label: "Intern instead", href: "/about-us/get-involved/intern" },
    },
    overview: { eyebrow: "Overview", title: "How volunteering works" },
    intro: [
      "If you are passionate about the progress of society, creating conditions that allow people to freely express themselves, or empowering the media to demand accountability from people in power, we are happy to welcome you to our team to contribute to the change we are making. You also learn new skills, get to understand the West African development context, and network with new people in the process.",
      "With the help of technology and the internet, you can contribute to improving governance and human rights in West Africa from wherever you are based. You may also choose to join us at our head office in Accra, Ghana, or with any of our national partners.",
    ],
    split: {
      id: "ways",
      eyebrow: "Get involved",
      title: "Why volunteer, and how",
      panels: [
        {
          id: "why",
          tone: "navy",
          motif: "megaphone",
          eyebrow: "Why volunteer",
          title: "What you'll gain",
          text: "You learn new skills, get to understand the West African development context, and network with new people in the process — all while contributing to the change we are making.",
          chips: ["New skills", "Regional insight", "New connections"],
        },
        {
          id: "ways-to-contribute",
          tone: "red",
          motif: "orbit",
          eyebrow: "Ways to contribute",
          title: "Pick a way to help",
          items: [
            "Sharing your innovative programme ideas with us",
            "Supporting us in fundraising",
            "Writing reports",
            "Developing content for our website",
            "Supporting the organisation of events",
            "Supporting our online campaigns and outreach",
          ],
        },
      ],
    },
    involve: {
      eyebrow: "Join us",
      title: "Ready to join us?",
      text: "Write to us with your CV and tell us how you'd like to contribute — we read every message.",
      contact: { label: "Prefer an internship instead?", href: "/about-us/get-involved/intern" },
      actions: [
        {
          num: "01",
          label: "Get in touch",
          desc: "Send your CV and a short note on how you'd like to help.",
          href: "mailto:info@mfwa.org",
        },
      ],
    },
  };
}

// -- About Us › Our Partners (hub) ----------------------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=our-partners`).then(r => r.json())
export async function getOurPartnersPage() {
  return {
    hero: {
      crumbs: [{ label: "About us", href: "/about-us" }, { label: "Our partners" }],
      eyebrow: "Our partners",
      titleLines: ["Stronger together,", "across West Africa."],
      lede: "We forge partnerships with credible national, regional and international organisations committed to open societies, freedom of expression, access to information and independent journalism.",
      primary: { label: "Meet our networks", href: "/about-us/our-partners/our-networks" },
      secondary: { label: "National partners", href: "/about-us/our-partners/national-partners" },
    },
    nav: {
      eyebrow: "Explore",
      title: "Three ways we work with others",
      text: "Learn more about our National Partners, our Funding Partners, and the wider Networks we belong to.",
      items: [
        {
          id: "funding",
          name: "Funding Partners",
          scope: "11 funders",
          desc: "The foundations, agencies and companies whose support makes our work across West Africa possible.",
          href: "/about-us/our-partners/funding-partners",
        },
        {
          id: "national",
          name: "National Partners",
          scope: "17 organisations",
          desc: "The leading press-freedom and media-development organisations we work with in each country of the region.",
          href: "/about-us/our-partners/national-partners",
        },
        {
          id: "networks",
          name: "Our Networks",
          scope: "6 networks",
          desc: "The national, regional and international networks that build synergies and broad collaborative advocacy.",
          href: "/about-us/our-partners/our-networks",
        },
      ],
    },
    involve: {
      eyebrow: "Work with us",
      title: "Become a partner",
      text: "Whether you fund, advocate or organise, we welcome new partnerships in pursuit of free expression and media development across West Africa.",
      contact: { label: "Read about our networks", href: "/about-us/our-partners/our-networks" },
      actions: [
        {
          num: "01",
          label: "Get in touch",
          desc: "Write to us about a potential partnership, collaboration or funding opportunity.",
          href: "mailto:info@mfwa.org",
        },
      ],
    },
  };
}

// -- About Us › Our Partners › Funding Partners ----------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=funding-partners`).then(r => r.json())
export async function getFundingPartnersPage() {
  return {
    hero: {
      crumbs: [
        { label: "About us", href: "/about-us" },
        { label: "Our partners", href: "/about-us/our-partners" },
        { label: "Funding partners" },
      ],
      eyebrow: "Funding partners",
      titleLines: ["The support behind", "the work we do."],
      lede: "The work of the MFWA is supported by dedicated and committed funding partners — our impact across West Africa would not be possible without them.",
      primary: { label: "National partners", href: "/about-us/our-partners/national-partners" },
      secondary: { label: "Our networks", href: "/about-us/our-partners/our-networks" },
    },
    overview: { eyebrow: "Support", title: "Who supports our work" },
    intro: ["You may learn more about our funding partners by visiting their respective websites below."],
    logos: [
      { name: "Open Society Foundations", href: "https://www.opensocietyfoundations.org/", logo: "https://mfwa.org/wp-content/uploads/2020/04/Osiwa-1.jpg" },
      { name: "Open Society Initiative for West Africa (OSIWA)", href: "https://www.opensocietyfoundations.org/about/offices-foundations/open-society-initiative-west-africa", logo: "https://mfwa.org/wp-content/uploads/2020/04/Osiwa.jpg" },
      { name: "STAR-Ghana", href: "https://star-ghana.org/", logo: "https://mfwa.org/wp-content/uploads/2020/04/Star-Ghana.jpg" },
      { name: "UNESCO", href: "https://www.unesco.org/en", logo: "https://mfwa.org/wp-content/uploads/2020/04/UNESCO.jpg" },
      { name: "IFEX", href: "https://ifex.org/", logo: "https://mfwa.org/wp-content/uploads/2020/04/Ifex.jpg" },
      { name: "Oxfam IBIS", href: "https://oxfam.dk/en/our-work", logo: "https://mfwa.org/wp-content/uploads/2020/04/Oxfam-Ibis-1024x288.png" },
      { name: "Access Now", href: "https://www.accessnow.org/", logo: "https://mfwa.org/wp-content/uploads/2020/04/Accessnow.jpg" },
      { name: "Global Partners Digital", href: "https://www.gp-digital.org/", logo: "https://mfwa.org/wp-content/uploads/2020/04/Global-partners.jpg" },
      { name: "European Union", href: "https://european-union.europa.eu/index_en", logo: "https://mfwa.org/wp-content/uploads/2022/05/EU.jpg" },
      { name: "Web Foundation", href: "https://webfoundation.org/", logo: "https://mfwa.org/wp-content/uploads/2022/05/web-foundation-570x299-1.png" },
      { name: "MTN Ghana", href: "https://mtn.com.gh/", logo: "https://mfwa.org/wp-content/uploads/2020/04/Mtn.jpg" },
    ],
  };
}

// -- About Us › Our Partners › National Partners ---------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=national-partners`).then(r => r.json())
export async function getNationalPartnersPage() {
  return {
    hero: {
      crumbs: [
        { label: "About us", href: "/about-us" },
        { label: "Our partners", href: "/about-us/our-partners" },
        { label: "National partners" },
      ],
      eyebrow: "National partners",
      titleLines: ["The most influential", "voices, in every country."],
      lede: "We work closely with the leading freedom-of-expression and press-advocacy organisations in each country of West Africa, sharing information and building capacity together.",
      primary: { label: "Funding partners", href: "/about-us/our-partners/funding-partners" },
      secondary: { label: "Our networks", href: "/about-us/our-partners/our-networks" },
    },
    overview: { eyebrow: "Working together", title: "Our partners, country by country" },
    intro: [
      "Our national partners are the most important and influential freedom of expression and press advocacy organisations in their respective countries. We work collaboratively through information sharing, mutual capacity building in organisational development and targeted advocacy objectives.",
    ],
    partners: [
      { id: "agepi", country: "Guinea", name: "AGEPI", text: "Guinea's independent newspaper publishers' association and the country's first press union, founded in 1991.", href: "http://www.mfwa.org/our-partners-list/lassociation-guineenne-des-editeurs-de-la-presse-independante-agepi/" },
      { id: "rpm", country: "Mauritania", name: "RPM", text: "An association of 32 media organisations that safeguards freedom of expression and journalist safety in Mauritania.", href: "https://web.facebook.com/profile.php?id=100069741345763" },
      { id: "olped", country: "Côte d’Ivoire", name: "OLPED", text: "Côte d'Ivoire's media self-regulatory body, promoting press freedom and journalism ethics since 1995.", href: "https://web.facebook.com/Olpedcotedivoire" },
      { id: "gpu", country: "The Gambia", name: "GPU", text: "Founded in 1979, the country's union of journalists pursuing media freedom and professionalism.", href: "http://www.gpu.gm/" },
      { id: "ipc", country: "Nigeria", name: "IPC", text: "A Lagos-based media resource centre building journalists' capacity to hold governance to account.", href: "http://www.ipcng.org" },
      { id: "odem", country: "Benin", name: "ODEM", text: "Benin's media self-regulatory body, promoting professionalism and ethics since 1999.", href: "https://www.mfwa.org/our-partners-list/benin-lobservatoire-de-la-deontologie-et-de-lethique-dans-les-medias-odem/" },
      { id: "synpics", country: "Senegal", name: "SYNPICS", text: "Senegal's journalists' union, defending journalist safety and media professionalism.", href: "https://www.mfwa.org/our-partners-list/synpics/" },
      { id: "mrcg", country: "Sierra Leone", name: "MRCG-SL", text: "A Freetown-based coalition working to strengthen independent, pluralistic media in Sierra Leone.", href: "https://mrcgonline.org/" },
      { id: "sinjotecs", country: "Guinea Bissau", name: "SINJOTECS", text: "Guinea-Bissau's press union, advocating for press freedom and the safety of journalists.", href: "https://web.facebook.com/sinjotecsguinebissau20218" },
      { id: "ujit", country: "Togo", name: "UJIT", text: "A media organisation formed in 1992, upholding excellence, ethics and cohesion in Togolese journalism.", href: "https://www.mfwa.org/our-partners-list/union-des-journalistes-independants-du-togo-ujit/" },
      { id: "cnp-nz", country: "Burkina Faso", name: "CNP-NZ", text: "Burkina Faso's leading press-freedom organisation, and organiser of the annual FILEP festival.", href: "https://cnpress-zongo.org/" },
      { id: "cemesp", country: "Liberia", name: "CEMESP", text: "A Liberian media-development organisation behind the country's Freedom of Information law.", href: "https://www.mfwa.org/our-partners-list/liberia-centre-for-media-studies-and-peace-building-cemesp/" },
      { id: "mp-mali", country: "Mali", name: "Maison de la Presse", text: "The umbrella association for more than fifty media organisations across Mali.", href: "https://www.mfwa.org/our-partners-list/mali-maison-de-la-presse-du-mali-mp/" },
      { id: "onimed", country: "Niger", name: "ONIMED", text: "Niger's self-regulating press body, upholding journalism ethics and training journalists.", href: "https://www.mfwa.org/our-partners-list/observatoire-nigerien-independant-des-medias-onimed/" },
      { id: "ajoc", country: "Cape Verde", name: "AJOC", text: "Cape Verde's independent association of journalists and media professionals, founded in 1990.", href: "https://mfwa.org/our-partners-list/a-associacao-sindical-dos-jornalistas-de-cabo-verde/" },
      { id: "africtivistes", country: "Pan-African", name: "AfricTivistes", text: "A pan-African network of bloggers and cyber-activists using digital tools to strengthen democracy across 45 countries.", href: "https://africtivistes.com/fr/about/history/" },
      { id: "tuwindi", country: "Mali", name: "Tuwindi Foundation", text: "A Mali-based civic-tech organisation running election-monitoring and fact-checking platforms.", href: "https://tuwindi.org/about" },
    ],
  };
}

// -- About Us › Our Partners › Our Networks --------------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=our-networks`).then(r => r.json())
export async function getNetworksPage() {
  return {
    hero: {
      crumbs: [
        { label: "About us", href: "/about-us" },
        { label: "Our partners", href: "/about-us/our-partners" },
        { label: "Our networks" },
      ],
      eyebrow: "Our networks",
      titleLines: ["Part of a", "wider movement."],
      lede: "The MFWA belongs to national, regional and international networks that build synergies, mutual learning and broad collaborative advocacy.",
      primary: { label: "Funding partners", href: "/about-us/our-partners/funding-partners" },
      secondary: { label: "National partners", href: "/about-us/our-partners/national-partners" },
    },
    networks: {
      eyebrow: "Our networks",
      title: "Networks we belong to",
      text: "The MFWA works with different organisations and belongs to several networks — spanning national, regional and international levels.",
      all: { label: "All our partners", href: "/about-us/our-partners" },
      items: [
        { id: "ifex", name: "IFEX", scope: "Global", desc: "Local and international organisations defending free expression as a fundamental human right.", href: "https://ifex.org/" },
        { id: "afex", name: "AFEX", scope: "Continental", desc: "Africa’s most prominent free-expression organisations — MFWA serves as its Secretariat.", href: "https://www.africafex.org/" },
        { id: "apai", name: "APAI", scope: "Continental", desc: "The African Platform on Access to Information, advancing the right to information.", href: "https://www.africanplatform.org/" },
        { id: "wacsof", name: "WACSOF", scope: "Regional", desc: "The West African Civil Society Forum, uniting CSOs from the fifteen ECOWAS states.", href: "https://wacsof-foscao.org/en/" },
        { id: "rti-ghana", name: "RTI Ghana", scope: "National", desc: "The coalition behind Ghana’s Right to Information law and its implementation.", href: "https://www.rti.org/focus-area/international-development" },
        { id: "afic", name: "AFIC", scope: "Continental", desc: "The African Freedom of Information Centre, around 30 CSOs promoting access to information.", href: "https://www.africafoicentre.org/" },
      ],
    },
  };
}

// -- Programmes ("What We Do") ----------------------------------------------
//
// Content audit (Sept 2026): read directly from the live site's five
// programme pages plus the /programmes/ hub and the header mega-menu (for
// the real slugs — several don't follow the "/programmes/<slug>" pattern
// WordPress's own Quick Links box implies). Each programme page's "Quick
// Links" box advertises "Our Activities & Projects" / "Meet The Team" /
// "Success Stories" sub-pages; every one of those 404s on the live site
// itself, so none are replicated here — the one exception checked (Media
// for Democracy & Good Governance's "Next Gen. Investigative Journalism"
// quick link) also 404s, so that focus-area line stays plain text, not a
// link. Two real in-house initiatives ARE live and are kept as external
// links: The Fourth Estate and Fact-check Ghana, both under Media for
// Democracy & Good Governance. A few focus-area bullets on the Freedom of
// Expression page are themselves the exact text of a live "Issues" category
// link (verified against the header mega-menu's Issues submenu) — those
// become internal /category/<slug> links; the rest stay plain text.
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=programmes`).then(r => r.json())
//
// Shared hero-tile data for the six Programmes pages: the same "ab-tiles"
// grid used by the About Us / Get Involved / Board / Staff heroes (a motif
// tile grid filling the column beside the copy, instead of the empty
// space a wide, tile-less hero leaves on those pages). The hub's hero
// shows all five; each detail page's hero shows the other four as
// cross-navigation. Each programme keeps the same motif everywhere it
// appears (hub tile, cross-nav tile, and — self only — its own focus
// section's aside motif), so the icon reads as that programme's identity.
const PROGRAMME_TILES = [
  { id: "foe", label: "Freedom of Expression", href: "/programmes/freedom-of-expression", variant: "mic", tone: "dark" },
  { id: "digital", label: "Digital Rights", href: "/programmes/digital-rights", variant: "orbit", tone: "pale" },
  { id: "governance", label: "Media & Governance", href: "/programmes/media-democracy-governance", variant: "newspaper", tone: "white" },
  { id: "peace", label: "Peace & Cohesion", href: "/programmes/media-peace-social-cohesion", variant: "quote", tone: "pale" },
  { id: "institutional", label: "Institutional Dev.", href: "/programmes/institutional-development", variant: "search", tone: "white" },
];

export async function getProgrammesPage() {
  return {
    hero: {
      crumbs: [{ label: "Programmes" }],
      eyebrow: "What we do",
      titleLines: ["Five ways we", "defend free expression."],
      lede: "Over 27 years working across West Africa, our 2025–2029 Strategic Plan focuses on four thematic areas — Freedom of Expression, Tech & Digital Rights, Media for Democracy & Good Governance, and Media for Peace & Social Cohesion — with Institutional Development as a cross-cutting pillar and women's empowerment as a cross-cutting theme.",
      primary: { label: "Our overall strategy", href: "https://mfwa.org/wp-content/uploads/2025/10/Strategic-Plan-doc_MFWA_2025-to-2029_clean-1.pdf" },
      secondary: { label: "About MFWA", href: "/about-us" },
      tiles: PROGRAMME_TILES,
    },
    nav: {
      eyebrow: "Explore",
      title: "Our five programmes",
      text: "Each programme is pursued through impact-oriented advocacy, strategic partnerships, research and documentation, and stronger institutional systems.",
      items: [
        {
          id: "foe",
          name: "Freedom of Expression",
          scope: "Thematic area",
          desc: "Protecting the right to free expression and access to information across West Africa.",
          href: "/programmes/freedom-of-expression",
        },
        {
          id: "digital",
          name: "Tech & Digital Rights",
          scope: "Thematic area",
          desc: "A freer and safer online environment for expression and participation by all, especially women.",
          href: "/programmes/digital-rights",
        },
        {
          id: "governance",
          name: "Media for Democracy & Good Governance",
          scope: "Thematic area",
          desc: "Strengthening the media's capacity to contribute to participatory, accountable governance.",
          href: "/programmes/media-democracy-governance",
        },
        {
          id: "peace",
          name: "Media for Peace & Social Cohesion",
          scope: "Thematic area",
          desc: "Engaging the media to address extremism, polarisation, mis/disinformation and conflict prevention.",
          href: "/programmes/media-peace-social-cohesion",
        },
        {
          id: "institutional",
          name: "Institutional Development",
          scope: "Cross-cutting pillar",
          desc: "Building an efficient, resilient organisation capable of delivering fully on its mandate.",
          href: "/programmes/institutional-development",
        },
      ],
    },
    involve: {
      eyebrow: "Support this work",
      title: "Help power our programmes",
      text: "Every programme above is made possible by donors, partners and volunteers who share our commitment to free expression in West Africa.",
      contact: { label: "About MFWA", href: "/about-us" },
      actions: [
        {
          num: "01",
          label: "Donate",
          desc: "Support investigations, legal aid for journalists and press-freedom advocacy across West Africa.",
          href: "https://mfwa.org/donate",
        },
      ],
    },
  };
}

// -- Programmes › Freedom of Expression -------------------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=freedom-of-expression-advocacy`).then(r => r.json())
export async function getFreedomOfExpressionPage() {
  return {
    hero: {
      crumbs: [{ label: "Programmes", href: "/programmes" }, { label: "Freedom of Expression" }],
      eyebrow: "Freedom of Expression",
      titleLines: ["Defending a", "fundamental right."],
      lede: "Freedom of Expression is a fundamental human right — yet violations continue to be a major challenge to participatory and accountable governance in West Africa.",
      primary: { label: "Donate", href: "https://mfwa.org/donate" },
      secondary: { label: "All programmes", href: "/programmes" },
      tiles: PROGRAMME_TILES.filter((t) => t.id !== "foe"),
    },
    overview: { eyebrow: "Overview", title: "Why this programme matters" },
    intro: [
      "In many countries in the region, critical media and dissenting voices are not tolerated and are often abused. The MFWA and its national partners across West Africa work toward ensuring noticeable improvement in respecting and protecting the right to freedom of expression by state and non-state actors, and that the public's right to access information is guaranteed by regional and national laws and respected in practice.",
    ],
    focus: {
      eyebrow: "Areas of work",
      title: "Where we focus our efforts",
      motif: "mic",
      contact: { label: "All programmes", href: "/programmes" },
      items: [
        "Law and policy reform advocacy relating to digital migration, Internet freedom, and de-criminalisation of defamation laws",
        "FoE Rights Monitoring, Campaigns and Protection",
        { label: "Freedom of Assembly", href: "/category/freedom-of-assembly" },
        { label: "Freedom of Expression Violations", href: "/category/free-expression-violations" },
        { label: "Freedom of Expression and the Law", href: "/category/free-expression-and-the-law" },
        { label: "Access to information advocacy", href: "/category/access-to-information" },
        "Safety of journalists advocacy",
        { label: "Access to Justice and anti-impunity campaigns", href: "/category/impunity" },
      ],
    },
    involve: {
      eyebrow: "Get involved",
      title: "Support this programme",
      text: "Your support helps protect journalists, defend dissenting voices and guarantee the public's right to access information across West Africa.",
      contact: { label: "Explore all our programmes", href: "/programmes" },
      actions: [
        {
          num: "01",
          label: "Donate",
          desc: "Fund advocacy, monitoring and legal support for freedom of expression across the region.",
          href: "https://mfwa.org/donate",
        },
      ],
    },
  };
}

// -- Programmes › Tech & Digital Rights --------------------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=digital-rights`).then(r => r.json())
export async function getDigitalRightsPage() {
  return {
    hero: {
      crumbs: [{ label: "Programmes", href: "/programmes" }, { label: "Tech & Digital Rights" }],
      eyebrow: "Tech & Digital Rights",
      titleLines: ["A freer, safer", "online space for all."],
      lede: "As internet access spreads across West Africa, governments are increasingly exploiting existing laws — and introducing new ones — to limit expression online, while gender inequality keeps many women offline.",
      primary: { label: "Donate", href: "https://mfwa.org/donate" },
      secondary: { label: "All programmes", href: "/programmes" },
      tiles: PROGRAMME_TILES.filter((t) => t.id !== "digital"),
    },
    overview: { eyebrow: "Overview", title: "Why this programme matters" },
    intro: [
      "In a number of countries in the region, fewer than 10 percent of women have regular internet access. To respond to this and other emerging challenges, the MFWA has decoupled digital rights from its Freedom of Expression programme to make it a full programme with a focus on digital rights issues alone, working with partners toward a freer and safer online environment for expression and participation by all, especially women.",
    ],
    focus: {
      eyebrow: "Areas of work",
      title: "Where we focus our efforts",
      motif: "orbit",
      contact: { label: "All programmes", href: "/programmes" },
      items: [
        "Improving the policy environment through research and stakeholder engagement",
        "Free expression online",
        "Cybersecurity",
        "Gender digital equity and equality, empowering women to assert their online rights",
      ],
    },
    involve: {
      eyebrow: "Get involved",
      title: "Support this programme",
      text: "Your support helps close the digital gender gap and defend a free, safe online space for expression across West Africa.",
      contact: { label: "Explore all our programmes", href: "/programmes" },
      actions: [
        {
          num: "01",
          label: "Donate",
          desc: "Fund digital-rights research, cybersecurity training and online-safety advocacy.",
          href: "https://mfwa.org/donate",
        },
      ],
    },
  };
}

// -- Programmes › Media for Democracy & Good Governance ---------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=media-good-governance-and-development`).then(r => r.json())
export async function getMediaGovernancePage() {
  return {
    hero: {
      crumbs: [{ label: "Programmes", href: "/programmes" }, { label: "Media for Democracy & Good Governance" }],
      eyebrow: "Media for Democracy & Good Governance",
      titleLines: ["Media that holds", "power to account."],
      lede: "Gains in the region's democratic consolidation have been dissipating amid coups, weak public-service delivery and corruption — a vibrant, professional and critical media can help rebuild them.",
      primary: { label: "Donate", href: "https://mfwa.org/donate" },
      secondary: { label: "All programmes", href: "/programmes" },
      tiles: PROGRAMME_TILES.filter((t) => t.id !== "governance"),
    },
    overview: { eyebrow: "Overview", title: "Why this programme matters" },
    intro: [
      "Our strategic objective for this programme is to strengthen the capacity of the media to contribute effectively to participatory, responsive, transparent and accountable governance — expanding civic participation, holding duty bearers accountable, and countering extremist narratives.",
    ],
    focus: {
      eyebrow: "Areas of work",
      title: "Where we focus our efforts",
      motif: "newspaper",
      contact: { label: "All programmes", href: "/programmes" },
      items: [
        "Access to information and civic participation in governance",
        "Media sustainability and professionalism",
        "Investigative reporting",
        "Next Generation Investigative Journalism Fellowship",
        "Mis/disinformation",
        "Citizens–authorities engagement",
      ],
      initiatives: [
        { name: "The Fourth Estate", href: "https://thefourthestategh.com/" },
        { name: "Fact-check Ghana", href: "https://www.fact-checkghana.com/" },
      ],
    },
    involve: {
      eyebrow: "Get involved",
      title: "Support this programme",
      text: "Your support helps strengthen investigative journalism and counter mis/disinformation across West Africa.",
      contact: { label: "Explore all our programmes", href: "/programmes" },
      actions: [
        {
          num: "01",
          label: "Donate",
          desc: "Fund investigative reporting, fact-checking and media-accountability initiatives.",
          href: "https://mfwa.org/donate",
        },
      ],
    },
  };
}

// -- Programmes › Media for Peace & Social Cohesion --------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=media-for-peace-social-cohesion`).then(r => r.json())
export async function getMediaPeacePage() {
  return {
    hero: {
      crumbs: [{ label: "Programmes", href: "/programmes" }, { label: "Media for Peace & Social Cohesion" }],
      eyebrow: "Media for Peace & Social Cohesion",
      titleLines: ["Media that builds", "peace, not division."],
      lede: "Political instability, violent extremism and the rapid spread of mis/disinformation are increasingly transnational — and the media can either mitigate or exacerbate the tensions they cause.",
      primary: { label: "Donate", href: "https://mfwa.org/donate" },
      secondary: { label: "All programmes", href: "/programmes" },
      tiles: PROGRAMME_TILES.filter((t) => t.id !== "peace"),
    },
    overview: { eyebrow: "Overview", title: "Why this programme matters" },
    intro: [
      "Our strategic objective for this programme, over 2025–2029, is to engage with the media to address extremism, polarisation and mis/disinformation, and to promote conflict prevention across the region.",
    ],
    focus: {
      eyebrow: "Areas of work",
      title: "Where we focus our efforts",
      motif: "quote",
      contact: { label: "All programmes", href: "/programmes" },
      items: [
        "Strengthening collaboration with ECOWAS to promote its conflict-prevention framework through the media",
        "Improving the media's capacity to contribute to regional peace and stability through conflict-sensitive journalism",
        "Countering mis/disinformation and polarising narratives, and mobilising stakeholders to address polarisation",
      ],
    },
    involve: {
      eyebrow: "Get involved",
      title: "Support this programme",
      text: "Your support helps train journalists in conflict-sensitive reporting and counter disinformation across West Africa.",
      contact: { label: "Explore all our programmes", href: "/programmes" },
      actions: [
        {
          num: "01",
          label: "Donate",
          desc: "Fund conflict-sensitive journalism training and anti-disinformation initiatives.",
          href: "https://mfwa.org/donate",
        },
      ],
    },
  };
}

// -- Programmes › Institutional Development ----------------------------------
// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/pages?slug=institutional-development`).then(r => r.json())
export async function getInstitutionalDevelopmentPage() {
  return {
    hero: {
      crumbs: [{ label: "Programmes", href: "/programmes" }, { label: "Institutional Development" }],
      eyebrow: "Institutional Development",
      titleLines: ["An organisation built", "to last."],
      lede: "Alongside delivering impactful projects, we are committed to building an efficient, nimble and resilient institution that is highly professional in the delivery of its mandate.",
      primary: { label: "Donate", href: "https://mfwa.org/donate" },
      secondary: { label: "All programmes", href: "/programmes" },
      tiles: PROGRAMME_TILES.filter((t) => t.id !== "institutional"),
    },
    overview: { eyebrow: "Overview", title: "Why this programme matters" },
    intro: [
      "This cross-cutting pillar is solely focused on ensuring the organisation runs as efficiently as possible, so that every other programme can deliver on its mandate.",
    ],
    focus: {
      eyebrow: "Areas of work",
      title: "Where we focus our efforts",
      motif: "search",
      contact: { label: "All programmes", href: "/programmes" },
      items: [
        "Continuously monitoring, evaluating and strengthening institutional policies and practices in line with global best practices",
        "Ensuring compliance with institutional policies and systems, and with those of our funders, for value for money in all we do",
        "Strengthening the capacity of our staff and national partner organisations across the region for optimal delivery",
        "Communicating results, impact and learnings with our partners and funders to inspire and shape future thinking",
      ],
    },
    involve: {
      eyebrow: "Get involved",
      title: "Support this programme",
      text: "Your support helps build the resilient institution behind every one of our programmes across West Africa.",
      contact: { label: "Explore all our programmes", href: "/programmes" },
      actions: [
        {
          num: "01",
          label: "Donate",
          desc: "Fund the institutional systems that keep our programmes running efficiently.",
          href: "https://mfwa.org/donate",
        },
      ],
    },
  };
}
