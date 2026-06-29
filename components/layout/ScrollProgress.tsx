"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 24,
    mass: 0.25
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[70] h-px w-full origin-left bg-gradient-to-r from-accent via-accent to-accent"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
