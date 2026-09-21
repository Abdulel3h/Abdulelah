"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { deviceClass, routeForAnalytics, trackEvent } from "@/lib/analytics";
import { splitLocalePath } from "@/lib/i18n/config";

const REPORTED = new Set(["LCP", "INP", "CLS"]);

/**
 * Real-user Core Web Vitals through the existing Vercel Web Analytics
 * pipeline: metric, rounded value, rating, route, language and a coarse
 * device class. No identifiers, no cookies, no extra provider.
 */
export function WebVitalsReporter() {
  const { locale } = useI18n();

  useReportWebVitals((metric) => {
    if (!REPORTED.has(metric.name)) return;

    trackEvent("web_vital", {
      metric: metric.name,
      value: metric.name === "CLS" ? Math.round(metric.value * 1000) / 1000 : Math.round(metric.value),
      rating: metric.rating ?? "unknown",
      route: routeForAnalytics(splitLocalePath(window.location.pathname).path),
      locale,
      device: deviceClass()
    });
  });

  return null;
}
