"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Github, Linkedin, Mail, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, MutableRefObject } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { directional, Latin, Ltr, pad } from "@/components/site/primitives";
import { SignatureMonogram } from "@/components/ui/SignatureMonogram";
import { siteConfig } from "@/data/site";
import { openCompanion } from "@/lib/agent/companion";
import { getDirection, otherLocale, splitLocalePath, switchLocaleHref } from "@/lib/i18n/config";
import type { SiteCopy } from "@/lib/i18n/experience";
import { openSearch } from "@/lib/ui-events";
import { cn } from "@/lib/utils";

const primary = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "resume", href: "/resume" },
  { key: "contact", href: "/contact" }
] as const;

const secondary = [
  { key: "achievements", href: "/achievements" },
  { key: "notes", href: "/blog" },
  { key: "skills", href: "/skills" },
  { key: "privacy", href: "/privacy" }
] as const;

/**
 * The menu on phones and tablets: a full-screen index set large, loaded on
 * demand. Radix Dialog supplies the focus trap, Escape and scroll lock; focus
 * returns to the menu button. Items settle in from below, one after another;
 * under reduced motion they simply appear.
 */
export default function MenuDialog({
  open,
  onOpenChange,
  triggerRef,
  copy
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  copy: SiteCopy["menu"];
}) {
  const { t, href, locale } = useI18n();
  const { Forward, Outward } = directional(locale);
  const pathname = usePathname() ?? "/";
  const path = splitLocalePath(pathname).path;
  const other = otherLocale(locale);
  const isActive = (target: string) =>
    target === "/" ? path === "/" : path === target || path.startsWith(`${target}/`);
  const close = () => onOpenChange(false);

  function askGuide() {
    onOpenChange(false);
    openCompanion({ prompt: t.nav.guideSummaryPrompt, send: true, returnFocusTo: triggerRef.current });
  }

  function search() {
    onOpenChange(false);
    // Let the menu release its focus trap before the search dialog opens.
    window.setTimeout(() => openSearch({ returnFocusTo: triggerRef.current }), 60);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[60] bg-ink-900/60" />
        <Dialog.Content
          aria-describedby={undefined}
          dir={getDirection(locale)}
          lang={locale}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
          className="dialog-sheet fixed inset-0 z-[61] flex flex-col overflow-y-auto overscroll-contain bg-[#0a0a0b] pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-[env(safe-area-inset-top)]"
        >
          <Dialog.Title className="sr-only">{copy.title}</Dialog.Title>

          <div className="ds-shell flex h-[4.25rem] items-center justify-between gap-4 sm:h-[4.75rem]">
            <span className="flex items-center gap-3">
              <SignatureMonogram play className="h-[1.35rem] w-auto text-accent" />
              <span className="ds-wordmark">{t.common.name}</span>
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/[0.14] px-3.5 text-[0.95rem] text-paper transition-colors hover:border-accent/50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                {copy.close}
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label={t.nav.primary} className="ds-shell mt-6">
            <ol className="border-t border-white/[0.08]">
              {primary.map((item, index) => {
                const active = isActive(item.href);

                return (
                  <li
                    key={item.href}
                    className="ds-settle border-b border-white/[0.08]"
                    style={{ "--ds-delay": `${0.04 + index * 0.05}s` } as CSSProperties}
                  >
                    <Link
                      href={href(item.href)}
                      onClick={close}
                      aria-current={path === item.href ? "page" : undefined}
                      className="focus-ring group flex min-h-[4.25rem] items-center gap-4 rounded-lg"
                    >
                      <span
                        aria-hidden="true"
                        className={cn("ds-latin w-7 text-sm", active ? "text-accent" : "text-paper-faint")}
                      >
                        {pad(index + 1)}
                      </span>
                      <span
                        className={cn(
                          "ds-heading text-[clamp(1.9rem,1.4rem+2.6vw,2.6rem)]",
                          active ? "text-accent-soft" : "text-paper"
                        )}
                      >
                        {t.nav[item.key]}
                      </span>
                      <Forward
                        aria-hidden="true"
                        className={cn("ds-forward ms-auto h-5 w-5", active ? "text-accent" : "text-paper-faint")}
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>

            <ul className="mt-5 flex flex-wrap gap-x-1 gap-y-1">
              {secondary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    onClick={close}
                    aria-current={path === item.href ? "page" : undefined}
                    className={cn(
                      "focus-ring inline-flex min-h-11 items-center rounded-lg px-3 text-base transition-colors hover:text-paper",
                      isActive(item.href) ? "text-accent-soft" : "text-paper-dim"
                    )}
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ds-shell mt-6">
            <p className="ds-label">{copy.quick}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={askGuide}
                className="focus-ring flex min-h-12 items-center justify-between gap-3 rounded-lg border border-white/[0.1] px-4 text-start text-[0.98rem] text-paper transition-colors hover:border-accent/40"
              >
                {copy.guide}
                <SignatureMonogram className="h-3.5 w-auto shrink-0 text-accent" />
              </button>
              <button
                type="button"
                onClick={search}
                aria-haspopup="dialog"
                className="focus-ring flex min-h-12 items-center justify-between gap-3 rounded-lg border border-white/[0.1] px-4 text-start text-[0.98rem] text-paper transition-colors hover:border-accent/40"
              >
                {t.nav.searchSite}
                <Search className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="ds-shell mt-auto pt-10">
            <p className="ds-label">{copy.elsewhere}</p>
            <ul className="mt-2 flex flex-wrap items-center gap-2">
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
                      className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/[0.12] px-3 text-sm text-paper-dim transition-colors hover:text-paper"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <Ltr>{profile.label}</Ltr>
                      <Outward className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">({t.common.opensInNewTab})</span>
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-paper-dim transition-colors hover:text-paper"
                >
                  <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
                  <Ltr>{siteConfig.email}</Ltr>
                </a>
              </li>
            </ul>
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
              <a
                href={switchLocaleHref(pathname, other)}
                hrefLang={other}
                lang={other}
                dir={getDirection(other)}
                className={cn(
                  "focus-ring inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-paper transition-colors hover:text-accent-soft",
                  other === "en" && "font-sans"
                )}
              >
                {copy.readOther}
              </a>
              {locale === "ar" ? (
                <Latin className="text-sm text-paper-faint">{siteConfig.name}</Latin>
              ) : (
                <span lang="ar" dir="rtl" className="text-sm text-paper-faint">
                  {siteConfig.arabicName}
                </span>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
