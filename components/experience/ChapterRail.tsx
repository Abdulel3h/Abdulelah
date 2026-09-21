"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type Chapter = { id: string; label: string };

/**
 * A quiet editorial chapter index on very wide screens: a thin set of ticks
 * at the inline-start edge that light as you move through each chapter. The
 * chapter name shows on hover or keyboard focus. Smaller screens simply read
 * the page top to bottom.
 */
export function ChapterRail({ chapters, label }: { chapters: Chapter[]; label: string }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  function jump(id: string) {
    const element = document.getElementById(id);

    if (!element) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    element.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav aria-label={label} className="fixed start-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block">
      <ol className="flex flex-col gap-0.5">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === active;

          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => jump(chapter.id)}
                aria-current={isActive ? "location" : undefined}
                className="focus-ring group flex min-h-8 items-center gap-3 rounded py-1.5"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-px transition-all duration-500 ease-out",
                    isActive ? "w-9 bg-accent" : "w-4 bg-paper/40 group-hover:w-6 group-hover:bg-paper/70"
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-[0.65rem] font-medium tabular-nums tracking-[0.15em] transition-colors duration-500",
                    isActive ? "text-accent" : "text-paper-dim group-hover:text-paper"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="whitespace-nowrap text-[0.65rem] uppercase tracking-[0.18em] text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {chapter.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
