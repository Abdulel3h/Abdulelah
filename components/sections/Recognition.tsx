import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { getAchievementsByYear } from "@/data/achievements";
import { getProject, type LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Recognition on the homepage, right after the work it tested: every
 * documented program or competition, newest first, with its result in a few
 * words and links to the case studies that came out of it. Server-rendered
 * and always visible; the full record lives on /achievements.
 */
export function Recognition({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.recognition;
  const items = getAchievementsByYear(locale);

  return (
    <section className="section-space" aria-labelledby="recognition-title">
      <div className="container-shell">
        <div className="flex flex-col gap-6 border-b border-white/[0.07] pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">{t.eyebrow}</p>
            <h2
              id="recognition-title"
              className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl lg:text-5xl"
            >
              {t.title}
              <span className="block text-paper/70">{t.titleAccent}</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-paper-dim">{t.intro}</p>
        </div>

        <ol>
          {items.map((item, index) => {
            const projects = item.projects
              .map((slug) => getProject(slug, locale))
              .filter((project): project is LocalizedProject => Boolean(project));

            return (
              <Reveal as="li" key={item.title} delay={index * 0.04}>
                <div className="grid gap-x-10 gap-y-4 border-b border-white/[0.08] py-8 md:grid-cols-[7rem_1fr_minmax(0,15rem)]">
                  <span className="font-display text-3xl text-paper/70">{item.year}</span>
                  <div className="min-w-0">
                    <p className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-accent">{item.organization}</p>
                    <h3 className="mt-2 font-display text-xl font-medium leading-snug text-paper sm:text-2xl">{item.title}</h3>
                    <p className="mt-3 flex items-start gap-2.5 text-sm leading-6 text-paper">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <span>
                        <span className="sr-only">{t.outcomeLabel}: </span>
                        {item.outcome}
                      </span>
                    </p>
                  </div>
                  {projects.length > 0 ? (
                    <div className="flex flex-col items-start gap-1 md:items-end md:pt-1">
                      <span className="text-[0.7rem] uppercase tracking-[0.14em] text-paper-dim">{t.projectsLabel}</span>
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
                    </div>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-12 flex justify-center">
          <Link
            href={localizeHref("/achievements", locale)}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-paper transition hover:text-accent-soft"
          >
            {t.seeAll}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
