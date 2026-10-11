"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { directional } from "@/components/site/primitives";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, href, locale } = useI18n();
  const { Forward } = directional(locale);

  return (
    <section aria-labelledby="error-title" className="ds-shell flex min-h-[70svh] flex-col justify-center py-20">
      <p className="ds-kicker">{t.error.eyebrow}</p>
      <h1 id="error-title" className="ds-h1 mt-4 max-w-[18ch]">
        {t.error.title}
      </h1>
      <p className="ds-lede mt-5">{t.error.body}</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button type="button" onClick={reset} className="ds-btn ds-btn-solid focus-ring">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t.error.retry}
        </button>
        <Link
          href={href("/")}
          className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded text-[1.05rem] text-paper transition-colors hover:text-accent-soft"
        >
          {t.error.home}
          <Forward className="ds-forward h-4 w-4 text-accent" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
