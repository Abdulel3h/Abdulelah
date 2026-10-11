import { Fragment, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";

// A run of Latin words: names, technologies, programs ("Absher Insight AI",
// "Google Cloud", "AthkaU", "#AthkaU"), with the spaces, dots and hyphens
// between them, but never a trailing space or punctuation.
const LATIN_RUN = /#?[A-Za-z][A-Za-z0-9+#&'’.\-]*(?:[ \-/][A-Za-z0-9][A-Za-z0-9+#&'’.\-]*)*/g;
// A run of Arabic words (letters, Arabic punctuation and the spaces between).
const ARABIC_RUN = /[\u0600-\u06FF](?:[\u0600-\u06FF\s]*[\u0600-\u06FF])?/g;
// Arabic one-letter proclitics written joined to the next word: و ف ب ل ك.
const PROCLITIC = /(^|[\s(«،])([وفبلك])$/;
// U+202F NARROW NO-BREAK SPACE.
const NNBSP = "\u202f";

/**
 * Text set the way it reads in a locale, with runs of the other script
 * isolated (correct order for their own punctuation, and pronounced in their
 * own language by screen readers).
 *
 * On Arabic pages every Latin run becomes a left-to-right English isolate.
 * Arabic attaches «و» to the next word — fine for one Latin word («وPython»),
 * but before a multi-word name the letter lands visually against the name's
 * last word («Virtual Astronautsو»). There, and only there, a narrow no-break
 * space keeps the conjunction readable as belonging to the whole name.
 *
 * On English pages the text is left as it is, except for any Arabic run,
 * which becomes a right-to-left Arabic isolate.
 */
export function mixed(text: string, locale: Locale = "ar"): ReactNode {
  const arabic = locale === "ar";
  const parts: ReactNode[] = [];
  let cursor = 0;

  const pattern = new RegExp((arabic ? LATIN_RUN : ARABIC_RUN).source, "g");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    const start = match.index;
    let before = text.slice(cursor, start);
    const run = match[0];

    if (arabic && run.includes(" ") && PROCLITIC.test(before)) {
      before += NNBSP;
    }

    if (before) parts.push(before);
    parts.push(
      <span key={start} lang={arabic ? "en" : "ar"} dir={arabic ? "ltr" : "rtl"}>
        {run}
      </span>
    );
    cursor = start + run.length;
  }

  if (cursor === 0) return text;
  if (cursor < text.length) parts.push(text.slice(cursor));

  return <Fragment>{parts}</Fragment>;
}

/** `mixed` bound to one locale, for components that set a lot of text. */
export function mixer(locale: Locale) {
  return (text: string) => mixed(text, locale);
}
