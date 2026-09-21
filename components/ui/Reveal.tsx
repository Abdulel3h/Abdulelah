"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealState = "visible" | "hidden";

/**
 * Scroll reveal that can never hide content by accident.
 *
 * The server renders everything visible. After hydration, only an element
 * that is still below the fold is hidden, and it comes back when it scrolls
 * into view, when anything inside it receives keyboard focus, or after a
 * short safety timeout — so a missing IntersectionObserver, a slow device or
 * a failed script can never leave text invisible. Reduced motion skips the
 * effect entirely.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div"
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<RevealState>("visible");

  useEffect(() => {
    const element = ref.current;

    if (
      !element ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const rect = element.getBoundingClientRect();

    // Already on screen (or above it): never hide what the reader can see.
    if (rect.top < window.innerHeight * 0.92) {
      return;
    }

    setState("hidden");

    const show = () => setState("visible");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    const fallback = window.setTimeout(show, 6000);

    observer.observe(element);
    element.addEventListener("focusin", show);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      element.removeEventListener("focusin", show);
    };
  }, []);

  const style = delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      data-reveal={state}
      style={style}
      className={className}
    >
      {children}
    </Tag>
  );
}
