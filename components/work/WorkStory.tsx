import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { EvidenceTag, StatusBadge } from "@/components/projects/ProjectMeta";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Reveal } from "@/components/ui/Reveal";
import { ConceptFigure } from "@/components/work/ProductPreview";
import type { LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

/** One featured project on the homepage — server-rendered and always visible. */
export function WorkStory({
  project,
  index,
  locale
}: {
  project: LocalizedProject;
  index: number;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const facts = dict.projectFacts;
  const flipped = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");
  const headingId = `work-${project.slug}`;

  return (
    <article aria-labelledby={headingId} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(flipped && "lg:order-2")}>
        <ConceptFigure
          kind={project.previewKind}
          locale={locale}
          caption={facts.conceptVisualization}
          note={facts.conceptVisualizationNote}
        />
      </Reveal>

      <div className={cn(flipped && "lg:order-1")}>
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl text-accent" aria-hidden="true">
            {num}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-accent/40 via-white/10 to-transparent rtl:bg-gradient-to-l" />
          <span className="text-[0.72rem] uppercase tracking-[0.14em] text-paper-dim">
            {project.domain} · {project.year}
          </span>
        </div>

        <h3 id={headingId} className="mt-6 font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-1.5 text-sm uppercase tracking-[0.12em] text-paper-dim">{project.descriptor}</p>

        <p className="mt-5 max-w-xl text-lg leading-8 text-paper">{project.summary}</p>

        <dl className="mt-6 grid max-w-xl gap-4 border-t border-white/[0.08] pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-paper-dim">{facts.role}</dt>
            <dd className="mt-1.5 text-sm text-paper">{project.role}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-paper-dim">{facts.status}</dt>
            <dd className="mt-1.5">
              <StatusBadge status={project.status} label={dict.status[project.status]} />
            </dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-paper-dim">{facts.evidence}</dt>
            <dd className="mt-1.5">
              <EvidenceTag type={project.evidenceType} label={dict.evidenceType[project.evidenceType]} />
            </dd>
          </div>
        </dl>

        <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-paper-dim" aria-label={dict.caseStudy.sections.architecture}>
          {project.flow.map((step, stepIndex) => (
            <li key={step} className="flex items-center gap-2">
              {stepIndex > 0 ? (
                <ArrowRight className="h-3 w-3 text-accent/70 rtl:-scale-x-100" aria-hidden="true" />
              ) : null}
              <span className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href={localizeHref(`/projects/${project.slug}`, locale)}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-accent-soft transition hover:text-accent"
          >
            {facts.viewCaseStudy}
            <span className="sr-only">: {project.name}</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
          </Link>
          {project.links.github ? (
            <TrackedLink
              href={project.links.github}
              event="evidence_opened"
              props={{ project: project.slug, type: "repository", source: "home" }}
              external
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-medium text-paper-dim transition hover:text-paper"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              {facts.viewCode}
              <span className="sr-only">
                : {project.name} ({dict.common.opensInNewTab})
              </span>
              <ArrowUpRight className="external-mark" aria-hidden="true" />
            </TrackedLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
