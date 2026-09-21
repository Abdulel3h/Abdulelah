import { NextResponse, type NextRequest } from "next/server";
import {
  DAL_ACCESS_COOKIE,
  DAL_ACCESS_QUERY_PARAM,
  DAL_CV_PATH,
  DAL_PROFILE_PATH,
  verifyDalAccessToken
} from "@/lib/security/dal-access";
import { getSignedTokenRemainingSeconds } from "@/lib/security/signed-token";
import { resolveLocaleRoute } from "@/lib/i18n/routing";

const CANONICAL_HOSTNAME = "www.abdulelah.de";

export const config = {
  matcher: ["/((?!_next/static|_next/image|_vercel|favicon.ico).*)"]
};

/**
 * Runs ahead of every page and API request (Next 16 renamed this convention
 * from `middleware` to `proxy`).
 *
 * Three jobs: keep the Vercel deployment domain from becoming a second
 * indexable copy of the site, exchange a signed Dal access link for an
 * HttpOnly cookie, and map locale routes — English pages keep their
 * unprefixed URLs (rewritten internally to /en/...), Arabic lives under /ar,
 * and explicit /en/... URLs redirect to the unprefixed canonical form.
 */
export async function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  // The Vercel deployment domain must not behave as a second, indexable copy
  // of the site. Cloning nextUrl (rather than composing a string) keeps the
  // destination host fixed, so a crafted path can never redirect off-site.
  if (host === "abdulelah.vercel.app" || host.endsWith(".vercel.app")) {
    const canonicalUrl = request.nextUrl.clone();

    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = CANONICAL_HOSTNAME;
    canonicalUrl.port = "";

    return NextResponse.redirect(canonicalUrl, 308);
  }

  const { pathname } = request.nextUrl;

  if (pathname === DAL_PROFILE_PATH || pathname === DAL_CV_PATH) {
    const token = request.nextUrl.searchParams.get(DAL_ACCESS_QUERY_PARAM);

    if (token && (await verifyDalAccessToken(token))) {
      // Exchange the link token for an HttpOnly cookie and strip it from the
      // URL, so the grant stops travelling through history and referrers.
      const cleanUrl = request.nextUrl.clone();

      cleanUrl.searchParams.delete(DAL_ACCESS_QUERY_PARAM);

      const response = NextResponse.redirect(cleanUrl);

      response.cookies.set({
        name: DAL_ACCESS_COOKIE,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: getSignedTokenRemainingSeconds(token)
      });

      return response;
    }
  }

  const route = resolveLocaleRoute(pathname);

  if (route.action === "redirect") {
    const url = request.nextUrl.clone();

    url.pathname = route.pathname;

    return NextResponse.redirect(url, 308);
  }

  if (route.action === "not-found") {
    const url = request.nextUrl.clone();

    url.pathname = route.pathname;

    return NextResponse.rewrite(url, { status: 404 });
  }

  if (route.action === "rewrite") {
    const url = request.nextUrl.clone();

    url.pathname = route.pathname;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
