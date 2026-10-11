"use client";

import { useEffect, useState } from "react";
import { localeTags, type Locale } from "@/lib/i18n/config";

const formatters = new Map<Locale, Intl.DateTimeFormat>();

function formatterFor(locale: Locale) {
  let formatter = formatters.get(locale);

  if (!formatter) {
    // Western digits in both languages, like every number on the site.
    formatter = new Intl.DateTimeFormat(localeTags[locale].intl, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Riyadh"
    });
    formatters.set(locale, formatter);
  }

  return formatter;
}

/**
 * The time in Riyadh. Rendered only after mount (the server cannot know the
 * minute the page is read), with its space reserved so nothing shifts.
 */
export function RiyadhTime({ locale, label, city }: { locale: Locale; label: string; city: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatterFor(locale).format(new Date()));

    tick();

    const timer = window.setInterval(tick, 30_000);

    return () => window.clearInterval(timer);
  }, [locale]);

  return (
    <p className="ds-micro mt-6 flex min-h-6 items-center gap-2.5 text-paper-faint">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent/80" />
      <span className="sr-only">{label}: </span>
      <span>{city}</span>
      <span className="ds-num min-w-[4.5rem] text-paper-dim">{time ?? " "}</span>
    </p>
  );
}
