import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// The arrow lights just before the step it points to.
const arrowOffset = { "--beat-offset": "-0.18s" } as CSSProperties;

/**
 * A project's workflow as a compact, ordered row of steps. Inside a
 * <PipelineStage> the signal lights each step on its beat, in step with the
 * project's sketch.
 */
export function FlowSteps({ steps, label, className }: { steps: string[]; label: string; className?: string }) {
  return (
    <ol aria-label={label} className={cn("flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-paper-dim", className)}>
      {steps.map((step, index) => {
        const beat = Math.min(index + 1, 4);

        return (
          <li key={step} className="flex items-center gap-2">
            {index > 0 ? (
              <ArrowRight
                data-beat={beat}
                style={arrowOffset}
                className="beat-text h-3 w-3 text-accent/70 rtl:-scale-x-100"
                aria-hidden="true"
              />
            ) : null}
            <span data-beat={beat} className="beat-glow beat-text rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1">
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
