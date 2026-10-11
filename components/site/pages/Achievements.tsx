import Link from "next/link";
import { mixer } from "@/components/site/mixed";
import { directional, Latin, PageHead } from "@/components/site/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { getAchievementsByYear } from "@/data/achievements";
import { getProject, type LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { siteCopy } from "@/lib/i18n/experience";

/**
 * Every documented program and competition, newest first. The year sits in
 * the margin; the organisation in brass, the result in one line, and what
 * was built there as links to its case study.
 */
export function Achievements({ locale }: { locale: Locale }) {
  const copy = siteCopy(locale).achievements;
  const mix = mixer(locale);
  const { Forward } = directional(locale);
  const milestones = getAchievementsByYear(locale);

  return (
    <>
      <PageHead id="achievements-title" kicker={copy.kicker} title={copy.title} lede={copy.lede} />

      <section aria-labelledby="achievements-title" className="ds-shell pb-[var(--ds-section)] pt-14 lg:pt-20">
        <ol className="border-t border-white/[0.09]">
          {milestones.map((item, index) => {
            const projects = item.projects
              .map((slug) => getProject(slug, locale))
              .filter((project): project is LocalizedProject => Boolean(project));

            return (
              <Reveal as="li" key={item.title} delay={index * 0.04} className="ds-rise">
                <article className="grid gap-x-12 gap-y-4 border-b border-white/[0.09] py-10 md:grid-cols-12">
                  <p className="text-[2.6rem] leading-none ds-tone-60 md:col-span-2">
                    <Latin>{item.year}</Latin>
                  </p>
                  <div className="md:col-span-10 lg:col-span-7">
                    <p className="ds-small text-accent">{mix(item.organization)}</p>
                    <h2 className="ds-heading mt-1.5 text-[clamp(1.35rem,1.15rem+0.9vw,1.85rem)]">{mix(item.title)}</h2>
                    <p className="ds-text mt-3 flex items-start gap-3 text-[1.05rem] font-medium text-paper">
                      <span
                        aria-hidden="true"
                        className="mt-[calc((var(--ds-lh-text)*1em_-_0.375rem)/2)] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span>{mix(item.outcome)}</span>
                    </p>
                    <p className="ds-small mt-3 max-w-2xl text-paper-dim">{mix(item.description)}</p>
                  </div>
                  {projects.length > 0 ? (
                    <div className="md:col-span-10 md:col-start-3 lg:col-span-3 lg:col-start-auto">
                      <p className="ds-label">{copy.built}</p>
                      <ul className="mt-1">
                        {projects.map((project) => (
                          <li key={project.slug}>
                            <Link
                              href={localizeHref(`/projects/${project.slug}`, locale)}
                              className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded text-accent-soft transition-colors hover:text-accent"
                            >
                              <Latin className="text-[1.2rem]">{project.name}</Latin>
                              <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="ds-title text-[1.35rem]">{copy.closing}</p>
          <Link href={localizeHref("/contact", locale)} className="ds-btn ds-btn-solid focus-ring group self-start">
            {copy.closingCta}
            <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
