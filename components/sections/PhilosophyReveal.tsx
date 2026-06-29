"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue
} from "framer-motion";
import { useRef } from "react";

const statement =
  "Anyone can add intelligence to a product. The part I care about is making it feel calm, trustworthy, and obvious — so the person on the other side never has to think about the machine at all.";

function Word({
  children,
  progress,
  range
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [
    "rgba(120,116,108,0.4)",
    "rgba(242,239,231,1)"
  ]);

  return (
    <motion.span style={{ color }}>
      {children}
      {" "}
    </motion.span>
  );
}

export function PhilosophyReveal() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"]
  });

  const words = statement.split(" ");

  return (
    <section ref={ref} className="container-shell py-28 sm:py-36 lg:py-44">
      <p className="eyebrow mb-10">What I believe</p>
      <p className="max-w-4xl font-display text-2xl font-medium leading-[1.32] tracking-[-0.01em] sm:text-3xl lg:text-[2.7rem] lg:leading-[1.28]">
        {reduce ? (
          <span className="text-paper">{statement}</span>
        ) : (
          words.map((word, index) => (
            <Word
              key={`${word}-${index}`}
              progress={scrollYProgress}
              range={[index / words.length, (index + 1.5) / words.length]}
            >
              {word}
            </Word>
          ))
        )}
      </p>
    </section>
  );
}
