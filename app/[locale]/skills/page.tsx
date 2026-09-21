import type { Metadata } from "next";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { getSkillGroups, type SkillLevel } from "@/data/skills";
import { localizeHref } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).skills;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/skills" });
}

const levelStyle: Record<SkillLevel, { name: string; tag: string }> = {
  Strong: { name: "text-paper", tag: "text-accent" },
  "Practical Experience": { name: "text-paper/85", tag: "text-paper-dim" },
  Familiar: { name: "text-paper-dim", tag: "text-paper-dim" }
};

export default async function SkillsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).skills;

  return (
    <>
      <section className="container-shell pt-14 sm:pt-20 lg:pt-24" aria-labelledby="skills-title">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">{t.eyebrow}</p>
          <h1
            id="skills-title"
            className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl"
          >
            {t.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">{t.intro}</p>
          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-[0.75rem] uppercase tracking-[0.16em]">
            <li className="text-accent">{t.legend.core}</li>
            <li className="text-paper-dim">{t.legend.practical}</li>
            <li className="text-paper-dim">{t.legend.familiar}</li>
          </ul>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="border-t border-white/[0.08]">
          {getSkillGroups(locale).map((group, index) => (
            <Reveal key={group.title} delay={index * 0.04}>
              <div className="grid gap-x-10 gap-y-6 border-b border-white/[0.08] py-10 lg:grid-cols-[16rem_1fr]">
                <div>
                  <span className="font-display text-sm text-accent" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-medium text-paper">{group.title}</h2>
                </div>
                <ul>
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-baseline justify-between gap-6 border-b border-white/[0.06] py-3 last:border-0"
                    >
                      <span className={`text-lg ${levelStyle[skill.level].name}`}>{skill.name}</span>
                      <span className={`shrink-0 text-[0.7rem] uppercase tracking-[0.16em] ${levelStyle[skill.level].tag}`}>
                        {t.levels[skill.level]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        title={t.closingTitle}
        description={t.closingBody}
        primaryHref={localizeHref("/projects", locale)}
        primaryLabel={t.closingPrimary}
        secondaryHref={localizeHref("/contact", locale)}
        secondaryLabel={t.closingSecondary}
      />
    </>
  );
}
