"use client";

import Link from "next/link";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, href } = useI18n();

  return (
    <section className="container-shell flex min-h-[72svh] flex-col justify-center py-20" aria-labelledby="error-title">
      <p className="eyebrow mb-6">{t.error.eyebrow}</p>
      <h1
        id="error-title"
        className="font-display text-5xl font-medium leading-[1] tracking-[-0.01em] text-paper sm:text-6xl lg:text-7xl"
      >
        {t.error.title} <span className="italic text-paper/70">{t.error.titleAccent}</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-paper-dim">{t.error.body}</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={reset}
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-ink-900 transition hover:bg-accent-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t.error.retry}
        </button>
        <Link
          href={href("/")}
          className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded text-base font-medium text-paper transition-colors hover:text-accent-soft"
        >
          {t.error.home}
          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
