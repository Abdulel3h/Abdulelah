"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * A calm, editorial backdrop whose light evolves with the journey: a single warm
 * wash drifts down the page as the visitor scrolls, with a faint cool
 * counter-light for depth. No particles, scanlines, or grids — paper and ink,
 * with the room lighting subtly changing from chapter to chapter.
 */
export function AnimatedAIBackground() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const warmY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const warmOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.62]);
  const coolY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0b]"
    >
      <div className="absolute left-1/2 top-[-26rem] h-[46rem] w-[64rem] -translate-x-1/2">
        <motion.div
          className="h-full w-full rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(201,167,92,0.10), transparent 72%)",
            ...(reduce ? {} : { y: warmY, opacity: warmOpacity })
          }}
        />
      </div>

      <motion.div
        className="absolute bottom-[-12rem] right-[-12rem] h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(120,130,150,0.05), transparent 70%)",
          ...(reduce ? {} : { y: coolY })
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
