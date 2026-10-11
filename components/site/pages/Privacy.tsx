import { mixer } from "@/components/site/mixed";
import { Ltr, PageHead } from "@/components/site/primitives";
import { siteConfig } from "@/data/site";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";

/**
 * The privacy notice in the gloss layout it suits best: each topic's title
 * in the margin column, its points in the main column.
 */
export function Privacy({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).privacy;
  const copy = siteCopy(locale).privacy;
  const mix = mixer(locale);

  return (
    <>
      <PageHead id="privacy-title" kicker={copy.kicker} title={t.title} lede={t.intro}>
        <p className="ds-micro mt-4 text-paper-faint">{t.updated}</p>
      </PageHead>

      <div className="ds-shell pb-[var(--ds-section)] pt-14 lg:pt-20">
        <div className="border-t border-white/[0.09]">
          {t.sections.map((section, index) => (
            <section
              key={section.title}
              aria-labelledby={`privacy-${index}`}
              className="grid gap-x-12 gap-y-4 border-b border-white/[0.09] py-10 lg:grid-cols-12"
            >
              <h2 id={`privacy-${index}`} className="ds-title text-[1.3rem] lg:col-span-4">
                {mix(section.title)}
              </h2>
              <ul className="grid gap-4 lg:col-span-8">
                {section.points.map((point) => (
                  <li key={point} className="ds-read flex gap-3 text-[1.04rem] text-paper-dim">
                    <span
                      aria-hidden="true"
                      className="mt-[calc((var(--ds-lh-read)*1em_-_0.25rem)/2)] h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    <span className="max-w-[44rem]">{mix(point)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section aria-labelledby="privacy-contact" className="ds-gloss ds-gloss-strong mt-14 max-w-2xl">
          <h2 id="privacy-contact" className="ds-title text-[1.3rem]">
            {copy.contactTitle}
          </h2>
          <p className="ds-small mt-1 text-paper-dim">{copy.contactBody}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="ds-link focus-ring mt-3 inline-flex min-h-11 items-center rounded text-[1.1rem] text-paper"
          >
            <Ltr>{siteConfig.email}</Ltr>
          </a>
        </section>
      </div>
    </>
  );
}
