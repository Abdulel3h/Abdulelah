"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Domain = { label: string; blurb: string; href: string };

// Layout effects place the marker before paint; on the server they are skipped.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Domain "spotlight". Hover, focus, click and tap all select a domain, and
 * the selected one is marked by weight and an underline — not colour alone.
 * Every blurb is reachable without hover and links to its case study.
 *
 * Once the client runs (and motion is allowed), one brass marker takes over
 * from the underline and travels to each newly selected domain, across
 * wrapped lines too; the blurb settles in after a visitor's change — never on
 * the first render.
 */
export function DomainsShowcase({ domains, exploreLabel }: { domains: Domain[]; exploreLabel: string }) {
  const [active, setActive] = useState(0);
  const [changed, setChanged] = useState(false);
  const panelId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const markerRef = useRef<HTMLLIElement>(null);
  const current = domains[active];

  function select(index: number) {
    if (index === active) return;

    setChanged(true);
    setActive(index);
  }

  // Moves the marker under the selected button. `animate: false` snaps it
  // there (first placement and layout changes); a selection glides.
  const place = useCallback((animate: boolean) => {
    const list = listRef.current;
    const marker = markerRef.current;
    const button = list?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');

    if (!list || !marker || !button) return;

    if (!animate) marker.style.transition = "none";

    marker.style.width = `${button.offsetWidth}px`;
    marker.style.transform = `translate3d(${button.offsetLeft}px, ${button.offsetTop + button.offsetHeight - 3}px, 0)`;

    if (!animate) {
      void marker.offsetWidth;
      marker.style.transition = "";
    }

    list.dataset.indicator = "on";
  }, []);

  useIsomorphicLayoutEffect(() => {
    place(listRef.current?.dataset.indicator === "on");
  }, [active, place]);

  useEffect(() => {
    const list = listRef.current;

    if (!list) return;

    let cancelled = false;
    const snap = () => {
      if (!cancelled) place(false);
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(snap);

    if (observer) {
      observer.observe(list);
      list.querySelectorAll("button").forEach((button) => observer.observe(button));
    }

    document.fonts?.ready.then(snap);

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [place]);

  return (
    <div>
      <ul ref={listRef} className="relative flex flex-wrap gap-x-6 gap-y-1.5">
        {domains.map((domain, index) => {
          const selected = index === active;

          return (
            <li key={domain.label}>
              <button
                type="button"
                onMouseEnter={() => select(index)}
                onFocus={() => select(index)}
                onClick={() => select(index)}
                aria-pressed={selected}
                aria-controls={panelId}
                className={cn(
                  "focus-ring rounded-md py-1 font-display text-2xl font-medium leading-snug underline-offset-8 transition-colors duration-300 sm:text-3xl lg:text-[2.5rem]",
                  selected
                    ? "text-paper underline decoration-accent decoration-2"
                    : "text-paper/60 hover:text-paper/85"
                )}
              >
                {domain.label}
              </button>
            </li>
          );
        })}
        {/* A list item (not a span) keeps the <ul> valid; hidden from assistive tech. */}
        <li ref={markerRef} aria-hidden="true" className="domain-indicator" />
      </ul>

      <div className="mt-8 h-px w-full bg-white/[0.08]" />

      <div id={panelId} aria-live="polite" className="mt-6 min-h-[5.5rem]">
        <div key={active} className={changed ? "panel-swap" : undefined}>
          <p className="max-w-xl text-base leading-7 text-paper-dim">{current.blurb}</p>
          <Link
            href={current.href}
            className="focus-ring group mt-3 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-accent-soft transition hover:text-accent"
          >
            {exploreLabel}
            <span className="sr-only">: {current.label}</span>
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
