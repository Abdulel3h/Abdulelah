import Link from "next/link";
import { mixer } from "@/components/site/mixed";
import { directional, PageHead } from "@/components/site/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { getSkillGroups, type SkillLevel } from "@/data/skills";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";
import { cn } from "@/lib/utils";

// Level is told by a shape and a word, never by colour alone.
const marks: Record<SkillLevel, { shape: string; text: string }> = {
  Strong: { shape: "bg-accent", text: "text-paper" },
  "Practical Experience": {
    shape: "border border-accent/80 [background:linear-gradient(90deg,transparent_50%,#c9a75c_50%)]",
    text: "ds-tone-85"
  },
  Familiar: { shape: "border border-paper-faint", text: "text-paper-dim" }
};

export function Skills({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).skills;
  const copy = siteCopy(locale).skills;
  const mix = mixer(locale);
  const { Forward } = directional(locale);
  const levels: SkillLevel[] = ["Strong", "Practical Experience", "Familiar"];

  return (
    <>
      <PageHead id="skills-title" kicker={copy.kicker} title={copy.title} lede={copy.lede}>
        <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
          {levels.map((level) => (
            <li key={level} className="ds-small flex items-center gap-2.5 text-paper-dim">
              <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full", marks[level].shape)} />
              {level === "Strong" ? t.legend.core : level === "Familiar" ? t.legend.familiar : t.legend.practical}
            </li>
          ))}
        </ul>
      </PageHead>

      <section aria-labelledby="skills-title" className="ds-shell pb-[var(--ds-section)] pt-14 lg:pt-20">
        <div className="border-t border-white/[0.09]">
          {getSkillGroups(locale).map((group, index) => (
            <Reveal key={group.title} delay={index * 0.04} className="ds-rise">
              <div className="grid gap-x-12 gap-y-5 border-b border-white/[0.09] py-10 lg:grid-cols-12">
                <h2 className="ds-title text-[1.45rem] lg:col-span-4">{group.title}</h2>
                <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex min-h-12 items-center justify-between gap-4 border-b border-white/[0.06] py-2.5"
                    >
                      <span className={cn("ds-text text-[1.05rem]", marks[skill.level].text)}>{mix(skill.name)}</span>
                      <span className="ds-micro flex shrink-0 items-center gap-2 text-paper-faint">
                        <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", marks[skill.level].shape)} />
                        {t.levels[skill.level]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
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
