import type { CSSProperties } from "react";
import { directional } from "@/components/site/primitives";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// Each arrow lights just before the step it points to.
const arrowOffset = { "--beat-offset": "-0.18s" } as CSSProperties;

/**
 * A project's workflow as one line of text in the reading direction, each
 * step joined by a forward arrow — not a row of pills. Inside a
 * <PipelineStage> the travelling signal lights each step on its beat, in step
 * with the project's sketch.
 */
export function Flow({
  steps,
  label,
  locale,
  className
}: {
  steps: string[];
  label: string;
  locale: Locale;
  className?: string;
}) {
  const { Forward } = directional(locale);

  return (
    <ol aria-label={label} className={cn("ds-small flex flex-wrap items-center gap-x-2 gap-y-1 text-paper-dim", className)}>
      {steps.map((step, index) => {
        const beat = Math.min(index + 1, 4);

        return (
          <li key={step} className="flex items-center gap-2">
            {index > 0 ? (
              <Forward
                data-beat={beat}
                style={arrowOffset}
                className="beat-text h-3.5 w-3.5 shrink-0 text-accent/70"
                aria-hidden="true"
              />
            ) : null}
            <span data-beat={beat} className="beat-text-strong">
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
