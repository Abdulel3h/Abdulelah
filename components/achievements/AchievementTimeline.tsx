import { Trophy } from "lucide-react";
import type { Achievement } from "@/data/achievements";
import { Card } from "@/components/ui/card";

export function AchievementTimeline({ items }: { items: Achievement[] }) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-sky-300/0 via-sky-300/40 to-gold/0 md:block" />
      <div className="grid gap-5">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="relative md:pl-14"
            style={{ transitionDelay: `${index * 35}ms` }}
          >
            <span className="absolute left-0 top-6 hidden h-10 w-10 place-items-center rounded-full border border-sky-300/35 bg-slate-950 text-sky-200 shadow-glow md:grid">
              <Trophy className="h-4 w-4" aria-hidden="true" />
            </span>
            <Card className="p-6 transition hover:border-sky-300/30">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gold">{item.year}</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.organization}</p>
                </div>
                <p className="badge w-fit">{item.tags[0]}</p>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-300">{item.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </article>
        ))}
      </div>
    </div>
  );
}
