import { createSignedToken, verifySignedToken } from "@/lib/security/signed-token";

/**
 * Access control for the private Dal Professional Accelerator profile.
 *
 * The page is reachable only with a signed, expiring grant. `noindex` is kept
 * as an SEO safeguard, but it is never the access control.
 *
 * Fails closed: without DAL_ACCESS_SECRET nothing is served, so a deployment
 * that forgets the variable exposes nothing instead of everything.
 */

export const DAL_PROFILE_PATH = "/dal-accelerator-abd-7xq29";
export const DAL_CV_PATH = "/api/dal-cv";
export const DAL_ACCESS_COOKIE = "dal_access";
export const DAL_ACCESS_QUERY_PARAM = "token";
const DAL_ACCESS_PURPOSE = "dal-accelerator-profile";
/** Grants stay valid for 14 days so a reviewer can return to the link. */
export const DAL_ACCESS_TTL_SECONDS = 14 * 24 * 60 * 60;

export function getDalAccessSecret() {
  return process.env.DAL_ACCESS_SECRET?.trim() ?? "";
}

export function createDalAccessToken(
  secret: string,
  ttlSeconds = DAL_ACCESS_TTL_SECONDS
) {
  return createSignedToken({
    purpose: DAL_ACCESS_PURPOSE,
    secret,
    ttlSeconds
  });
}

export async function verifyDalAccessToken(token: string | undefined | null) {
  const secret = getDalAccessSecret();

  if (!secret) {
    return false;
  }

  return verifySignedToken({
    purpose: DAL_ACCESS_PURPOSE,
    secret,
    token
  });
}
