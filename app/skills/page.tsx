import type { Metadata } from "next";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { skillGroups, type SkillLevel } from "@/data/skills";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Skills",
  description:
    "The capabilities Abdulelah Alkhathami builds with — AI and machine learning, cloud deployment, data, and the craft of shipping — with honest depth on each.",
  path: "/skills"
});

const levelMeta: Record<SkillLevel, { label: string; name: string; tag: string }> = {
  Strong: { label: "Core", name: "text-paper", tag: "text-accent" },
  "Practical Experience": {
    label: "Practical",
    name: "text-paper/80",
    tag: "text-paper-dim"
  },
  Familiar: { label: "Familiar", name: "text-paper-dim", tag: "text-paper-faint" }
};

export default function SkillsPage() {
  return (
    <>
      <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Capabilities</p>
          <h1 className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
            What I build with — and how far.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">
            No progress bars, no inflated scores. Just an honest read: where
            I&apos;m a safe pair of hands, where I&apos;ve shipped real work, and
            where I&apos;m still growing.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-[0.7rem] uppercase tracking-[0.18em]">
            <span className="text-accent">Core — proven, lead with it</span>
            <span className="text-paper-dim">Practical — used in real projects</span>
            <span className="text-paper-faint">Familiar — growing</span>
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="border-t border-white/[0.08]">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.04}>
              <div className="grid gap-x-10 gap-y-6 border-b border-white/[0.08] py-10 lg:grid-cols-[16rem_1fr]">
                <div>
                  <span className="font-display text-sm text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-medium text-paper">
                    {group.title}
                  </h2>
                </div>
                <ul>
                  {group.skills.map((skill) => {
                    const meta = levelMeta[skill.level];

                    return (
                      <li
                        key={skill.name}
                        className="flex items-baseline justify-between gap-6 border-b border-white/[0.05] py-3 last:border-0"
                      >
                        <span className={`text-lg ${meta.name}`}>{skill.name}</span>
                        <span
                          className={`shrink-0 text-[0.62rem] uppercase tracking-[0.18em] ${meta.tag}`}
                        >
                          {meta.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        title="Skills only matter when they ship."
        description="See how these came together in real products — or tell me what you're trying to build."
        primaryHref="/projects"
        primaryLabel="See the work"
        secondaryHref="/contact"
        secondaryLabel="Start a conversation"
      />
    </>
  );
}
