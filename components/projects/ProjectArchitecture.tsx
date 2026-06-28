"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Database, Cpu, Lightbulb, LayoutDashboard } from "lucide-react";
import { Fragment } from "react";

const stageIcons = [Database, Cpu, Lightbulb, LayoutDashboard];
const stageLabels = ["Source", "Processing", "Intelligence", "Experience"];

/**
 * An interactive pipeline of a project's real flow (data → intelligence →
 * experience). Nodes reveal in sequence on scroll and lift on hover. Static and
 * legible under reduced motion.
 */
export function ProjectArchitecture({ steps }: { steps: string[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
      {steps.map((step, index) => {
        const Icon = stageIcons[Math.min(index, stageIcons.length - 1)];
        const stage = stageLabels[Math.min(index, stageLabels.length - 1)];

        return (
          <Fragment key={step}>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative flex flex-1 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-accent/30 hover:bg-accent/[0.04]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent transition-colors group-hover:border-accent/45">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-paper-faint">
                  {stage}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm font-medium leading-6 text-paper">
                {step}
              </p>
              <span className="mt-3 font-display text-sm text-accent/70">
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>

            {index < steps.length - 1 ? (
              <div
                className="flex items-center justify-center text-accent/45"
                aria-hidden="true"
              >
                <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
