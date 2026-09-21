import { AgentAskButton } from "@/components/blog/AgentAskButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ResumeDownloadButton } from "@/components/ui/ResumeDownloadButton";
import { siteConfig } from "@/data/site";
import { getBlogText, type BlogLanguage } from "@/data/blog.ar";
import { localizeHref } from "@/lib/i18n/config";

export function BlogCTA({ prompt, language = "en" }: { prompt?: string; language?: BlogLanguage }) {
  const text = getBlogText(language);

  return (
    <section className="section-space" aria-labelledby="blog-cta-title">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(201,167,92,0.14),rgba(12,12,14,0.92),rgba(201,167,92,0.10))] p-7 shadow-glow sm:p-10 lg:p-12">
          <div className="relative max-w-3xl">
            <h2 id="blog-cta-title" className="font-display text-3xl font-medium text-paper sm:text-4xl">
              {text.ctaTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-paper-dim">{text.ctaBody}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={localizeHref("/projects", language)} showArrow className="w-full sm:w-auto">
                {text.viewProjects}
              </ButtonLink>
              <AgentAskButton prompt={prompt ?? text.ctaPrompt}>{text.askAgent}</AgentAskButton>
              <ResumeDownloadButton
                href={siteConfig.resumes.engineer}
                cv="engineer"
                source="notes"
                className="border border-white/[0.12] bg-white/[0.05] text-paper hover:border-accent/40 hover:bg-white/[0.09]"
              >
                {text.downloadResume}
              </ResumeDownloadButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
