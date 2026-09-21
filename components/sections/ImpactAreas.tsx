import { DomainsShowcase } from "@/components/sections/DomainsShowcase";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function ImpactAreas({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.range;

  return (
    <section className="section-space section-band" aria-labelledby="range-title">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5">{t.eyebrow}</p>
            <h2
              id="range-title"
              className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl"
            >
              {t.title}
            </h2>
          </div>
          <p className="max-w-md text-base leading-8 text-paper-dim lg:pb-2">{t.intro}</p>
        </div>

        <div className="mt-12">
          <DomainsShowcase
            exploreLabel={t.explore}
            domains={t.domains.map((domain) => ({
              label: domain.label,
              blurb: domain.blurb,
              href: localizeHref(`/projects/${domain.slug}`, locale)
            }))}
          />
        </div>
      </div>
    </section>
  );
}
