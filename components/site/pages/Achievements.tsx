import Link from "next/link";
import { mixer } from "@/components/site/mixed";
import { directional, Latin, PageHead, ProjectName } from "@/components/site/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { getAchievementsByYear, type Achievement } from "@/data/achievements";
import { getProject, type LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { siteCopy } from "@/lib/i18n/experience";

/**
 * Every documented program and competition, newest first, told year by year.
 * On wide screens the year stays pinned in the margin (CSS sticky, no script)
 * while that year's entries pass beside it, each a log entry on one rail: the
 * organisation in the system voice, the result in one line, and what was
 * built there as links to its case study. On a phone the year heads its group.
 */
export function Achievements({ locale }: { locale: Locale }) {
  const copy = siteCopy(locale).achievements;
  const mix = mixer(locale);
  const { Forward } = directional(locale);
  const years = getAchievementsByYear(locale).reduce<{ year: string; items: Achievement[] }[]>((groups, item) => {
    const last = groups[groups.length - 1];

    if (last?.year === item.year) last.items.push(item);
    else groups.push({ year: item.year, items: [item] });

    return groups;
  }, []);

  return (
    <>
      <PageHead id="achievements-title" path="~/recognition" kicker={copy.kicker} title={copy.title} lede={copy.lede} />

      <section aria-labelledby="achievements-title" className="ds-shell pb-[var(--ds-section)] pt-14 lg:pt-20">
        <ol className="border-t border-white/[0.09]">
          {years.map((group, groupIndex) => (
            <li key={group.year} className="grid gap-x-12 border-b border-white/[0.09] py-10 lg:grid-cols-12 lg:py-14">
              <div className="lg:col-span-3">
                <div className="ac-year">
                  <Latin className={groupIndex === 0 ? "ac-year-num text-accent" : "ac-year-num ds-tone-60"}>{group.year}</Latin>
                  <span aria-hidden="true" className="sh-path mt-3 block">
                    ~/recognition/{group.year}
                  </span>
                </div>
              </div>

              <ol className="ac-rail mt-8 lg:col-span-9 lg:mt-0">
                {group.items.map((item, index) => {
                  const projects = item.projects
                    .map((slug) => getProject(slug, locale))
                    .filter((project): project is LocalizedProject => Boolean(project));

                  return (
                    <Reveal as="li" key={item.title} delay={index * 0.05} className="ds-rise ac-entry">
                      <article className="grid gap-x-10 gap-y-4 xl:grid-cols-9">
                        <div className="xl:col-span-6">
                          <p className="ac-org">{mix(item.organization)}</p>
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
                          <div className="xl:col-span-3">
                            <p className="ds-label">{copy.built}</p>
                            <ul className="mt-1">
                              {projects.map((project) => (
                                <li key={project.slug}>
                                  <Link
                                    href={localizeHref(`/projects/${project.slug}`, locale)}
                                    className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded text-accent-soft transition-colors hover:text-accent"
                                  >
                                    <ProjectName className="text-[1.2rem]" name={project.name} />
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
            </li>
          ))}
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
