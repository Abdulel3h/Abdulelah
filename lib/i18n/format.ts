import type { Locale } from "@/lib/i18n/config";

/** Fills `{placeholders}` in a dictionary string. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}

/**
 * Joins a short list of names for a sentence: "ChatUB and Stadium",
 * "ChatUB, Stadium and more" — or, in Arabic, "ChatUB وStadium" with the
 * conjunction attached to the next word as Arabic writes it.
 */
export function joinNames(names: string[], locale: Locale, andMore: string) {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];

  if (locale === "ar") {
    return names.length === 2
      ? `${names[0]} و${names[1]}`
      : `${names[0]} و${names[1]} ${andMore}`;
  }

  return names.length === 2
    ? `${names[0]} and ${names[1]}`
    : `${names[0]}, ${names[1]} ${andMore}`;
}
