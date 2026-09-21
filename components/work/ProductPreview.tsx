import { ArrowUp, FileText, Play, Scale, Wallet } from "lucide-react";
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

/**
 * Handcrafted, code-drawn sketches of how each idea behaves — never
 * screenshots. They carry no measured numbers, and every use is wrapped in a
 * <ConceptFigure> captioned "Concept visualization". The drawing itself is
 * decorative (aria-hidden); the caption and the case study carry the meaning.
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
          <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
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
    <figure className={cn("relative", className)}>
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

function Skeleton({ widths }: { widths: string[] }) {
  return (
    <span className="block space-y-2">
      {widths.map((width, index) => (
        <span key={`${width}-${index}`} className="block h-2 rounded-full bg-paper/20" style={{ width }} />
      ))}
    </span>
  );
}

function ChatBody() {
  // ChatUB is Arabic-first, so its sketch is Arabic in both languages.
  return (
    <div className="space-y-3" dir="rtl" lang="ar">
      <div className="me-auto max-w-[80%] rounded-2xl rounded-ss-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-paper">
        ما شروط الاعتذار عن مقرر؟
      </div>
      <div className="ms-auto max-w-[88%] rounded-2xl rounded-se-sm border border-accent/20 bg-accent/[0.06] px-3.5 py-3">
        <Skeleton widths={["92%", "78%", "54%"]} />
        <span className="mt-3 flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-ink-900/70 px-2.5 py-1 text-[0.7rem] text-paper-dim">
          <FileText className="h-3 w-3 text-accent" />
          مطابقة من الأسئلة الشائعة
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2 text-xs text-paper-dim">
        اكتب سؤالك الأكاديمي…
        <span className="ms-auto grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent text-ink-900">
          <ArrowUp className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function MapBody({ locale }: { locale: Locale }) {
  const ar = locale === "ar";

  return (
    <div>
      <div className="relative h-[208px] overflow-hidden rounded-lg border border-white/[0.07] bg-ink-900">
        <div className="absolute inset-0 bg-soft-grid bg-[length:22px_22px] opacity-25" />
        <div
          className="absolute -left-8 top-2 h-44 w-44 rounded-full blur-[2px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(204,92,58,0.34), rgba(201,167,92,0.20), transparent 72%)"
          }}
        />
        <div
          className="absolute -bottom-10 -right-6 h-44 w-44 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(122,150,178,0.20), transparent 70%)" }}
        />
        <span className="absolute start-3 top-3 rounded-full border border-white/10 bg-ink-900/85 px-2.5 py-1 text-[0.7rem] text-paper-dim">
          {ar ? "مواقع تظليل مرشحة" : "Candidate shade sites"}
        </span>
        <span className="absolute left-[52%] top-[44%] flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="rounded-full border border-accent/25 bg-ink-900/85 px-2 py-0.5 text-[0.68rem] text-accent-soft">
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
          <p className="mt-1 font-display text-3xl leading-none text-paper">{ar ? "منخفض" : "Low"}</p>
        </div>
        <span className="rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[0.7rem] text-accent-soft">
          {ar ? "قابل للتفسير" : "Explainable"}
        </span>
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
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[0.78rem] text-paper-dim"
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${event.tone}`} />
            {event.label}
            <span className="ms-auto text-[0.7rem] text-paper-dim">{ar ? "السبب مذكور" : "reason shown"}</span>
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
      <div className="ms-auto max-w-[86%] rounded-2xl rounded-se-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-paper">
        {ar ? "هل يحق لصاحب العمل تغيير راتبي دون موافقتي؟" : "Can my employer change my salary without my agreement?"}
      </div>
      <div className="me-auto max-w-[92%] rounded-2xl rounded-ss-sm border border-accent/20 bg-accent/[0.06] px-3.5 py-3">
        <Skeleton widths={["90%", "72%"]} />
        <span className="mt-3 flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-ink-900/70 px-2.5 py-1 text-[0.7rem] text-paper-dim">
          <Scale className="h-3 w-3 text-accent" />
          {ar ? "مرجع من نظام العمل" : "Labour-law reference"}
        </span>
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-ink-900/60 p-3">
        <p className="text-[0.7rem] uppercase tracking-[0.12em] text-paper-dim">{ar ? "الخطوات التالية" : "Next steps"}</p>
        <ul className="mt-2 space-y-1.5 text-[0.8rem] text-paper-dim">
          <li className="flex gap-2">
            <span className="text-accent">1.</span> {ar ? "اطلب التغيير كتابيًا" : "Ask for the change in writing"}
          </li>
          <li className="flex gap-2">
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
          <p className="mt-1 font-display text-2xl leading-none text-paper">{ar ? "الإنفاق والادخار" : "Spending & saving"}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[0.7rem] text-accent-soft">
          <Wallet className="h-3 w-3" /> {ar ? "ضمن الخطة" : "On track"}
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
      <div className="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2.5 text-[0.8rem] leading-5 text-paper-dim">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
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
            className="absolute h-0.5 w-0.5 rounded-full bg-paper/70"
            style={{ left, top }}
          />
        ))}
        <div
          className="absolute -bottom-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle at 35% 30%, #d8a36a, #b5532f 55%, #5e2415)" }}
        />
        <span className="absolute start-3 top-3 rounded-full border border-white/10 bg-ink-900/85 px-2.5 py-1 text-[0.7rem] text-paper-dim">
          {ar ? "المريخ · جولة موجّهة" : "Mars · guided tour"}
        </span>
        <span className="absolute left-1/2 top-[38%] grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-accent/40 bg-ink-900/70 text-accent">
          <Play className="h-4 w-4 translate-x-0.5" />
        </span>
      </div>
      <p className="mt-3 text-[0.75rem] text-paper-dim">
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
      <div className="space-y-2.5">
        {gates.map((gate) => (
          <div key={gate.name}>
            <div className="flex items-center justify-between text-[0.75rem] text-paper-dim">
              <span>
                {ar ? "البوابة" : "Gate"} {gate.name}
              </span>
              <span>{gate.status}</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/[0.06]">
              <div className={`h-full rounded-full ${gate.tone}`} style={{ width: `${gate.level}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-ink-900/60 px-3 py-2.5 text-[0.8rem] leading-5 text-paper-dim">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c85c3a]" />
        {ar ? "البوابة C حرجة — انقل موظفين من البوابة D." : "Gate C is critical — move staff from Gate D."}
      </div>
    </div>
  );
}
