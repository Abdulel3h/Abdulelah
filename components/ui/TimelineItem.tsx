import { Calendar } from "lucide-react";
import type { TimelineEvent } from "@/data/timeline";
import { Card } from "@/components/ui/card";

export function TimelineItem({
  item,
  index = 0
}: {
  item: TimelineEvent;
  index?: number;
}) {
  return (
    <Card
      className="relative grid gap-5 p-5 transition hover:border-sky-300/30 sm:grid-cols-[8rem_1fr]"
      style={{ transitionDelay: `${index * 35}ms` }}
    >
      <span className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-sky-300/25 to-transparent sm:left-[8.9rem]" aria-hidden="true" />
      <div className="flex items-center gap-3">
        <span className="z-10 grid h-10 w-10 place-items-center rounded-full border border-sky-300/25 bg-sky-300/10 text-sky-100 shadow-glow">
          <Calendar className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-xl font-semibold text-white">{item.year}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
