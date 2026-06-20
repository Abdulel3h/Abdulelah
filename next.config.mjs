/** @type {import('next').NextConfig} */
const securityHeaders = [
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
    value: "camera=(), microphone=(), geolocation=()"
  },
  // HSTS only in production: the site is served exclusively over HTTPS on its
  // custom domain. Skipped in dev so local http://localhost is unaffected.
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains"
        }
      ]
    : [])
];

// TODO: Add a stricter Content-Security-Policy after the final deployment
// domain, analytics, and asset sources are known. A premature CSP can break
// Next.js runtime styles/scripts and Framer Motion inline transforms.
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    workerThreads: true
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
