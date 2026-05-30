"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  Cloud,
  Database,
  GraduationCap,
  Leaf,
  Lock,
  MessageSquareText,
  ShieldCheck
} from "lucide-react";

const nodes = [
  { label: "NLP", icon: BrainCircuit, x: "50%", y: "8%" },
  { label: "LLMs", icon: MessageSquareText, x: "78%", y: "20%" },
  { label: "Cloud", icon: Cloud, x: "84%", y: "54%" },
  { label: "Data", icon: Database, x: "68%", y: "82%" },
  { label: "Security", icon: ShieldCheck, x: "32%", y: "82%" },
  { label: "Education", icon: GraduationCap, x: "16%", y: "54%" },
  { label: "Sustainability", icon: Leaf, x: "22%", y: "20%" }
];

export function AISystemDiagram() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[2rem]">
      <div className="absolute inset-3 rounded-[2rem] border border-white/10 bg-slate-950/45 shadow-glow backdrop-blur-xl" />
      <div className="absolute inset-10 rounded-full border border-sky-300/15" />
      <div className="absolute inset-20 rounded-full border border-violet-300/10" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 520"
        role="img"
        aria-label="Animated AI orbit system diagram"
      >
        <defs>
          <linearGradient id="line-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.65" />
            <stop offset="52%" stopColor="#7C3AED" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <circle cx="260" cy="260" r="154" stroke="url(#line-gradient)" strokeWidth="1" fill="none" strokeDasharray="8 12" />
        <circle cx="260" cy="260" r="98" stroke="url(#line-gradient)" strokeWidth="1" fill="none" strokeDasharray="4 12" />
      </svg>

      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 sm:h-36 sm:w-36">
        <motion.div
          className="grid h-full w-full place-items-center rounded-full border border-sky-300/35 bg-[#06101f]/95 text-center shadow-[0_0_70px_rgba(56,189,248,0.23)]"
          animate={
            reduceMotion
              ? { scale: 1 }
              : {
                  scale: [1, 1.045, 1],
                  boxShadow: [
                    "0 0 45px rgba(56,189,248,0.16)",
                    "0 0 82px rgba(124,58,237,0.24)",
                    "0 0 45px rgba(56,189,248,0.16)"
                  ]
                }
          }
          transition={reduceMotion ? { duration: 0 } : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div>
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-sky-300/15 text-sky-200">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold text-white">AI Core</p>
            <p className="mt-1 text-xs text-slate-400">Context + Trust</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 72, repeat: Infinity, ease: "linear" }}
      >
        {nodes.map((node, index) => {
          const Icon = node.icon;

          return (
            <div
              key={node.label}
              className="absolute w-20 -translate-x-1/2 -translate-y-1/2 sm:w-24"
              style={{ left: node.x, top: node.y }}
            >
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-950/80 p-2 text-center shadow-glow backdrop-blur-xl transition hover:border-sky-300/40 sm:p-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.08, duration: 0.45 }}
              >
                <motion.div
                  animate={reduceMotion ? { rotate: 0 } : { rotate: -360 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 72, repeat: Infinity, ease: "linear" }}
                >
                  <Icon className="mx-auto h-5 w-5 text-sky-200" aria-hidden="true" />
                  <p className="mt-2 text-xs font-semibold text-white">{node.label}</p>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
