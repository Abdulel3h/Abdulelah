import { ArrowUp, FileText, Play, Scale, Wallet } from "lucide-react";

type PreviewKind =
  | "chat"
  | "map"
  | "security"
  | "legal"
  | "fintech"
  | "vr"
  | "vision";

const labels: Record<PreviewKind, { title: string; sub: string }> = {
  chat: { title: "ChatUB", sub: "University of Bisha" },
  map: { title: "Althil", sub: "Thermal comfort" },
  security: { title: "Absher Insight", sub: "Risk monitor" },
  legal: { title: "Qanouni", sub: "Labor rights" },
  fintech: { title: "Medad", sub: "Inclusive banking" },
  vr: { title: "Virtual Astronauts", sub: "Immersive learning" },
  vision: { title: "Stadium", sub: "Gate monitor" }
};

/**
 * Handcrafted, code-drawn product previews — not screenshots. Each one is a
 * small, faithful sketch of how the real product behaves, drawn in the brand
 * palette so the showcase feels like a product studio.
 */
export function ProductPreview({ kind }: { kind?: PreviewKind }) {
  const k: PreviewKind = kind ?? "chat";
  const label = labels[k];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-gradient-to-b from-ink-800 to-ink-900 shadow-glow">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <span className="flex items-center gap-2 text-[0.72rem] font-medium text-paper-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-accent/80" aria-hidden="true" />
          {label.title}
        </span>
        <span className="text-[0.62rem] uppercase tracking-[0.16em] text-paper-faint">
          {label.sub}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        {k === "chat" ? <ChatBody /> : null}
        {k === "map" ? <MapBody /> : null}
        {k === "security" ? <SecurityBody /> : null}
        {k === "legal" ? <LegalBody /> : null}
        {k === "fintech" ? <FintechBody /> : null}
        {k === "vr" ? <VrBody /> : null}
        {k === "vision" ? <VisionBody /> : null}
      </div>
    </div>
  );
}

function ChatBody() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-paper">
        What&apos;s the policy on academic probation?
      </div>
      <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-accent/20 bg-accent/[0.06] px-3.5 py-3 text-sm leading-6 text-paper">
        A student is placed on academic probation when their GPA falls below 2.0,
        and must raise it within two terms to avoid dismissal.
        <span className="ml-0.5 inline-block h-3.5 w-px -mb-0.5 animate-pulse bg-accent/80 align-middle" />
        <span className="mt-2.5 flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-ink-900/70 px-2.5 py-1 text-[0.68rem] text-paper-dim">
          <FileText className="h-3 w-3 text-accent" aria-hidden="true" />
          Academic Regulations · §4.2
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2 text-xs text-paper-faint">
        Ask about regulations, procedures, deadlines…
        <span className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent text-ink-900">
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function MapBody() {
  return (
    <div aria-hidden="true">
      <div className="relative h-[208px] overflow-hidden rounded-lg border border-white/[0.07] bg-ink-900">
        <div className="absolute inset-0 bg-soft-grid bg-[length:22px_22px] opacity-25" />
        {/* heat zone */}
        <div
          className="absolute -left-8 top-2 h-44 w-44 rounded-full blur-[2px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(204,92,58,0.34), rgba(201,167,92,0.20), transparent 72%)"
          }}
        />
        {/* cool zone */}
        <div
          className="absolute -bottom-10 -right-6 h-44 w-44 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(122,150,178,0.20), transparent 70%)"
          }}
        />
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-ink-900/80 px-2.5 py-1 text-[0.66rem] text-paper-dim">
          Recommended sites · 4
        </span>
        {/* shade marker */}
        <span className="absolute left-[52%] top-[44%] flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="rounded-full border border-accent/25 bg-ink-900/85 px-2 py-0.5 text-[0.64rem] text-accent-soft">
            Shade canopy · −3.2°C
          </span>
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[0.66rem] text-paper-faint">
        <span>Heat exposure</span>
        <span className="h-1.5 flex-1 rounded-full bg-[linear-gradient(90deg,rgba(204,92,58,0.85),rgba(201,167,92,0.7),rgba(122,150,178,0.6))]" />
        <span>Cooler</span>
      </div>
    </div>
  );
}

function SecurityBody() {
  const events = [
    { label: "Unusual login geography", time: "2m", tone: "bg-accent" },
    { label: "Access velocity anomaly", time: "14m", tone: "bg-[#c85c3a]" },
    { label: "Off-hours data export", time: "1h", tone: "bg-paper-faint" }
  ];

  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-paper-faint">
            Aggregate risk
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-paper">
            0.18 <span className="text-base text-accent-soft">Low</span>
          </p>
        </div>
        <span className="rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[0.66rem] text-accent-soft">
          Proactive
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
        <div className="h-full w-[18%] rounded-full bg-accent" />
      </div>
      <svg viewBox="0 0 240 46" className="h-12 w-full" preserveAspectRatio="none">
        <polyline
          points="0,34 24,30 48,32 72,26 96,31 120,28 144,30 168,11 192,25 216,29 240,27"
          fill="none"
          stroke="#c9a75c"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        <circle cx="168" cy="11" r="2.6" fill="#c9a75c" />
      </svg>
      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.label}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[0.74rem] text-paper-dim"
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${event.tone}`} />
            {event.label}
            <span className="ml-auto text-paper-faint">{event.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalBody() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="ml-auto max-w-[84%] rounded-2xl rounded-tr-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-paper">
        Can my employer cut my salary without notice?
      </div>
      <div className="max-w-[94%] rounded-2xl rounded-tl-sm border border-accent/20 bg-accent/[0.06] px-3.5 py-3 text-sm leading-6 text-paper">
        Not unilaterally. A pay change needs your written agreement — otherwise it
        may count as an arbitrary change to the contract.
        <span className="mt-2.5 flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-ink-900/70 px-2.5 py-1 text-[0.68rem] text-paper-dim">
          <Scale className="h-3 w-3 text-accent" aria-hidden="true" />
          Labor Law · Art. 61
        </span>
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-ink-900/60 p-3">
        <p className="text-[0.64rem] uppercase tracking-[0.14em] text-paper-faint">
          Your options
        </p>
        <ul className="mt-2 space-y-1.5 text-[0.78rem] text-paper-dim">
          <li className="flex gap-2">
            <span className="text-accent">1.</span> Request the change in writing
          </li>
          <li className="flex gap-2">
            <span className="text-accent">2.</span> File with the labor office within 12 months
          </li>
        </ul>
      </div>
    </div>
  );
}

function FintechBody() {
  const bars = [42, 64, 30, 78, 52, 88];

  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-paper-faint">
            Balance
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-paper">SAR 4,820</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[0.66rem] text-accent-soft">
          <Wallet className="h-3 w-3" aria-hidden="true" /> On track
        </span>
      </div>
      <div className="flex h-20 items-end gap-2">
        {bars.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className="flex-1 rounded-t bg-gradient-to-t from-accent/20 to-accent/70"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2.5 text-[0.78rem] leading-5 text-paper-dim">
        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        Set aside SAR 220 this month to reach your savings goal by December.
      </div>
    </div>
  );
}

function VrBody() {
  const stars: Array<[string, string]> = [
    ["12%", "22%"],
    ["28%", "66%"],
    ["62%", "16%"],
    ["80%", "44%"],
    ["46%", "34%"],
    ["88%", "72%"]
  ];

  return (
    <div aria-hidden="true">
      <div
        className="relative h-[208px] overflow-hidden rounded-lg border border-white/[0.07]"
        style={{
          background:
            "radial-gradient(120% 120% at 70% 120%, rgba(204,92,58,0.18), transparent 60%), #070708"
        }}
      >
        {stars.map(([left, top], index) => (
          <span
            key={`${left}-${index}`}
            className="absolute h-0.5 w-0.5 rounded-full bg-paper/70"
            style={{ left, top }}
          />
        ))}
        <div
          className="absolute -bottom-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #d8a36a, #b5532f 55%, #5e2415)"
          }}
        />
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-ink-900/80 px-2.5 py-1 text-[0.66rem] text-paper-dim">
          Mars · guided tour
        </span>
        <span className="absolute left-1/2 top-[38%] grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-accent/40 bg-ink-900/70 text-accent backdrop-blur">
          <Play className="h-4 w-4 translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-[0.72rem] text-paper-dim">
        AI narrates the science as you explore in VR.
      </p>
    </div>
  );
}

function VisionBody() {
  const gates = [
    { name: "Gate A", level: 38, status: "Normal", tone: "bg-accent/55" },
    { name: "Gate B", level: 64, status: "Busy", tone: "bg-accent" },
    { name: "Gate C", level: 92, status: "Critical", tone: "bg-[#c85c3a]" },
    { name: "Gate D", level: 27, status: "Normal", tone: "bg-accent/55" }
  ];

  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-paper-faint">
            Live occupancy
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-paper">
            342 <span className="text-base text-paper-dim">people</span>
          </p>
        </div>
        <span className="rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[0.66rem] text-accent-soft">
          4 gates
        </span>
      </div>
      <div className="space-y-2.5">
        {gates.map((gate) => (
          <div key={gate.name}>
            <div className="flex items-center justify-between text-[0.72rem] text-paper-dim">
              <span>{gate.name}</span>
              <span>{gate.status}</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full ${gate.tone}`}
                style={{ width: `${gate.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2.5 text-[0.78rem] leading-5 text-paper-dim">
        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c85c3a]" />
        Gate C is overflowing — move 2 staff from Gate D.
      </div>
    </div>
  );
}
