import { ReadingPath } from "@/components/agent/ReadingPath";
import { PageHead } from "@/components/site/primitives";
import { tintOf } from "@/components/site/tints";
import { ProjectIndex, type IndexItem } from "@/components/site/work/ProjectIndex";
import { getProjects } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectBriefs, siteCopy } from "@/lib/i18n/experience";

export function Projects({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const site = siteCopy(locale);
  const copy = site.projects;
  const briefs = projectBriefs(locale);
  const projects = getProjects(locale);
  const items: IndexItem[] = projects.map((project) => ({
    slug: project.slug,
    href: localizeHref(`/projects/${project.slug}`, locale),
    name: project.name,
    descriptor: project.descriptor,
    line: briefs[project.slug].line,
    domain: project.domain,
    year: project.year,
    status: project.status,
    statusLabel: dict.status[project.status],
    hasCode: Boolean(project.links.github),
    previewKind: project.previewKind,
    flow: project.flow,
    tint: tintOf(project.slug)
  }));

  return (
    <>
      <PageHead id="projects-title" kicker={copy.kicker} title={copy.title} titleSoft={copy.titleSoft} />

      <section aria-labelledby="projects-title" className="ds-shell pb-[var(--ds-section)] pt-14 lg:pt-20">
        <ProjectIndex
          items={items}
          locale={locale}
          labels={{
            filterLabel: copy.filterLabel,
            filters: copy.filters,
            count: copy.count,
            listLabel: copy.listLabel,
            previewLabel: copy.previewLabel,
            open: copy.open,
            howItWorks: site.home.work.howItWorks,
            code: site.home.work.code,
            conceptVisualization: dict.projectFacts.conceptVisualization,
            conceptVisualizationNote: dict.projectFacts.conceptVisualizationNote
          }}
        />

        <div className="mt-16 border-t border-white/[0.08] pt-12">
          <ReadingPath
            page="projects"
            projects={items.map(({ slug, name, href, domain }) => ({ slug, name, href, domain }))}
          />
        </div>
      </section>
    </>
  );
}
