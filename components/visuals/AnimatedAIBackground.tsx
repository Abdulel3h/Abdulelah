"use client";

import { motion, useReducedMotion } from "framer-motion";

const nodes = [
  { left: "9%", top: "18%", delay: 0, size: "h-1.5 w-1.5" },
  { left: "22%", top: "72%", delay: 0.8, size: "h-2 w-2" },
  { left: "42%", top: "14%", delay: 1.2, size: "h-1.5 w-1.5" },
  { left: "64%", top: "28%", delay: 0.4, size: "h-2 w-2" },
  { left: "82%", top: "64%", delay: 1.6, size: "h-1.5 w-1.5" },
  { left: "74%", top: "10%", delay: 2, size: "h-2.5 w-2.5" },
  { left: "15%", top: "44%", delay: 1.4, size: "h-1.5 w-1.5" },
  { left: "52%", top: "82%", delay: 0.6, size: "h-2 w-2" }
];

const lines = [
  "left-[8%] top-[23%] w-[28vw] rotate-[18deg]",
  "left-[24%] top-[67%] w-[33vw] -rotate-[13deg]",
  "right-[8%] top-[34%] w-[24vw] rotate-[143deg]",
  "right-[16%] top-[72%] w-[30vw] rotate-[23deg]"
];

export function AnimatedAIBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030712]">
      <div className="page-grid absolute inset-0 opacity-90" />
      <div className="absolute left-1/2 top-[-12rem] h-[32rem] w-[44rem] -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute right-[-10rem] top-1/4 h-[26rem] w-[26rem] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-[-12rem] left-[8%] h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" />

      {lines.map((line) => (
        <motion.span
          key={line}
          className={`absolute h-px origin-left bg-gradient-to-r from-transparent via-sky-300/25 to-transparent ${line}`}
          initial={reduceMotion ? false : { opacity: 0.16, scaleX: 0.75 }}
          animate={
            reduceMotion
              ? { opacity: 0.2, scaleX: 0.86 }
              : { opacity: [0.12, 0.32, 0.12], scaleX: [0.72, 1, 0.72] }
          }
          transition={reduceMotion ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {nodes.map((node) => (
        <motion.span
          key={`${node.left}-${node.top}`}
          className={`absolute ${node.size} rounded-full bg-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.75)]`}
          style={{ left: node.left, top: node.top }}
          animate={reduceMotion ? { opacity: 0.5, y: 0 } : { opacity: [0.22, 0.9, 0.22], y: [0, -10, 0] }}
          transition={{
            duration: reduceMotion ? 0 : 4.8,
            delay: node.delay,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <motion.div
        className="scanline absolute -inset-x-1/3 top-0 h-full opacity-80"
        animate={reduceMotion ? { x: 0 } : { x: ["-14%", "14%", "-14%"] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.12),rgba(3,7,18,0.82)_76%,#030712)]" />
    </div>
  );
}
