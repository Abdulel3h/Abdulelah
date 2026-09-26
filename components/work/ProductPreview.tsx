import { ArrowUp, FileText, Play, Scale, Wallet } from "lucide-react";
import type { CSSProperties } from "react";
import type { PreviewKind } from "@/data/projects";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type Copy = Record<Locale, string>;

const labels: Record<PreviewKind, { title: string; sub: Copy }> = {
  chat: { title: "ChatUB", sub: { en: "University of Bisha", ar: "جامعة بيشة" } },
  map: { title: "Althil", sub: { en: "Thermal comfort", ar: "الراحة الحرارية" } },
  security: { title: "Absher Insight AI", sub: { en: "Risk monitor", ar: "مراقبة المخاطر" } },
  legal: { title: "Qanouni", sub: { en: "Labour rights", ar: "الحقوق العمالية" } },
  fintech: { title: "Medad", sub: { en: "Inclusive banking", ar: "خدمات مصرفية شاملة" } },
  vr: { title: "Virtual Astronauts", sub: { en: "Immersive learning", ar: "تعلّم غامر" } },
  vision: { title: "Stadium", sub: { en: "Gate monitor", ar: "مراقبة البوابات" } }
};

/** Shifts a part within its beat, in seconds (see the beat grid in globals.css). */
function offset(seconds: number) {
  return (seconds ? { "--beat-offset": `${Math.round(seconds * 1000) / 1000}s` } : {}) as CSSProperties;
}

/**
 * Handcrafted, code-drawn sketches of how each idea behaves — never
 * screenshots. They carry no measured numbers, and every use is wrapped in a
 * <ConceptFigure> captioned "Concept visualization". The drawing itself is
 * decorative (aria-hidden); the caption and the case study carry the meaning.
 *
 * Inside a <PipelineStage> each sketch acts out its project's four-step flow:
 * `data-beat` 1–4 match the steps in `project.flow`, so the signal reaches a
 * part of the drawing as it reaches the matching step. At rest (and without
 * JavaScript or motion) the drawing is unchanged.
 */
export function ProductPreview({ kind, locale = "en" }: { kind: PreviewKind; locale?: Locale }) {
  const label = labels[kind];

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-gradient-to-b from-ink-800 to-ink-900 shadow-glow"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <span className="flex items-center gap-2 text-[0.75rem] font-medium text-paper-dim" dir="ltr">
          <span data-beat="1" className="beat-ring h-1.5 w-1.5 rounded-full bg-accent/80" />
          {label.title}
        </span>
        <span className="text-[0.68rem] uppercase tracking-[0.14em] text-paper-dim">{label.sub[locale]}</span>
      </div>
      <div className="p-4 sm:p-5">
        {kind === "chat" ? <ChatBody /> : null}
        {kind === "map" ? <MapBody locale={locale} /> : null}
        {kind === "security" ? <SecurityBody locale={locale} /> : null}
        {kind === "legal" ? <LegalBody locale={locale} /> : null}
        {kind === "fintech" ? <FintechBody locale={locale} /> : null}
        {kind === "vr" ? <VrBody locale={locale} /> : null}
        {kind === "vision" ? <VisionBody locale={locale} /> : null}
      </div>
    </div>
  );
}

/** A preview with its mandatory "Concept visualization" caption. */
export function ConceptFigure({
  kind,
  locale,
  caption,
  note,
  className
}: {
  kind: PreviewKind;
  locale: Locale;
  caption: string;
  note: string;
  className?: string;
}) {
  return (
    <figure data-pipeline-trigger="" className={cn("relative", className)}>
      <div
        className="absolute -inset-3 -z-10 rounded-[2.5rem] sm:-inset-6"
        style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.12), transparent 76%)" }}
        aria-hidden="true"
      />
      <ProductPreview kind={kind} locale={locale} />
      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-2 text-xs leading-5 text-paper-dim">
        <span className="font-semibold uppercase tracking-[0.14em] text-accent-soft">{caption}</span>
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}

/** Placeholder text lines; with a `beat`, they write themselves line by line. */
function Skeleton({ widths, beat }: { widths: string[]; beat?: number }) {
  return (
    <span className="block space-y-2">
      {widths.map((width, index) => (
        <span
          key={`${width}-${index}`}
          data-beat={beat}
          className={cn("block h-2 rounded-full bg-paper/20", beat ? "beat-fill" : undefined)}
          style={{ width, ...(beat ? offset(index * 0.16) : null) }}
        />
      ))}
    </span>
  );
}

function ChatBody() {
  // ChatUB is Arabic-first, so its sketch is Arabic in both languages.
  // Beat 2 is the stop-word cleanup: stop words dim, keywords light up.
  return (
    <div className="space-y-3" dir="rtl" lang="ar">
      <div
        data-beat="1"
        className="beat-glow me-auto max-w-[80%] rounded-2xl rounded-ss-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-paper"
      >
        <span data-beat="2" className="beat-stop">
          ما
        </span>{" "}
        <span data-beat="2" className="beat-key rounded-sm" style={offset(0.1)}>
          شروط الاعتذار
        </span>{" "}
        <span data-beat="2" className="beat-stop" style={offset(0.1)}>
          عن
        </span>{" "}
        <span data-beat="2" className="beat-key rounded-sm" style={offset(0.2)}>
          مقرر
        </span>
        ؟
      </div>
      <div className="ms-auto max-w-[88%] rounded-2xl rounded-se-sm border border-accent/20 bg-accent/[0.06] px-3.5 py-3">
        <Skeleton widths={["92%", "78%", "54%"]} beat={4} />
        <span
          data-beat="3"
          className="beat-glow mt-3 flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-ink-900/70 px-2.5 py-1 text-[0.7rem] text-paper-dim"
        >
          <FileText className="h-3 w-3 text-accent" />
          مطابقة من الأسئلة الشائعة
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2 text-xs text-paper-dim">
        اكتب سؤالك الأكاديمي…
        <span
          data-beat="1"
          style={offset(-0.15)}
          className="beat-glow ms-auto grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent text-ink-900"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function MapBody({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const sunPath = "M2 58 Q 50 -14 98 58";

  return (
    <div>
      <div className="relative h-[208px] overflow-hidden rounded-lg border border-white/[0.07] bg-ink-900">
        <div data-beat="3" className="beat-grid absolute inset-0 bg-soft-grid bg-[length:22px_22px] opacity-25" />
        <div
          data-beat="2"
          className="beat-swell absolute -left-8 top-2 h-44 w-44 rounded-full blur-[2px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(204,92,58,0.34), rgba(201,167,92,0.20), transparent 72%)",
            ...offset(0.3)
          }}
        />
        <div
          className="absolute -bottom-10 -right-6 h-44 w-44 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(122,150,178,0.20), transparent 70%)" }}
        />
        {/* The sun's path across the site: a faint dashed arc the signal traces. */}
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
          <path
            d={sunPath}
            stroke="rgba(201,167,92,0.3)"
            strokeWidth="1"
            strokeDasharray="3 5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={sunPath}
            pathLength={1}
            data-beat="2"
            className="beat-trace"
            stroke="#f3e3b8"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </svg>
        <span
          data-beat="1"
          className="beat-glow absolute start-3 top-3 rounded-full border border-white/10 bg-ink-900/85 px-2.5 py-1 text-[0.7rem] text-paper-dim"
        >
          {ar ? "مواقع تظليل مرشحة" : "Candidate shade sites"}
        </span>
        <span className="absolute left-[52%] top-[44%] flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span data-beat="4" className="beat-ring relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span
            data-beat="4"
            style={offset(0.12)}
            className="beat-glow rounded-full border border-accent/25 bg-ink-900/85 px-2 py-0.5 text-[0.68rem] text-accent-soft"
          >
            {ar ? "مظلة مقترحة" : "Suggested canopy"}
          </span>
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[0.7rem] text-paper-dim">
        <span>{ar ? "تعرض أعلى للحرارة" : "More heat exposure"}</span>
        <span className="h-1.5 flex-1 rounded-full bg-[linear-gradient(90deg,rgba(204,92,58,0.85),rgba(201,167,92,0.7),rgba(122,150,178,0.6))] rtl:bg-[linear-gradient(270deg,rgba(204,92,58,0.85),rgba(201,167,92,0.7),rgba(122,150,178,0.6))]" />
        <span>{ar ? "أبرد" : "Cooler"}</span>
      </div>
    </div>
  );
}

function SecurityBody({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const points = "0,34 24,30 48,32 72,26 96,31 120,28 144,30 168,11 192,25 216,29 240,27";
  const events = [
    { label: ar ? "موقع غير معتاد" : "Unusual location", tone: "bg-accent" },
    { label: ar ? "دخول في ساعة متأخرة" : "Late-night access", tone: "bg-[#c85c3a]" },
    { label: ar ? "كثافة إجراءات عالية" : "High action volume", tone: "bg-paper-faint" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-paper-dim">
            {ar ? "تقييم وفق القواعد" : "Rule-based assessment"}
          </p>
          <p data-beat="4" className="beat-text-strong mt-1 font-display text-3xl leading-none text-paper">
            {ar ? "منخفض" : "Low"}
          </p>
        </div>
        <span
          data-beat="4"
          style={offset(0.12)}
          className="beat-glow rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[0.7rem] text-accent-soft"
        >
          {ar ? "قابل للتفسير" : "Explainable"}
        </span>
      </div>
      <div className="relative">
        <svg viewBox="0 0 240 46" className="h-12 w-full" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="#c9a75c"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <polyline
            points={points}
            pathLength={1}
            data-beat="1"
            className="beat-trace"
            fill="none"
            stroke="#f3e3b8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="168" cy="11" r="2.6" fill="#c9a75c" />
        </svg>
        {/* The rule firing at the spike (168/240, 11/46). An HTML ring stays
            round where the stretched SVG (preserveAspectRatio="none") would not. */}
        <span
          data-beat="2"
          className="beat-ring absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: "70%", top: "23.9%" }}
        />
      </div>
      <div className="space-y-2">
        {events.map((event, index) => (
          <div
            key={event.label}
            data-beat="3"
            style={offset(index * 0.16)}
            className="beat-glow flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[0.78rem] text-paper-dim"
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${event.tone}`} />
            {event.label}
            <span className="beat-text ms-auto text-[0.7rem] text-paper-dim">{ar ? "السبب مذكور" : "reason shown"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalBody({ locale }: { locale: Locale }) {
  const ar = locale === "ar";

  return (
    <div className="space-y-3">
      <div
        data-beat="1"
        className="beat-glow ms-auto max-w-[86%] rounded-2xl rounded-se-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-paper"
      >
        {ar ? "هل يحق لصاحب العمل تغيير راتبي دون موافقتي؟" : "Can my employer change my salary without my agreement?"}
      </div>
      <div className="me-auto max-w-[92%] rounded-2xl rounded-ss-sm border border-accent/20 bg-accent/[0.06] px-3.5 py-3">
        <Skeleton widths={["90%", "72%"]} beat={3} />
        <span
          data-beat="2"
          className="beat-glow mt-3 flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-ink-900/70 px-2.5 py-1 text-[0.7rem] text-paper-dim"
        >
          <Scale className="h-3 w-3 text-accent" />
          {ar ? "مرجع من نظام العمل" : "Labour-law reference"}
        </span>
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-ink-900/60 p-3">
        <p className="text-[0.7rem] uppercase tracking-[0.12em] text-paper-dim">{ar ? "الخطوات التالية" : "Next steps"}</p>
        <ul className="mt-2 space-y-1.5 text-[0.8rem] text-paper-dim">
          <li data-beat="4" className="beat-text flex gap-2">
            <span className="text-accent">1.</span> {ar ? "اطلب التغيير كتابيًا" : "Ask for the change in writing"}
          </li>
          <li data-beat="4" style={offset(0.2)} className="beat-text flex gap-2">
            <span className="text-accent">2.</span> {ar ? "راجع مكتب العمل" : "Contact the labour office"}
          </li>
        </ul>
      </div>
    </div>
  );
}

function FintechBody({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const bars = [42, 64, 30, 78, 52, 88];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-paper-dim">{ar ? "نظرة شهرية" : "Monthly overview"}</p>
          <p data-beat="2" className="beat-text-strong mt-1 font-display text-2xl leading-none text-paper">
            {ar ? "الإنفاق والادخار" : "Spending & saving"}
          </p>
        </div>
        <span
          data-beat="3"
          className="beat-glow flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[0.7rem] text-accent-soft"
        >
          <Wallet className="h-3 w-3" /> {ar ? "ضمن الخطة" : "On track"}
        </span>
      </div>
      <div className="flex h-20 items-end gap-2">
        {bars.map((height, index) => (
          <div
            key={`${height}-${index}`}
            data-beat="1"
            className="beat-rise flex-1 rounded-t bg-gradient-to-t from-accent/20 to-accent/70"
            style={{ height: `${height}%`, ...offset(index * 0.08) }}
          />
        ))}
      </div>
      <div
        data-beat="4"
        className="beat-glow flex items-start gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2.5 text-[0.8rem] leading-5 text-paper-dim"
      >
        <span className="beat-ring mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        {ar ? "خصّص مبلغًا صغيرًا كل أسبوع لهدف الادخار." : "Put a small amount aside each week toward your saving goal."}
      </div>
    </div>
  );
}

function VrBody({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const stars: Array<[string, string]> = [
    ["12%", "22%"],
    ["28%", "66%"],
    ["62%", "16%"],
    ["80%", "44%"],
    ["46%", "34%"],
    ["88%", "72%"]
  ];

  return (
    <div>
      <div
        className="relative h-[208px] overflow-hidden rounded-lg border border-white/[0.07]"
        style={{
          background: "radial-gradient(120% 120% at 70% 120%, rgba(204,92,58,0.18), transparent 60%), #070708"
        }}
      >
        {stars.map(([left, top], index) => (
          <span
            key={`${left}-${index}`}
            data-beat="1"
            className="beat-brighten absolute h-0.5 w-0.5 rounded-full bg-paper/70"
            style={{ left, top, ...offset(index * 0.08) }}
          />
        ))}
        {/* Centred with the individual `translate` property, so the swell's
            `scale` grows the planet around its own centre. */}
        <div
          data-beat="2"
          className="beat-swell absolute -bottom-16 left-1/2 h-44 w-44 rounded-full [translate:-50%_0]"
          style={{ background: "radial-gradient(circle at 35% 30%, #d8a36a, #b5532f 55%, #5e2415)" }}
        />
        <span className="absolute start-3 top-3 rounded-full border border-white/10 bg-ink-900/85 px-2.5 py-1 text-[0.7rem] text-paper-dim">
          {ar ? "المريخ · جولة موجّهة" : "Mars · guided tour"}
        </span>
        <span
          data-beat="3"
          className="beat-glow beat-ring absolute left-1/2 top-[38%] grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-accent/40 bg-ink-900/70 text-accent"
          style={{ "--ring-scale": 1.6 } as CSSProperties}
        >
          <Play className="h-4 w-4 translate-x-0.5" />
        </span>
      </div>
      <p data-beat="4" className="beat-text mt-3 text-[0.75rem] text-paper-dim">
        {ar ? "يروي الذكاء الاصطناعي العلم أثناء الاستكشاف." : "AI narrates the science as you explore."}
      </p>
    </div>
  );
}

function VisionBody({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const gates = [
    { name: "A", level: 38, status: ar ? "طبيعية" : "Normal", tone: "bg-accent/55" },
    { name: "B", level: 64, status: ar ? "مزدحمة" : "Busy", tone: "bg-accent" },
    { name: "C", level: 92, status: ar ? "حرجة" : "Critical", tone: "bg-[#c85c3a]" },
    { name: "D", level: 27, status: ar ? "طبيعية" : "Normal", tone: "bg-accent/55" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-paper-dim">{ar ? "الإشغال المباشر" : "Live occupancy"}</p>
          <p className="mt-1 font-display text-2xl leading-none text-paper">{ar ? "حالة البوابات" : "Gate status"}</p>
        </div>
        <span className="rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[0.7rem] text-accent-soft">
          {ar ? "4 مناطق" : "4 zones"}
        </span>
      </div>
      <div className="relative space-y-2.5 overflow-hidden">
        {gates.map((gate, index) => (
          <div key={gate.name}>
            <div className="flex items-center justify-between text-[0.75rem] text-paper-dim">
              <span>
                {ar ? "البوابة" : "Gate"} {gate.name}
              </span>
              <span
                data-beat="3"
                style={offset(index * 0.14)}
                className={cn("beat-text", gate.name === "C" && "beat-critical")}
              >
                {gate.status}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                data-beat="2"
                className={`beat-fill h-full rounded-full ${gate.tone}`}
                style={{ width: `${gate.level}%`, ...offset(index * 0.12) }}
              />
            </div>
          </div>
        ))}
        {/* The camera frame being scanned. `!mt-0` undoes space-y on this overlay. */}
        <span data-beat="1" className="beat-scan absolute inset-0 !mt-0" />
      </div>
      <div
        data-beat="4"
        className="beat-glow beat-critical flex items-start gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2.5 text-[0.8rem] leading-5 text-paper-dim"
      >
        <span className="beat-ring mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c85c3a]" />
        {ar ? "البوابة C حرجة — انقل موظفين من البوابة D." : "Gate C is critical — move staff from Gate D."}
      </div>
    </div>
  );
}
