import { Github } from "lucide-react";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { PipelineStage } from "@/components/motion/PipelineStage";
import { StatusBadge } from "@/components/projects/ProjectMeta";
import { mixer } from "@/components/site/mixed";
import { directional, Latin, Ltr, pad, tintStyle } from "@/components/site/primitives";
import { tintOf } from "@/components/site/tints";
import { Flow } from "@/components/site/work/Flow";
import { Reveal } from "@/components/ui/Reveal";
import { ConceptFigure } from "@/components/work/ProductPreview";
import type { LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectBriefs, siteCopy } from "@/lib/i18n/experience";
import { cn } from "@/lib/utils";

/**
 * One working project on the homepage — a small world of its own: its tint
 * washes behind its sketch, the name is set large, and the facts sit beside
 * it as margin notes. The sketch is revealed by a wipe in the reading
 * direction, then acts out the project's four steps while the workflow line
 * lights beside it. Plates alternate sides down the page.
 */
export function Chapter({ project, index, locale }: { project: LocalizedProject; index: number; locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = siteCopy(locale).home.work;
  const brief = projectBriefs(locale)[project.slug];
  const mix = mixer(locale);
  const { Forward, Outward } = directional(locale);
  const flipped = index % 2 === 1;
  const headingId = `work-${project.slug}`;

  return (
    <article id={project.slug} aria-labelledby={headingId} className="scroll-mt-24" style={tintStyle(tintOf(project.slug))}>
      <PipelineStage threshold={0.3} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className={cn("ds-wipe relative lg:col-span-7", flipped && "lg:order-2")}>
          <div aria-hidden="true" className="ds-tint-wash absolute -inset-12 -z-10 sm:-inset-20" />
          <ConceptFigure
            kind={project.previewKind}
            locale={locale}
            caption={dict.projectFacts.conceptVisualization}
            note={dict.projectFacts.conceptVisualizationNote}
          />
        </Reveal>

        <div className={cn("lg:col-span-5", flipped && "lg:order-1")}>
          <p className="ds-small flex items-center gap-4 text-paper-dim">
            <Latin className="ds-tint-text text-2xl leading-none">{pad(index + 1)}</Latin>
            <span aria-hidden="true" className="h-px flex-1 bg-white/[0.1]" />
            <span>
              {project.domain} · <span className="ds-num">{project.year}</span>
            </span>
          </p>

          {/* In Arabic the heading stays right-to-left with the name as an
              inline isolate, so a wrapped Latin name still aligns with the page. */}
          <h3 id={headingId} className="mt-6 text-[clamp(2.6rem,1.9rem+3vw,4.25rem)] leading-[1.08] text-paper">
            <Latin className="ds-name">{project.name}</Latin>
          </h3>
          <p className="ds-h3 mt-3 ds-tone-80">{mix(project.descriptor)}</p>
          <p className="ds-body mt-4 text-paper">{mix(brief.line)}</p>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.09] pt-6">
            <div className="col-span-2">
              <dt className="ds-label">{copy.role}</dt>
              <dd className="ds-small mt-1.5 text-paper">{mix(project.role)}</dd>
            </div>
            <div>
              <dt className="ds-label">{copy.status}</dt>
              <dd className="mt-1.5">
                <StatusBadge status={project.status} label={dict.status[project.status]} />
              </dd>
            </div>
            <div>
              <dt className="ds-label">{copy.code}</dt>
              <dd className="ds-small mt-1.5 text-paper">
                {project.links.github ? <Ltr>GitHub</Ltr> : copy.noCode}
              </dd>
            </div>
          </dl>

          <Flow steps={project.flow} label={copy.howItWorks} locale={locale} className="mt-6" />

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2">
            <Link
              href={localizeHref(`/projects/${project.slug}`, locale)}
              className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded text-[1.02rem] font-medium text-accent-soft transition-colors hover:text-accent"
            >
              {copy.caseStudy}
              <span className="sr-only">: {project.name}</span>
              <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
            </Link>
            {project.links.github ? (
              <TrackedLink
                href={project.links.github}
                external
                event="evidence_opened"
                props={{ project: project.slug, type: "repository", source: "home" }}
                className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded text-[0.98rem] text-paper-dim transition-colors hover:text-paper"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {copy.openCode}
                <span className="sr-only">
                  : {project.name} ({dict.common.opensInNewTab})
                </span>
                <Outward className="ds-forward h-3.5 w-3.5" aria-hidden="true" />
              </TrackedLink>
            ) : null}
          </div>
        </div>
      </PipelineStage>
    </article>
  );
}
