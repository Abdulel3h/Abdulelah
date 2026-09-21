"use client";

import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { otherLocale, switchLocaleHref } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * AR/EN switch that keeps the reader on the same page. A plain link (full
 * page load) on purpose: the document language, direction and typeface all
 * change with it.
 */
export function LanguageSwitch({ className, showIcon = true }: { className?: string; showIcon?: boolean }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? "/";
  const target = otherLocale(locale);

  return (
    <a
      href={switchLocaleHref(pathname, target)}
      hrefLang={target}
      className={cn(
        "focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] px-3.5 text-sm font-medium text-paper transition hover:border-accent/50 hover:text-accent-soft",
        className
      )}
    >
      {showIcon ? <Languages className="h-4 w-4 text-accent" aria-hidden="true" /> : null}
      <span lang={target} dir={target === "ar" ? "rtl" : "ltr"}>
        {t.language.switchTo}
      </span>
      <span className="sr-only"> — {t.language.switchToLabel}</span>
    </a>
  );
}
