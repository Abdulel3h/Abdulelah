import "server-only";
import { createSignedToken, verifySignedToken } from "@/lib/security/signed-token";
import {
  getTurnstileSecret,
  isTurnstileEnabled,
  verifyTurnstileToken
} from "@/lib/security/turnstile";

/**
 * Bot protection shared by the contact endpoints and the AI agent.
 *
 * The contact form solves a fresh Turnstile challenge on every submission —
 * it is low volume and sends real email. The agent would be tedious to
 * challenge on every message, so a passing check mints a short-lived signed
 * cookie and later messages in the same session ride on that instead. The
 * cookie is HttpOnly and HMAC-signed, so the browser cannot forge one.
 */

export const HUMAN_GRANT_COOKIE = "pv_human";
const HUMAN_GRANT_PURPOSE = "human-verified";
const HUMAN_GRANT_TTL_SECONDS = 30 * 60;

export type BotCheckResult = {
  ok: boolean;
  /** Set when a fresh challenge passed and a session grant should be stored. */
  grant?: string;
};

function getClientIp(request: Request) {
  const trusted = request.headers.get("x-vercel-forwarded-for")?.trim();

  if (trusted) {
    return trusted.split(",")[0]?.trim() || null;
  }

  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie");

  if (!header) {
    return null;
  }

  for (const part of header.split(";")) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    if (part.slice(0, separatorIndex).trim() === name) {
      return decodeURIComponent(part.slice(separatorIndex + 1).trim());
    }
  }

  return null;
}

async function hasValidHumanGrant(request: Request) {
  return verifySignedToken({
    purpose: HUMAN_GRANT_PURPOSE,
    secret: getTurnstileSecret(),
    token: readCookie(request, HUMAN_GRANT_COOKIE)
  });
}

export async function checkBotProtection({
  request,
  token,
  allowSessionGrant = false
}: {
  request: Request;
  token: unknown;
  allowSessionGrant?: boolean;
}): Promise<BotCheckResult> {
  if (!isTurnstileEnabled()) {
    return { ok: true };
  }

  if (allowSessionGrant && (await hasValidHumanGrant(request))) {
    return { ok: true };
  }

  const passed = await verifyTurnstileToken(token, getClientIp(request));

  if (!passed) {
    return { ok: false };
  }

  if (!allowSessionGrant) {
    return { ok: true };
  }

  return {
    ok: true,
    grant: await createSignedToken({
      purpose: HUMAN_GRANT_PURPOSE,
      secret: getTurnstileSecret(),
      ttlSeconds: HUMAN_GRANT_TTL_SECONDS
    })
  };
}

export function buildHumanGrantCookie(grant: string) {
  const attributes = [
    `${HUMAN_GRANT_COOKIE}=${encodeURIComponent(grant)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${HUMAN_GRANT_TTL_SECONDS}`
  ];

  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}
