"use client";

import { ArrowUpRight } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { openCompanion } from "@/lib/agent/companion";

/**
 * A quiet, inline invitation from Abdulelah's guide, placed at natural
 * moments in the reading. One tap opens the guide already asking the right
 * question; closing the guide returns focus here.
 */
export function CompanionCue({
  title,
  body,
  prompt,
  cta,
  send = true
}: {
  title: string;
  body?: string;
  prompt: string;
  cta: string;
  send?: boolean;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => openCompanion({ prompt, send, returnFocusTo: event.currentTarget })}
      className="focus-ring group flex w-full items-center gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.02] px-5 py-4 text-start transition hover:border-accent/35 hover:bg-accent/[0.04]"
    >
      <Monogram className="h-5 w-auto shrink-0 text-accent transition-colors group-hover:text-accent-soft" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-paper">{title}</span>
        {body ? <span className="mt-0.5 block text-sm leading-6 text-paper-dim">{body}</span> : null}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent-soft">
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
      </span>
    </button>
  );
}
