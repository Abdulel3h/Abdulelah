import {
  Banknote,
  Cloud,
  GraduationCap,
  Leaf,
  Scale,
  ShieldCheck,
  Telescope
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const areas = [
  {
    title: "Education AI",
    description: "Academic assistants and learning systems designed around institutional context.",
    icon: GraduationCap
  },
  {
    title: "Cloud AI",
    description: "Cloud-native analysis services using Google Cloud and Azure AI capabilities.",
    icon: Cloud
  },
  {
    title: "Digital Security",
    description: "Behavioral analytics concepts for proactive risk prediction and decision support.",
    icon: ShieldCheck
  },
  {
    title: "Sustainability Tech",
    description: "AI-assisted planning tools for heat exposure, shade strategy, and city comfort.",
    icon: Leaf
  },
  {
    title: "LegalTech AI",
    description: "AI advisor concepts that make labor rights and procedures easier to understand.",
    icon: Scale
  },
  {
    title: "FinTech AI",
    description: "Financial inclusion ideas powered by dashboards, analytics, and recommendations.",
    icon: Banknote
  },
  {
    title: "Immersive AI Learning",
    description: "VR and AI learning experiences that make complex concepts more memorable.",
    icon: Telescope
  }
];

export function ImpactAreas() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <SectionHeader
          align="center"
          eyebrow="AI Domains I Work Across"
          title="Applied AI across real domains"
          description="Every project translates AI into a use case that a real team, institution, or community could understand."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {areas.map((area) => {
            const Icon = area.icon;

            return (
              <article key={area.title} className="glass-card group rounded-2xl p-6 transition hover:-translate-y-1 hover:border-sky-300/30">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{area.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{area.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
