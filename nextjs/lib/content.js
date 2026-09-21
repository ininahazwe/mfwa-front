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

import { getWpCategoryBySlug, getWpCategoryPosts } from "./wp";

// Future: return fetch(`${process.env.WP_API_BASE}/wp/v2/menu?slug=primary`).then(r => r.json())
export async function getHeader() {
  return {
    logo: { src: "/images/mfwa-logo-01.png", alt: "" },
    homeAriaLabel: "Media Foundation for West Africa — accueil",
    brandNameLines: ["Media Foundation", "for West Africa"],
    nav: [
      { label: "Our Work", href: "#our-work" },
      { label: "Stories", href: "#stories" },
      { label: "Impact", href: "#impact" },
      { label: "About", href: "#about" },
    ],
    searchAriaLabel: "Rechercher",
    donate: { label: "Donate", href: "#donate" },
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
    link: { label: "Discover our work", href: "#programmes" },
    items: [
      {
        num: "01",
        icon: "shield",
        heading: "Freedom of Expression",
        desc: "Protecting journalists and media rights.",
      },
      {
        num: "02",
        icon: "network",
        heading: "Digital Rights",
        desc: "Safer digital spaces for everyone.",
      },
      {
        num: "03",
        icon: "document",
        heading: "Media & Democracy",
        desc: "Stronger media for informed societies.",
      },
      {
        num: "04",
        icon: "connections",
        heading: "Peace & Social Cohesion",
        desc: "Media for more inclusive and resilient communities.",
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
    cta: { label: "See our impact", href: "#impact-report" },
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
    viewAll: { label: "View all stories", href: "#impact-archive" },
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
// marker / list entry navigates to on click — the real mfwa.org "country"
// archive for that country (e.g. Benin: https://mfwa.org/benin/). Slugs
// were confirmed against the live site rather than guessed, since a couple
// don't follow the obvious pattern (Cabo Verde's term is "Cape Verde" →
// cape-verde; Côte d’Ivoire → cote-divoire).
export async function getReach() {
  return {
    eyebrow: "Our reach",
    titleLines: ["16 countries.", "One region."],
    text: "We work across West Africa, supporting independent media and protecting press freedom in some of the region\u2019s most challenging environments.",
    link: { label: "Explore our countries", href: "#countries" },
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
    // dataset. `coordinates` is [longitude, latitude] of the capital, used
    // to place each country's marker dot (Cabo Verde has no landmass in the
    // 110m dataset at all, so it renders as a marker only, matching the
    // reference design where it shows as a small offshore dot cluster).
    countries: [
      { name: "Benin", id: "204", link: "https://mfwa.org/benin/", coordinates: [2.3912, 6.3703] },
      { name: "Burkina Faso", id: "854", link: "https://mfwa.org/burkina-faso/", coordinates: [-1.5197, 12.3714] },
      { name: "Cabo Verde", id: "132", link: "https://mfwa.org/cape-verde/", coordinates: [-23.5133, 14.9330] },
      { name: "C\u00f4te d\u2019Ivoire", id: "384", link: "https://mfwa.org/cote-divoire/", coordinates: [-4.0083, 5.3599] },
      { name: "The Gambia", id: "270", link: "https://mfwa.org/gambia/", coordinates: [-16.5790, 13.4549] },
      { name: "Ghana", id: "288", link: "https://mfwa.org/ghana/", coordinates: [-0.1870, 5.6037] },
      { name: "Guinea", id: "324", link: "https://mfwa.org/guinea/", coordinates: [-13.5784, 9.6412] },
      { name: "Guinea-Bissau", id: "624", link: "https://mfwa.org/guinea-bissau/", coordinates: [-15.5977, 11.8636] },
      { name: "Liberia", id: "430", link: "https://mfwa.org/liberia/", coordinates: [-10.7605, 6.2907] },
      { name: "Mali", id: "466", link: "https://mfwa.org/mali/", coordinates: [-8.0029, 12.6392] },
      { name: "Mauritania", id: "478", link: "https://mfwa.org/mauritania/", coordinates: [-15.9582, 18.0735] },
      { name: "Niger", id: "562", link: "https://mfwa.org/niger/", coordinates: [2.1128, 13.5127] },
      { name: "Nigeria", id: "566", link: "https://mfwa.org/nigeria/", coordinates: [7.3986, 9.0765] },
      { name: "Senegal", id: "686", link: "https://mfwa.org/senegal/", coordinates: [-17.4677, 14.7167] },
      { name: "Sierra Leone", id: "694", link: "https://mfwa.org/sierra-leone/", coordinates: [-13.2317, 8.4657] },
      { name: "Togo", id: "768", link: "https://mfwa.org/togo/", coordinates: [1.2314, 6.1725] },
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
    nav: [
      { label: "Our Work", href: "#our-work" },
      { label: "Stories", href: "#stories" },
      { label: "Impact", href: "#impact" },
      { label: "About", href: "#about" },
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
