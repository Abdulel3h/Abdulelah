import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { mixed } from "@/components/site/mixed";
import { Down, Latin, pad } from "@/components/site/primitives";
import { tintOf } from "@/components/site/tints";
import { getFeaturedProjects, projectCounts } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";
import { format } from "@/lib/i18n/format";

/**
 * The opening. The name, set very large, is the first thing painted (no
 * hidden start state). One sentence says what Abdulelah does; three of its
 * words carry numbered margin notes — the gloss of a manuscript — with the
 * evidence. Hovering a word lights its note and the other way round (CSS
 * only, see .ds-hero in site.css); the notes are always visible, so touch and
 * screen readers lose nothing. Below, the four working projects are one swipe
 * away on a phone and one row on a desktop.
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
      <div className="ds-shell grid gap-y-10 pb-10 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-x-12 lg:pb-14 lg:pt-14">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="flex items-center gap-4">
            <div className="ds-arch relative h-16 w-[3.25rem] shrink-0 overflow-hidden border border-white/[0.14] bg-paper lg:hidden">
              <Image
                src={siteConfig.assets.profileImage}
                alt=""
                fill
                sizes="52px"
                className="object-cover object-[50%_12%]"
              />
            </div>
            <p className="ds-kicker">{copy.kicker}</p>
          </div>

          <h1 id="hero-title" className="ds-display mt-7 lg:mt-9">
            <span className="block">{dict.common.firstName}</span>
            <span className="block ds-tone-62">{dict.common.lastName}</span>
          </h1>

          <div aria-hidden="true" className="ds-draw mt-7 h-px w-32 bg-accent sm:w-44" />

          <p className="ds-statement mt-7 max-w-[30ch]">
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

          <ol aria-label={copy.notesLabel} className="mt-7 grid max-w-3xl gap-3 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-5">
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

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#work" className="ds-btn ds-btn-solid focus-ring group">
              {copy.primary}
              <Down className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <Link href={localizeHref("/resume", locale)} className="ds-btn ds-btn-quiet focus-ring">
              {copy.secondary}
            </Link>
          </div>
        </div>

        <figure className="relative hidden lg:col-span-5 lg:block xl:col-span-4">
          <div
            aria-hidden="true"
            className="absolute -inset-10 -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.14), transparent 72%)" }}
          />
          <div className="ds-arch relative aspect-[4/5.2] overflow-hidden border border-white/[0.14] bg-paper">
            <Image
              src={siteConfig.assets.profileImage}
              alt={copy.portraitAlt}
              fill
              priority
              sizes="(min-width: 1280px) 400px, 36vw"
              className="object-cover object-top"
            />
          </div>
          {/* The name in the other script, and where he is. */}
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-paper-faint">
            {locale === "ar" ? (
              <Latin className="text-[0.95rem]">{siteConfig.name}</Latin>
            ) : (
              <span lang="ar" dir="rtl" className="text-[0.95rem]">
                {siteConfig.arabicName}
              </span>
            )}
            <span className="ds-micro">{dict.common.location}</span>
          </figcaption>
        </figure>
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
                <span className="flex items-center justify-between gap-3">
                  <Latin className="text-[1.45rem] leading-none text-paper">{project.name}</Latin>
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
