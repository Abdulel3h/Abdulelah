import Link from "next/link";
import { CompanionCue } from "@/components/agent/CompanionCue";
import { ResumeViewRecorder } from "@/components/agent/ResumeViewRecorder";
import { mixer } from "@/components/site/mixed";
import { directional, Latin, PageHead } from "@/components/site/primitives";
import { ResumeDownloadButton } from "@/components/ui/ResumeDownloadButton";
import { siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";

const roleNames = { engineer: "AI Engineer", specialist: "AI Specialist" } as const;

/**
 * The CV in thirty seconds: a ledger of facts, then two versions to download,
 * each named by its role (as the files are) with its angle beneath. The
 * files themselves are in English, and the page says so.
 */
export function Resume({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.resume;
  const copy = siteCopy(locale).resume;
  const mix = mixer(locale);
  const { Forward } = directional(locale);

  return (
    <>
      <ResumeViewRecorder />
      <PageHead id="resume-title" kicker={copy.kicker} title={copy.title} lede={copy.lede} />

      <section aria-labelledby="resume-glance" className="ds-shell pt-14 lg:pt-20">
        <h2 id="resume-glance" className="sr-only">
          {copy.glanceLabel}
        </h2>
        <dl className="grid border-t border-white/[0.09] md:grid-cols-2">
          {t.glance.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-white/[0.09] py-5 md:odd:pe-10 md:even:border-s md:even:ps-10"
            >
              <dt className="ds-label">{item.label}</dt>
              <dd className="ds-text text-[1.08rem] text-paper">{mix(item.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="cv-versions" className="ds-shell ds-section">
        <h2 id="cv-versions" className="ds-kicker">
          {copy.versionsKicker}
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {t.versions.map((version) => {
            const cv = version.key === "engineer" ? "engineer" : "specialist";

            return (
              <article
                key={version.key}
                aria-labelledby={`cv-${cv}`}
                className="flex flex-col rounded-[var(--ds-radius)] border border-white/[0.1] p-6 sm:p-8"
              >
                <h3 id={`cv-${cv}`} className="text-[clamp(1.9rem,1.5rem+1.6vw,2.6rem)] text-paper">
                  <Latin className="ds-name">{roleNames[cv]}</Latin>
                </h3>
                <p className="ds-small mt-4 flex-1 text-paper-dim">{mix(version.positioning)}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <ResumeDownloadButton
                    href={siteConfig.resumes[cv]}
                    cv={cv}
                    source="resume-page"
                    meta={t.fileMeta}
                    className="h-auto min-h-11 whitespace-normal rounded-[var(--ds-radius)] py-2.5 text-center text-[0.98rem] font-medium"
                  >
                    {version.button}
                  </ResumeDownloadButton>
                  <span className="ds-micro text-paper-faint" aria-hidden="true">
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
      </section>

      <section aria-labelledby="resume-evidence" className="ds-shell pb-[var(--ds-section)]">
        <div className="flex flex-col gap-6 border-t border-white/[0.09] pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="resume-evidence" className="ds-h2">
              {copy.evidenceTitle}
            </h2>
            <p className="ds-small mt-2 text-paper-dim">{copy.evidenceBody}</p>
          </div>
          <Link href={localizeHref("/projects", locale)} className="ds-btn ds-btn-solid focus-ring group self-start md:self-auto">
            {copy.evidenceCta}
            <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
