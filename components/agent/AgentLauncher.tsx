"use client";

import { forwardRef } from "react";
import { Monogram } from "@/components/ui/Monogram";

export const AgentLauncher = forwardRef<
  HTMLButtonElement,
  {
    onClick: () => void;
  }
>(({ onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    aria-label="Ask Abdulelah — a guide to the work"
    className="focus-ring group fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-5 z-40 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-ink-900/90 px-4 py-3 text-sm text-paper shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-accent/45 hover:bg-ink-800/90"
  >
    <Monogram className="h-4 w-auto text-accent transition-colors group-hover:text-accent-soft" />
    <span className="font-medium">Ask Abdulelah</span>
  </button>
));

AgentLauncher.displayName = "AgentLauncher";
