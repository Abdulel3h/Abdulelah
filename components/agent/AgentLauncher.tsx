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
    className="focus-ring group fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/35 bg-slate-950/88 p-0 text-sm font-semibold text-white shadow-[0_18px_64px_rgba(15,23,42,0.5),0_0_34px_rgba(201,168,76,0.18)] backdrop-blur-2xl transition hover:border-gold/65 hover:bg-slate-900/95 sm:bottom-5 sm:right-5 sm:h-auto sm:w-auto sm:justify-start sm:gap-3 sm:px-4 sm:py-3"
  >
    <span className="relative grid h-10 w-10 place-items-center rounded-full border border-sky-300/30 bg-sky-300/10 text-sky-100 shadow-glow">
      <Bot className="h-5 w-5" aria-hidden="true" />
      <Sparkles
        className="absolute -right-1 -top-1 h-3.5 w-3.5 text-amber-200 transition group-hover:scale-110"
        aria-hidden="true"
      />
    </span>
    <span className="hidden pr-1 text-amber-100 sm:inline">
      Agent Abdulelah
    </span>
  </button>
));

AgentLauncher.displayName = "AgentLauncher";
