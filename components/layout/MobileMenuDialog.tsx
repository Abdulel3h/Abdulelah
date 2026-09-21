"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Github, Linkedin, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MutableRefObject } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { SignatureMonogram } from "@/components/ui/SignatureMonogram";
import { openCompanion } from "@/lib/agent/companion";
import { moreNav, siteConfig } from "@/data/site";
import { splitLocalePath } from "@/lib/i18n/config";
import { openSearch } from "@/lib/ui-events";
import { cn } from "@/lib/utils";

const primary = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "resume", href: "/resume" },
  { key: "contact", href: "/contact" }
] as const;

/**
 * Full-screen mobile index, loaded on demand (Radix Dialog: focus trap,
 * Escape and scroll lock; focus returns to the menu button on close).
 */
export default function MobileMenuDialog({
  open,
  onOpenChange,
  triggerRef
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
}) {
  const { t, href } = useI18n();
  const path = splitLocalePath(usePathname() ?? "/").path;

  const isActive = (target: string) =>
    target === "/" ? path === "/" : path === target || path.startsWith(`${target}/`);

  function close() {
    onOpenChange(false);
  }

  function askGuide() {
    onOpenChange(false);
    openCompanion({ prompt: t.nav.guideSummaryPrompt, send: true, returnFocusTo: triggerRef.current });
  }

  function search() {
    onOpenChange(false);
    // Let the menu finish closing (and release its focus trap) first.
    window.setTimeout(() => openSearch({ returnFocusTo: triggerRef.current }), 60);
  }

  const socials = [
    { label: t.nav.githubProfile, href: siteConfig.social.github, icon: Github },
    { label: t.nav.linkedinProfile, href: siteConfig.social.linkedin, icon: Linkedin }
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[60] bg-ink-900/50" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
          className="dialog-sheet fixed inset-0 z-[61] flex flex-col overflow-y-auto overscroll-contain bg-[#0a0a0b] px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-8"
        >
                <Dialog.Title className="sr-only">{t.nav.menuTitle}</Dialog.Title>

                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2.5">
                    <SignatureMonogram play className="h-6 w-auto text-accent" />
                    <span className="font-display text-base font-medium tracking-tight text-paper">
                      {t.common.name}
                    </span>
                  </span>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label={t.nav.closeMenu}
                      className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] text-paper-dim transition hover:text-paper"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="mt-8" aria-label={t.nav.primary}>
                  <ul>
                    {primary.map((link, index) => {
                      const active = isActive(link.href);

                      return (
                        <li key={link.href}>
                          <Link
                            href={href(link.href)}
                            onClick={close}
                            aria-current={path === link.href ? "page" : undefined}
                            className={cn(
                              "focus-ring flex min-h-14 items-center gap-4 rounded-2xl px-3 transition-colors",
                              active ? "bg-accent/[0.12] text-paper" : "text-paper/85 active:bg-white/[0.04]"
                            )}
                          >
                            <span
                              className={cn(
                                "font-display text-sm tabular-nums",
                                active ? "text-accent" : "text-paper-faint"
                              )}
                              aria-hidden="true"
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="font-display text-[1.75rem] font-medium leading-none">
                              {t.nav[link.key]}
                            </span>
                            {active ? (
                              <span className="ms-auto h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                            ) : (
                              <ArrowUpRight className="ms-auto h-5 w-5 text-paper-faint rtl:-scale-x-100" aria-hidden="true" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {moreNav.map((link) => (
                    <Link
                      key={link.href}
                      href={href(link.href)}
                      onClick={close}
                      aria-current={path === link.href ? "page" : undefined}
                      className={cn(
                        "focus-ring flex min-h-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.02] px-2 text-center text-sm font-medium text-paper-dim transition-colors hover:border-accent/30 hover:text-paper",
                        isActive(link.href) && "border-accent/40 text-paper"
                      )}
                    >
                      {t.nav[link.key]}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.1] bg-white/[0.02] p-4">
                  <p className="eyebrow mb-2">{t.nav.hiringTitle}</p>
                  <ul>
                    <li>
                      <Link
                        href={href("/projects")}
                        onClick={close}
                        className="focus-ring flex min-h-12 items-center justify-between border-b border-white/[0.07] text-paper transition-colors hover:text-accent-soft"
                      >
                        {t.nav.selectedWork}
                        <ArrowUpRight className="h-4 w-4 text-accent-soft rtl:-scale-x-100" aria-hidden="true" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={href("/resume")}
                        onClick={close}
                        className="focus-ring flex min-h-12 items-center justify-between border-b border-white/[0.07] text-paper transition-colors hover:text-accent-soft"
                      >
                        {t.nav.chooseCv}
                        <ArrowUpRight className="h-4 w-4 text-accent-soft rtl:-scale-x-100" aria-hidden="true" />
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={askGuide}
                        className="focus-ring flex min-h-12 w-full items-center justify-between text-start text-paper transition-colors hover:text-accent-soft"
                      >
                        {t.nav.guideSummary}
                        <SignatureMonogram className="h-3.5 w-auto text-accent-soft" />
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={search}
                    aria-haspopup="dialog"
                    className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] px-4 text-sm font-medium text-paper transition hover:border-accent/40"
                  >
                    <Search className="h-4 w-4 text-accent" aria-hidden="true" />
                    {t.nav.searchSite}
                  </button>
                  <LanguageSwitch />
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <ul className="flex gap-2">
                    {socials.map((social) => {
                      const Icon = social.icon;

                      return (
                        <li key={social.href}>
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${social.label} (${t.common.opensInNewTab})`}
                            className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] text-paper-dim transition hover:border-accent/35 hover:text-paper"
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  <span lang="ar" dir="rtl" className="font-display text-lg text-paper-dim">
                    {siteConfig.arabicName}
                  </span>
                </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
