"use client";

import { forwardRef } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { cn } from "@/lib/utils";

/**
 * The minimised guide. It owns the inline-end bottom corner (back-to-top owns
 * the inline-start one), respects the safe area, and steps aside on small
 * screens while the visitor is typing into a page form.
 */
export const AgentLauncher = forwardRef<
  HTMLButtonElement,
  {
    label: string;
    ariaLabel: string;
    hidden: boolean;
    compactHidden: boolean;
    onClick: () => void;
    /** Hover/focus/touch: start fetching the dialog before the click lands. */
    onIntent: () => void;
  }
>(({ label, ariaLabel, hidden, compactHidden, onClick, onIntent }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={ariaLabel}
    aria-haspopup="dialog"
    tabIndex={hidden ? -1 : undefined}
    onClick={onClick}
    onPointerEnter={onIntent}
    onFocus={onIntent}
    onTouchStart={onIntent}
    className={cn(
      "focus-ring group fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] end-4 z-40 inline-flex h-12 items-center gap-2.5 rounded-full border border-white/[0.14] bg-ink-900/95 px-4 text-sm text-paper shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-accent/50 hover:bg-ink-800 sm:end-5",
      hidden && "invisible opacity-0",
      compactHidden && "max-sm:invisible max-sm:opacity-0"
    )}
  >
    <Monogram className="h-4 w-auto text-accent transition-colors group-hover:text-accent-soft" />
    <span className="font-medium">{label}</span>
  </button>
));

AgentLauncher.displayName = "AgentLauncher";
