import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * The homepage's one closing section (it replaces the two consecutive
 * contact blocks). Three journeys, each one decision away: a recruiter
 * picks a CV, a client sends a brief, a reviewer opens the code.
 */
export function ClosingSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.home.closing;

  return (
    <section className="section-space" aria-labelledby="home-closing-title">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900/60 p-7 shadow-glow sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="absolute -end-24 -top-24 h-80 w-80 rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.16), transparent 72%)" }}
          />
          <div className="relative">
            <p className="eyebrow mb-5">{t.eyebrow}</p>
            <h2
              id="home-closing-title"
              className="max-w-3xl font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl lg:text-5xl"
            >
              {t.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-paper-dim">{t.intro}</p>

            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {t.paths.map((path) => {
                const external = path.href === "github";
                const target = external ? siteConfig.social.github : localizeHref(path.href, locale);
                const content = (
                  <>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">
                      {path.audience}
                    </span>
                    <span className="mt-3 block text-sm leading-7 text-paper-dim">{path.body}</span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-paper transition group-hover:text-accent-soft">
                      {path.cta}
                      {external ? (
                        <>
                          <ArrowUpRight className="external-mark" aria-hidden="true" />
                          <span className="sr-only">({dict.common.opensInNewTab})</span>
                        </>
                      ) : (
                        <ArrowRight
                          className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </>
                );
                const className =
                  "focus-ring group flex h-full flex-col rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 transition hover:border-accent/40 hover:bg-white/[0.05]";

                return (
                  <li key={path.audience}>
                    {external ? (
                      <a href={target} target="_blank" rel="noopener noreferrer" className={className}>
                        {content}
                      </a>
                    ) : (
                      <Link href={target} className={className}>
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-paper-dim">
              {t.direct}
              <a
                href={`mailto:${siteConfig.email}`}
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full font-semibold text-paper transition hover:text-accent-soft"
              >
                <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
                <span dir="ltr">{siteConfig.email}</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
