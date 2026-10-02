import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { getAchievementsByYear } from "@/data/achievements";
import { getProject, type LocalizedProject } from "@/data/projects";
import { localizeHref } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).achievements;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/achievements" });
}

export default async function AchievementsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.achievements;
  const labels = dict.home.recognition;
  const milestones = getAchievementsByYear(locale);

  return (
    <>
      <section className="container-shell pt-14 sm:pt-20 lg:pt-24" aria-labelledby="achievements-title">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">{t.eyebrow}</p>
          <h1
            id="achievements-title"
            className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl"
          >
            {t.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">{t.intro}</p>
        </div>
      </section>

      <section className="container-shell section-space">
        <ol className="border-t border-white/[0.08]">
          {milestones.map((item, index) => {
            const projects = item.projects
              .map((slug) => getProject(slug, locale))
              .filter((project): project is LocalizedProject => Boolean(project));

            return (
              <Reveal as="li" key={item.title} delay={index * 0.04}>
                <div className="grid gap-x-10 gap-y-4 border-b border-white/[0.08] py-9 md:grid-cols-[9rem_1fr]">
                  <span className="font-display text-3xl text-paper/70 md:text-[2.6rem]">{item.year}</span>
                  <div>
                    <p className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-accent">{item.organization}</p>
                    <h2 className="mt-2 font-display text-2xl font-medium leading-snug text-paper">{item.title}</h2>
                    <p className="mt-3 flex items-start gap-2.5 text-sm font-medium leading-6 text-paper">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <span>
                        <span className="sr-only">{labels.outcomeLabel}: </span>
                        {item.outcome}
                      </span>
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-paper-dim">{item.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <li key={tag} className="chip">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    {projects.length > 0 ? (
                      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
                        <span className="text-[0.7rem] uppercase tracking-[0.14em] text-paper-dim">{labels.projectsLabel}</span>
                        {projects.map((project) => (
                          <Link
                            key={project.slug}
                            href={localizeHref(`/projects/${project.slug}`, locale)}
                            className="focus-ring group inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-accent-soft transition hover:text-accent"
                          >
                            {project.name}
                            <ArrowRight
                              className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                              aria-hidden="true"
                            />
                          </Link>
                        ))}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <CTASection
        title={t.closingTitle}
        description={t.closingBody}
        primaryHref={localizeHref("/contact", locale)}
        primaryLabel={t.closingPrimary}
        secondaryHref={localizeHref("/projects", locale)}
        secondaryLabel={t.closingSecondary}
      />
    </>
  );
}
