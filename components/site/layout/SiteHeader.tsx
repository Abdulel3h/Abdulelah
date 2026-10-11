"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Ltr } from "@/components/site/primitives";
import { Monogram } from "@/components/ui/Monogram";
import { getDirection, otherLocale, splitLocalePath, switchLocaleHref } from "@/lib/i18n/config";
import type { SiteCopy } from "@/lib/i18n/experience";
import { openSearch } from "@/lib/ui-events";
import { whenIdle } from "@/lib/when-idle";
import { cn } from "@/lib/utils";

const loadMenu = () => import("@/components/site/layout/MenuDialog");
const MenuDialog = dynamic(loadMenu, { ssr: false });

/** Desktop navigation, in reading order from the inline start. */
export const siteNav = [
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "resume", href: "/resume" },
  { key: "achievements", href: "/achievements" },
  { key: "notes", href: "/blog" }
] as const;

export type HeaderCopy = Pick<SiteCopy, "header" | "menu">;

/**
 * The header: flush with the page instead of a floating pill. It is
 * transparent over the opening and gains an ink surface with a hairline once
 * the page scrolls. Name at the inline start; tools at the inline end. The
 * copy comes from the server layout, so neither language's strings ship in
 * the other's bundle.
 */
export function SiteHeader({ copy }: { copy: HeaderCopy }) {
  const { t, href, locale } = useI18n();
  const pathname = usePathname() ?? "/";
  const path = splitLocalePath(pathname).path;
  const other = otherLocale(locale);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuRequested, setMenuRequested] = useState(false);
  const menuButton = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      setScrolled(window.scrollY > 8);
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => whenIdle(() => void loadMenu(), 3000), []);

  const inSection = (target: string) => path === target || path.startsWith(`${target}/`);

  return (
    <header data-scrolled={scrolled} className="ds-header sticky top-0 z-50">
      <div className="ds-shell flex h-[4.25rem] items-center gap-4 sm:h-[4.75rem]">
        <Link
          href={href("/")}
          aria-label={copy.header.homeAria}
          aria-current={path === "/" ? "page" : undefined}
          className="focus-ring group flex min-h-11 shrink-0 items-center gap-3 rounded-lg"
        >
          <Monogram className="h-[1.35rem] w-auto text-accent transition-colors group-hover:text-accent-soft" />
          <span className="ds-wordmark" aria-hidden="true">
            {t.common.firstName}
            <span className="ds-name-tail"> {t.common.lastName}</span>
          </span>
        </Link>

        <nav aria-label={t.nav.primary} className="ms-4 hidden lg:block xl:ms-8">
          <ul className="flex items-center">
            {siteNav.map((item) => {
              const active = inSection(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    aria-current={path === item.href ? "page" : undefined}
                    data-active={active}
                    className={cn(
                      "ds-nav-link focus-ring inline-flex min-h-11 items-center rounded-lg px-3 text-[0.98rem] transition-colors hover:text-paper",
                      active ? "text-paper" : "text-paper-dim"
                    )}
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={(event) => openSearch({ returnFocusTo: event.currentTarget })}
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K"
            aria-label={copy.header.searchAria}
            className="focus-ring hidden min-h-11 items-center gap-2 rounded-lg px-3 text-[0.95rem] text-paper-dim transition-colors hover:text-paper lg:inline-flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {copy.header.search}
            <kbd
              aria-hidden="true"
              className="hidden rounded border border-white/[0.14] px-1.5 py-0.5 font-sans text-[0.7rem] leading-none text-paper-faint xl:inline"
            >
              <Ltr>Ctrl K</Ltr>
            </kbd>
          </button>

          {/* Named in its own language, as language switches are; a full page
              load on purpose, since direction and typeface change with it. */}
          <a
            href={switchLocaleHref(pathname, other)}
            hrefLang={other}
            lang={other}
            dir={getDirection(other)}
            aria-label={copy.header.otherLanguage}
            className={cn(
              "focus-ring inline-flex min-h-11 items-center rounded-lg px-3 text-[0.92rem] text-paper-dim transition-colors hover:text-paper",
              other === "en" && "font-sans"
            )}
          >
            <span className="max-sm:hidden">{copy.header.otherLanguage}</span>
            <span className="sm:hidden">{copy.header.otherLanguageShort}</span>
          </a>

          <Link
            href={href("/contact")}
            aria-current={path === "/contact" ? "page" : undefined}
            className="focus-ring hidden min-h-11 items-center rounded-lg bg-accent px-4 text-[0.95rem] font-medium text-ink-900 transition-colors hover:bg-accent-soft lg:inline-flex"
          >
            {copy.header.contact}
          </Link>

          <button
            ref={menuButton}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onPointerEnter={() => void loadMenu()}
            onTouchStart={() => void loadMenu()}
            onClick={() => {
              setMenuRequested(true);
              setMenuOpen(true);
            }}
            className="focus-ring inline-flex min-h-11 items-center gap-2.5 rounded-lg border border-white/[0.14] px-3.5 text-[0.95rem] text-paper transition-colors hover:border-accent/50 lg:hidden"
          >
            <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-2/3 bg-current" />
            </span>
            {copy.header.menu}
          </button>
        </div>
      </div>

      {menuRequested ? (
        <MenuDialog open={menuOpen} onOpenChange={setMenuOpen} triggerRef={menuButton} copy={copy.menu} />
      ) : null}
    </header>
  );
}
