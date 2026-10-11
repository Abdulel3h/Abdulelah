import Link from "next/link";
import type { ReactNode } from "react";
import { directional } from "@/components/site/primitives";
import { localizeHref, type Locale } from "@/lib/i18n/config";

/**
 * The quiet pages — not found, unexpected error, form result — share one
 * composition: a large «404» or kicker, one sentence, a short lede, and the
 * ways back as a list of forward links.
 */
export function Status({
  id,
  locale,
  mark,
  kicker,
  title,
  lede,
  links,
  children
}: {
  id: string;
  locale: Locale;
  mark?: string;
  kicker: string;
  title: string;
  lede: string;
  links: { label: string; href: string }[];
  children?: ReactNode;
}) {
  const { Forward } = directional(locale);

  return (
    <section aria-labelledby={id} className="ds-shell flex min-h-[70svh] flex-col justify-center py-20">
      {mark ? (
        <p aria-hidden="true" className="text-[clamp(5rem,3rem+9vw,10rem)] leading-none text-paper/[0.14]">
          <span className="ds-latin">{mark}</span>
        </p>
      ) : null}
      <p className="ds-kicker mt-6">{kicker}</p>
      <h1 id={id} className="ds-h1 mt-4 max-w-[18ch]">
        {title}
      </h1>
      <p className="ds-lede mt-5">{lede}</p>
      {children}
      {links.length > 0 ? (
        <ul className="mt-10 max-w-md border-t border-white/[0.08]">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={localizeHref(link.href, locale)}
                className="focus-ring group flex min-h-14 items-center justify-between gap-4 border-b border-white/[0.08] text-[1.05rem] text-paper transition-colors hover:text-accent-soft"
              >
                {link.label}
                <Forward className="ds-forward h-4 w-4 text-accent" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
