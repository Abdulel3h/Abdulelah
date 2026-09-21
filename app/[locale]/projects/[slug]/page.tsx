import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { FieldNote } from "@/components/agent/FieldNote";
import { ProjectViewRecorder } from "@/components/agent/ProjectViewRecorder";
import { ReadingPath } from "@/components/agent/ReadingPath";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { EvidencePanel } from "@/components/projects/EvidencePanel";
import { ProjectArchitecture } from "@/components/projects/ProjectArchitecture";
import { EvidenceTag, StatusBadge } from "@/components/projects/ProjectMeta";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ConceptFigure } from "@/components/work/ProductPreview";
import { getProject, getProjects, projectSlugs } from "@/data/projects";
import { localizeHref, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Unknown slugs render the localized not-found page (404) on the server.
export const dynamicParams = true;

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const project = getProject(slug, locale);

  if (!project) {
    return { title: getDictionary(locale).caseStudy.notFoundTitle, robots: { index: false } };
  }

  return createPageMetadata({
    locale,
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: "article",
    keywords: [project.name, project.domain, ...project.technologies]
  });
}

function Section({
  id,
  index,
  title,
  children
}: {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-white/[0.08] pt-8 md:grid-cols-[13rem_1fr] md:gap-10">
      <h2 id={id} className="flex items-baseline gap-3 font-display text-xl font-medium text-paper">
        <span className="text-sm text-accent" aria-hidden="true">
          {String(index).padStart(2, "0")}
        </span>
        {title}
      </h2>
      <div className="min-w-0 text-base leading-8 text-paper-dim">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const project = getProject(slug, locale);

  if (!project) {
    notFound();
  }

  const t = dict.caseStudy;
  const facts = dict.projectFacts;
  const all = getProjects(locale);
  const position = all.findIndex((item) => item.slug === project.slug);
  const related = [all[(position + 1) % all.length], all[(position + 2) % all.length]];
  const sections = t.sections;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.projects, path: "/projects" },
            { name: project.name, path: `/projects/${project.slug}` }
          ],
          locale
        )}
      />
      <JsonLd data={projectJsonLd(project, locale)} />
      <ProjectViewRecorder slug={project.slug} name={project.name} category={project.domain} />

      <div className="container-shell pt-10 sm:pt-14">
        <Breadcrumbs
          label={dict.common.breadcrumb}
          items={[
            { label: dict.nav.home, href: localizeHref("/", locale) },
            { label: dict.nav.projects, href: localizeHref("/projects", locale) },
            { label: project.name }
          ]}
        />
      </div>

      <section className="container-shell pt-8" aria-labelledby="project-title">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="eyebrow mb-5">
              {project.domain} · {project.year}
            </p>
            <h1
              id="project-title"
              className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl"
            >
              {project.name}
            </h1>
            <p className="mt-3 text-lg text-paper-dim">{project.descriptor}</p>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-paper">{project.summary}</p>

            <dl className="mt-8 grid max-w-2xl gap-5 border-t border-white/[0.08] pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-paper-dim">{facts.role}</dt>
                <dd className="mt-1.5 text-sm text-paper">{project.role}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-paper-dim">{facts.status}</dt>
                <dd className="mt-1.5">
                  <StatusBadge status={project.status} label={dict.status[project.status]} />
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-paper-dim">{facts.evidence}</dt>
                <dd className="mt-1.5">
                  <EvidenceTag type={project.evidenceType} label={dict.evidenceType[project.evidenceType]} />
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-paper-dim">{facts.year}</dt>
                <dd className="mt-1.5 text-sm text-paper">{project.year}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {project.links.github ? (
                <TrackedLink
                  href={project.links.github}
                  external
                  event="evidence_opened"
                  props={{ project: project.slug, type: "repository", source: "case-study-header" }}
                  className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-ink-900 transition hover:bg-accent-soft"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  {facts.viewCode}
                  <ArrowUpRight className="external-mark" aria-hidden="true" />
                  <span className="sr-only">({dict.common.opensInNewTab})</span>
                </TrackedLink>
              ) : null}
              <ButtonLink
                href={localizeHref("/contact", locale)}
                variant={project.links.github ? "secondary" : "primary"}
                className="w-full sm:w-auto"
              >
                {facts.discussSimilar}
              </ButtonLink>
            </div>
          </div>

          <EvidencePanel project={project} locale={locale} />
        </div>
      </section>

      <div className="container-shell section-space">
        <div className="grid gap-10">
          <Section id="context" index={1} title={sections.context}>
            <p>{project.context}</p>
          </Section>
          <Section id="problem" index={2} title={sections.problem}>
            <p>{project.problem}</p>
          </Section>
          <Section id="constraints" index={3} title={sections.constraints}>
            <BulletList items={project.constraints} />
          </Section>
          <Section id="solution" index={4} title={sections.solution}>
            <p>{project.solution}</p>
          </Section>
          <Section id="responsibility" index={5} title={sections.responsibility}>
            <p className="font-medium text-paper">{project.role}</p>
            <div className="mt-3">
              <BulletList items={project.responsibilities} />
            </div>
          </Section>
          <Section id="architecture" index={6} title={sections.architecture}>
            <ProjectArchitecture steps={project.flow} locale={locale} label={sections.architecture} />
            <h3 className="mt-8 text-sm font-semibold text-paper">{t.architectureNotes}</h3>
            <div className="mt-3">
              <BulletList items={project.approach} />
            </div>
          </Section>
          <Section id="decisions" index={7} title={sections.decisions}>
            <ul className="grid gap-6 sm:grid-cols-2">
              {project.decisions.map((decision) => (
                <li key={decision.title} className="border-t border-accent/30 pt-4">
                  <h3 className="font-display text-lg font-medium text-paper">{decision.title}</h3>
                  <p className="mt-2 text-sm leading-7">{decision.body}</p>
                </li>
              ))}
            </ul>
          </Section>
          <Section id="outcome" index={8} title={sections.outcome}>
            <p className="text-paper">{project.outcome}</p>
          </Section>
          <Section id="limitations" index={9} title={sections.limitations}>
            <BulletList items={project.limitations} />
          </Section>
          <Section id="next" index={10} title={sections.next}>
            <BulletList items={project.next} />
          </Section>
        </div>
      </div>

      <section className="section-space section-band" aria-labelledby="concept-title">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 id="concept-title" className="font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
              {t.conceptTitle}
            </h2>
            {project.lesson ? (
              <div className="mt-8">
                <FieldNote label={t.lessonLabel}>{project.lesson}</FieldNote>
              </div>
            ) : null}
            {project.quote ? (
              <blockquote className="mt-8 border-s-2 border-accent ps-5 text-lg font-medium leading-8 text-accent-soft">
                {project.quote}
              </blockquote>
            ) : null}
          </div>
          <ConceptFigure
            kind={project.previewKind}
            locale={locale}
            caption={facts.conceptVisualization}
            note={facts.conceptVisualizationNote}
          />
        </div>
      </section>

      <section className="container-shell pt-12">
        <ReadingPath
          page="detail"
          slug={project.slug}
          projects={all.map((item) => ({
            slug: item.slug,
            name: item.name,
            href: localizeHref(`/projects/${item.slug}`, locale),
            domain: item.domain
          }))}
        />
      </section>

      <section className="container-shell section-space" aria-labelledby="related-title">
        <h2 id="related-title" className="font-display text-2xl font-medium text-paper sm:text-3xl">
          {t.relatedTitle}
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={localizeHref(`/projects/${item.slug}`, locale)}
                className="focus-ring group flex h-full flex-col rounded-2xl border border-white/[0.1] bg-white/[0.02] p-6 transition hover:border-accent/35"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.14em] text-paper-dim">
                  {item.domain} · {item.year}
                </span>
                <span className="mt-2 font-display text-2xl font-medium text-paper">{item.name}</span>
                <span className="mt-2 text-sm leading-7 text-paper-dim">{item.summary}</span>
                <span className="mt-4 flex flex-wrap items-center gap-3">
                  <StatusBadge status={item.status} label={dict.status[item.status]} />
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-soft">
                    {facts.viewCaseStudy}
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CTASection
        title={t.closingTitle}
        description={t.closingBody}
        primaryHref={localizeHref("/contact", locale)}
        primaryLabel={t.closingPrimary}
        secondaryHref={localizeHref("/resume", locale)}
        secondaryLabel={t.closingSecondary}
      />
    </>
  );
}
