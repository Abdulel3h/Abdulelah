import { ArrowRight, Cpu, Database, LayoutDashboard, Lightbulb } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const stageIcons = [Database, Cpu, Lightbulb, LayoutDashboard];
const stageLabels: Record<Locale, string[]> = {
  en: ["Input", "Processing", "Intelligence", "Output"],
  ar: ["المدخلات", "المعالجة", "الذكاء", "المخرجات"]
};

/**
 * The project's workflow as an ordered list (input → processing →
 * intelligence → output). Static, server-rendered and readable without
 * animation.
 */
export function ProjectArchitecture({ steps, locale, label }: { steps: string[]; locale: Locale; label: string }) {
  return (
    <ol aria-label={label} className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = stageIcons[Math.min(index, stageIcons.length - 1)];
        const stage = stageLabels[locale][Math.min(index, stageLabels[locale].length - 1)];

        return (
          <li key={step} className="flex flex-col gap-3">
            <div className="group relative flex flex-1 flex-col rounded-2xl border border-white/[0.1] bg-white/[0.02] p-5 transition-colors hover:border-accent/30 hover:bg-accent/[0.04]">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-paper-dim">
                  {String(index + 1).padStart(2, "0")} · {stage}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm font-medium leading-6 text-paper">{step}</p>
            </div>
            {index < steps.length - 1 ? (
              <span className="flex items-center justify-center text-accent/60 sm:hidden" aria-hidden="true">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
