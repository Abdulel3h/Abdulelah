import type { Metadata } from "next";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ResumeDownloadButton } from "@/components/ui/ResumeDownloadButton";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "A quick read on Abdulelah Alkhathami — what he does, where he's been tested, and two tailored CVs to download.",
  path: "/resume"
});

const glance = [
  { label: "Now", value: "Builder & product thinker" },
  { label: "Focus", value: "AI products · NLP & LLMs · cloud" },
  { label: "Education", value: "Information Systems — University of Bisha" },
  { label: "Based in", value: siteConfig.location },
  { label: "Selected work", value: "Six products across six domains" },
  { label: "Recognition", value: "Top 30 — SDAIA × Microsoft AthkaU" }
];

const versions = [
  {
    title: "AI Engineer CV",
    positioning:
      "For technical roles: building, integrating, and deploying AI systems with NLP, LLMs, cloud services, and data-driven architecture.",
    href: siteConfig.resumes.engineer,
    button: "Download Engineer CV"
  },
  {
    title: "AI Specialist CV",
    positioning:
      "For solution-focused roles: spotting AI opportunities, translating business needs, and driving adoption through analysis and dashboards.",
    href: siteConfig.resumes.specialist,
    button: "Download Specialist CV"
  }
];

export default function ResumePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resume", path: "/resume" }
        ])}
      />

      <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Resume</p>
          <h1 className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
            The short version.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">
            Everything important in thirty seconds — then a CV tailored to the
            angle you&apos;re hiring for.
          </p>
        </div>
      </section>

      <section className="container-shell section-space">
        <dl className="grid border-t border-white/[0.08] sm:grid-cols-2">
          {glance.map((item) => (
            <div
              key={item.label}
              className="border-b border-white/[0.08] py-5 sm:odd:pr-8 sm:even:border-l sm:even:border-white/[0.08] sm:even:pl-8"
            >
              <dt className="text-[0.66rem] font-medium uppercase tracking-[0.2em] text-paper-faint">
                {item.label}
              </dt>
              <dd className="mt-2 font-display text-xl text-paper">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-paper-faint">
            Two versions — pick your angle
          </p>
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            {versions.map((version) => (
              <div
                key={version.title}
                className="flex flex-col border-t border-accent/30 pt-6"
              >
                <h2 className="font-display text-2xl font-medium text-paper">
                  {version.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-paper-dim">
                  {version.positioning}
                </p>
                <div className="mt-6">
                  <ResumeDownloadButton href={version.href}>
                    {version.button}
                  </ResumeDownloadButton>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-7 text-paper-dim">
            Not sure which fits? Ask{" "}
            <span className="text-paper">Agent Abdulelah</span> in the corner — tell
            it the role and it&apos;ll point you to the right one.
          </p>
        </div>
      </section>

      <CTASection
        title="Want the long version?"
        description="The work itself says more than any CV — see how each product was thought through and built."
        primaryHref="/projects"
        primaryLabel="See the work"
        secondaryHref="/contact"
        secondaryLabel="Start a conversation"
      />
    </>
  );
}
