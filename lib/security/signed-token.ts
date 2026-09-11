/**
 * Minimal HMAC-SHA256 signed tokens.
 *
 * Used for capabilities that must be verifiable without server state:
 * the private Dal profile grant and the "this browser passed a bot check"
 * cookie. Built on Web Crypto so the exact same helper runs in the Edge
 * middleware and in Node.js route handlers.
 *
 * Token shape: `<expiresAtUnixSeconds>.<base64url(hmac)>`
 * The signature covers `<purpose>.<expiresAt>`, so a token minted for one
 * purpose can never be replayed against another.
 */

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function importKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(payload: string, secret: string) {
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  return toBase64Url(new Uint8Array(signature));
}

/** Length-independent, constant-time string comparison. */
export function constantTimeEquals(a: string, b: string) {
  const length = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;

  for (let index = 0; index < length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function createSignedToken({
  purpose,
  secret,
  ttlSeconds
}: {
  purpose: string;
  secret: string;
  ttlSeconds: number;
}) {
  const expiresAt = Math.floor(Date.now() / 1_000) + ttlSeconds;
  const signature = await sign(`${purpose}.${expiresAt}`, secret);

  return `${expiresAt}.${signature}`;
}

export async function verifySignedToken({
  purpose,
  secret,
  token
}: {
  purpose: string;
  secret: string;
  token: string | undefined | null;
}) {
  if (!token || !secret) {
    return false;
  }

  const separatorIndex = token.indexOf(".");

  if (separatorIndex <= 0) {
    return false;
  }

  const expiresAtValue = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);

  if (!/^\d{1,15}$/.test(expiresAtValue) || !signature) {
    return false;
  }

  const expiresAt = Number(expiresAtValue);

  if (!Number.isSafeInteger(expiresAt) || expiresAt * 1_000 <= Date.now()) {
    return false;
  }

  const expectedSignature = await sign(`${purpose}.${expiresAt}`, secret);

  return constantTimeEquals(signature, expectedSignature);
}

/** Seconds until a token expires; 0 when it is malformed or already expired. */
export function getSignedTokenRemainingSeconds(token: string | undefined | null) {
  if (!token) {
    return 0;
  }

  const expiresAtValue = token.slice(0, token.indexOf("."));

  if (!/^\d{1,15}$/.test(expiresAtValue)) {
    return 0;
  }

  return Math.max(Number(expiresAtValue) - Math.floor(Date.now() / 1_000), 0);
}
