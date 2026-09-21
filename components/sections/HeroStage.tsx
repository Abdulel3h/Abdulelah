"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Wraps the (server-rendered) hero with a cursor-following warm light.
 * Purely decorative: mouse-only, disabled under reduced motion, and the
 * content inside is visible whether or not this ever hydrates.
 */
export function HeroStage({ children, className }: { children: ReactNode; className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  function handlePointer(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const light = lightRef.current;

    if (!section || !light) return;

    const rect = section.getBoundingClientRect();

    light.style.setProperty("--px", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    light.style.setProperty("--py", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    light.style.opacity = "1";
  }

  function handleLeave() {
    if (lightRef.current) lightRef.current.style.opacity = "0";
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointer}
      onPointerLeave={handleLeave}
      aria-labelledby="hero-title"
      className={className}
    >
      <div
        ref={lightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(440px circle at var(--px, 50%) var(--py, 50%), rgba(201,167,92,0.10), transparent 62%)"
        }}
      />
      {children}
    </section>
  );
}
