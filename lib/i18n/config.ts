/**
 * Locale routing rules for the whole site.
 *
 * English is the default locale and keeps its original, unprefixed URLs
 * (`/about`), so every existing link and search result stays valid. Arabic
 * lives under `/ar` (`/ar/about`). Internally both are served from
 * `app/[locale]`; `proxy.ts` rewrites unprefixed requests to `/en/...` and
 * redirects any explicit `/en/...` URL back to its unprefixed form so the
 * same page is never reachable at two addresses.
 */

export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ar: { short: "ع", name: "العربية" }
};

/** BCP 47 tags used for Open Graph, hreflang and Intl formatting. */
export const localeTags: Record<Locale, { hreflang: string; og: string; intl: string }> = {
  en: { hreflang: "en", og: "en_US", intl: "en-US" },
  ar: { hreflang: "ar", og: "ar_SA", intl: "ar-SA-u-nu-latn" }
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

function normalizePath(path: string) {
  if (!path || path === "/") {
    return "/";
  }

  const withSlash = path.startsWith("/") ? path : `/${path}`;

  return withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
}

/**
 * Splits a browser pathname into its locale and the locale-free path.
 * `/ar/projects/chatub` → `{ locale: "ar", path: "/projects/chatub" }`.
 * Explicit `/en/...` paths (seen during server rendering of a rewrite) are
 * treated the same as their unprefixed form.
 */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const path = normalizePath(pathname.split(/[?#]/)[0] ?? "/");
  const [, first, ...rest] = path.split("/");

  if (isLocale(first)) {
    return { locale: first, path: normalizePath(`/${rest.join("/")}`) };
  }

  return { locale: defaultLocale, path };
}

/**
 * Builds the public URL path of a locale-free route for a locale.
 * Hashes and query strings are preserved; external URLs, mailto links and
 * files (anything with an extension, such as the CV PDFs) are returned as-is.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/api/") ||
    /\/[^/?#]+\.[a-z0-9]{2,5}(?:[?#]|$)/i.test(href)
  ) {
    return href;
  }

  const match = href.match(/^([^?#]*)(.*)$/);
  const rawPath = match?.[1] ?? href;
  const suffix = match?.[2] ?? "";
  const { path } = splitLocalePath(rawPath);

  if (locale === defaultLocale) {
    return `${path}${suffix}`;
  }

  return `${path === "/" ? `/${locale}` : `/${locale}${path}`}${suffix}`;
}

/** The same page in another locale — used by the language switch. */
export function switchLocaleHref(pathname: string, target: Locale) {
  return localizeHref(splitLocalePath(pathname).path, target);
}
