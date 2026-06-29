"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const paths = [
  "M4 37 L14 6 L24 37",
  "M24 37 L34 6 L44 37",
  "M8 25 H20",
  "M28 25 H40"
];

/**
 * The AA monogram, drawn the way a signature is written — stroke by stroke.
 * Draws as it scrolls into view; pass `play` to draw immediately on mount (e.g.
 * inside a portal/overlay). Under reduced motion it simply appears, fully formed.
 */
export function SignatureMonogram({
  className,
  play = false
}: {
  className?: string;
  play?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 48 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={play && !reduce ? { pathLength: 1, opacity: 1 } : undefined}
            whileInView={
              play || reduce ? undefined : { pathLength: 1, opacity: 1 }
            }
            viewport={play ? undefined : { once: true, margin: "-12%" }}
            transition={
              reduce
                ? undefined
                : { duration: 0.85, delay: index * 0.22, ease: ease.out }
            }
          />
        ))}
      </g>
    </svg>
  );
}
