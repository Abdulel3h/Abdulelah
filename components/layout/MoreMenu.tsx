"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; active: boolean };

/**
 * "More" navigation as a disclosure (button + list of links) — the pattern
 * recommended for site navigation. Escape closes it and returns focus to the
 * button; clicking outside, tabbing away or navigating also closes it.
 */
export function MoreMenu({ label, listLabel, items }: { label: string; listLabel: string; items: Item[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const anyActive = items.some((item) => item.active);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "focus-ring group relative inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-paper-dim transition hover:text-paper",
          (anyActive || open) && "text-paper"
        )}
      >
        {label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 bg-accent transition-transform group-hover:scale-x-100",
            anyActive && "scale-x-100"
          )}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute end-0 top-full z-50 mt-2 w-60 rounded-2xl border border-white/[0.12] bg-ink-800 p-2 shadow-glow"
      >
        <ul aria-label={listLabel}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "focus-ring flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm text-paper-dim transition hover:bg-white/[0.06] hover:text-paper",
                  item.active && "bg-white/[0.06] text-paper"
                )}
              >
                {item.label}
                {item.active ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
