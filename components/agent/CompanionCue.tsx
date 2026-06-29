"use client";

import { ArrowUpRight } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { openCompanion } from "@/lib/agent/companion";

/**
 * A quiet, inline invitation from Abdulelah's guide — placed at natural moments
 * in the reading. It waits in the margin of the content; if it's useful, one tap
 * opens the companion already asking the right question. Never a popup.
 */
export function CompanionCue({
  title,
  body,
  prompt,
  cta = "Ask",
  send = true
}: {
  title: string;
  body?: string;
  prompt: string;
  cta?: string;
  send?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => openCompanion({ prompt, send })}
      className="focus-ring group flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-left transition hover:border-accent/30 hover:bg-accent/[0.04]"
    >
      <Monogram className="h-5 w-auto shrink-0 text-accent transition-colors group-hover:text-accent-soft" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-paper">{title}</span>
        {body ? (
          <span className="mt-0.5 block text-sm leading-6 text-paper-dim">{body}</span>
        ) : null}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent-soft">
        {cta}
        <ArrowUpRight
          className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
