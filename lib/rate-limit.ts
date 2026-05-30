type RateLimitEntry = {
  timestamps: number[];
};

type RateLimitOptions = {
  limit: number;
  namespace: string;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

declare global {
  var portfolioRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const rateLimitStore =
  globalThis.portfolioRateLimitStore ??
  (globalThis.portfolioRateLimitStore = new Map<string, RateLimitEntry>());

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedAddress = forwardedFor?.split(",")[0]?.trim();

  return firstForwardedAddress || request.headers.get("x-real-ip") || "unknown";
}

export function applyRuntimeRateLimit(
  request: Request,
  { limit, namespace, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = `${namespace}:${getClientIdentifier(request)}`;
  const cutoff = now - windowMs;
  const currentEntry = rateLimitStore.get(key);
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
  rateLimitStore.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    retryAfterSeconds: 0
  };
}

// TODO: Replace this warm-instance limiter with a durable shared store if
// traffic or abuse requires consistent limits across Vercel instances.
