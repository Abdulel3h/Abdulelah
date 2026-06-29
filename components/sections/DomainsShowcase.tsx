"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const domains = [
  {
    label: "Education",
    blurb:
      "Academic assistants and learning tools built around how an institution actually works — not generic answers."
  },
  {
    label: "Sustainability",
    blurb:
      "Planning tools for heat, shade, and city comfort — cooling streets without raising the energy bill."
  },
  {
    label: "Digital security",
    blurb:
      "Behavioural analytics that read patterns and predict risk before an incident ever happens."
  },
  {
    label: "Legal",
    blurb:
      "AI advisors that turn rights, contracts, and procedures into language an ordinary person can act on."
  },
  {
    label: "Fintech",
    blurb:
      "Inclusive banking — insight and guidance designed for the people usually left out of the system."
  },
  {
    label: "Immersive learning",
    blurb:
      "VR and AI experiences that make abstract, hard-to-picture ideas genuinely memorable."
  },
  {
    label: "Cloud & AI systems",
    blurb:
      "The connective tissue — NLP, LLMs, and cloud services wired together into products that ship."
  }
];

export function DomainsShowcase() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap gap-x-7 gap-y-2.5">
        {domains.map((domain, index) => (
          <button
            key={domain.label}
            type="button"
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            className={cn(
              "focus-ring rounded-md font-display text-2xl font-medium leading-snug transition-colors duration-300 sm:text-3xl lg:text-[2.6rem]",
              index === active
                ? "text-paper"
                : "text-paper/25 hover:text-paper/60"
            )}
          >
            {domain.label}
          </button>
        ))}
      </div>

      <div className="mt-8 h-px w-full bg-white/[0.08]" />

      <div className="mt-6 min-h-[3.5rem]">
        <motion.p
          key={active}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: ease.out }}
          className="max-w-xl text-base leading-7 text-paper-dim"
        >
          {domains[active].blurb}
        </motion.p>
      </div>
    </div>
  );
}
