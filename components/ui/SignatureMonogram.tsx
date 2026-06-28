"use client";

import { motion, useReducedMotion } from "framer-motion";

const paths = [
  "M4 37 L14 6 L24 37",
  "M24 37 L34 6 L44 37",
  "M8 25 H20",
  "M28 25 H40"
];

/**
 * The AA monogram, drawn the way a signature is written — stroke by stroke as it
 * scrolls into view. Under reduced motion it simply appears, fully formed.
 */
export function SignatureMonogram({ className }: { className?: string }) {
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
            whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={
              reduce
                ? undefined
                : { duration: 0.85, delay: index * 0.22, ease: [0.4, 0, 0.2, 1] }
            }
          />
        ))}
      </g>
    </svg>
  );
}
