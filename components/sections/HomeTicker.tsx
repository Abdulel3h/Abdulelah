const tickerItems = [
  "Local AI Academic Assistant",
  "Google Cloud Hackathon Project",
  "AI Security & UEBA Concept",
  "SDAIA x Microsoft Top 30",
  "AI + NLP + Cloud Systems",
  "University of Bisha Graduate",
  "LLM Applications",
  "Sustainability AI",
  "Cloud Architecture",
  "Applied AI Projects"
];

function TickerGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8"
      aria-hidden={hidden || undefined}
    >
      {tickerItems.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-3 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-300 sm:text-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.95)]" />
          {item}
        </span>
      ))}
    </div>
  );
}

export function HomeTicker() {
  return (
    <section
      className="home-ticker border-y border-sky-300/15 bg-[#020817]/88"
      aria-label="AI portfolio highlights"
    >
      <div className="home-ticker-track py-3.5 sm:py-4">
        <TickerGroup />
        <TickerGroup hidden />
      </div>
    </section>
  );
}
