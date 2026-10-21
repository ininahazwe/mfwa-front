// lib/programmeSections.js
//
// The four content sub-pages of every programme page (2026-10-21, at Yv's
// call): /programmes/<programme>/projects | team | legal-support |
// success-stories. They replace the cross-navigation tiles that used to sit
// in the hero of each programme page (the .ab-hero__tiles-slot): the four
// tiles now open the programme's own content instead of the other
// programmes (the hub /programmes still lists all of them).
//
// This file is pure data (no imports from lib/content.js) so content.js can
// build the hero tiles from it without a circular import; the page builder
// getProgrammeSection() lives in content.js.

export const PROGRAMMES = [
  { id: "foe", slug: "freedom-of-expression", short: "Freedom of Expression", motif: "mic", tone: "dark" },
  { id: "digital", slug: "digital-rights", short: "Tech & Digital Rights", motif: "orbit", tone: "pale" },
  { id: "governance", slug: "media-democracy-governance", short: "Media for Democracy & Good Governance", motif: "newspaper", tone: "white" },
  { id: "peace", slug: "media-peace-social-cohesion", short: "Media for Peace & Social Cohesion", motif: "quote", tone: "pale" },
  { id: "institutional", slug: "institutional-development", short: "Institutional Development", motif: "search", tone: "white" },
];

export const programmeBySlug = (slug) => PROGRAMMES.find((p) => p.slug === slug) ?? null;

// `titleLines` / `lede` take the programme's short name where noted.
export const SECTIONS = [
  {
    key: "projects",
    slug: "projects",
    label: "Projects",
    variant: "dots",
    tone: "dark",
    titleLines: ["What we are", "working on."],
    lede: (p) => `The areas of work, in-house initiatives and publications of the ${p.short} programme.`,
  },
  {
    key: "team",
    slug: "team",
    label: "Meet the team",
    variant: "press",
    tone: "pale",
    titleLines: ["The people behind", "this programme."],
    lede: (p) => `The MFWA staff who deliver the ${p.short} programme, from the programme leads to the colleagues who support it every day.`,
  },
  {
    key: "legal",
    slug: "legal-support",
    label: "Legal support",
    variant: "halfspin",
    tone: "white",
    titleLines: ["Legal support", "when it matters."],
    lede: () => "Pro-bono legal services for victims of free expression rights violations, delivered through our Network of Human Rights Lawyers.",
  },
  {
    key: "stories",
    slug: "success-stories",
    label: "Success stories",
    variant: "quote",
    tone: "pale",
    titleLines: ["Stories of", "change."],
    lede: () => "Documented outcomes from our investigative journalism, advocacy and capacity-building work across West Africa.",
  },
];

export const sectionBySlug = (slug) => SECTIONS.find((s) => s.slug === slug) ?? null;

export const programmeHref = (programme) => `/programmes/${programme.slug}`;
export const sectionHref = (programme, section) => `/programmes/${programme.slug}/${section.slug}`;

// The four hero tiles of a programme page: one per content sub-page.
export function programmeTiles(programmeSlug) {
  const programme = programmeBySlug(programmeSlug);
  if (!programme) return [];
  return SECTIONS.map((s) => ({
    id: s.key,
    label: s.label,
    href: sectionHref(programme, s),
    variant: s.variant,
    tone: s.tone,
  }));
}

// Hero tiles of a sub-page: the three other sections plus a way back to the
// programme's own page (shown with the programme's motif).
export function subpageTiles(programmeSlug, currentKey) {
  const programme = programmeBySlug(programmeSlug);
  if (!programme) return [];
  return [
    ...programmeTiles(programmeSlug).filter((t) => t.id !== currentKey),
    { id: "overview", label: "Programme overview", href: programmeHref(programme), variant: programme.motif, tone: programme.tone },
  ];
}

// -- Who works on which programme -------------------------------------------
//
// Derived from the biographies in lib/staff.js (each one states the
// programme its owner works under — "…Programme Manager for the Media for
// Democracy and Good Governance Programme", "…Programme Assistant under the
// Freedom of Expression & Digital Rights Programme", "…under the
// Institutional Development Programme", the Fourth Estate and Fact-Check
// Ghana being MFWA's public-interest journalism projects under Media for
// Democracy & Good Governance). The staff biographies still speak of one
// "Freedom of Expression & Digital Rights" programme, which the site now
// splits in two: its people appear on both pages. The Executive Director
// leads every programme. Edit freely — it only lists slugs from STAFF.
const FOEDR = [
  "dora-b-mawutor",
  "vivian-affoah",
  "victoria-enyonam-adonu",
  "rhoda-adwoa-bondzie",
  "melvine-enzeng",
  "diane-rachelle-sylvia-badolo",
  "delali-dessouassi",
  "miliza-fernandes-djata",
];

const ALL = ["sulemana-braimah"];

export const STAFF_BY_PROGRAMME = {
  "freedom-of-expression": [...ALL, ...FOEDR],
  "digital-rights": [...ALL, ...FOEDR],
  "media-democracy-governance": [
    ...ALL,
    "adizatu-moro-maiga",
    "kwaku-krobea-asante",
    "fatimata-mustapha",
    "josephine-badu-nyarko",
    "paul-kofi-gozo",
    "solomon-joojo-cobbinah",
    "seth-j-bokpe",
    "william-nlanjerbor-jalulah",
    "edmund-agyemang-boateng",
    "elizabeth-abena-egyin",
    "thelma-dede-amedeku",
    "philip-teye-agbove",
    "clement-kumsah",
  ],
  "media-peace-social-cohesion": [...ALL, "kojo-impraim"],
  "institutional-development": [
    ...ALL,
    "abigail-larbi-odei",
    "margritta-amoaful-owusu",
    "daniel-kwame-ampofo-adjei",
    "michael-etrue",
    "enoch-sam",
    "meshack-odoi-yemoh",
    "mia-ewagnignon",
    "nana-oduro-korankye",
    "james-abbey",
    "alice-assibuaba-assibu",
    "elijah-ago-acquaye",
    "daisy-prempeh",
    "richard-koduah",
    "frank-foli",
  ],
};

// -- Legal support ------------------------------------------------------------
// Only what the site already states elsewhere: the Network of Human Rights
// Lawyers' pro-bono services (Where We Work intro), the lawyers' network in
// the About page, the header's "legal support … for reporters facing
// threats", and the info@mfwa.org contact from the About FAQ. Same text on
// every programme page — replace per programme when the team supplies more.
export const LEGAL_SUPPORT = {
  intro: [
    "In every country where we work, members of our Network of Human Rights Lawyers offer pro-bono legal services in defence of victims of free expression rights violations.",
    "The network works alongside our national partner organisations and our in-country freedom of expression rights monitors, so that a violation documented on the ground can be followed by legal assistance for the journalist or citizen concerned.",
  ],
  focus: {
    eyebrow: "How it works",
    title: "Legal assistance across West Africa",
    motif: "halfspin",
    items: [
      "Pro-bono legal services in defence of victims of free expression rights violations",
      "Delivered by our Network of Human Rights Lawyers across West Africa",
      "Backed by our national partner organisations and in-country freedom of expression rights monitors",
      "Legal support, safety training and rapid response for reporters facing threats across the region",
    ],
  },
  contact: {
    eyebrow: "Need legal assistance?",
    title: "Contact the MFWA",
    text: "If you or a colleague faces a violation of freedom of expression or press freedom, write to us at info@mfwa.org.",
    cta: { label: "Write to info@mfwa.org", href: "mailto:info@mfwa.org" },
  },
};
