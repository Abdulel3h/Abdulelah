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
    <Card className="p-6 transition hover:-translate-y-1 hover:border-accent/30" style={{ transitionDelay: `${index * 35}ms` }}>
      <div className="flex gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent-soft">
          <Trophy className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-accent">{achievement.year}</p>
          <h3 className="mt-1 text-xl font-semibold text-paper">{achievement.title}</h3>
          <p className="mt-1 text-sm text-paper-dim">{achievement.organization}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-paper-dim">{achievement.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {achievement.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-paper-dim">
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
