"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { duration, ease, revealViewport } from "@/lib/motion";

/**
 * Reusable scroll reveal — a quiet fade-up as content enters the viewport.
 * Fully disabled under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: duration.slow, delay, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
