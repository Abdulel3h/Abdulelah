import { Download } from "lucide-react";
import { AgentAskButton } from "@/components/blog/AgentAskButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { siteConfig } from "@/data/site";
import { getBlogText, type BlogLanguage } from "@/data/blog.ar";
import { cn } from "@/lib/utils";

export function BlogCTA({
  prompt,
  language = "en"
}: {
  prompt?: string;
  language?: BlogLanguage;
}) {
  const isArabic = language === "ar";
  const text = getBlogText(language);

  return (
    <section
      dir={isArabic ? "rtl" : undefined}
      lang={isArabic ? "ar" : undefined}
      className={cn("section-space", isArabic && "blog-arabic")}
    >
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.16),rgba(10,15,31,0.9),rgba(201,168,76,0.12))] p-8 shadow-glow sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-25" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              {text.ctaTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">{text.ctaBody}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/projects" showArrow className="w-full sm:w-auto">
                {text.viewProjects}
              </ButtonLink>
              <AgentAskButton prompt={prompt ?? text.ctaPrompt}>
                {text.askAgent}
              </AgentAskButton>
              <ButtonLink
                href={siteConfig.resumes.engineer}
                variant="secondary"
                download
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {text.downloadResume}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
