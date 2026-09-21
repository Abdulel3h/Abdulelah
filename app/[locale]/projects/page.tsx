import type { Metadata } from "next";
import { ReadingPath } from "@/components/agent/ReadingPath";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkIndex, type WorkIndexItem } from "@/components/work/WorkIndex";
import { getProjects } from "@/data/projects";
import { localizeHref } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).projectsPage;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/projects" });
}

export default async function ProjectsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.projectsPage;
  const items: WorkIndexItem[] = getProjects(locale).map((project) => ({
    slug: project.slug,
    href: localizeHref(`/projects/${project.slug}`, locale),
    name: project.name,
    descriptor: project.descriptor,
    summary: project.summary,
    domain: project.domain,
    year: project.year,
    role: project.role,
    status: project.status,
    statusLabel: dict.status[project.status],
    evidenceType: project.evidenceType,
    evidenceLabel: dict.evidenceType[project.evidenceType],
    previewKind: project.previewKind,
    flow: project.flow
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.projects, path: "/projects" }
          ],
          locale
        )}
      />

      <section className="container-shell pt-14 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">{t.eyebrow}</p>
          <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">{t.intro}</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-paper">{t.instruction}</p>
        </div>
      </section>

      <section className="container-shell section-space">
        <WorkIndex
          items={items}
          locale={locale}
          labels={{
            listLabel: t.listLabel,
            role: dict.projectFacts.role,
            open: t.open,
            conceptVisualization: dict.projectFacts.conceptVisualization,
            conceptVisualizationNote: dict.projectFacts.conceptVisualizationNote,
            previewLabel: t.previewLabel,
            architecture: dict.caseStudy.sections.architecture
          }}
        />
        <div className="mt-16 border-t border-white/[0.08] pt-12">
          <ReadingPath page="projects" projects={items.map(({ slug, name, href, domain }) => ({ slug, name, href, domain }))} />
        </div>
      </section>
    </>
  );
}
