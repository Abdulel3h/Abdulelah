import { Award, Camera, FileText, Github, Lock } from "lucide-react";
import Link from "next/link";
import { ProjectViewRecorder } from "@/components/agent/ProjectViewRecorder";
import { ReadingPath } from "@/components/agent/ReadingPath";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { PipelineStage } from "@/components/motion/PipelineStage";
import { StatusBadge } from "@/components/projects/ProjectMeta";
import { mixer } from "@/components/site/mixed";
import { directional, Latin, Ltr, pad, ProjectName, tintStyle } from "@/components/site/primitives";
import { tintOf } from "@/components/site/tints";
import { Pipeline } from "@/components/site/work/Pipeline";
import {
  Architecture,
  BoundaryCase,
  Capabilities,
  Checks,
  Evaluation,
  Failures,
  Guardrails,
  Highlights,
  Principle,
  Providers,
  Requests
} from "@/components/site/work/Story";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { ConceptFigure } from "@/components/work/ProductPreview";
import { getProjects, type LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectBriefs, siteCopy } from "@/lib/i18n/experience";

const evidenceIcons = {
  repository: Github,
  document: FileText,
  screenshots: Camera,
  "program-record": Award,
  private: Lock
} as const;

function Dots({ items, mix }: { items: string[]; mix: ReturnType<typeof mixer> }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="ds-small flex gap-3 text-paper-dim">
          <span aria-hidden="true" className="mt-[calc((var(--ds-lh-small)*1em_-_0.25rem)/2)] h-1 w-1 shrink-0 rounded-full bg-accent/80" />
          <span>{mix(item)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A case study, told in the order a reviewer asks: what was the problem, what
 * was built, what was my part, what came of it — four short lines first.
 * Then how it works (a station line the signal travels along), the
 * decisions, the honest limits, the evidence, and the full record kept intact
 * behind one disclosure. It ends by walking into the next project.
 */
export function CaseStudy({ project, locale }: { project: LocalizedProject; locale: Locale }) {
  const dict = getDictionary(locale);
  const site = siteCopy(locale);
  const copy = site.caseStudy;
  const work = site.home.work;
  const briefs = projectBriefs(locale);
  const brief = briefs[project.slug];
  const mix = mixer(locale);
  const { Forward, Back, Outward } = directional(locale);
  const all = getProjects(locale);
  const position = all.findIndex((item) => item.slug === project.slug);
  const next = all[(position + 1) % all.length];
  const previous = all[(position - 1 + all.length) % all.length];
  const story = project.story;
  const lines = [
    { label: copy.problem, text: brief.problem },
    { label: copy.built, text: brief.built },
    { label: copy.role, text: brief.role },
    { label: copy.result, text: brief.result }
  ];

  return (
    <div style={tintStyle(tintOf(project.slug))}>
      <ProjectViewRecorder slug={project.slug} name={project.name} category={project.domain} />

      <div className="ds-shell pt-8 sm:pt-10">
        <Breadcrumbs
          label={dict.common.breadcrumb}
          items={[
            { label: dict.nav.home, href: localizeHref("/", locale) },
            { label: dict.nav.projects, href: localizeHref("/projects", locale) },
            { label: project.name }
          ]}
        />
      </div>

      <header className="ds-shell grid gap-10 pt-8 lg:grid-cols-12 lg:gap-14 lg:pt-12">
        <div className="lg:col-span-7">
          <p className="ds-kicker">
            {project.domain} · <span className="ds-num">{project.year}</span>
          </p>
          <h1 id="project-title" className="mt-5 text-[clamp(3.2rem,2rem+5.4vw,7rem)] leading-[1.02] text-paper">
            <ProjectName className="ds-name" name={project.name} />
          </h1>
          {/* The name in the other script, once, where the project has one. */}
          {project.altName ? (
            <p className="mt-2 text-[1.1rem] text-paper-faint">
              <ProjectName name={project.altName} />
            </p>
          ) : null}
          <p className="ds-h3 mt-5 ds-tone-85">{mix(project.descriptor)}</p>
          <p className="ds-lede mt-5">{mix(brief.line)}</p>
          {project.highlights?.length ? <Highlights items={project.highlights} locale={locale} className="mt-8" /> : null}
        </div>

        <div className="lg:col-span-5 lg:pt-6">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/[0.1] pt-6">
            <div className="col-span-2">
              <dt className="ds-label">{work.role}</dt>
              <dd className="ds-text mt-1.5 text-[1.02rem] text-paper">{mix(project.role)}</dd>
            </div>
            <div>
              <dt className="ds-label">{work.status}</dt>
              <dd className="mt-2">
                <StatusBadge status={project.status} label={dict.status[project.status]} />
              </dd>
            </div>
            <div>
              <dt className="ds-label">{copy.year}</dt>
              <dd className="mt-1.5 text-[1.02rem] text-paper">
                <span className="ds-num">{project.year}</span>
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="ds-label">{copy.code}</dt>
              <dd className="mt-1.5 break-words text-[1.02rem] text-paper">
                {project.links.github ? <Ltr>{project.links.github.replace("https://", "")}</Ltr> : work.noCode}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {project.links.github ? (
              <TrackedLink
                href={project.links.github}
                external
                event="evidence_opened"
                props={{ project: project.slug, type: "repository", source: "case-study-header" }}
                className="ds-btn ds-btn-solid focus-ring group"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {work.openCode}
                <Outward className="ds-forward h-4 w-4" aria-hidden="true" />
                <span className="sr-only">({dict.common.opensInNewTab})</span>
              </TrackedLink>
            ) : null}
            <Link
              href={localizeHref("/contact", locale)}
              className={project.links.github ? "ds-btn ds-btn-quiet focus-ring" : "ds-btn ds-btn-solid focus-ring"}
            >
              {copy.discuss}
            </Link>
          </div>
        </div>
      </header>

      <section aria-label={dict.projectFacts.conceptVisualization} className="ds-shell mt-16 lg:mt-24">
        <PipelineStage threshold={0.3}>
          <Reveal className="ds-wipe relative mx-auto max-w-4xl">
            <div aria-hidden="true" className="ds-tint-wash absolute -inset-16 -z-10 sm:-inset-24" />
            <ConceptFigure
              kind={project.previewKind}
              locale={locale}
              caption={dict.projectFacts.conceptVisualization}
              note={dict.projectFacts.conceptVisualizationNote}
            />
          </Reveal>
        </PipelineStage>
      </section>

      <section aria-labelledby="in-lines" className="ds-shell ds-section">
        <h2 id="in-lines" className="ds-kicker">
          {copy.inLines}
        </h2>
        <ol className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {lines.map((line, index) => (
            <Reveal as="li" key={line.label} delay={index * 0.06} className="ds-rise border-t border-white/[0.1] pt-5">
              <p className="flex items-baseline gap-3">
                <Latin className="ds-tint-text text-sm">{pad(index + 1)}</Latin>
                <span className="ds-title text-[1.15rem]">{line.label}</span>
              </p>
              <p className="ds-text mt-3 text-[1.02rem] ds-tone-85">{mix(line.text)}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {story?.requests ? <Requests story={story.requests} locale={locale} /> : null}
      {story?.principle ? <Principle story={story.principle} locale={locale} /> : null}

      <section aria-labelledby="how" className={story?.principle ? "ds-shell pt-[var(--ds-section)]" : "ds-shell"}>
        <h2 id="how" className="ds-h2">
          {copy.how}
        </h2>
        <div className="mt-10">
          {story?.architecture ? (
            <Architecture story={story.architecture} locale={locale} label={copy.how} />
          ) : (
            <Pipeline steps={project.flow} stages={copy.stages} label={copy.how} />
          )}
        </div>
      </section>

      {story?.boundary ? <BoundaryCase story={story.boundary} locale={locale} project={project.slug} /> : null}
      {story ? <Capabilities items={project.capabilities} title={copy.capabilities} locale={locale} /> : null}
      {story?.evaluation ? <Evaluation story={story.evaluation} locale={locale} scopeLabel={copy.scope} /> : null}
      {story?.failures ? <Failures story={story.failures} locale={locale} /> : null}
      {story?.guardrails ? <Guardrails story={story.guardrails} locale={locale} scopeLabel={copy.scope} /> : null}
      {story?.checks ? <Checks story={story.checks} locale={locale} scopeLabel={copy.scope} /> : null}
      {story?.providers ? <Providers story={story.providers} locale={locale} /> : null}

      <section aria-labelledby="decisions" className="ds-shell ds-section">
        <h2 id="decisions" className="ds-h2">
          {copy.decisions}
        </h2>
        <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {project.decisions.map((decision) => (
            <li key={decision.title} className="ds-gloss">
              <h3 className="ds-title text-[1.15rem]">{mix(decision.title)}</h3>
              <p className="ds-small mt-2 text-paper-dim">{mix(decision.body)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="honest" className="border-y border-white/[0.08] bg-white/[0.015]">
        <div className="ds-shell py-16 lg:py-20">
          <h2 id="honest" className="ds-h2">
            {copy.honest}
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-3">
            <div>
              <h3 className="ds-label text-accent">{copy.notClaimed}</h3>
              <p className="ds-small mt-3 text-paper">{mix(project.notClaimed)}</p>
            </div>
            <div>
              <h3 className="ds-label text-accent">{copy.limitations}</h3>
              <div className="mt-3">
                <Dots items={project.limitations} mix={mix} />
              </div>
            </div>
            <div>
              <h3 className="ds-label text-accent">{copy.next}</h3>
              <div className="mt-3">
                <Dots items={project.next} mix={mix} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="evidence" className="ds-shell ds-section grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="evidence" className="ds-h2">
            {copy.evidence}
          </h2>
          <p className="ds-small mt-3 text-paper-dim">{mix(project.statusDetail)}</p>
          <ul className="mt-8 border-t border-white/[0.08]">
            {project.evidence.map((item) => {
              const Icon = evidenceIcons[item.kind];
              const external = Boolean(item.href?.startsWith("http"));
              const body = (
                <>
                  <Icon className="mt-1.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.02rem] font-medium text-paper">{mix(item.label)}</span>
                    <span className="ds-small mt-1 block text-paper-dim">{mix(item.detail)}</span>
                  </span>
                </>
              );

              return (
                <li key={`${item.kind}-${item.label}`} className="border-b border-white/[0.08]">
                  {item.href ? (
                    <TrackedLink
                      href={external ? item.href : localizeHref(item.href, locale)}
                      external={external}
                      event="evidence_opened"
                      props={{ project: project.slug, type: item.kind, source: "case-study" }}
                      className="focus-ring group flex items-start gap-4 rounded py-5 transition-colors hover:bg-white/[0.02]"
                    >
                      {body}
                      {external ? (
                        <>
                          <Outward className="ds-forward mt-1.5 h-4 w-4 shrink-0 text-paper-dim" aria-hidden="true" />
                          <span className="sr-only">({dict.common.opensInNewTab})</span>
                        </>
                      ) : (
                        <Forward className="ds-forward mt-1.5 h-4 w-4 shrink-0 text-paper-dim" aria-hidden="true" />
                      )}
                    </TrackedLink>
                  ) : (
                    <div className="flex items-start gap-4 py-5">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <h3 className="ds-label">{copy.stack}</h3>
          {/* In Arabic each technology is its own isolate, so the list runs
              in the Arabic reading order like any other list on the page. */}
          <p className="ds-text mt-3 text-[1.05rem] text-paper">{mix(project.technologies.join(" · "))}</p>
          {project.technologiesNote ? (
            <p className="ds-small mt-3 text-paper-dim">{mix(project.technologiesNote)}</p>
          ) : null}

          {project.lesson || project.quote ? (
            <figure className="ds-gloss mt-10">
              <blockquote className="ds-text text-[1.2rem] font-medium text-paper">
                {site.quote.open}
                {mix(project.lesson ?? project.quote ?? "")}
                {site.quote.close}
              </blockquote>
            </figure>
          ) : null}
        </div>
      </section>

      <section className="ds-shell">
        <details className="group border-y border-white/[0.08]">
          <summary className="focus-ring flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded py-4 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="ds-title block text-[1.15rem]">{copy.full}</span>
              <span className="ds-small block text-paper-dim">{copy.fullHint}</span>
            </span>
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[0.14] text-accent transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="grid gap-10 pb-12 pt-4 lg:grid-cols-2">
            <div>
              <h3 className="ds-label text-accent">{copy.context}</h3>
              <p className="ds-small mt-2 text-paper-dim">{mix(project.context)}</p>
              <h3 className="ds-label mt-8 text-accent">{copy.problem}</h3>
              <p className="ds-small mt-2 text-paper-dim">{mix(project.problem)}</p>
              <h3 className="ds-label mt-8 text-accent">{copy.built}</h3>
              <p className="ds-small mt-2 text-paper-dim">{mix(project.solution)}</p>
              <h3 className="ds-label mt-8 text-accent">{copy.result}</h3>
              <p className="ds-small mt-2 text-paper-dim">{mix(project.outcome)}</p>
            </div>
            <div>
              <h3 className="ds-label text-accent">{copy.constraints}</h3>
              <div className="mt-3">
                <Dots items={project.constraints} mix={mix} />
              </div>
              <h3 className="ds-label mt-8 text-accent">{copy.responsibilities}</h3>
              <div className="mt-3">
                <Dots items={project.responsibilities} mix={mix} />
              </div>
              <h3 className="ds-label mt-8 text-accent">{copy.approach}</h3>
              <div className="mt-3">
                <Dots items={project.approach} mix={mix} />
              </div>
            </div>
          </div>
        </details>
      </section>

      <section className="ds-shell pt-12">
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

      <nav aria-label={copy.nextProject} className="ds-shell ds-section">
        <Link
          href={localizeHref(`/projects/${next.slug}`, locale)}
          style={tintStyle(tintOf(next.slug))}
          className="focus-ring group relative block overflow-hidden rounded-[var(--ds-radius)] border border-white/[0.09] px-6 py-10 transition-colors hover:border-[rgb(var(--tint)/0.5)] sm:px-10 sm:py-14"
        >
          <span aria-hidden="true" className="ds-tint-wash absolute -end-24 -top-24 h-80 w-80 opacity-80" />
          <span className="ds-kicker relative">{copy.nextProject}</span>
          <span className="relative mt-4 flex items-end justify-between gap-6">
            <span className="min-w-0">
              <span className="block text-[clamp(2.4rem,1.6rem+3.6vw,4.6rem)] text-paper">
                <ProjectName className="ds-name" name={next.name} />
              </span>
              <span className="ds-small mt-3 block max-w-xl text-paper-dim">{mix(briefs[next.slug].line)}</span>
            </span>
            <Forward className="ds-forward h-8 w-8 shrink-0 text-accent" aria-hidden="true" />
          </span>
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={localizeHref(`/projects/${previous.slug}`, locale)}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded text-[0.98rem] text-paper-dim transition-colors hover:text-paper"
          >
            <Back className="h-4 w-4" aria-hidden="true" />
            {copy.previousProject}: <ProjectName name={previous.name} />
          </Link>
          <Link
            href={localizeHref("/projects", locale)}
            className="focus-ring inline-flex min-h-11 items-center rounded text-[0.98rem] text-paper-dim transition-colors hover:text-paper"
          >
            {copy.all}
          </Link>
        </div>
      </nav>
    </div>
  );
}
