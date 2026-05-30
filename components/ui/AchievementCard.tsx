import { Trophy } from "lucide-react";
import type { Achievement } from "@/data/achievements";
import { Card } from "@/components/ui/card";

export function AchievementCard({
  achievement,
  index = 0
}: {
  achievement: Achievement;
  index?: number;
}) {
  return (
    <Card className="p-6 transition hover:-translate-y-1 hover:border-sky-300/30" style={{ transitionDelay: `${index * 35}ms` }}>
      <div className="flex gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-amber-100">
          <Trophy className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gold">{achievement.year}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{achievement.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{achievement.organization}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-300">{achievement.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {achievement.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
