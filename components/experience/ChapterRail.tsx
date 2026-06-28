"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type Chapter = { id: string; label: string };

/**
 * A quiet editorial chapter index. It turns the page into a book: a thin set of
 * ticks on the left that light as you move through each chapter, with the active
 * chapter's name revealed. Click to turn to a chapter. Desktop-only; smaller
 * screens read the same story top-to-bottom.
 */
export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

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
    if (element)
      element.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start"
      });
  }

  return (
    <nav
      aria-label="Chapters"
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col gap-0.5">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === active;

          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => jump(chapter.id)}
                aria-current={isActive ? "true" : undefined}
                className="focus-ring group flex items-center gap-3 rounded py-1.5"
              >
                <span
                  className={cn(
                    "block h-px origin-left transition-all duration-500 ease-out",
                    isActive
                      ? "w-9 bg-accent"
                      : "w-4 bg-paper/25 group-hover:w-6 group-hover:bg-paper/50"
                  )}
                />
                <span
                  className={cn(
                    "text-[0.6rem] font-medium tabular-nums tracking-[0.15em] transition-colors duration-500",
                    isActive ? "text-accent" : "text-paper-faint group-hover:text-paper-dim"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="-translate-x-1 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.2em] text-paper opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
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
