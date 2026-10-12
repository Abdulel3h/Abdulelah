"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { PipelineStage } from "@/components/motion/PipelineStage";
import { phrase } from "@/components/site/mixed";
import type { BoundaryRow, ProjectStory } from "@/data/projects";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type Gate = NonNullable<NonNullable<ProjectStory["boundary"]>["gate"]>;
type Scenario = "allowed" | "denied";

const DENY = "text-[#e5816b]";
const ALLOW = "text-accent-soft";

/** Shifts a part within its beat (see the beat grid in globals.css). */
function offset(seconds: number) {
  return { "--beat-offset": `${seconds}s` } as CSSProperties;
}

/**
 * Raqmi's signature interaction: one authorization boundary, two captured
 * scenarios. The reader picks an order; the signal carries the message to
 * the model, the model's proposal to the gate, and only crosses the gate
 * when the application allows the call.
 *
 * - The choice is two native radios, and CSS (`:has(:checked)` in site.css)
 *   shows the chosen scenario, so switching works before (and without)
 *   JavaScript. The client only replays the signal (PipelineStage) and
 *   records one anonymous event per switch.
 * - The decision is drawn in static styles: the gate's colour, the verdict,
 *   the solid or broken track after it. Motion only carries the signal
 *   through, so under reduced motion nothing is lost and switching is
 *   instant.
 * - It flows top to bottom, so it reads the same in both directions; the
 *   gate's hairline draws from the inline start.
 */
export function GateExplorer({
  id,
  project,
  rows,
  gate,
  locale
}: {
  id: string;
  project: string;
  rows: BoundaryRow[];
  gate: Gate;
  locale: Locale;
}) {
  const [replays, setReplays] = useState(0);
  const scenarios = [
    { key: "allowed" as const, ...gate.allowed },
    { key: "denied" as const, ...gate.denied, rows }
  ];

  return (
    <div className="ds-gate overflow-hidden rounded-[var(--ds-radius)] border border-white/[0.1] bg-ink-900/60">
      <fieldset className="border-b border-white/[0.07] px-5 pb-5 pt-4">
        <legend className="ds-label float-start w-full">{gate.legend}</legend>
        <div className="ds-gate-choices clear-both pt-3">
          {scenarios.map((scenario) => (
            <label key={scenario.key} className="ds-gate-choice">
              <input
                type="radio"
                name={`${id}-scenario`}
                value={scenario.key}
                defaultChecked={scenario.key === "denied"}
                onChange={() => {
                  setReplays((count) => count + 1);
                  trackEvent("signature_interaction_used", { project, scenario: scenario.key });
                }}
              />
              <span className="min-w-0">
                <span className="block text-[0.98rem] font-medium leading-snug text-paper">{scenario.choice}</span>
                <span className="ds-micro block text-paper-dim">{scenario.detail}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <PipelineStage replayOnHover={false} replayKey={String(replays)}>
        {scenarios.map((scenario) => (
          <Path
            key={scenario.key}
            scenario={scenario.key}
            rows={scenario.rows}
            verdict={scenario.verdict}
            gate={gate}
            locale={locale}
          />
        ))}
      </PipelineStage>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/[0.07] px-5 py-4">
        <p className="ds-micro max-w-[34rem] text-paper-dim">{phrase(gate.note, locale)}</p>
        <button
          type="button"
          onClick={() => setReplays((count) => count + 1)}
          className="ds-gate-replay focus-ring inline-flex min-h-11 items-center gap-2 rounded text-[0.95rem] font-medium text-accent-soft transition-colors hover:text-accent"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {gate.replay}
        </button>
      </div>
    </div>
  );
}

/** One scenario: the model's side, the gate, and what followed. */
function Path({
  scenario,
  rows,
  verdict,
  gate,
  locale
}: {
  scenario: Scenario;
  rows: BoundaryRow[];
  verdict: string;
  gate: Gate;
  locale: Locale;
}) {
  const allowed = scenario === "allowed";
  const [message, proposal, decision, ...outcome] = rows;
  const Verdict = allowed ? Check : X;

  return (
    <div data-scenario={scenario}>
      <div className="ds-gate-zone pt-4">
        <span data-beat="1" aria-hidden="true" className="ds-gate-track beat-rise" />
        <p className="ds-label px-5">{gate.proposes}</p>
        <dl>
          <Row row={message} beat={1} locale={locale} />
          <Row row={proposal} beat={2} locale={locale} />
        </dl>
      </div>

      {/* The boundary. Its colour and verdict are static; the signal only draws through it. */}
      <div
        data-beat="3"
        className={cn("ds-gate-bar beat-rule", allowed ? "border-accent/50" : "beat-critical border-[#e5816b]/55")}
      >
        <div className="flex items-center justify-between gap-4 px-5 pt-3.5">
          <p className="ds-label text-accent">{gate.decides}</p>
          <span
            data-beat="3"
            style={offset(0.3)}
            className={cn(
              "beat-text inline-flex items-center gap-1.5 text-[0.9rem] font-medium",
              allowed ? ALLOW : cn("beat-critical", DENY)
            )}
          >
            <Verdict className="h-4 w-4" aria-hidden="true" />
            {verdict}
          </span>
        </div>
        <dl>
          <Row row={decision} beat={3} delay={0.3} critical={!allowed} locale={locale} />
        </dl>
      </div>

      <div className="ds-gate-zone ds-gate-after pb-2">
        {allowed ? <span data-beat="4" aria-hidden="true" className="ds-gate-track beat-rise" /> : <span aria-hidden="true" className="ds-gate-track" />}
        <dl>
          {outcome.map((row, index) => (
            <Row
              key={row.label}
              row={row}
              beat={4}
              delay={index * 0.3}
              // A denied call stops at the gate: "nothing executed" is struck, the reply still goes out.
              stop={!allowed && index === 0}
              locale={locale}
            />
          ))}
        </dl>
      </div>
    </div>
  );
}

function Row({
  row,
  beat,
  delay = 0,
  critical = false,
  stop = false,
  locale
}: {
  row: BoundaryRow;
  beat: number;
  delay?: number;
  critical?: boolean;
  stop?: boolean;
  locale: Locale;
}) {
  return (
    <div className="grid gap-1.5 px-5 py-3.5 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
      <dt className="ds-label">{row.label}</dt>
      <dd
        data-beat={beat}
        style={delay ? offset(delay) : undefined}
        className={cn(
          "min-w-0 text-[0.98rem] leading-relaxed",
          stop ? "beat-stop beat-critical" : "beat-text",
          critical && "beat-critical",
          row.tone === "deny" ? DENY : row.tone === "allow" ? ALLOW : "text-paper"
        )}
      >
        {row.code ? (
          <code lang="en" dir="ltr" className="inline-block max-w-full break-words font-mono text-[0.86rem]">
            {row.value}
          </code>
        ) : (
          phrase(row.value, locale)
        )}
      </dd>
    </div>
  );
}
