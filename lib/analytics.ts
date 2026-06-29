import { track } from "@vercel/analytics";

/**
 * Privacy-friendly event tracking for the recruiter funnel. Wraps Vercel Web
 * Analytics (cookieless, no personal data, no cross-site profiles). Safe no-op
 * if analytics is disabled or unavailable — the site never depends on it.
 *
 * Only non-invasive intent signals are recorded (e.g. "resume_download"),
 * never personal identity or message content.
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>
) {
  try {
    track(name, props);
  } catch {
    // analytics unavailable — ignore.
  }
}
