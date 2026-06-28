"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Languages } from "lucide-react";
import { useBlogLanguage } from "@/components/blog/BlogLanguageProvider";
import { cn } from "@/lib/utils";
import type { BlogLanguage } from "@/data/blog.ar";

const options: { value: BlogLanguage; label: string }[] = [
  { value: "ar", label: "عربي" },
  { value: "en", label: "EN" }
];

export function BlogLanguageToggle() {
  const { language, setLanguage } = useBlogLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label="Blog language / لغة المدونة"
      className="fixed bottom-5 left-4 z-40 flex items-center gap-1 rounded-full border border-white/10 bg-ink-900/85 p-1.5 shadow-[0_14px_44px_rgba(10,10,11,0.5),0_0_26px_rgba(201,167,92,0.10)] backdrop-blur-2xl sm:bottom-auto sm:left-4 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col"
    >
      <span
        className="grid h-8 w-8 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent"
        aria-hidden="true"
      >
        <Languages className="h-4 w-4" />
      </span>
      {options.map((option) => {
        const isActive = language === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            aria-pressed={isActive}
            aria-label={
              option.value === "ar"
                ? "عرض المدونة بالعربية"
                : "Show the blog in English"
            }
            className={cn(
              "focus-ring relative grid h-9 min-w-11 place-items-center rounded-full px-2 text-xs font-semibold transition",
              option.value === "ar" && "blog-arabic",
              isActive ? "text-accent" : "text-paper-dim hover:text-paper"
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="blog-language-pill"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 480, damping: 38 }
                }
                className="absolute inset-0 rounded-full border border-accent/35 bg-accent/15"
                aria-hidden="true"
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
