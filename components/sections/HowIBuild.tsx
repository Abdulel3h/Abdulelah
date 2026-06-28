const principles = [
  {
    title: "Context over hype",
    body: "I start with the environment, not the model. The best system is the one that actually fits the place it serves."
  },
  {
    title: "Privacy by design",
    body: "Trust is a feature. I default to local-first thinking and data practices that respect the people behind it."
  },
  {
    title: "Ship, then refine",
    body: "An idea means nothing until it runs. I build working systems first, then make them sharper."
  },
  {
    title: "Details are the product",
    body: "Craft compounds. The small decisions — wording, timing, spacing — are the ones people actually feel."
  }
];

export function HowIBuild() {
  return (
    <section className="section-space section-band">
      <div className="container-shell">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">How I build</p>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl">
            A way of working, not a job title.
          </h2>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle, index) => (
            <div key={principle.title} className="border-t border-white/[0.10] pt-5">
              <span className="font-display text-sm text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-xl font-medium text-paper">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-paper-dim">{principle.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
