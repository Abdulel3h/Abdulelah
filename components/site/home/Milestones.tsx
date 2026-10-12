import Link from "next/link";
import { mixer } from "@/components/site/mixed";
import { directional, Latin, ProjectName, SectionHead } from "@/components/site/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { getAchievements } from "@/data/achievements";
import { getProject, type LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { siteCopy } from "@/lib/i18n/experience";

/**
 * Where the work was tested, as one timeline that runs in the reading
 * direction: oldest at the inline start, newest at the inline end. A brass
 * hairline joins the years on wide screens; on a phone the line runs down the
 * inline start instead. Each stop says its result in a few words and links to
 * what was built there.
 */
export function Milestones({ locale }: { locale: Locale }) {
  const copy = siteCopy(locale).home.recognition;
  const mix = mixer(locale);
  const { Forward } = directional(locale);
  const stops = [...getAchievements(locale)].sort((a, b) => Number(a.year) - Number(b.year));

  return (
    <section aria-labelledby="milestones-title" className="ds-section border-t border-white/[0.08]">
      <div className="ds-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHead id="milestones-title" kicker={copy.kicker} title={copy.title} />
          <Link
            href={localizeHref("/achievements", locale)}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 self-start rounded text-[1.02rem] font-medium text-paper transition-colors hover:text-accent-soft md:self-auto"
          >
            {copy.all}
            <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ol className="relative mt-14 grid gap-0 border-s border-white/[0.1] ps-6 lg:grid-cols-5 lg:border-s-0 lg:border-t lg:ps-0 lg:pt-0">
          {stops.map((stop, index) => {
            const projects = stop.projects
              .map((slug) => getProject(slug, locale))
              .filter((project): project is LocalizedProject => Boolean(project));
            const latest = index === stops.length - 1;

            return (
              <Reveal
                as="li"
                key={stop.title}
                delay={index * 0.06}
                className="ds-rise relative pb-10 last:pb-0 lg:pb-0 lg:pe-6 lg:pt-8"
              >
                <span
                  aria-hidden="true"
                  className={
                    latest
                      ? "absolute -start-[1.81rem] top-2 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(201,167,92,0.18)] lg:-top-[0.34rem] lg:start-0"
                      : "absolute -start-[1.72rem] top-2.5 h-1.5 w-1.5 rounded-full bg-paper-faint lg:-top-[0.2rem] lg:start-0.5"
                  }
                />
                <Latin className={latest ? "text-[2.1rem] leading-none text-accent" : "text-[2.1rem] leading-none ds-tone-60"}>
                  {stop.year}
                </Latin>
                <p className="ds-micro mt-4 text-accent">{mix(stop.organization)}</p>
                <h3 className="ds-title mt-1.5 text-[1.1rem]">{mix(stop.title)}</h3>
                <p className="ds-small mt-2 text-paper-dim">{mix(stop.outcome)}</p>
                {projects.length > 0 ? (
                  <p className="ds-micro mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-paper-faint">
                    {copy.built}
                    {projects.map((project) => (
                      <Link
                        key={project.slug}
                        href={localizeHref(`/projects/${project.slug}`, locale)}
                        className="focus-ring inline-flex min-h-11 items-center rounded text-accent-soft transition-colors hover:text-accent"
                      >
                        <ProjectName className="text-[0.95rem]" name={project.name} />
                      </Link>
                    ))}
                  </p>
                ) : null}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
