/**
 * A calm, editorial backdrop: a single warm wash with a faint cool
 * counter-light. Where the browser supports scroll-driven animations the
 * light drifts gently as the page scrolls (pure CSS, no JavaScript); elsewhere,
 * and under reduced motion, it simply stays still.
 */
export function AnimatedAIBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0b]">
      <div className="absolute left-1/2 top-[-26rem] h-[46rem] w-[64rem] -translate-x-1/2">
        <div
          className="bg-drift-warm h-full w-full rounded-full blur-2xl"
          style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.10), transparent 72%)" }}
        />
      </div>

      <div
        className="bg-drift-cool absolute bottom-[-12rem] right-[-12rem] h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(120,130,150,0.05), transparent 70%)" }}
      />

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 85% at 50% -8%, transparent 52%, rgba(0,0,0,0.55))" }}
      />
    </div>
  );
}
