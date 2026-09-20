"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

const backPath =
  "M116 610C36 486 52 256 178 126C274 28 421 52 482 165C530 255 483 348 382 374";
const frontPath =
  "M552 128C628 275 607 493 488 630C386 747 222 704 171 579C133 486 193 411 292 385";

type NeuralOrbitProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The portfolio's signature sculpture brought into the product: two inflated,
 * translucent forms exchange a signal around one shared core. The portrait is
 * intentionally placed between the rear and front ribbons so the effect has
 * real spatial depth without obscuring the face.
 */
export function NeuralOrbit({ children, className }: NeuralOrbitProps) {
  const reduce = useReducedMotion();
  const rawId = useId().replace(/:/g, "");
  const backGradient = `${rawId}-back-gradient`;
  const frontGradient = `${rawId}-front-gradient`;
  const coreGradient = `${rawId}-core-gradient`;
  const glow = `${rawId}-glow`;

  const draw = (delay: number, opacity = 1) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity },
          transition: { duration: 1.55, delay, ease: ease.out }
        };

  return (
    <div className={cn("relative isolate aspect-[16/19] w-full", className)}>
      <div
        aria-hidden="true"
        className="absolute inset-[8%] -z-20 rounded-full bg-[#22e3c5]/10 blur-[72px]"
      />

      <motion.svg
        viewBox="0 0 640 760"
        className="pointer-events-none absolute -inset-[13%] z-0 h-[126%] w-[126%] overflow-visible"
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : { rotate: [-0.8, 0.8, -0.8], y: [0, -5, 0] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id={backGradient} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#22E3C5" stopOpacity="0.86" />
            <stop offset="0.5" stopColor="#3B65FF" stopOpacity="0.72" />
            <stop offset="1" stopColor="#15336F" stopOpacity="0.78" />
          </linearGradient>
          <filter id={glow} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        <motion.path
          d={backPath}
          fill="none"
          stroke="#22E3C5"
          strokeWidth="88"
          strokeLinecap="round"
          opacity="0.12"
          filter={`url(#${glow})`}
          {...draw(0.08, 0.12)}
        />
        <motion.path
          d={backPath}
          fill="none"
          stroke={`url(#${backGradient})`}
          strokeWidth="66"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...draw(0.08)}
        />
        <motion.path
          d={backPath}
          fill="none"
          stroke="#F2FFFC"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.18"
          transform="translate(-7 -8)"
          {...draw(0.2, 0.18)}
        />

        {!reduce ? (
          <motion.circle
            r="7"
            fill="#46F6FF"
            filter={`url(#${glow})`}
            animate={{
              cx: [116, 74, 96, 178, 300, 421, 482, 500, 462, 382],
              cy: [610, 500, 290, 126, 55, 52, 165, 255, 330, 374],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
            }}
            transition={{ duration: 5.8, delay: 2.2, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </motion.svg>

      <div className="absolute inset-[7%_12%_9%_13%] z-10">{children}</div>

      <motion.svg
        viewBox="0 0 640 760"
        className="pointer-events-none absolute -inset-[13%] z-20 h-[126%] w-[126%] overflow-visible"
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : { rotate: [0.7, -0.7, 0.7], y: [0, 4, 0] }
        }
        transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id={frontGradient} x1="0" y1="0" x2="0.85" y2="1">
            <stop stopColor="#E8FBFF" />
            <stop offset="0.18" stopColor="#46F6FF" />
            <stop offset="0.52" stopColor="#22E3C5" />
            <stop offset="0.78" stopColor="#C8FF54" />
            <stop offset="1" stopColor="#3B65FF" />
          </linearGradient>
          <radialGradient id={coreGradient} cx="34%" cy="28%" r="72%">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.18" stopColor="#C8FF54" />
            <stop offset="0.56" stopColor="#22E3C5" />
            <stop offset="1" stopColor="#3B65FF" />
          </radialGradient>
          <filter id={`${glow}-front`} x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        <motion.path
          d={frontPath}
          fill="none"
          stroke="#46F6FF"
          strokeWidth="86"
          strokeLinecap="round"
          opacity="0.13"
          filter={`url(#${glow}-front)`}
          {...draw(0.34, 0.13)}
        />
        <motion.path
          d={frontPath}
          fill="none"
          stroke={`url(#${frontGradient})`}
          strokeWidth="62"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.92"
          {...draw(0.34, 0.92)}
        />
        <motion.path
          d={frontPath}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.22"
          transform="translate(-7 -8)"
          {...draw(0.48, 0.22)}
        />

        <motion.g
          initial={reduce ? false : { scale: 0.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.85, delay: reduce ? 0 : 1.45, ease: ease.out }}
          style={{ transformOrigin: "488px 630px" }}
        >
          <circle
            cx="488"
            cy="630"
            r="60"
            fill="#22E3C5"
            opacity="0.24"
            filter={`url(#${glow}-front)`}
          />
          <circle cx="488" cy="630" r="34" fill={`url(#${coreGradient})`} />
          <circle cx="477" cy="619" r="8" fill="#FFFFFF" opacity="0.62" />
          <circle cx="488" cy="630" r="43" fill="none" stroke="#E8FBFF" strokeOpacity="0.22" />
        </motion.g>

        {!reduce ? (
          <motion.circle
            r="6.5"
            fill="#C8FF54"
            filter={`url(#${glow}-front)`}
            animate={{
              cx: [552, 610, 607, 560, 488, 370, 240, 171, 150, 196, 292],
              cy: [128, 270, 425, 555, 630, 700, 680, 579, 500, 420, 385],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
            }}
            transition={{ duration: 6.2, delay: 2.85, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </motion.svg>

      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: reduce ? 0 : 1.85, ease: ease.out }}
        className="absolute -bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#040b09]/85 px-3 py-2 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#8fa8a1] shadow-2xl backdrop-blur-xl sm:gap-3 sm:px-4 sm:text-[0.6rem]"
      >
        {[
          ["Think", "#46F6FF"],
          ["Connect", "#22E3C5"],
          ["Act", "#C8FF54"],
          ["Verify", "#7B96FF"]
        ].map(([label, color], index) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <motion.span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: color }}
              animate={
                reduce
                  ? undefined
                  : { opacity: [0.28, 1, 0.28], scale: [0.8, 1.35, 0.8] }
              }
              transition={{ duration: 2.8, delay: index * 0.55, repeat: Infinity }}
            />
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * A foreground signal that briefly crosses the surname before joining the
 * sculpture. It creates the requested behind/in-front typography interaction
 * while keeping the word readable and the rest of the page calm.
 */
export function NeuralSignalBridge() {
  const reduce = useReducedMotion();
  const rawId = useId().replace(/:/g, "");
  const gradient = `${rawId}-bridge-gradient`;
  const blur = `${rawId}-bridge-blur`;
  const path = "M535 354C628 315 689 340 749 395C799 441 857 451 952 411";

  return (
    <svg
      viewBox="0 0 1280 760"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-30 hidden h-full w-full overflow-visible lg:block"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#22E3C5" stopOpacity="0" />
          <stop offset="0.22" stopColor="#46F6FF" />
          <stop offset="0.58" stopColor="#C8FF54" />
          <stop offset="1" stopColor="#22E3C5" stopOpacity="0.18" />
        </linearGradient>
        <filter id={blur} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke="#22E3C5"
        strokeWidth="34"
        strokeLinecap="round"
        opacity="0.12"
        filter={`url(#${blur})`}
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.12 }}
        transition={{ duration: 1.2, delay: reduce ? 0 : 1.2, ease: ease.out }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={`url(#${gradient})`}
        strokeWidth="18"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.74 }}
        transition={{ duration: 1.2, delay: reduce ? 0 : 1.2, ease: ease.out }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.32"
        transform="translate(0 -4)"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.15, delay: reduce ? 0 : 1.34, ease: ease.out }}
      />
      {!reduce ? (
        <motion.circle
          r="5"
          fill="#F4FFF9"
          filter={`url(#${blur})`}
          animate={{
            cx: [535, 625, 710, 790, 875, 952],
            cy: [354, 326, 360, 430, 443, 411],
            opacity: [0, 1, 1, 1, 1, 0]
          }}
          transition={{ duration: 3.8, delay: 2.5, repeat: Infinity, ease: "linear" }}
        />
      ) : null}
    </svg>
  );
}
