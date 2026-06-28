import type { ReactNode } from "react";

/**
 * A small, authentic note in Abdulelah's voice, surfaced beside the work.
 * Only ever used with real, authored content (project lessons, reflections) —
 * never invented.
 */
export function FieldNote({
  label = "A note from Abdulelah",
  children
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <figure className="max-w-2xl border-l border-accent/40 pl-6">
      <figcaption className="text-[0.64rem] font-medium uppercase tracking-[0.2em] text-accent">
        {label}
      </figcaption>
      <blockquote className="mt-3 font-display text-xl italic leading-relaxed text-paper sm:text-2xl">
        {children}
      </blockquote>
    </figure>
  );
}
