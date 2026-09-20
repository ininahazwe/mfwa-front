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
      { label: "West Africa", slug: "west-africa" },
    ],
    stories: [
      {
        link: "#article-ghana",
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
// Note: kept here for the future Reach.js pass (carousel/hover-map behaviour
// is intentionally not built yet). `countries` carries both the map hit
// coordinates (ellipse cx/cy/rx/ry, ported verbatim from the SVG) and the
// name used by the two-column country list, so a future component can
// derive either view from one array.
export async function getReach() {
  return {
    eyebrow: "Our reach",
    titleLines: ["16 countries.", "One region."],
    text: "We work across West Africa, supporting independent media and protecting press freedom in some of the region’s most challenging environments.",
    link: { label: "Explore our countries", href: "#countries" },
    map: {
      viewBox: "78 -6 372 312",
      ariaLabel: "Carte des 16 pays d'Afrique de l'Ouest où intervient la MFWA",
      contextPath:
        "M280 4 L365 0 L408 18 L432 48 L442 90 L438 140 L420 190 L430 230 L412 270 L380 296 L352 280 L350 240 L330 210 L336 170 L320 130 L300 95 L286 55 Z",
      contextLines: [
        "M365 0 L358 90 L372 180 L358 240",
        "M408 18 L398 110 L420 190",
        "M286 55 L322 90 L322 130",
        "M330 210 L370 220 L380 296",
      ],
      islands: [
        { cx: 92, cy: 168, r: 3.2 },
        { cx: 100, cy: 177, r: 2.4 },
        { cx: 86, cy: 180, r: 2 },
      ],
      silhouettePath:
        "M145 75 L160 50 L220 40 L280 42 L310 55 L330 75 L350 100 L365 135 L372 170 L385 195 L390 215 L378 235 L355 248 L320 252 L290 250 L260 248 L230 244 L200 238 L178 222 L165 200 L158 180 L152 160 L145 140 L138 118 L132 100 L140 80 Z",
      borders: [
        "M200 42 L202 148",
        "M300 46 L302 172",
        "M148 146 L370 168",
        "M160 196 L385 202",
        "M140 88 L175 108 L200 148",
        "M136 112 L145 138",
        "M145 140 L156 162",
        "M155 162 L166 198",
        "M167 202 L182 220",
        "M180 222 L204 236",
        "M243 200 L248 249",
        "M283 197 L286 251",
        "M298 197 L301 251",
        "M311 197 L318 251",
        "M345 172 L386 198",
      ],
    },
    // Alphabetical, matching the order of the static two-column list
    // (8 per column when rendered).
    countries: [
      { name: "Benin", cx: 308, cy: 220, rx: 8, ry: 28 },
      { name: "Burkina Faso", cx: 252, cy: 176, rx: 22, ry: 18 },
      { name: "Cabo Verde", cx: 97, cy: 179, rx: 16, ry: 15 },
      { name: "Côte d’Ivoire", cx: 226, cy: 220, rx: 22, ry: 22 },
      { name: "The Gambia", cx: 158, cy: 140, rx: 9, ry: 6 },
      { name: "Ghana", cx: 272, cy: 218, rx: 16, ry: 24 },
      { name: "Guinea", cx: 170, cy: 180, rx: 16, ry: 18 },
      { name: "Guinea-Bissau", cx: 149, cy: 151, rx: 10, ry: 9 },
      { name: "Liberia", cx: 186, cy: 223, rx: 14, ry: 14 },
      { name: "Mali", cx: 238, cy: 100, rx: 32, ry: 34 },
      { name: "Mauritania", cx: 176, cy: 88, rx: 27, ry: 30 },
      { name: "Niger", cx: 315, cy: 115, rx: 30, ry: 40 },
      { name: "Nigeria", cx: 347, cy: 196, rx: 30, ry: 32 },
      { name: "Senegal", cx: 160, cy: 106, rx: 16, ry: 20 },
      { name: "Sierra Leone", cx: 167, cy: 206, rx: 12, ry: 12 },
      { name: "Togo", cx: 293, cy: 222, rx: 7, ry: 28 },
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
