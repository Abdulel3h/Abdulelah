import { Reveal } from "@/components/ui/Reveal";
import { journeyTimeline } from "@/data/timeline";

export function JourneyPath() {
  return (
    <ol className="border-t border-white/[0.08]">
      {journeyTimeline.map((item, index) => (
        <li key={item.year}>
          <Reveal delay={index * 0.04}>
            <div className="group grid items-baseline gap-x-10 gap-y-3 border-b border-white/[0.08] py-8 md:grid-cols-[11rem_1fr]">
              <div className="flex items-center gap-3">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <span className="font-display text-3xl text-paper/40 transition-colors duration-500 group-hover:text-accent md:text-[2.75rem]">
                  {item.year}
                </span>
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-paper md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-paper-dim">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
