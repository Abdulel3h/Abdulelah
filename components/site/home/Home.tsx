import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Belief } from "@/components/site/home/Belief";
import { Hero } from "@/components/site/home/Hero";
import { Milestones } from "@/components/site/home/Milestones";
import { mixed } from "@/components/site/mixed";
import { directional, Ltr, ProjectName, SectionHead } from "@/components/site/primitives";
import { tintOf } from "@/components/site/tints";
import { Chapter } from "@/components/site/work/Chapter";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { getFeaturedProjects, getProjects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectBriefs, siteCopy } from "@/lib/i18n/experience";

/**
 * The homepage, project first: the opening, then the four working projects
 * as chapters, the three concepts in one row, the milestones where the work
 * was tested, one belief, and a direct line.
 */
export function Home({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = siteCopy(locale).home;
  const briefs = projectBriefs(locale);
  const { Forward, Outward } = directional(locale);
  const featured = getFeaturedProjects(locale);
  const concepts = getProjects(locale).filter((project) => project.status === "concept");

  return (
    <>
      <Hero locale={locale} />

      <section id="work" aria-labelledby="work-title" className="ds-section scroll-mt-16">
        <div className="ds-shell">
          <SectionHead id="work-title" kicker={copy.work.kicker} title={copy.work.title} titleSoft={copy.work.titleSoft} />

          <div className="mt-16 grid gap-28 lg:mt-24 lg:gap-40">
            {featured.map((project, index) => (
              <Chapter key={project.slug} project={project} index={index} locale={locale} />
            ))}
          </div>

          <div className="mt-28 border-t border-white/[0.09] pt-12 lg:mt-36">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="ds-title text-[clamp(1.3rem,1.12rem+0.85vw,1.8rem)]">{copy.concepts.title}</h3>
                <p className="ds-small mt-1 text-paper-dim">{copy.concepts.body}</p>
              </div>
              <Link
                href={localizeHref("/projects", locale)}
                className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded text-[1.02rem] font-medium text-paper transition-colors hover:text-accent-soft"
              >
                {copy.concepts.all}
                <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-8 grid md:grid-cols-3">
              {concepts.map((project) => (
                <li
                  key={project.slug}
                  style={{ "--tint": tintOf(project.slug) } as CSSProperties}
                  className="border-t border-white/[0.07] md:border-s md:border-t-0 md:first:border-s-0"
                >
                  <Link
                    href={localizeHref(`/projects/${project.slug}`, locale)}
                    className="focus-ring group flex h-full flex-col gap-3 rounded-lg py-6 transition-colors md:px-6 md:first:ps-0"
                  >
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="ds-tint-dot h-1.5 w-1.5 rounded-full" />
                      <ProjectName className="ds-name text-[1.65rem] text-paper transition-colors group-hover:text-accent-soft" name={project.name} />
                    </span>
                    <span className="ds-small text-paper-dim">{mixed(briefs[project.slug].line, locale)}</span>
                    <span className="ds-micro mt-auto inline-flex items-center gap-1.5 text-paper-faint transition-colors group-hover:text-accent-soft">
                      {dict.status.concept} · <span className="ds-num">{project.year}</span>
                      <Forward className="ds-forward h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Milestones locale={locale} />

      <Belief kicker={copy.belief.kicker} statement={copy.belief.statement} />

      <section aria-labelledby="home-closing-title" className="ds-section border-t border-white/[0.08]">
        <div className="ds-shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="ds-kicker">{copy.closing.kicker}</p>
            <h2 id="home-closing-title" className="ds-h1 mt-5">
              {copy.closing.title}
              <span className="block ds-tone-55">{copy.closing.titleSoft}</span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-12">
            <a
              href={`mailto:${siteConfig.email}`}
              className="ds-link focus-ring inline-block rounded text-[clamp(1.6rem,1.2rem+1.8vw,2.4rem)] font-medium text-paper"
            >
              <Ltr>{siteConfig.email}</Ltr>
            </a>
            <div className="mt-5">
              <CopyEmailButton
                email={siteConfig.email}
                labels={{
                  copy: dict.common.copy,
                  copied: dict.common.copied,
                  failed: dict.common.copyFailed,
                  aria: dict.common.copyEmail
                }}
              />
            </div>

            <ul className="mt-10 border-t border-white/[0.08]">
              {[
                { label: copy.closing.resume, href: "/resume" },
                { label: copy.closing.contactPage, href: "/contact" }
              ].map((row) => (
                <li key={row.href}>
                  <Link
                    href={localizeHref(row.href, locale)}
                    className="focus-ring group flex min-h-14 items-center justify-between gap-4 border-b border-white/[0.08] text-[1.02rem] text-paper transition-colors hover:text-accent-soft"
                  >
                    {row.label}
                    <Forward className="ds-forward h-4 w-4 text-paper-dim" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              {[
                { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
                { label: "GitHub", href: siteConfig.social.github, icon: Github }
              ].map((profile) => {
                const Icon = profile.icon;

                return (
                  <li key={profile.href}>
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring group flex min-h-14 items-center justify-between gap-4 border-b border-white/[0.08] text-[1.02rem] text-paper transition-colors hover:text-accent-soft"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-paper-dim" aria-hidden="true" />
                        <Ltr>{profile.label}</Ltr>
                        <span className="sr-only">({dict.common.opensInNewTab})</span>
                      </span>
                      <Outward className="ds-forward h-4 w-4 text-paper-dim" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
