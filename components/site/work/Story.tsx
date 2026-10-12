import { Check, X } from "lucide-react";
import { PipelineStage } from "@/components/motion/PipelineStage";
import { mixed, phrase } from "@/components/site/mixed";
import { directional, Latin, pad } from "@/components/site/primitives";
import { Reveal } from "@/components/ui/Reveal";
import type { ProjectStory, StoryFigure } from "@/data/projects";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/*
 * The longer story a flagship case study tells (data/projects.ts →
 * ProjectStory). Every block is plain, ordered text first; the drawing around
 * it only groups and marks. Figures always appear with their scope, and a
 * denial is told in the same coral the site uses for a critical status.
 */

const DENY = "text-[#e5816b]";

type Block<K extends keyof ProjectStory> = { story: NonNullable<ProjectStory[K]>; locale: Locale };

/** Short margin notes beside an opening (the case study and the homepage). */
export function Highlights({ items, locale, className }: { items: string[]; locale: Locale; className?: string }) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <li key={item} className="ds-gloss">
          {mixed(item, locale)}
        </li>
      ))}
    </ul>
  );
}

function Figures({ figures, className }: { figures: StoryFigure[]; className?: string }) {
  return (
    <ul className={cn("grid border-t border-white/[0.09] sm:grid-cols-2", className)}>
      {figures.map((figure) => (
        <li
          key={`${figure.value}-${figure.label}`}
          className="flex items-baseline gap-4 border-b border-white/[0.09] py-5 sm:odd:pe-8 sm:even:ps-8"
        >
          <Latin className="ds-num shrink-0 text-[clamp(1.9rem,1.5rem+1.4vw,2.6rem)] leading-none text-paper">
            {figure.value}
          </Latin>
          <span className="ds-small text-paper-dim">{figure.label}</span>
        </li>
      ))}
    </ul>
  );
}

const toneMark = {
  answer: "border border-accent/80",
  action: "bg-accent",
  refuse: "bg-[#e5816b]"
} as const;

/** The problem as a few requests, from a plain question to one that must be refused. */
export function Requests({ story, locale }: Block<"requests">) {
  return (
    <section aria-labelledby="requests" className="ds-shell pb-[var(--ds-section)]">
      <h2 id="requests" className="ds-h2 max-w-[22ch]">
        {story.title}
      </h2>
      <p className="ds-lede mt-5">{story.intro}</p>
      <ol className="mt-10 border-t border-white/[0.09]">
        {story.items.map((item) => (
          <li
            key={item.text}
            className="grid gap-2 border-b border-white/[0.09] py-6 md:grid-cols-12 md:items-baseline md:gap-10"
          >
            <p className="ds-heading text-[clamp(1.3rem,1.1rem+1vw,1.9rem)] md:col-span-7">{phrase(item.text, locale)}</p>
            <p
              className={cn(
                "ds-small flex items-center gap-2.5 md:col-span-5",
                item.tone === "refuse" ? DENY : "text-paper-dim"
              )}
            >
              <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full", toneMark[item.tone])} />
              {mixed(item.outcome, locale)}
            </p>
          </li>
        ))}
      </ol>
      <p className="ds-title mt-10 max-w-[44ch] text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)]">{story.question}</p>
    </section>
  );
}

/** One principle in two lines, with the boundary drawn between them. */
export function Principle({ story, locale }: Block<"principle">) {
  return (
    <section aria-labelledby="principle" className="border-y border-white/[0.08] bg-white/[0.015]">
      <div className="ds-shell py-20 lg:py-28">
        <h2 id="principle" className="ds-kicker">
          {story.kicker}
        </h2>
        <p className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-0">
          <span className="ds-h1 block lg:pe-12">{story.lines[0]}</span>
          <span className="ds-h1 block border-t border-accent/60 pt-4 text-accent-soft lg:border-s lg:border-t-0 lg:ps-12 lg:pt-0">
            {story.lines[1]}
          </span>
        </p>
        <p className="ds-lede mt-10">{mixed(story.body, locale)}</p>
      </div>
    </section>
  );
}

/**
 * The architecture as four groups of steps, in the reading direction (down
 * the page on a phone). The group where the system decides is marked; the
 * travelling signal lights each group on its beat.
 */
export function Architecture({ story, locale, label }: Block<"architecture"> & { label: string }) {
  return (
    <div>
      <PipelineStage threshold={0.35}>
        <ol aria-label={label} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {story.groups.map((group, index) => (
            <li
              key={group.label}
              data-beat={Math.min(index + 1, 4)}
              className={cn(
                "beat-glow rounded-[var(--ds-radius)] border p-5",
                group.decisive ? "border-[rgb(var(--tint)/0.55)] bg-[rgb(var(--tint)/0.06)]" : "border-white/[0.09]"
              )}
            >
              <p className="ds-micro flex items-center gap-2 text-paper-faint">
                <Latin className="text-accent">{pad(index + 1)}</Latin>
                <span className={cn(group.decisive && "ds-tint-text font-medium")}>{group.label}</span>
              </p>
              <ol className="mt-4 grid gap-3">
                {group.steps.map((step) => (
                  <li key={step} className="ds-text flex gap-2.5 text-[1rem] text-paper">
                    <span
                      aria-hidden="true"
                      className="mt-[calc((var(--ds-lh-text)*1em_-_0.25rem)/2)] h-1 w-1 shrink-0 rounded-full bg-accent/80"
                    />
                    <span>{mixed(step, locale)}</span>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </PipelineStage>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
        <p className="ds-label">{story.outcomesLabel}</p>
        <ul className="flex flex-wrap gap-2">
          {story.outcomes.map((outcome) => (
            <li key={outcome} className="rounded-full border border-white/[0.12] px-3 py-1 text-[0.92rem] text-paper">
              {outcome}
            </li>
          ))}
        </ul>
      </div>
      <p className="ds-small mt-5 max-w-3xl text-paper-dim">{mixed(story.note, locale)}</p>
    </div>
  );
}

/** One captured moment, row by row, beside the story it tells. */
export function BoundaryCase({ story, locale }: Block<"boundary">) {
  return (
    <section aria-labelledby="boundary" className="ds-shell grid gap-10 pt-[var(--ds-section)] lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <h2 id="boundary" className="ds-h2">
          {story.title}
        </h2>
        <p className="ds-lede mt-5">{mixed(story.intro, locale)}</p>
        <p className="ds-body mt-6 text-paper">{mixed(story.body, locale)}</p>
        <p className="ds-gloss mt-6">{mixed(story.counterpart, locale)}</p>
      </div>
      <dl className="self-start overflow-hidden rounded-[var(--ds-radius)] border border-white/[0.1] bg-ink-900/60 lg:col-span-7">
        {story.rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1.5 border-b border-white/[0.07] px-5 py-4 last:border-b-0 sm:grid-cols-[9.5rem_1fr] sm:gap-6"
          >
            <dt className="ds-label">{row.label}</dt>
            <dd className={cn("min-w-0 text-[0.98rem] leading-relaxed", row.tone === "deny" ? DENY : "text-paper")}>
              {row.code ? (
                <code lang="en" dir="ltr" className="inline-block max-w-full break-words font-mono text-[0.86rem]">
                  {row.value}
                </code>
              ) : (
                phrase(row.value, locale)
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** What the system can do, as a plain list. */
export function Capabilities({ items, title, locale }: { items: string[]; title: string; locale: Locale }) {
  return (
    <section aria-labelledby="capabilities" className="ds-shell pt-[var(--ds-section)]">
      <h2 id="capabilities" className="ds-h2">
        {title}
      </h2>
      <ul className="mt-8 grid border-t border-white/[0.09] sm:grid-cols-2 sm:gap-x-10">
        {items.map((item) => (
          <li key={item} className="ds-text flex gap-3 border-b border-white/[0.09] py-4 text-[1.02rem] text-paper">
            <Check aria-hidden="true" className="mt-[0.3em] h-4 w-4 shrink-0 text-accent" />
            <span>{mixed(item, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The evaluation: the headline count with every case drawn as a dot (the
 * failed ones hollow and coral), the slices, and the scope beside it.
 */
export function Evaluation({ story, locale, scopeLabel }: Block<"evaluation"> & { scopeLabel: string }) {
  const failed = story.total - story.passed;

  return (
    <section aria-labelledby="evaluation" className="ds-shell pt-[var(--ds-section)]">
      <h2 id="evaluation" className="ds-h2">
        {story.title}
      </h2>
      <p className="ds-lede mt-5">{mixed(story.intro, locale)}</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          {/* "51 / 56" always reads left to right, set where the column starts. */}
          <p>
            <span dir="ltr" className="inline-flex items-baseline gap-3">
              <Latin className="ds-num text-[clamp(4.5rem,3rem+6vw,8rem)] leading-none text-paper">{story.passed}</Latin>
              <Latin className="ds-num text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] ds-tone-62">/ {story.total}</Latin>
            </span>
          </p>
          <p className="ds-small mt-3 flex flex-wrap gap-x-4 text-paper-dim">
            <span>
              <span className="ds-num">{story.passed}</span> {story.passedLabel}
            </span>
            <span className={DENY}>
              <span className="ds-num">{failed}</span> {story.failedLabel}
            </span>
          </p>
          <Reveal className="ds-rise mt-6">
            <div aria-hidden="true" className="grid max-w-[20rem] grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5">
              {Array.from({ length: story.total }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "aspect-square rounded-full",
                    index < story.passed ? "bg-accent/80" : "border border-[#e5816b]"
                  )}
                />
              ))}
            </div>
          </Reveal>
          <p className="ds-small mt-6 text-paper">{mixed(story.providers, locale)}</p>
        </div>
        <div className="lg:col-span-7">
          <Figures figures={story.figures} />
          <p className="ds-gloss ds-gloss-strong mt-8">
            <span className="ds-label block text-accent">{scopeLabel}</span>
            {mixed(story.scope, locale)}
          </p>
        </div>
      </div>
    </section>
  );
}

/** What failed, case by case, in the language it was asked in. */
export function Failures({ story, locale }: Block<"failures">) {
  return (
    <section aria-labelledby="failures" className="ds-shell grid gap-10 pt-[var(--ds-section)] lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <h2 id="failures" className="ds-h2">
          {story.title}
        </h2>
        <p className="ds-body mt-5">{mixed(story.body, locale)}</p>
      </div>
      <div className="lg:col-span-7">
        <p className="ds-label">{story.casesLabel}</p>
        <ol className="mt-3 border-t border-white/[0.09]">
          {story.cases.map((item) => (
            <li key={item} className="flex items-center gap-3 border-b border-white/[0.09] py-4 text-[1.08rem] text-paper">
              <X aria-hidden="true" className={cn("h-4 w-4 shrink-0", DENY)} />
              {phrase(item, locale)}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** The guard stages as one chain, the documented figures, and their limits. */
export function Guardrails({ story, locale, scopeLabel }: Block<"guardrails"> & { scopeLabel: string }) {
  const { Forward } = directional(locale);

  return (
    <section aria-labelledby="guardrails" className="ds-shell pt-[var(--ds-section)]">
      <h2 id="guardrails" className="ds-h2">
        {story.title}
      </h2>
      <p className="ds-lede mt-5">{story.intro}</p>
      <ol className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-3">
        {story.layers.map((layer, index) => (
          <li key={layer} className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-3.5 py-1.5 text-[0.95rem] text-paper">
              <Latin className="text-[0.8rem] text-accent">{pad(index + 1)}</Latin>
              {layer}
            </span>
            {index < story.layers.length - 1 ? (
              <Forward aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-paper-faint" />
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Figures figures={story.figures} className="lg:col-span-7" />
        <p className="ds-gloss ds-gloss-strong self-start lg:col-span-5">
          <span className="ds-label block text-accent">{scopeLabel}</span>
          {mixed(story.scope, locale)}
        </p>
      </div>
    </section>
  );
}

/** A structured output treated as a proposal: the checks it passes, then execute or escalate. */
export function Checks({ story, locale, scopeLabel }: Block<"checks"> & { scopeLabel: string }) {
  return (
    <section aria-labelledby="checks" className="ds-shell grid gap-10 pt-[var(--ds-section)] lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <h2 id="checks" className="ds-h2">
          {story.title}
        </h2>
        <p className="ds-body mt-5">{mixed(story.intro, locale)}</p>
        <code
          lang="en"
          dir="ltr"
          className="mt-6 inline-block rounded-md border border-white/[0.12] bg-white/[0.03] px-3 py-1.5 font-mono text-[0.9rem] text-paper"
        >
          {story.subject}
        </code>
      </div>
      <div className="lg:col-span-7">
        <ol className="relative border-s border-white/[0.12] ps-6">
          {story.steps.map((step, index) => (
            <li key={step} className="relative pb-5 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -start-[1.84rem] top-[0.55em] h-2 w-2 rounded-full border border-accent bg-ink-900"
              />
              <p className="flex items-baseline gap-3 text-[1.08rem] text-paper">
                <Latin className="text-sm text-accent">{pad(index + 1)}</Latin>
                {step}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent px-3.5 py-1 text-[0.95rem] font-medium text-ink-900">{story.outcomes[0]}</span>
          <span className="ds-micro text-paper-faint" aria-hidden="true">
            /
          </span>
          <span className="rounded-full border border-white/[0.16] px-3.5 py-1 text-[0.95rem] text-paper">{story.outcomes[1]}</span>
        </p>
        <Figures figures={story.figures} className="mt-10" />
        <p className="ds-gloss ds-gloss-strong mt-8">
          <span className="ds-label block text-accent">{scopeLabel}</span>
          {mixed(story.scope, locale)}
        </p>
      </div>
    </section>
  );
}

/** Two model paths behind the same boundary. */
export function Providers({ story, locale }: Block<"providers">) {
  return (
    <section aria-labelledby="providers" className="ds-shell pt-[var(--ds-section)]">
      <h2 id="providers" className="ds-h2">
        {story.title}
      </h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {story.items.map((item) => (
          <li key={item.name} className="rounded-[var(--ds-radius)] border border-white/[0.1] p-6">
            <Latin className="ds-name text-[1.9rem] text-paper">{item.name}</Latin>
            <p className="ds-small mt-3 text-paper-dim">{mixed(item.body, locale)}</p>
          </li>
        ))}
      </ul>
      <p className="ds-gloss mt-8 max-w-3xl">{mixed(story.note, locale)}</p>
    </section>
  );
}
