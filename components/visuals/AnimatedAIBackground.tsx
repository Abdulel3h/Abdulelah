"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A calm, editorial backdrop: deep ink with a single slow warm wash and a
 * faint cool counter-light for depth. Intentionally free of particles,
 * scanlines, and grids — the page should feel like paper and ink, not a HUD.
 */
export function AnimatedAIBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0b]"
    >
      <motion.div
        className="absolute left-1/2 top-[-26rem] h-[46rem] w-[64rem] -translate-x-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,167,92,0.10), transparent 72%)"
        }}
        animate={reduceMotion ? undefined : { opacity: [0.55, 0.85, 0.55] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 16, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <div
        className="absolute bottom-[-12rem] right-[-12rem] h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(120,130,150,0.05), transparent 70%)"
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% -8%, transparent 52%, rgba(0,0,0,0.55))"
        }}
      />
    </div>
  );
}
