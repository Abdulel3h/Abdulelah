import type { Metadata } from "next";
import { BrainCircuit, Cloud, Globe2, Lock, Rocket } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about Abdulelah Alkhathami, an Information Systems graduate and aspiring AI Engineer focused on practical, reliable, and context-aware AI solutions.",
  path: "/about"
});

const values = [
  {
    title: "Context-aware AI",
    description: "Building AI systems that understand the environment they serve.",
    icon: BrainCircuit
  },
  {
    title: "Privacy-first thinking",
    description: "Designing solutions that respect data privacy and institutional trust.",
    icon: Lock
  },
  {
    title: "Real-world deployment",
    description: "Moving beyond ideas into working prototypes and usable systems.",
    icon: Rocket
  },
  {
    title: "Cross-domain innovation",
    description:
      "Applying AI across education, sustainability, security, finance, and legal domains.",
    icon: Globe2
  }
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Abdulelah"
        title="Information Systems graduate building practical, context-aware AI."
        subtitle="I am an Information Systems graduate and aspiring AI Engineer focused on building practical, reliable, and context-aware AI solutions."
        stats={[
          { value: "NLP + LLMs", label: "AI engineering direction" },
          { value: "Cloud AI", label: "Google Cloud and Azure exposure" },
          { value: "6 projects", label: "Applied AI portfolio" },
          { value: "Riyadh", label: "Saudi Arabia" }
        ]}
      />

      <section className="container-shell section-space">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <SectionHeader
            eyebrow="Intro story"
            title="AI with context, trust, and practical value"
            description="My work is not about using AI for the sake of AI; it is about designing systems that understand real environments, protect trust, and solve meaningful problems."
          />

          <div className="premium-panel p-6 sm:p-8">
            <div className="relative space-y-5 text-base leading-8 text-slate-300">
              <p>
                I am Abdulelah Alkhathami (
                <span lang="ar">عبدالإله الخثعمي</span>), an Information Systems
                graduate and aspiring AI Engineer focused on building practical,
                reliable, and context-aware AI solutions.
              </p>
              <p>
                I have worked on applied AI projects in education, government digital
                security, sustainability, legal tech, fintech, and immersive learning.
                These projects helped me understand that good AI products are shaped
                by domain knowledge as much as technical capability.
              </p>
              <p>
                I led ChatUB as a graduation project, contributed to cloud and AI
                hackathon solutions, and participated in national innovation programs.
                My focus areas include AI engineering, AI solutions architecture,
                NLP, LLM applications, cloud deployment, and real-world AI products.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space section-band">
        <div className="container-shell">
          <SectionHeader
            eyebrow="What defines my work"
            title="A clear engineering posture"
            description="The best AI systems are accurate enough to trust, simple enough to use, and grounded enough to fit the environment around them."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article key={value.title} className="glass-card rounded-2xl p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-lg font-semibold text-white">{value.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <SectionHeader
          eyebrow="My technical direction"
          title="AI engineering meets cloud and product thinking"
          description="The goal is to connect model behavior, cloud services, dashboards, and user needs into practical AI systems."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="premium-panel p-6 sm:p-8">
            <BrainCircuit className="h-8 w-8 text-sky-200" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-white">AI Engineering</h2>
            <ul className="mt-5 grid gap-3 text-sm text-slate-300">
              {["NLP", "LLM applications", "Intelligent search", "Model integration", "AI system design"].map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="premium-panel p-6 sm:p-8">
            <Cloud className="h-8 w-8 text-sky-200" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-white">Cloud & Solutions</h2>
            <ul className="mt-5 grid gap-3 text-sm text-slate-300">
              {["Google Cloud", "Azure AI Services", "Dashboards", "Data-driven decision support", "Product thinking"].map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="container-shell pb-16 sm:pb-20 lg:pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gold/10 p-8 sm:p-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
          <p className="badge relative mb-4 border-gold/30 bg-gold/10 text-amber-100">Mission quote</p>
          <h2 className="relative max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Real innovation starts when technology respects context, privacy,
            and real human needs.
          </h2>
        </div>
      </section>

      <CTASection
        title="See how this approach appears in real projects."
        description="The case studies show how I think about context, cloud services, privacy, and applied AI value."
        primaryHref="/projects"
        primaryLabel="View Projects"
      />
    </>
  );
}
