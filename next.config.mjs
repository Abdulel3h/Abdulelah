/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

/**
 * Content-Security-Policy built from the resources this site actually uses:
 * self-hosted next/font files, local images, same-origin API routes, Vercel
 * Analytics (served from /_vercel/insights in production) and Cloudflare
 * Turnstile. Everything else is denied.
 *
 * Documented exceptions:
 * - script-src 'unsafe-inline': the App Router streams its RSC payload through
 *   inline bootstrap scripts and the JSON-LD blocks are inline. Dropping it
 *   requires per-request nonces from middleware, which forces every page to be
 *   dynamically rendered — a real cost for a site that is almost entirely
 *   static. Third-party script origins are still blocked.
 * - style-src 'unsafe-inline': Framer Motion animates via inline style
 *   attributes, which CSP cannot cover with a nonce.
 * - Development also allows 'unsafe-eval' (React Refresh), the Vercel
 *   Analytics debug script, and websocket connections for HMR.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  [
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    ...(isProduction ? [] : ["'unsafe-eval'", "https://va.vercel-scripts.com"])
  ].join(" "),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  [
    "connect-src 'self' https://challenges.cloudflare.com",
    ...(isProduction ? [] : ["ws:", "wss:", "https://va.vercel-scripts.com"])
  ].join(" "),
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "manifest-src 'self'",
  ...(isProduction ? ["upgrade-insecure-requests"] : [])
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), browsing-topics=(), camera=(), geolocation=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), payment=(), usb=()"
  },
  // HSTS only in production: the site is served exclusively over HTTPS on its
  // custom domain. Skipped in dev so local http://localhost is unaffected.
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains"
        }
      ]
    : [])
];

// Belt and braces on top of the signed-grant check: even if a private URL is
// shared, crawlers are told never to index or archive it.
const privateRouteHeaders = [
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive"
  },
  {
    key: "Cache-Control",
    value: "private, no-store"
  }
];

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    workerThreads: true
  },
  // The private Dal CV lives outside /public, so it has to be traced into the
  // serverless bundle explicitly for the authorized download route.
  outputFileTracingIncludes: {
    "/api/dal-cv": ["./private/dal/**"]
  },
  async redirects() {
    return [
      // The journey now lives inside the About story ("The path").
      { source: "/journey", destination: "/about", permanent: true },
      { source: "/ar/journey", destination: "/ar/about", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      },
      {
        // Self-hosted Arabic font files never change in place.
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
      },
      {
        source: "/dal-accelerator-abd-7xq29",
        headers: privateRouteHeaders
      },
      {
        source: "/api/dal-cv",
        headers: privateRouteHeaders
      }
    ];
  }
};

export default nextConfig;
