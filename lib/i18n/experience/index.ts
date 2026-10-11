import type { Locale } from "@/lib/i18n/config";
import { arBriefs, arCopy, type ProjectBrief, type SiteCopy } from "./ar";
import { enBriefs, enCopy } from "./en";

export type { ProjectBrief, SiteCopy };

const copies: Record<Locale, SiteCopy> = { en: enCopy, ar: arCopy };
const briefs: Record<Locale, Record<string, ProjectBrief>> = { en: enBriefs, ar: arBriefs };

/** The copy the site's compositions say, in one locale. */
export function siteCopy(locale: Locale): SiteCopy {
  return copies[locale];
}

/** The five-line brief of a project (index line, problem, build, role, result). */
export function projectBriefs(locale: Locale): Record<string, ProjectBrief> {
  return briefs[locale];
}
