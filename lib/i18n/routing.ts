import { isKnownRoute } from "@/data/route-manifest";
import { defaultLocale } from "@/lib/i18n/config";

export type LocaleRoute =
  | { action: "pass" }
  | { action: "rewrite"; pathname: string }
  | { action: "redirect"; pathname: string }
  | { action: "not-found"; pathname: string };

/** Internal page that renders the localized 404 (see app/[locale]/(fallback)). */
export const NOT_FOUND_SEGMENT = "status-404";

/**
 * Paths the locale router must leave alone: API routes, Next internals,
 * Vercel endpoints, generated metadata routes and any file with an extension
 * (CV PDFs, images, fonts, robots.txt, sitemap.xml).
 */
function isPassthrough(pathname: string) {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    /\/[^/]+\.[a-zA-Z0-9]{2,5}$/.test(pathname)
  );
}

function trim(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/**
 * Pure routing decision for the proxy (unit-tested):
 * - `/en` and `/en/...` redirect to the unprefixed canonical URL;
 * - `/ar/...` is served as is when the page exists;
 * - any other known path is English and is rewritten to `/en/...`;
 * - unknown paths are rewritten, with a 404 status, to the localized
 *   not-found page so it is fully server-rendered.
 */
export function resolveLocaleRoute(rawPathname: string): LocaleRoute {
  const pathname = trim(rawPathname);

  if (isPassthrough(pathname)) {
    return { action: "pass" };
  }

  const [, first] = pathname.split("/");

  if (first === defaultLocale) {
    const rest = pathname.slice(defaultLocale.length + 1);

    return { action: "redirect", pathname: rest.startsWith("/") ? rest : `/${rest}` };
  }

  if (first === "ar") {
    const rest = pathname.slice(3) || "/";

    return isKnownRoute(rest)
      ? { action: "pass" }
      : { action: "not-found", pathname: `/ar/${NOT_FOUND_SEGMENT}` };
  }

  if (isKnownRoute(pathname, { includePrivate: true })) {
    return { action: "rewrite", pathname: `/${defaultLocale}${pathname === "/" ? "" : pathname}` };
  }

  return { action: "not-found", pathname: `/${defaultLocale}/${NOT_FOUND_SEGMENT}` };
}
