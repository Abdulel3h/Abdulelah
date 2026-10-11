import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { RiyadhTime } from "@/components/site/layout/RiyadhTime";
import { directional, Latin, Ltr } from "@/components/site/primitives";
import { SignatureMonogram } from "@/components/ui/SignatureMonogram";
import { siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";

const pages = [
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "resume", href: "/resume" },
  { key: "achievements", href: "/achievements" },
  { key: "skills", href: "/skills" },
  { key: "notes", href: "/blog" },
  { key: "contact", href: "/contact" },
  { key: "privacy", href: "/privacy" }
] as const;

/**
 * A quiet ending: the signature draws itself when it scrolls into view, the
 * name in both scripts, one line, the email, and the time in Riyadh. No
 * second call-to-action — each page closes with at most one.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = siteCopy(locale).footer;
  const { Outward } = directional(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] pb-28 sm:pb-24">
      <div className="ds-shell grid gap-12 pt-14 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        <div className="lg:col-span-5">
          <SignatureMonogram className="h-9 w-auto text-accent" />
          <p className="ds-heading mt-6 text-2xl">{dict.common.name}</p>
          {/* The name in the other script, set in its own direction. */}
          <p className="mt-1 text-[0.95rem] text-paper-faint">
            {locale === "ar" ? (
              <Latin>{siteConfig.name}</Latin>
            ) : (
              <span lang="ar" dir="rtl">
                {siteConfig.arabicName}
              </span>
            )}
          </p>
          <p className="ds-small mt-5 max-w-sm text-paper-dim">{copy.line}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="ds-link focus-ring mt-5 inline-flex min-h-11 items-center rounded text-lg text-paper"
          >
            <Ltr>{siteConfig.email}</Ltr>
          </a>
        </div>

        <nav aria-labelledby="footer-pages" className="lg:col-span-4">
          <h2 id="footer-pages" className="ds-label">
            {copy.pages}
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-6">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={localizeHref(page.href, locale)}
                  className="focus-ring inline-flex min-h-11 items-center rounded text-[0.98rem] text-paper-dim transition-colors hover:text-paper"
                >
                  {dict.nav[page.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <ul className="grid gap-1">
            {[
              { label: "GitHub", href: siteConfig.social.github, icon: Github },
              { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin }
            ].map((profile) => {
              const Icon = profile.icon;

              return (
                <li key={profile.href}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring group inline-flex min-h-11 items-center gap-2.5 rounded text-[0.98rem] text-paper-dim transition-colors hover:text-paper"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <Ltr>{profile.label}</Ltr>
                    <Outward className="ds-forward h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">({dict.common.opensInNewTab})</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <RiyadhTime locale={locale} label={copy.timeLabel} city={copy.riyadh} />
        </div>
      </div>

      <div className="ds-shell mt-14">
        <p className="ds-micro flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/[0.08] pt-6 text-paper-faint">
          <span>
            © <span className="ds-num">{year}</span> {dict.common.name}
          </span>
          <span aria-hidden="true">·</span>
          <span>{copy.rights}</span>
        </p>
      </div>
    </footer>
  );
}
