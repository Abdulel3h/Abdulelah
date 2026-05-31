import { Download } from "lucide-react";
import { AgentAskButton } from "@/components/blog/AgentAskButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { siteConfig } from "@/data/site";

export function BlogCTA({
  prompt = "What should I read first in Abdulelah AI Insights?"
}: {
  prompt?: string;
}) {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.16),rgba(10,15,31,0.9),rgba(201,168,76,0.12))] p-8 shadow-glow sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-25" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Want to explore my applied AI work?
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Continue from practical ideas into project case studies, ask the AI
              Navigator about a topic, or download a role-focused resume.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/projects" showArrow className="w-full sm:w-auto">
                View Projects
              </ButtonLink>
              <AgentAskButton prompt={prompt}>Ask Abdulelah AI</AgentAskButton>
              <ButtonLink
                href={siteConfig.resumes.engineer}
                variant="secondary"
                download
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Resume
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
