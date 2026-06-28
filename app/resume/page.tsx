import type { Metadata } from "next";
import { FileText, SplitSquareHorizontal } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { ResumeDownloadButton } from "@/components/ui/ResumeDownloadButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "Download tailored AI Engineer and AI Specialist CV versions for Abdulelah Alkhathami.",
  path: "/resume"
});

const resumeCards = [
  {
    title: "AI Engineer CV",
    description:
      "Best for technical roles focused on AI development, NLP, LLMs, cloud deployment, and intelligent systems engineering.",
    href: siteConfig.resumes.engineer,
    button: "Download AI Engineer CV",
    summary:
      "Focused on building, integrating, and deploying AI-powered systems using NLP, LLMs, cloud services, and data-driven architecture."
  },
  {
    title: "AI Specialist CV",
    description:
      "Best for roles focused on AI solutions, business use cases, AI adoption, analysis, dashboards, and cross-functional implementation.",
    href: siteConfig.resumes.specialist,
    button: "Download AI Specialist CV",
    summary:
      "Focused on identifying AI opportunities, translating business needs into AI solutions, and supporting adoption through analysis, dashboards, and practical implementation."
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
      <PageHero
        eyebrow="Resume"
        title="Download a version tailored to the role you are hiring for."
        subtitle="Two CV paths make it easier for recruiters and teams to evaluate Abdulelah for hands-on AI engineering roles or AI solutions-focused opportunities."
        stats={[
          { value: "AI Engineer", label: "Technical development and deployment" },
          { value: "AI Specialist", label: "Solutions, adoption, and implementation" }
        ]}
      />
      <section className="container-shell section-space">
        <div className="grid gap-6 lg:grid-cols-2">
          {resumeCards.map((card) => (
            <article key={card.title} className="premium-panel p-6 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-2xl font-semibold text-paper">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-paper-dim">{card.description}</p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-paper">Positioning</p>
                <p className="mt-2 text-sm leading-7 text-paper-dim">{card.summary}</p>
              </div>
              <div className="mt-6">
                <ResumeDownloadButton href={card.href}>{card.button}</ResumeDownloadButton>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent-soft">
              <SplitSquareHorizontal className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold text-paper">Which CV should you choose?</h2>
              <Tabs defaultValue="engineer" className="mt-5">
                <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
                  <TabsTrigger value="engineer">AI Engineer</TabsTrigger>
                  <TabsTrigger value="specialist">AI Specialist</TabsTrigger>
                </TabsList>
                <TabsContent value="engineer" className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-7 text-paper-dim">
                  Choose AI Engineer for technical AI development, NLP, LLMs,
                  cloud deployment, and intelligent systems roles.
                </TabsContent>
                <TabsContent value="specialist" className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-7 text-paper-dim">
                  Choose AI Specialist for solution, consulting, analysis,
                  dashboard, and cross-functional implementation roles.
                </TabsContent>
              </Tabs>
              <p className="mt-5 text-sm text-paper-dim">
                Still unsure? Ask Agent Abdulelah in the corner chat and it will
                recommend the right CV for the role you are hiring for.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Need a fast summary for screening?"
        description="The projects page gives a recruiter-friendly view of role, technologies, problem, solution, and impact for each applied AI project."
        primaryHref="/projects"
        primaryLabel="Review Projects"
        secondaryHref="/contact"
        secondaryLabel="Contact Directly"
      />
    </>
  );
}
