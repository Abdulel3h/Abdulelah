import Link from "next/link";
import type { CSSProperties } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { mixed } from "@/components/site/mixed";
import { directional, Down, Latin, pad, ProjectName } from "@/components/site/primitives";
import { tintOf } from "@/components/site/tints";
import { getFeaturedProjects, getProject, projectCounts } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";
import { format } from "@/lib/i18n/format";

/**
 * The opening. The name, set very large, is the first thing painted (no
 * hidden start state). One sentence says what Abdulelah does; three of its
 * words carry numbered margin notes — the gloss of a manuscript — with the
 * evidence, set in the margin beside it on wide screens and below it on a
 * phone. Hovering a word lights its note and the other way round (CSS only,
 * see .ds-hero in site.css); the notes are always visible, so touch and
 * screen readers lose nothing. Below, the working projects are one swipe
 * away on a phone and one row on a desktop. Above the name, one quiet line
 * points to the newest project (see Notice).
 */
export function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = siteCopy(locale).home;
  const featured = getFeaturedProjects(locale);
  const notes = [
    { id: 1, text: mixed(copy.notes[1], locale) },
    {
      id: 2,
      text: format(copy.notes[2], { total: projectCounts.total, code: projectCounts.publicRepositories })
    },
    { id: 3, text: copy.notes[3] }
  ];

  return (
    <section className="ds-hero relative" aria-labelledby="hero-title">
      <div className="ds-shell grid gap-y-7 pb-10 pt-6 sm:pt-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-9 lg:pb-14 lg:pt-11">
        <div className="lg:col-span-12">
          <Notice locale={locale} />

          <p className="ds-kicker">{copy.kicker}</p>

          <h1 id="hero-title" className="ds-display mt-7 lg:mt-9">
            <span className="block">{dict.common.firstName}</span>
            <span className="block ds-tone-62">{dict.common.lastName}</span>
          </h1>

          <div aria-hidden="true" className="ds-draw mt-7 h-px w-32 bg-accent sm:w-44" />
        </div>

        <p className="ds-statement max-w-[30ch] lg:col-span-7 lg:col-start-1 lg:row-start-2">
          {copy.statement.before}{" "}
          <span data-gloss="1" className="ds-glossed">
            {copy.statement.gloss1}
          </span>
          <sup aria-hidden="true" className="ds-gloss-mark">
            1
          </sup>{" "}
          {/* The preposition («إلى», "into") never ends a line on its own. */}
          {copy.statement.middle}
          {"\u00a0"}
          <span data-gloss="2" className="ds-glossed">
            {copy.statement.gloss2}
          </span>
          <sup aria-hidden="true" className="ds-gloss-mark">
            2
          </sup>{" "}
          <span data-gloss="3" className="ds-glossed">
            {copy.statement.gloss3}
          </span>
          <sup aria-hidden="true" className="ds-gloss-mark">
            3
          </sup>
          {copy.statement.end}
        </p>

        {/* The margin: beside the statement on wide screens, below it on a phone. */}
        <ol
          aria-label={copy.notesLabel}
          className="grid max-w-3xl gap-3 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-2 lg:gap-6 lg:self-start lg:pt-2"
        >
          {notes.map((note, index) => (
            <li
              key={note.id}
              data-note={note.id}
              className="ds-gloss ds-settle flex items-baseline gap-2.5"
              style={{ "--ds-delay": `${0.35 + index * 0.12}s` } as CSSProperties}
            >
              {/* Spacing comes from the flex gap: a logical margin on an
                  LTR-isolated element would resolve to the wrong side. */}
              <span aria-hidden="true" className="ds-latin shrink-0 text-sm text-accent">
                {note.id}
              </span>
              <span>{note.text}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:pt-0">
          <a href="#work" className="ds-btn ds-btn-solid focus-ring group">
            {copy.primary}
            <Down className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
          <Link href={localizeHref("/resume", locale)} className="ds-btn ds-btn-quiet focus-ring">
            {copy.secondary}
          </Link>
        </div>
      </div>

      <div className="ds-shell pb-6">
        <p className="ds-label" id="hero-strip-label">
          {copy.stripLabel}
        </p>
        <ol aria-labelledby="hero-strip-label" className="ds-strip mt-3">
          {featured.map((project, index) => (
            <li key={project.slug} style={{ "--tint": tintOf(project.slug) } as CSSProperties}>
              <a
                href={`#${project.slug}`}
                className="focus-ring group flex h-full min-h-[5.5rem] flex-col justify-between gap-3 rounded-[var(--ds-radius)] border border-white/[0.09] bg-white/[0.02] p-4 transition-colors hover:border-[rgb(var(--tint)/0.55)] hover:bg-white/[0.04]"
              >
                <span className="flex items-start justify-between gap-3">
                  <ProjectName className="text-[1.45rem] leading-none text-paper lg:text-[1.2rem] xl:text-[1.3rem]" name={project.name} />
                  <Latin className="ds-tint-text text-sm">{pad(index + 1)}</Latin>
                </span>
                <span className="ds-micro text-paper-dim">{project.domain}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** The project the notice above the name points to. */
const NOTICE_PROJECT = "raqmi";

/**
 * A featured-project notice: one link, made of the strip cards' material, that
 * names the project and its idea and opens its case study. Two rows on a
 * phone (the arrow alone stands for "explore"), one line on a desktop. It
 * settles in once with the hero and never moves again; there is nothing to
 * dismiss. The label says "new" for now and can say "featured" later.
 */
function Notice({ locale }: { locale: Locale }) {
  const project = getProject(NOTICE_PROJECT, locale);
  const copy = siteCopy(locale).home.notice;
  const { Forward } = directional(locale);

  if (!project) return null;

  return (
    <div className="mb-8 flex lg:mb-9" style={{ "--tint": tintOf(project.slug) } as CSSProperties}>
      <TrackedLink
        href={localizeHref(`/projects/${project.slug}`, locale)}
        event="announcement_opened"
        props={{ project: project.slug, source: "hero" }}
        className="ds-notice ds-settle focus-ring group"
      >
        <span className="ds-notice-head">
          <span className="ds-label">{copy.label}</span>
          <span aria-hidden="true" className="ds-tint-dot h-1.5 w-1.5 shrink-0 rounded-full" />
          <span className="sr-only">: </span>
          <ProjectName className="text-[1.15rem] leading-none text-paper" name={project.name} />
          <span className="sr-only">. </span>
        </span>
        <span className="ds-notice-line ds-small text-paper-dim">{copy.line} </span>
        <span className="ds-notice-cta ds-small font-medium text-accent-soft">
          <span className="max-sm:sr-only">{copy.cta}</span>
          <Forward className="ds-forward h-4 w-4 shrink-0" aria-hidden="true" />
        </span>
      </TrackedLink>
    </div>
  );
}
