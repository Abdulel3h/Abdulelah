import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { footerNav, siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";

/**
 * Quiet footer: identity, pages and profiles. It deliberately carries no
 * call-to-action panel — each page ends with at most one closing section.
 */
export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.footer;
  const profiles = [
    { label: dict.nav.linkedin, href: siteConfig.social.linkedin, icon: Linkedin },
    { label: dict.nav.github, href: siteConfig.social.github, icon: Github }
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0b]/80 pb-24 sm:pb-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr_0.8fr]">
        <div>
          <Link
            href={localizeHref("/", locale)}
            className="focus-ring group inline-flex min-h-11 items-center gap-2.5 rounded"
            aria-label={dict.common.homeAria}
          >
            <Monogram className="h-6 w-auto text-accent transition-colors group-hover:text-accent-soft" />
            <span className="font-display text-lg font-medium tracking-tight text-paper" aria-hidden="true">
              {dict.common.name}
            </span>
          </Link>
          {locale === "en" ? (
            <p className="mt-1 text-sm text-paper-dim" lang="ar" dir="rtl">
              {siteConfig.arabicName}
            </p>
          ) : (
            <p className="mt-1 text-sm text-paper-dim" lang="en" dir="ltr">
              {siteConfig.name}
            </p>
          )}
          <p className="mt-4 max-w-md text-sm leading-6 text-paper-dim">{t.tagline}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-medium text-accent-soft transition hover:text-paper"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span dir="ltr">{siteConfig.email}</span>
          </a>
        </div>

        <nav aria-labelledby="footer-pages">
          <h2 id="footer-pages" className="text-sm font-semibold text-paper">
            {t.navTitle}
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4">
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={localizeHref(link.href, locale)}
                  className="focus-ring inline-flex min-h-11 items-center rounded text-sm text-paper-dim transition hover:text-paper"
                >
                  {dict.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-paper">{t.profilesTitle}</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {profiles.map((profile) => {
              const Icon = profile.icon;

              return (
                <li key={profile.href}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] px-4 text-sm text-paper-dim transition hover:border-accent/40 hover:text-paper"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {profile.label}
                    <ArrowUpRight className="external-mark" aria-hidden="true" />
                    <span className="sr-only">({dict.common.opensInNewTab})</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 text-xs leading-6 text-paper-faint">
            {format(t.copyright, { year: new Date().getFullYear() })}{" "}
            {locale === "en" ? (
              <>
                (
                <bdi lang="ar" dir="rtl">
                  {siteConfig.arabicName}
                </bdi>
                ).{" "}
              </>
            ) : (
              "· "
            )}
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
