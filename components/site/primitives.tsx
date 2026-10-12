import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/*
 * Icon direction, decided by meaning rather than mirrored wholesale:
 * "forward" (open, next, read) points the way the page reads — right in
 * English, left in Arabic; "back" points the other way; leaving the site
 * points up and forward (↗ / ↖). Brand marks, play, search, mail and download
 * glyphs never change with direction.
 */
const icons = {
  en: { Forward: ArrowRight, Back: ArrowLeft, Outward: ArrowUpRight },
  ar: { Forward: ArrowLeft, Back: ArrowRight, Outward: ArrowUpLeft }
} as const;

export function directional(locale: Locale) {
  return icons[locale];
}

export const Down = ArrowDown;

/**
 * A Latin name (ChatUB, Stadium, the years) in the brand's display face.
 * Inside Arabic text it is also an isolated left-to-right English run.
 */
export function Latin({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span lang="en" dir="ltr" className={cn("ds-latin", className)}>
      {children}
    </span>
  );
}

const ARABIC = new RegExp("[\u0600-\u06FF]");

/**
 * A project's name as the page shows it: a Latin name (ChatUB, Stadium) in
 * the brand's Latin display face, an Arabic one («رقمي») in the Arabic
 * display face, each in its own direction.
 */
export function ProjectName({ name, className }: { name: string; className?: string }) {
  if (ARABIC.test(name)) {
    return (
      <span lang="ar" dir="rtl" className={cn("ds-arabic-name", className)}>
        {name}
      </span>
    );
  }

  return <Latin className={className}>{name}</Latin>;
}

/**
 * Technical inline text in the body face (emails, handles, URLs, shortcuts,
 * brand names such as GitHub), isolated left-to-right and announced in English.
 */
export function Ltr({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span lang="en" dir="ltr" className={cn("ds-ltr", className)}>
      {children}
    </span>
  );
}

/** A project's tint as a CSS custom property for its subtree. */
export function tintStyle(rgb: string): CSSProperties {
  return { "--tint": rgb } as CSSProperties;
}

/**
 * The opening of every inner page: a kicker, the title (with an optional
 * softer second line), a short lede, and room for margin notes.
 */
export function PageHead({
  id,
  kicker,
  title,
  titleSoft,
  lede,
  children,
  className
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  titleSoft?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("ds-shell pt-12 sm:pt-16 lg:pt-24", className)}>
      <p className="ds-kicker">{kicker}</p>
      <h1 id={id} className="ds-h1 mt-5 max-w-[18ch]">
        {title}
        {titleSoft ? <span className="block ds-tone-55">{titleSoft}</span> : null}
      </h1>
      <div aria-hidden="true" className="ds-draw mt-7 h-px w-24 bg-accent" />
      {lede ? <p className="ds-lede mt-7">{lede}</p> : null}
      {children}
    </header>
  );
}

/** A section title in the gloss layout: kicker above, title below. */
export function SectionHead({
  id,
  kicker,
  title,
  titleSoft,
  className
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  titleSoft?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="ds-kicker">{kicker}</p>
      <h2 id={id} className="ds-h2 mt-4 max-w-[22ch]">
        {title}
        {titleSoft ? <span className="block ds-tone-55">{titleSoft}</span> : null}
      </h2>
    </div>
  );
}

/** Two-digit index numbers (01, 02…) used across lists and chapters. */
export function pad(index: number) {
  return String(index).padStart(2, "0");
}
