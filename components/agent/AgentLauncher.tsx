"use client";

import { Bot, Sparkles } from "lucide-react";
import { forwardRef } from "react";

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
    aria-label="Open Agent Abdulelah"
    className="focus-ring group fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full border border-accent/35 bg-ink-900/88 px-4 py-3 text-sm font-semibold text-paper shadow-[0_18px_64px_rgba(20,20,22,0.5),0_0_34px_rgba(201,167,92,0.18)] backdrop-blur-2xl transition hover:border-accent/65 hover:bg-ink-800/95"
  >
    <span className="relative grid h-10 w-10 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent shadow-glow">
      <Bot className="h-5 w-5" aria-hidden="true" />
      <Sparkles
        className="absolute -right-1 -top-1 h-3.5 w-3.5 text-accent-soft transition group-hover:scale-110"
        aria-hidden="true"
      />
    </span>
    <span className="pr-1 text-accent-soft">
      Agent Abdulelah
    </span>
  </button>
));

AgentLauncher.displayName = "AgentLauncher";
