import type { Locale } from "@/lib/i18n/config";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en, type Dictionary } from "@/lib/i18n/dictionaries/en";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
