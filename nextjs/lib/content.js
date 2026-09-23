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
import { STAFF, STAFF_TEAMS } from "./staff";
import { BOARD, BOARD_ROLES } from "./board";

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
      { label: "About", href: "/about-us" },
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
      all: { label: "All our partners", href: "https://mfwa.org/about-us/our-partners/" },
      href: "https://mfwa.org/about-us/our-partners/our-networks/",
      items: [
        { name: "IFEX", scope: "Global", desc: "Local and international organisations defending free expression as a fundamental human right." },
        { name: "AFEX", scope: "Continental", desc: "Africa’s most prominent free-expression organisations — MFWA serves as its Secretariat." },
        { name: "APAI", scope: "Continental", desc: "The African Platform on Access to Information, advancing the right to information." },
        { name: "WACSOF", scope: "Regional", desc: "The West African Civil Society Forum, uniting CSOs from the fifteen ECOWAS states." },
        { name: "RTI Ghana", scope: "National", desc: "The coalition behind Ghana’s Right to Information law and its implementation." },
        { name: "AFIC", scope: "Continental", desc: "The African Freedom of Information Centre, around 30 CSOs promoting access to information." },
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
