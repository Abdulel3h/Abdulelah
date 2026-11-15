import { Github } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { PipelineStage } from "@/components/motion/PipelineStage";
import { StatusBadge } from "@/components/projects/ProjectMeta";
import { mixer } from "@/components/site/mixed";
import { directional, Ltr, pad, ProjectName, tintStyle } from "@/components/site/primitives";
import { tintOf } from "@/components/site/tints";
import { StackController } from "@/components/site/work/StackController";
import { Reveal } from "@/components/ui/Reveal";
import { ConceptFigure } from "@/components/work/ProductPreview";
import type { LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectBriefs, siteCopy } from "@/lib/i18n/experience";

/**
 * The working projects as chapters of one story: cards that stack as the
 * page scrolls (StackController), each a small world in its project's tint.
 * A card carries everything needed to judge and open the project — name,
 * idea, status, role, code, flow and two links — so the motion never hides
 * information: a covered card has already been read, and focus brings it back.
 */
export function StackedChapters({ projects, locale }: { projects: LocalizedProject[]; locale: Locale }) {
  const copy = siteCopy(locale).home.work;

  return (
    <StackController label={copy.kicker}>
      {projects.map((project, index) => (
        <ChapterCard key={project.slug} project={project} index={index} locale={locale} />
      ))}
    </StackController>
  );
}

function ChapterCard({ project, index, locale }: { project: LocalizedProject; index: number; locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = siteCopy(locale).home.work;
  const brief = projectBriefs(locale)[project.slug];
  const mix = mixer(locale);
  const { Forward, Outward } = directional(locale);
  const headingId = `work-${project.slug}`;

  return (
    <li id={project.slug} className="stack-card" style={tintStyle(tintOf(project.slug))}>
      <article aria-labelledby={headingId} className="stack-surface">
        <p className="stack-bar">
          <span className="stack-bar-index">{pad(index + 1)}</span>
          <span className="stack-bar-path" dir="ltr" aria-hidden="true">
            ~/projects/{project.slug}
          </span>
          <span aria-hidden="true" className="stack-bar-rule" />
          <span className="stack-bar-meta">
            {project.domain} · <span className="ds-num">{project.year}</span>
          </span>
        </p>

        <PipelineStage threshold={0.3} className="stack-body">
          <div>
            {/* In Arabic the heading stays right-to-left with the name as an
                inline isolate, so a wrapped Latin name still aligns with the page. */}
            <h3 id={headingId} className="text-[clamp(2.4rem,1.8rem+2.8vw,4rem)] leading-[1.06] text-paper">
              <ProjectName className="ds-name" name={project.name} />
            </h3>
            <p className="ds-h3 mt-3 ds-tone-80">{mix(project.descriptor)}</p>
            <p className="ds-body mt-4 text-paper">{mix(brief.line)}</p>

            {project.highlights?.length ? (
              <ul className="mt-5 grid gap-2">
                {project.highlights.slice(0, 3).map((item) => (
                  <li key={item} className="ds-gloss ds-small">
                    {mix(item)}
                  </li>
                ))}
              </ul>
            ) : null}

            <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-white/[0.08] pt-5 sm:grid-cols-[auto_minmax(0,1fr)]">
              <div className="sm:col-span-2">
                <dt className="ds-label">{copy.role}</dt>
                <dd className="ds-small mt-1 text-paper">{mix(project.role)}</dd>
              </div>
              <div>
                <dt className="ds-label">{copy.status}</dt>
                <dd className="mt-1.5">
                  <StatusBadge status={project.status} label={dict.status[project.status]} />
                </dd>
              </div>
              <div>
                <dt className="ds-label">{copy.code}</dt>
                <dd className="ds-small mt-1 text-paper">{project.links.github ? <Ltr>GitHub</Ltr> : copy.noCode}</dd>
              </div>
            </dl>

            <ol aria-label={copy.howItWorks} className="stack-flow mt-5">
              {project.flow.map((step, stepIndex) => (
                <Fragment key={step}>
                  {stepIndex > 0 ? (
                    <li aria-hidden="true" className="stack-flow-arrow">
                      {locale === "ar" ? "←" : "→"}
                    </li>
                  ) : null}
                  <li data-beat={Math.min(stepIndex + 1, 4)} className="beat-text-strong">
                    {mix(step)}
                  </li>
                </Fragment>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2">
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

          <Reveal className="ds-wipe relative">
            <ConceptFigure
              kind={project.previewKind}
              locale={locale}
              caption={dict.projectFacts.conceptVisualization}
              note={dict.projectFacts.conceptVisualizationNote}
            />
          </Reveal>
        </PipelineStage>
        <span aria-hidden="true" className="stack-shade" />
      </article>
    </li>
  );
}
