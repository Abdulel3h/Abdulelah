"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const paths = ["M4 37 L14 6 L24 37", "M24 37 L34 6 L44 37", "M8 25 H20", "M28 25 H40"];

/**
 * The AA monogram, drawn stroke by stroke like a signature (CSS stroke
 * animation). It is fully drawn in the server HTML; the drawing only replays
 * when it scrolls into view — or immediately with `play` — and never under
 * reduced motion.
 */
export function SignatureMonogram({
  className,
  play = false,
  strokeWidth = 2.2
}: {
  className?: string;
  play?: boolean;
  strokeWidth?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<"drawn" | "armed" | "play">(play ? "play" : "drawn");

  useEffect(() => {
    const element = ref.current;

    if (play || !element || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState("play");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    const frame = window.requestAnimationFrame(() => setState("armed"));

    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [play]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 48 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("signature", state === "armed" && "signature-armed", state === "play" && "signature-play", className)}
    >
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {paths.map((d, index) => (
          <path key={d} d={d} pathLength={1} style={{ "--sig-delay": `${index * 0.22}s` } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}
