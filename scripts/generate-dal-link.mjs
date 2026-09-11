#!/usr/bin/env node
/**
 * Mint a private access link for the Dal Professional Accelerator profile.
 *
 *   DAL_ACCESS_SECRET=... node scripts/generate-dal-link.mjs [--days 14] [--base https://www.abdulelah.de]
 *
 * The signing format mirrors lib/security/signed-token.ts. It is reimplemented
 * here with node:crypto so the script stays runnable without a build step.
 */
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

const PURPOSE = "dal-accelerator-profile";
const PROFILE_PATH = "/dal-accelerator-abd-7xq29";

function readArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);

  return index >= 0 && process.argv[index + 1]
    ? process.argv[index + 1]
    : fallback;
}

/** Convenience only: read DAL_ACCESS_SECRET out of a local env file. */
function readSecretFromEnvFile() {
  for (const file of [".env.local", ".env"]) {
    try {
      const contents = readFileSync(path.join(process.cwd(), file), "utf8");
      const match = contents.match(/^DAL_ACCESS_SECRET\s*=\s*(.+)$/m);

      if (match) {
        return match[1].trim().replace(/^["']|["']$/g, "");
      }
    } catch {
      // File is optional.
    }
  }

  return "";
}

const secret = process.env.DAL_ACCESS_SECRET?.trim() || readSecretFromEnvFile();

if (!secret) {
  console.error(
    "DAL_ACCESS_SECRET is not set. Generate one with:\n  node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
  );
  process.exit(1);
}

const days = Number(readArg("days", "14"));

if (!Number.isFinite(days) || days <= 0) {
  console.error("--days must be a positive number.");
  process.exit(1);
}

const baseUrl = (
  readArg("base", process.env.NEXT_PUBLIC_SITE_URL || "https://www.abdulelah.de")
).replace(/\/+$/, "");

const expiresAt = Math.floor(Date.now() / 1_000) + Math.round(days * 24 * 60 * 60);
const signature = createHmac("sha256", secret)
  .update(`${PURPOSE}.${expiresAt}`)
  .digest("base64url");
const token = `${expiresAt}.${signature}`;

console.log(`${baseUrl}${PROFILE_PATH}?token=${token}`);
console.log(`Expires: ${new Date(expiresAt * 1_000).toISOString()}`);
