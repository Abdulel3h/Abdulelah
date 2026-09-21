/**
 * Lightweight list of every public route, used by the proxy to answer unknown
 * URLs with a server-rendered 404 page. Kept free of content imports so the
 * proxy bundle stays small; a unit test checks it against the project and
 * note data so the two never drift apart.
 */
export const projectRouteSlugs = [
  "chatub",
  "absher-insight-ai",
  "stadium",
  "althil",
  "qanouni",
  "virtual-astronauts",
  "medad"
] as const;

export const noteRouteSlugs = [
  "why-context-matters-more-than-prompts-in-ai-agents",
  "local-ai-systems-and-the-future-of-university-services",
  "from-chatbots-to-ai-agents-what-actually-changed",
  "how-ai-can-support-smarter-urban-planning",
  "from-reactive-security-to-predictive-ai-security",
  "what-every-student-should-know-about-ai-in-2026",
  "ai-for-non-technical-people-a-simple-mental-model",
  "building-ai-products-accuracy-is-not-enough"
] as const;

export const staticRoutePaths = [
  "/",
  "/about",
  "/projects",
  "/resume",
  "/achievements",
  "/skills",
  "/blog",
  "/contact",
  "/contact/sent",
  "/contact/failed",
  "/privacy"
] as const;

/** Private, English-only route that handles its own access control. */
export const privateRoutePaths = ["/dal-accelerator-abd-7xq29"] as const;

const known = new Set<string>([
  ...staticRoutePaths,
  ...projectRouteSlugs.map((slug) => `/projects/${slug}`),
  ...noteRouteSlugs.map((slug) => `/blog/${slug}`)
]);

export function isKnownRoute(path: string, { includePrivate = false } = {}) {
  return known.has(path) || (includePrivate && (privateRoutePaths as readonly string[]).includes(path));
}
