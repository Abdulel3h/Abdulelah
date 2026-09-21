import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Reads and validates the `[locale]` segment; unknown values are a 404. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function resolveDictionary(params: Promise<{ locale: string }>) {
  const locale = await resolveLocale(params);

  return { locale, dict: getDictionary(locale) };
}
