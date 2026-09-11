import "server-only";

/**
 * Cloudflare Turnstile server-side verification.
 *
 * A Turnstile token is only ever evidence once Cloudflare has confirmed it, so
 * the client result is never trusted. When the keys are not configured the
 * check is skipped entirely — the site keeps working on honeypot plus rate
 * limiting alone — but a configured deployment always enforces it.
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 4_000;
const MAX_TOKEN_LENGTH = 2_048;

export function getTurnstileSecret() {
  return process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
}

export function isTurnstileEnabled() {
  return Boolean(getTurnstileSecret());
}

export async function verifyTurnstileToken(
  token: unknown,
  remoteIp?: string | null
) {
  const secret = getTurnstileSecret();

  if (!secret) {
    return false;
  }

  if (
    typeof token !== "string" ||
    !token ||
    token.length > MAX_TOKEN_LENGTH
  ) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  const form = new URLSearchParams({ secret, response: token });

  if (remoteIp) {
    form.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as { success?: unknown };

    return result.success === true;
  } catch {
    // Fail closed: an unverifiable token is not a verified human.
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
