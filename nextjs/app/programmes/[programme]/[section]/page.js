// /programmes/<programme>/<section> — the four content sub-pages of each
// programme (2026-10-21, at Yv's call): projects, team, legal-support,
// success-stories. The programme pages' hero tiles open them. See
// lib/programmeSections.js (data) and getProgrammeSection() in
// lib/content.js (page builder). Unknown pairs → 404.
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvolvedHero from "@/components/InvolvedHero";
import ProgrammeTopo from "@/components/ProgrammeTopo";
import SectionHead from "@/components/SectionHead";
import ProgrammeFocus from "@/components/ProgrammeFocus";
import ProgrammeReports from "@/components/ProgrammeReports";
import AboutGetInvolved from "@/components/AboutGetInvolved";
import StaffDirectory from "@/components/StaffDirectory";
import CategoryGrid from "@/components/CategoryGrid";

import { getHeader, getFooter, getProgrammeSection, getProgrammeSectionParams } from "@/lib/content";

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return getProgrammeSectionParams();
}

export async function generateMetadata({ params }) {
  const { programme, section } = await params;
  const page = await getProgrammeSection(programme, section);
  if (!page) return { title: "Page not found — Media Foundation for West Africa" };
  return {
    title: `${page.title} — Media Foundation for West Africa`,
    description: page.description,
  };
}

export default async function ProgrammeSectionPage({ params }) {
  const { programme: programmeSlug, section: sectionSlug } = await params;
  const [header, footer, page] = await Promise.all([getHeader(), getFooter(), getProgrammeSection(programmeSlug, sectionSlug)]);
  if (!page) notFound();

  return (
    <>
      <div className="page-shell">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header data={header} tone={page.tone} />

        <main id="main" className="about">
          <InvolvedHero data={page.hero} tiles={page.hero.tiles} tone={page.tone} topo={<ProgrammeTopo tone={page.tone} />} />

          {page.key === "projects" && (
            <>
              <section className="ab-section" id="overview">
                <div className="ab-wrap">
                  <SectionHead eyebrow={page.overview.eyebrow} title={page.overview.title} text={page.overview.text} />
                </div>
              </section>
              <ProgrammeFocus data={page.focus} />
              {page.reports && <ProgrammeReports data={page.reports} />}
            </>
          )}

          {page.key === "team" && (
            <>
              <StaffDirectory
                data={page.directory}
                teams={page.teams}
                showFilters={page.teams.length > 2}
              />
              <ProgrammeReports
                data={{
                  eyebrow: "The whole organisation",
                  title: "Meet everyone at the MFWA",
                  text: "Staff, fellows and interns of all our programmes, at our Accra headquarters.",
                  cta: page.directoryLink,
                }}
              />
            </>
          )}

          {page.key === "legal" && (
            <>
              <section className="ab-section" id="overview">
                <div className="ab-wrap">
                  <SectionHead eyebrow={page.overview.eyebrow} title={page.overview.title} text={page.overview.text} />
                </div>
              </section>
              <ProgrammeFocus data={page.focus} />
              <ProgrammeReports
                data={{
                  eyebrow: page.contact.eyebrow,
                  title: page.contact.title,
                  text: page.contact.text,
                  cta: page.contact.cta,
                }}
              />
            </>
          )}

          {page.key === "stories" && (
            <>
              <section className="ab-section" id="overview">
                <div className="ab-wrap">
                  <SectionHead eyebrow={page.overview.eyebrow} title={page.overview.title} text={page.overview.text} />
                </div>
              </section>
              <section className="category ab-prog-stories" id="stories">
                <CategoryGrid
                  apiBase="/api/impact-stories"
                  initialItems={page.stories.articles}
                  initialTotalPages={page.stories.totalPages}
                  initialTotal={page.stories.total}
                  pageSize={12}
                  endMessage="You've reached the end of our impact stories."
                />
              </section>
              <ProgrammeReports
                data={{
                  eyebrow: "Our impact",
                  title: "Every impact story, in one place",
                  text: "Browse the full archive of documented outcomes from across the MFWA.",
                  cta: page.stories.all,
                }}
              />
            </>
          )}

          <AboutGetInvolved data={page.involve} />
        </main>
      </div>

      <Footer data={footer} />
    </>
  );
}
