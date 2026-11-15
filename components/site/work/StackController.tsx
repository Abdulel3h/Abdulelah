"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Below this viewport height there is no room for a stack; the list stays a column. */
const MIN_VIEWPORT = 560;

/** Screens where the cards stack (the same breakpoint as the cards' two-column layout). */
const WIDE = "(min-width: 64rem)";

/**
 * Turns the list of chapters into a stack: each card sticks a step lower
 * than the one before, and the card beneath recedes as the next covers it.
 *
 * - Each card's sticking point is measured, so a card taller than the screen
 *   sticks by its end: everything on it scrolls past before it is covered.
 * - Stacking only switches on ([data-armed]) after that measurement; without
 *   JavaScript, on short screens and before hydration the list is a column.
 * - When focus moves into a covered card (Shift+Tab back up the page), the
 *   page scrolls that card back to the top of the stack, so a focused link is
 *   never hidden beneath another card.
 * - One passive scroll listener, batched to a frame: reads first, then writes.
 *   It writes `top`, `transform` and the shade's `opacity` directly, and only
 *   when they change. Never a custom property: those inherit, so one write
 *   would restyle every element inside the card.
 * - It arms only when the stack comes near the screen, so the page's load
 *   never pays for it.
 */
export function StackController({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;

    if (!list) return;

    const cards = Array.from(list.children) as HTMLElement[];
    const shades = cards.map((card) => card.querySelector<HTMLElement>(".stack-shade"));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let heights: number[] = [];
    let sticks: number[] = [];
    let progress: number[] = [];
    let frame = 0;
    let armed = false;

    function disarm() {
      armed = false;
      delete list!.dataset.armed;
      cards.forEach((card, index) => {
        card.style.removeProperty("top");
        card.style.removeProperty("transform");
        shades[index]?.style.removeProperty("opacity");
      });
      progress = [];
    }

    function update() {
      frame = 0;

      if (!armed) return;

      const tops = cards.map((card) => card.getBoundingClientRect().top);

      cards.forEach((card, index) => {
        const next = tops[index + 1];
        // The card scales from its top edge, so its rect top is exact; its
        // bottom is measured from the unscaled height.
        const overlap = next === undefined ? 0 : tops[index] + heights[index] - next;
        const value = Math.round(Math.min(1, Math.max(0, overlap / heights[index])) * 200) / 200;

        if (value === progress[index]) return;

        progress[index] = value;
        // Under reduced motion the card holds still; only the shade deepens.
        card.style.transform = still.matches || value === 0 ? "" : `scale(${(1 - value * 0.045).toFixed(4)})`;
        shades[index]?.style.setProperty("opacity", (value * 0.62).toFixed(3));
      });
    }

    function measure() {
      const viewport = window.innerHeight;

      if (viewport < MIN_VIEWPORT || cards.length < 2 || !window.matchMedia(WIDE).matches) {
        disarm();
        return;
      }

      const header = document.querySelector<HTMLElement>(".ds-header")?.getBoundingClientRect().height ?? 72;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const step = 0.9 * rem;

      // All reads first, then all writes; the recede is computed on the next
      // frame, so nothing here forces a second layout.
      heights = cards.map((card) => card.offsetHeight);
      sticks = heights.map((height, index) => Math.min(header + 0.75 * rem + index * step, viewport - height - rem));
      cards.forEach((card, index) => {
        card.style.top = `${Math.round(sticks[index])}px`;
      });
      armed = true;
      list!.dataset.armed = "true";
      onScroll();
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    /** At most one measurement per frame, however many cards resized. */
    let pending = 0;

    function scheduleMeasure() {
      if (!pending) {
        pending = window.requestAnimationFrame(() => {
          pending = 0;
          measure();
        });
      }
    }

    function onFocusIn(event: FocusEvent) {
      if (!armed) return;

      const index = cards.findIndex((card) => card.contains(event.target as Node));
      const next = cards[index + 1];

      if (index < 0 || !next) return;

      const top = cards[index].getBoundingClientRect().top;

      if (next.getBoundingClientRect().top >= top + heights[index] - 2) return;

      // Where the card sits in the flow, independent of sticking.
      const gap = parseFloat(getComputedStyle(list!).rowGap) || 0;
      const natural =
        list!.getBoundingClientRect().top +
        window.scrollY +
        heights.slice(0, index).reduce((sum, height) => sum + height + gap, 0);

      window.scrollTo({ top: natural - sticks[index], behavior: "auto" });
    }

    const resize = new ResizeObserver(scheduleMeasure);
    let started = false;
    let cancelled = false;

    // The stack sits below the fold: nothing is measured during the page's
    // load. It arms once it comes within a screen of view, after the web
    // fonts have settled (a late Arabic font would otherwise re-measure).
    function start() {
      if (started || cancelled) return;
      started = true;
      cards.forEach((card) => resize.observe(card));
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", scheduleMeasure);
      list!.addEventListener("focusin", onFocusIn);
    }

    // Arm in idle time, so switching the cards to sticky never lands in the
    // middle of a scroll frame.
    function whenIdle(task: () => void) {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(task, { timeout: 600 });
      else setTimeout(task, 120);
    }

    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        near.disconnect();
        (document.fonts?.ready ?? Promise.resolve()).then(() => whenIdle(start), () => whenIdle(start));
      },
      { rootMargin: "100% 0px" }
    );

    // Only wide screens stack. On a phone or tablet a card is taller than the
    // screen, so it could only stick by its end — a faint effect that would
    // cost the slowest devices a relayout of every card. There, each card's
    // title bar sticks instead (CSS only, see shell.css).
    const wide = window.matchMedia(WIDE);

    function onWideChange() {
      if (wide.matches) {
        if (started) scheduleMeasure();
        else near.observe(list!);
      } else {
        near.disconnect();
        disarm();
      }
    }

    onWideChange();
    wide.addEventListener("change", onWideChange);

    return () => {
      cancelled = true;
      wide.removeEventListener("change", onWideChange);
      near.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleMeasure);
      list.removeEventListener("focusin", onFocusIn);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(pending);
      disarm();
    };
  }, []);

  return (
    <ol ref={ref} className="stack" aria-label={label}>
      {children}
    </ol>
  );
}
