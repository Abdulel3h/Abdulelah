import type { Metadata } from "next";
import { CompanionCue } from "@/components/agent/CompanionCue";
import { ResumeViewRecorder } from "@/components/agent/ResumeViewRecorder";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ResumeDownloadButton } from "@/components/ui/ResumeDownloadButton";
import { siteConfig } from "@/data/site";
import { localizeHref } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).resume;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/resume" });
}

export default async function ResumePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.resume;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.resume, path: "/resume" }
          ],
          locale
        )}
      />
      <ResumeViewRecorder />

      <section className="container-shell pt-14 sm:pt-20 lg:pt-24" aria-labelledby="resume-title">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">{t.eyebrow}</p>
          <h1
            id="resume-title"
            className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl"
          >
            {t.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">{t.intro}</p>
        </div>
      </section>

      <section className="container-shell section-space" aria-labelledby="cv-versions-title">
        <h2 className="sr-only">{t.glanceLabel}</h2>
        <dl className="grid border-t border-white/[0.08] sm:grid-cols-2">
          {t.glance.map((item) => (
            <div
              key={item.label}
              className="border-b border-white/[0.08] py-5 sm:odd:pe-8 sm:even:border-s sm:even:border-white/[0.08] sm:even:ps-8"
            >
              <dt className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-paper-dim">{item.label}</dt>
              <dd className="mt-2 font-display text-xl text-paper">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16">
          <h2 id="cv-versions-title" className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-paper-dim">
            {t.versionsLabel}
          </h2>
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            {t.versions.map((version) => {
              const cv = version.key === "engineer" ? "engineer" : "specialist";

              return (
                <article key={version.key} className="flex flex-col border-t border-accent/40 pt-6" aria-labelledby={`cv-${cv}`}>
                  <h3 id={`cv-${cv}`} className="font-display text-2xl font-medium text-paper">
                    {version.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-paper-dim">{version.positioning}</p>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <ResumeDownloadButton
                      href={siteConfig.resumes[cv]}
                      cv={cv}
                      source="resume-page"
                      meta={t.fileMeta}
                    >
                      {version.button}
                    </ResumeDownloadButton>
                    <span className="text-xs text-paper-dim" aria-hidden="true">
                      {t.fileMeta}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-10 max-w-2xl">
            <CompanionCue title={t.cueTitle} body={t.cueBody} prompt={t.cuePrompt} cta={t.cueCta} />
          </div>
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
