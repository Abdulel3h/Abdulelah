"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MoreMenu } from "@/components/layout/MoreMenu";
import { Monogram } from "@/components/ui/Monogram";
import { moreNav, primaryNav } from "@/data/site";
import { splitLocalePath } from "@/lib/i18n/config";
import { openSearch } from "@/lib/ui-events";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t, href } = useI18n();
  const path = splitLocalePath(usePathname() ?? "/").path;

  const isExact = (target: string) => path === target;
  const isSection = (target: string) =>
    target === "/" ? path === "/" : path === target || path.startsWith(`${target}/`);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        aria-label={t.nav.primary}
        className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0a0a0b]/90 px-3 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-lg sm:bg-[#0a0a0b]/75 sm:px-5 sm:backdrop-blur-2xl lg:gap-4 lg:rounded-3xl"
      >
        <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <Link
          href={href("/")}
          className="focus-ring group flex min-h-11 items-center gap-2.5 rounded-full px-1"
          aria-label={t.common.homeAria}
        >
          <Monogram className="h-6 w-auto text-accent transition-colors group-hover:text-accent-soft" />
          <span className="font-display text-[0.98rem] font-medium tracking-tight text-paper" aria-hidden="true">
            {t.common.firstName} <span className="hidden sm:inline">{t.common.lastName}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {primaryNav.map((link) => {
            const active = isSection(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={href(link.href)}
                  aria-current={isExact(link.href) ? "page" : undefined}
                  className={cn(
                    "focus-ring group relative inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-paper-dim transition hover:text-paper",
                    active && "text-paper"
                  )}
                >
                  {t.nav[link.key]}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 bg-accent transition-transform group-hover:scale-x-100",
                      active && "scale-x-100"
                    )}
                  />
                </Link>
              </li>
            );
          })}
          <li>
            <MoreMenu
              label={t.nav.more}
              listLabel={t.nav.moreLabel}
              items={moreNav.map((link) => ({
                href: href(link.href),
                label: t.nav[link.key],
                active: isSection(link.href)
              }))}
            />
          </li>
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={(event) => openSearch({ returnFocusTo: event.currentTarget })}
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K"
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] px-3.5 text-sm font-medium text-paper-dim transition hover:border-accent/40 hover:text-paper"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {t.search.trigger}
            <kbd
              className="hidden rounded-md border border-white/[0.14] bg-white/[0.06] px-1.5 py-0.5 font-sans text-[0.68rem] text-paper-dim xl:inline"
              aria-hidden="true"
            >
              {t.search.shortcut}
            </kbd>
          </button>
          <LanguageSwitch />
          <Link
            href={href("/contact")}
            aria-current={isExact("/contact") ? "page" : undefined}
            className="focus-ring inline-flex min-h-11 items-center rounded-full border border-accent/50 bg-accent/[0.12] px-5 text-sm font-semibold text-accent-soft transition hover:border-accent hover:bg-accent/[0.18]"
          >
            {t.nav.contact}
          </Link>
        </div>

        <MobileMenu />
      </nav>
    </header>
  );
}
