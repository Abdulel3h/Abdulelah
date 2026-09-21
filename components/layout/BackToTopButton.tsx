"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * Sits in the inline-start corner; the guide's launcher owns the inline-end
 * corner, so the two can never collide in either direction.
 */
export function BackToTopButton() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      setVisible(window.scrollY > 720);
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t.common.backToTop}
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
      className={cn(
        "focus-ring fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] start-4 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/[0.12] bg-ink-900/90 text-accent shadow-glow backdrop-blur-md transition duration-300 hover:border-accent/50 sm:start-5",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
