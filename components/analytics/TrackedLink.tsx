"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * A link that records one anonymous journey event when followed. External
 * links open in a new tab with `noopener noreferrer`; the caller supplies the
 * visible external marker and screen-reader note.
 */
export function TrackedLink({
  href,
  event,
  props,
  external = false,
  download = false,
  className,
  children,
  ariaLabel
}: {
  href: string;
  event: AnalyticsEvent;
  props?: Record<string, string | number | boolean>;
  external?: boolean;
  download?: boolean;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const onClick = () => trackEvent(event, props);

  if (external || download || !href.startsWith("/")) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        aria-label={ariaLabel}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
