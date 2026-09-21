import { track } from "@vercel/analytics";

/**
 * Privacy-friendly journey events on top of Vercel Web Analytics (cookieless,
 * aggregated, no cross-site profiles). Safe no-op when analytics is disabled
 * or unavailable — the site never depends on it.
 *
 * Only these anonymous intent signals are recorded. Never pass names, email
 * addresses, message text or guide questions as properties.
 */
export type AnalyticsEvent =
  | "project_opened"
  | "evidence_opened"
  | "cv_downloaded"
  | "contact_submitted"
  | "email_copied"
  | "companion_open"
  | "web_vital";

export function trackEvent(
  name: AnalyticsEvent,
  props?: Record<string, string | number | boolean>
) {
  try {
    track(name, props);
  } catch {
    // analytics unavailable — ignore.
  }
}

/** Coarse, privacy-safe device class from the viewport width only. */
export function deviceClass(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";

  return "desktop";
}

/** `/projects/chatub` stays as-is; long free-form paths are not expected. */
export function routeForAnalytics(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}
