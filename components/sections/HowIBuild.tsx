import { Reveal } from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function HowIBuild({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.approach;

  return (
    <section className="section-space section-band" aria-labelledby="approach-title">
      <div className="container-shell">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">{t.eyebrow}</p>
          <h2
            id="approach-title"
            className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl"
          >
            {t.title}
          </h2>
        </div>

        <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.principles.map((principle, index) => (
            <Reveal as="li" key={principle.title} delay={index * 0.08}>
              <div className="border-t border-white/[0.12] pt-5">
                <span className="font-display text-sm text-accent" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-medium text-paper">{principle.title}</h3>
                <p className="mt-3 text-sm leading-7 text-paper-dim">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
