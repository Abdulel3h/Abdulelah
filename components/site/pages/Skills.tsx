import Link from "next/link";
import type { CSSProperties } from "react";
import { mixer } from "@/components/site/mixed";
import { directional, Kicker, PageHead, pad, ProjectName } from "@/components/site/primitives";
import { tintOf } from "@/components/site/tints";
import { getFeaturedProjects } from "@/data/projects";
import { getSkillGroups, type SkillLevel } from "@/data/skills";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";
import { format } from "@/lib/i18n/format";

const levelKey: Record<SkillLevel, "core" | "practical" | "familiar"> = {
  Strong: "core",
  "Practical Experience": "practical",
  Familiar: "familiar"
};

/**
 * Skills, read two ways.
 *
 * 1. The honest read: every skill with its level, told by a shape and a word
 *    (never colour alone). A level filter — native radios switched by CSS
 *    `:has()`, so it works without JavaScript — quiets every other level to a
 *    still-readable tone.
 * 2. The evidence: a matrix of the technologies each working project lists in
 *    data/projects.ts. Nothing is inferred; a dot means the project's own
 *    record names that technology. Concepts are left out.
 */
export function Skills({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).skills;
  const copy = siteCopy(locale).skills;
  const mix = mixer(locale);
  const { Forward } = directional(locale);
  const groups = getSkillGroups(locale);
  const levels: SkillLevel[] = ["Strong", "Practical Experience", "Familiar"];
  const legend: Record<SkillLevel, string> = {
    Strong: t.legend.core,
    "Practical Experience": t.legend.practical,
    Familiar: t.legend.familiar
  };

  const projects = getFeaturedProjects(locale);
  const counts = new Map<string, number>();

  projects.forEach((project) => project.technologies.forEach((tech) => counts.set(tech, (counts.get(tech) ?? 0) + 1)));

  const technologies = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));

  return (
    <>
      <PageHead id="skills-title" path="~/skills" kicker={copy.kicker} title={copy.title} lede={copy.lede} />

      <section aria-labelledby="skills-title" className="sk-map ds-shell pt-12 lg:pt-16">
        <fieldset className="sk-filter">
          <legend className="ds-label">{copy.filterLabel}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="sh-chip sh-flag sk-choice">
              <input type="radio" name="skill-level" value="all" defaultChecked className="sr-only" />
              <span aria-hidden="true" className="sh-chip-cmd" dir="ltr">
                -a
              </span>
              {copy.filterAll}
            </label>
            {levels.map((level) => (
              <label key={level} className="sh-chip sh-flag sk-choice">
                <input type="radio" name="skill-level" value={levelKey[level]} className="sr-only" />
                <span aria-hidden="true" data-level={levelKey[level]} className="sk-mark" />
                {legend[level]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group, index) => (
            <section key={group.title} aria-labelledby={`skills-group-${index}`} className="sh-window">
              <div className="sh-window-bar">
                <span aria-hidden="true" className="text-accent">
                  {pad(index + 1)}
                </span>
                <h2 id={`skills-group-${index}`} className="ds-title text-[1.05rem] text-paper">
                  {group.title}
                </h2>
                <span className="sh-window-end ds-num" aria-hidden="true">
                  {group.skills.length}
                </span>
              </div>
              <ul className="px-4 py-2">
                {group.skills.map((skill) => (
                  <li key={skill.name} data-level={levelKey[skill.level]} className="sk-skill">
                    <span className="ds-text text-[1.02rem]">{mix(skill.name)}</span>
                    <span className="sk-level">
                      <span aria-hidden="true" data-level={levelKey[skill.level]} className="sk-mark" />
                      {t.levels[skill.level]}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section aria-labelledby="stack-title" className="ds-shell ds-section">
        <Kicker path="~/projects/*/requirements">{copy.stackKicker}</Kicker>
        <h2 id="stack-title" className="ds-h2 mt-4 max-w-[24ch]">
          {copy.stackTitle}
        </h2>
        <p className="ds-small mt-3 text-paper-dim">{copy.stackNote}</p>

        <div className="sk-scroll mt-10">
          <table className="sk-matrix">
            <caption className="sr-only">{copy.stackLabel}</caption>
            <thead>
              <tr>
                <th scope="col" className="sk-corner">
                  <span className="ds-label">{copy.stackTech}</span>
                </th>
                {projects.map((project) => (
                  <th key={project.slug} scope="col" style={{ "--tint": tintOf(project.slug) } as CSSProperties}>
                    <Link href={localizeHref(`/projects/${project.slug}`, locale)} className="sk-project focus-ring">
                      <span aria-hidden="true" className="ds-tint-dot h-1.5 w-1.5 shrink-0 rounded-full" />
                      <ProjectName name={project.name} />
                    </Link>
                  </th>
                ))}
                <th scope="col" className="sk-count-head">
                  <span className="sr-only">{copy.stackLabel}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {technologies.map((tech) => (
                <tr key={tech.name}>
                  <th scope="row" lang="en" dir="ltr">
                    {tech.name}
                  </th>
                  {projects.map((project) => {
                    const used = project.technologies.includes(tech.name);

                    return (
                      <td key={project.slug} style={{ "--tint": tintOf(project.slug) } as CSSProperties}>
                        <span aria-hidden="true" className={used ? "sk-dot" : "sk-none"} />
                        <span className="sr-only">{used ? copy.used : copy.unused}</span>
                      </td>
                    );
                  })}
                  <td className="sk-count">
                    {format(copy.usedIn, { n: tech.count, total: projects.length })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="ds-title text-[1.35rem]">{copy.closing}</p>
          <Link href={localizeHref("/projects", locale)} className="ds-btn ds-btn-solid focus-ring group self-start">
            {copy.closingCta}
            <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
