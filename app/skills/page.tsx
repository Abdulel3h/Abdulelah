import type { Metadata } from "next";
import { BrainCircuit, Cloud, Code2, Database, LineChart, Rocket, Search, Users } from "lucide-react";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { PageHero } from "@/components/ui/PageHero";
import { skillGroups } from "@/data/skills";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Skills",
  description:
    "AI engineering, cloud deployment, data, software, and professional skills for Abdulelah Alkhathami.",
  path: "/skills"
});

const icons = [BrainCircuit, Cloud, Database, Code2, Users];
const coreStrengths = [
  { title: "NLP & LLM Applications", icon: BrainCircuit },
  { title: "Cloud AI Deployment", icon: Cloud },
  { title: "AI Solution Design", icon: Search },
  { title: "Data-driven Dashboards", icon: LineChart },
  { title: "Project Leadership", icon: Rocket }
];

export default function SkillsPage() {
  return (
    <>
      <PageHero
        eyebrow="Skills"
        title="A practical AI engineering skill matrix."
        subtitle="The levels are intentionally realistic: strong foundations where proven, practical experience where used in projects, and familiar where the skill is developing."
      />

      <section className="container-shell section-space">
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {coreStrengths.map((strength) => {
            const Icon = strength.icon;

            return (
              <article key={strength.title} className="glass-card rounded-2xl p-5">
                <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <h2 className="mt-4 text-sm font-semibold leading-6 text-paper">
                  {strength.title}
                </h2>
              </article>
            );
          })}
        </div>

      <div className="grid gap-6">
        {skillGroups.map((group, index) => {
          const Icon = icons[index] ?? BrainCircuit;

          return (
            <section key={group.title} className="glass-card rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-semibold text-paper">{group.title}</h2>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.skills.map((skill) => (
                  <SkillBadge key={skill.name} name={skill.name} level={skill.level} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      </section>
    </>
  );
}
