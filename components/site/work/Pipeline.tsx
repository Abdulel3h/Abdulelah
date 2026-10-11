import { PipelineStage } from "@/components/motion/PipelineStage";
import { Latin, pad } from "@/components/site/primitives";

/**
 * How the project works, drawn as four stations on one line that runs in the
 * reading direction, or down the inline start on a phone. The travelling
 * signal passes along the line and lights each station on its beat. Static,
 * ordered and readable without any motion.
 */
export function Pipeline({ steps, stages, label }: { steps: string[]; stages: string[]; label: string }) {
  return (
    <PipelineStage threshold={0.45} className="relative">
      {/* The line the signal runs along sits beside the list, not in it. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-[0.4rem] hidden h-px bg-white/[0.12] md:block" />
      <span aria-hidden="true" data-beat="1" className="beat-rule absolute inset-x-0 top-[0.4rem] hidden md:block" />
      <ol
        aria-label={label}
        className="relative grid gap-0 border-s border-white/[0.12] ps-7 md:grid-cols-4 md:border-s-0 md:ps-0"
      >
        {steps.map((step, index) => {
          const beat = Math.min(index + 1, 4);

          return (
            <li key={step} className="relative pb-8 last:pb-0 md:pb-0 md:pe-6 md:pt-9">
              <span
                aria-hidden="true"
                data-beat={beat}
                className="beat-ring absolute -start-[2.06rem] top-1.5 h-2.5 w-2.5 rounded-full border border-accent bg-ink-900 md:start-0 md:top-0"
              />
              <p className="ds-micro flex items-center gap-2 text-paper-faint">
                <Latin className="text-accent">{pad(index + 1)}</Latin>
                <span>{stages[Math.min(index, stages.length - 1)]}</span>
              </p>
              <p data-beat={beat} className="beat-text-strong ds-text mt-2 text-[1.08rem] font-medium text-paper">
                {step}
              </p>
            </li>
          );
        })}
      </ol>
    </PipelineStage>
  );
}
