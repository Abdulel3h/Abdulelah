import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Shared rate limiting.
 *
 * Vercel runs each API route on many independent serverless instances, so a
 * per-instance Map only limits a single warm lambda. The durable path is an
 * Upstash Redis sliding window keyed by `endpoint + hashed IP`, which every
 * instance and region agrees on.
 *
 * The in-memory limiter is kept as a degraded fallback for local development
 * and for the case where Redis is unreachable — losing Redis must not remove
 * all throttling, and must not take the site down either.
 */

export type RateLimitOptions = {
  limit: number;
  namespace: string;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type RateLimitEntry = {
  timestamps: number[];
};

/** Redis must not stall a user-facing request; past this we fall back. */
const REDIS_TIMEOUT_MS = 1_500;

declare global {
  var portfolioRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const memoryStore =
  globalThis.portfolioRateLimitStore ??
  (globalThis.portfolioRateLimitStore = new Map<string, RateLimitEntry>());

const limiters = new Map<string, Ratelimit>();

let redisClient: Redis | null | undefined;
let hasWarnedAboutMissingRedis = false;

function getRedis() {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  redisClient = url && token ? new Redis({ url, token }) : null;

  if (!redisClient && !hasWarnedAboutMissingRedis) {
    hasWarnedAboutMissingRedis = true;
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set; falling back to per-instance limiting."
    );
  }

  return redisClient;
}

function getLimiter(redis: Redis, { limit, namespace, windowMs }: RateLimitOptions) {
  const windowSeconds = Math.max(Math.ceil(windowMs / 1_000), 1);
  const key = `${namespace}:${limit}:${windowSeconds}`;
  const existing = limiters.get(key);

  if (existing) {
    return existing;
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    prefix: `rl:${namespace}`,
    analytics: false
  });

  limiters.set(key, limiter);

  return limiter;
}

/**
 * Vercel rewrites `x-vercel-forwarded-for` itself, so it cannot be spoofed by
 * the client. `x-forwarded-for` is only trusted as a fallback for other hosts.
 */
function getClientIp(request: Request) {
  const trusted = request.headers.get("x-vercel-forwarded-for")?.trim();

  if (trusted) {
    return trusted.split(",")[0]?.trim() || "unknown";
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedAddress = forwardedFor?.split(",")[0]?.trim();

  return firstForwardedAddress || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Identities are stored as a salted hash so no raw visitor IP is persisted in
 * Redis. RATE_LIMIT_SALT keeps the short IPv4 space from being brute-forced.
 */
async function getClientKey(request: Request) {
  const salt = process.env.RATE_LIMIT_SALT?.trim() ?? "";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${getClientIp(request)}`)
  );

  return Array.from(new Uint8Array(digest).slice(0, 16))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function applyMemoryRateLimit(
  identifier: string,
  { limit, namespace, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = `${namespace}:${identifier}`;
  const cutoff = now - windowMs;
  const currentEntry = memoryStore.get(key);
  const activeTimestamps =
    currentEntry?.timestamps.filter((timestamp) => timestamp > cutoff) ?? [];

  if (activeTimestamps.length >= limit) {
    const retryAfterMs = Math.max(activeTimestamps[0] + windowMs - now, 1_000);

    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1_000)
    };
  }

  activeTimestamps.push(now);
  memoryStore.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    retryAfterSeconds: 0
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("rate-limit store timed out")),
      timeoutMs
    );

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function applyRateLimit(
  request: Request,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const identifier = await getClientKey(request);
  const redis = getRedis();

  if (!redis) {
    return applyMemoryRateLimit(identifier, options);
  }

  try {
    const result = await withTimeout(
      getLimiter(redis, options).limit(identifier),
      REDIS_TIMEOUT_MS
    );

    if (result.success) {
      return { allowed: true, retryAfterSeconds: 0 };
    }

    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        Math.ceil((result.reset - Date.now()) / 1_000),
        1
      )
    };
  } catch (error) {
    // Never let a store outage 500 the endpoint: degrade to per-instance
    // limiting, which is weaker but still blocks a single hot client.
    console.error("[rate-limit] shared store unavailable", {
      namespace: options.namespace,
      error: error instanceof Error ? error.message : "unknown"
    });

    return applyMemoryRateLimit(identifier, options);
  }
}
