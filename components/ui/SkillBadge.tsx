import { cn } from "@/lib/utils";
import type { SkillLevel } from "@/data/skills";

const levelStyles: Record<SkillLevel, string> = {
  Strong: "border-accent/35 bg-accent/[0.12] text-accent",
  "Practical Experience": "border-accent/30 bg-accent/10 text-accent",
  Familiar: "border-accent/35 bg-accent/10 text-accent-soft"
};

export function SkillBadge({
  name,
  level
}: {
  name: string;
  level: SkillLevel;
}) {
  return (
    <div className="subtle-card flex min-h-24 flex-col justify-between rounded-2xl p-4">
      <span className="text-sm font-semibold text-paper">{name}</span>
      <span
        className={cn(
          "mt-4 w-fit rounded-full border px-3 py-1 text-xs font-medium",
          levelStyles[level]
        )}
      >
        {level}
      </span>
    </div>
  );
}
