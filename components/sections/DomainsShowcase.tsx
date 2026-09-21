"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type Domain = { label: string; blurb: string; href: string };

/**
 * Domain "spotlight". Hover, focus, click and tap all select a domain, and
 * the selected one is marked by weight and an underline — not colour alone.
 * Every blurb is reachable without hover and links to its case study.
 */
export function DomainsShowcase({ domains, exploreLabel }: { domains: Domain[]; exploreLabel: string }) {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const current = domains[active];

  return (
    <div>
      <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
        {domains.map((domain, index) => {
          const selected = index === active;

          return (
            <li key={domain.label}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
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
      </ul>

      <div className="mt-8 h-px w-full bg-white/[0.08]" />

      <div id={panelId} aria-live="polite" className="mt-6 min-h-[5.5rem]">
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
  );
}
