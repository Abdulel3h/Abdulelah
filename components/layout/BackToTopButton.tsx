"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTopButton() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return scrollY.on("change", (latest) => setVisible(latest > 640));
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          className="focus-ring fixed bottom-20 right-5 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-ink-900/80 text-accent shadow-glow backdrop-blur-xl transition hover:border-accent/45"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
