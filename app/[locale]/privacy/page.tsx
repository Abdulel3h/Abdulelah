import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { siteConfig } from "@/data/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).privacy;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/privacy" });
}

export default async function PrivacyPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).privacy;

  return (
    <>
      <section className="container-shell pt-14 sm:pt-20 lg:pt-24" aria-labelledby="privacy-title">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">{t.eyebrow}</p>
          <h1
            id="privacy-title"
            className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl"
          >
            {t.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">{t.intro}</p>
          <p className="mt-3 text-sm text-paper-dim">{t.updated}</p>
        </div>
      </section>

      <div className="container-shell section-space">
        <div className="grid max-w-4xl gap-12">
          {t.sections.map((section, index) => (
            <section
              key={section.title}
              aria-labelledby={`privacy-${index}`}
              className="grid gap-4 border-t border-white/[0.08] pt-8 md:grid-cols-[14rem_1fr] md:gap-10"
            >
              <h2 id={`privacy-${index}`} className="font-display text-xl font-medium text-paper">
                {section.title}
              </h2>
              <ul className="grid gap-3 text-base leading-8 text-paper-dim">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-3.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section
            aria-labelledby="privacy-contact"
            className="rounded-3xl border border-accent/30 bg-accent/[0.07] p-6 sm:p-8"
          >
            <h2 id="privacy-contact" className="font-display text-xl font-medium text-paper">
              {t.contactTitle}
            </h2>
            <p className="mt-2 text-sm leading-7 text-paper-dim">{t.contactBody}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="focus-ring mt-3 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-paper transition hover:text-accent-soft"
            >
              <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
              <span dir="ltr">{siteConfig.email}</span>
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
