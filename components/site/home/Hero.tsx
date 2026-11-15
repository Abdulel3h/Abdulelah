import type { CSSProperties } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { mixed } from "@/components/site/mixed";
import { directional, Latin, pad, ProjectName } from "@/components/site/primitives";
import { Shell, type ShellChip } from "@/components/site/shell/Shell";
import { tintOf } from "@/components/site/tints";
import { getFeaturedProjects, getProject, projectCounts } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";
import { format } from "@/lib/i18n/format";
import { buildShellData } from "@/lib/shell/data";

/** The prompt the shell shows; Latin in both languages, as code is. */
const PROMPT = "~ $";

/**
 * The opening — the Signature Terminal. The page reads as a shell session
 * that has already run `whoami`: the name it printed is set very large and is
 * the first thing painted (full tone at once; the brass read-head that passes
 * over it never hides a letter). The statement keeps its numbered margin
 * notes with the evidence. Then a live command line: the chips are plain
 * links without JavaScript, and with it they type their command and the shell
 * answers from the same data the page renders. Below, `ls ~/work` lists the
 * five working projects, one swipe away on a phone.
 */
export function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const site = siteCopy(locale);
  const copy = site.home;
  const shell = site.shell;
  const featured = getFeaturedProjects(locale);
  const notes = [
    { id: 1, text: mixed(copy.notes[1], locale) },
    {
      id: 2,
      text: format(copy.notes[2], { total: projectCounts.total, code: projectCounts.publicRepositories })
    },
    { id: 3, text: copy.notes[3] }
  ];
  const chips: ShellChip[] = [
    { command: "work", label: shell.chips.work, href: "#work" },
    { command: "open raqmi", label: shell.chips.raqmi, href: localizeHref("/projects/raqmi", locale) },
    { command: "about", label: shell.chips.about, href: localizeHref("/about", locale) },
    { command: "cv", label: shell.chips.resume, href: localizeHref("/resume", locale) },
    { command: "contact", label: shell.chips.contact, href: localizeHref("/contact", locale) },
    { command: "ask", label: shell.chips.ask }
  ];

  return (
    <section className="ds-hero sh-hero relative" aria-labelledby="hero-title">
      <div className="ds-shell pb-8 pt-6 sm:pt-9 lg:pb-12 lg:pt-10">
        <Notice locale={locale} />

        {/* On wide screens the shell stands beside the name (row 1) and the
            statement runs below both; elsewhere everything is one column, with
            the statement before the shell. */}
        <div className="grid gap-y-9 xl:grid-cols-12 xl:gap-x-12 xl:gap-y-12">
          <div className="xl:col-span-7 xl:row-start-1">
            <p className="sh-command sh-type" aria-hidden="true" dir="ltr">
              <span className="sh-ps">{PROMPT}</span> <span className="sh-typed">whoami</span>
            </p>

            <h1 id="hero-title" className="ds-display sh-name mt-3 sm:mt-4">
              <span className="sh-decode block">{dict.common.firstName}</span>
              <span className="sh-decode sh-decode-soft block">{dict.common.lastName}</span>
            </h1>

            <p className="sh-role ds-settle mt-5 sm:mt-6" style={{ "--ds-delay": "0.55s" } as CSSProperties}>
              {mixed(shell.role, locale)}
            </p>
          </div>

          <div className="grid gap-y-7 lg:grid-cols-12 lg:gap-x-12 xl:col-span-12 xl:row-start-2">
            <p className="ds-statement max-w-[30ch] lg:col-span-7">
              {copy.statement.before}{" "}
              <span data-gloss="1" className="ds-glossed">
                {copy.statement.gloss1}
              </span>
              <sup aria-hidden="true" className="ds-gloss-mark">
                1
              </sup>{" "}
              {/* The preposition («إلى», "into") never ends a line on its own. */}
              {copy.statement.middle}
              {" "}
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
            <ol aria-label={copy.notesLabel} className="grid max-w-3xl gap-3 lg:col-span-4 lg:col-start-9 lg:gap-4 lg:self-center">
              {notes.map((note, index) => (
                <li
                  key={note.id}
                  data-note={note.id}
                  className="ds-gloss ds-settle flex items-baseline gap-2.5"
                  style={{ "--ds-delay": `${0.7 + index * 0.1}s` } as CSSProperties}
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
          </div>

          <div className="xl:col-span-5 xl:col-start-8 xl:row-start-1 xl:self-end">
            <Shell
              data={buildShellData(locale)}
              chips={chips}
              labels={{
                inputLabel: shell.inputLabel,
                placeholder: shell.placeholder,
                run: shell.run,
                logLabel: shell.logLabel,
                chipsLabel: shell.chipsLabel,
                hint: shell.hint,
                copy: dict.common.copy,
                copied: dict.common.copied,
                path: PROMPT
              }}
            />
          </div>
        </div>
      </div>

      <div className="ds-shell pb-6">
        <p className="sh-ls" id="hero-strip-label">
          <span aria-hidden="true" className="sh-ls-cmd" dir="ltr">
            <span className="sh-ps">{PROMPT}</span> ls ~/work
          </span>
          <span className="ds-label">{copy.stripLabel}</span>
        </p>
        <ol aria-labelledby="hero-strip-label" className="ds-strip mt-3">
          {featured.map((project, index) => (
            <li key={project.slug} style={{ "--tint": tintOf(project.slug) } as CSSProperties}>
              <a href={`#${project.slug}`} className="sh-file focus-ring group">
                <span className="flex items-start justify-between gap-3">
                  <ProjectName className="text-[1.45rem] leading-none text-paper lg:text-[1.2rem] xl:text-[1.3rem]" name={project.name} />
                  <Latin className="sh-file-index">{pad(index + 1)}</Latin>
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
 * A featured-project notice, set as the shell's message of the day: one link
 * that names the project and its idea and opens its case study. Two rows on a
 * phone (the arrow alone stands for "explore"), one line on a desktop. It
 * settles in once with the hero; there is nothing to dismiss. The label says
 * "new" for now and can say "featured" later.
 */
function Notice({ locale }: { locale: Locale }) {
  const project = getProject(NOTICE_PROJECT, locale);
  const copy = siteCopy(locale).home.notice;
  const { Forward } = directional(locale);

  if (!project) return null;

  return (
    <div className="mb-7 flex lg:mb-9" style={{ "--tint": tintOf(project.slug) } as CSSProperties}>
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
