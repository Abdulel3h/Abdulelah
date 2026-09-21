"use client";

import { useEffect, useRef } from "react";

// Every state of the word-by-word reveal stays readable: words start at the
// "faint" paper tone (≈5.4:1 on ink — it used to start near 1.6:1) and warm up
// to full paper as the statement scrolls through the viewport. The server
// renders the finished state, so the text is always legible without script.
const FROM = [142, 137, 127];
const TO = [242, 239, 231];

export function PhilosophyReveal({ eyebrow, statement }: { eyebrow: string; statement: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const words = statement.split(" ");

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(section.querySelectorAll<HTMLSpanElement>("[data-word]"));
    const last = new Array<number>(spans.length).fill(-1);
    let frame = 0;

    function update() {
      frame = 0;

      const rect = section!.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the top reaches 85% of the viewport, 1 when the bottom reaches 50%.
      const start = viewport * 0.85;
      const end = viewport * 0.5 - rect.height;
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
      const count = spans.length;

      spans.forEach((span, index) => {
        const t = Math.min(Math.max((progress - index / count) / (1.5 / count), 0), 1);
        const step = Math.round(t * 20);

        if (step === last[index]) return;

        last[index] = step;

        const mix = step / 20;

        span.style.color = `rgb(${FROM.map((from, channel) => Math.round(from + (TO[channel] - from) * mix)).join(",")})`;
      });
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [statement]);

  return (
    <section ref={sectionRef} className="container-shell py-28 sm:py-36 lg:py-44" aria-labelledby="belief-title">
      <h2 id="belief-title" className="eyebrow mb-10">
        {eyebrow}
      </h2>
      <p className="max-w-4xl font-display text-2xl font-medium leading-[1.4] tracking-[-0.01em] text-paper sm:text-3xl lg:text-[2.7rem] lg:leading-[1.3]">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} data-word>
            {word}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
