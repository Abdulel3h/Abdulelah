import { cn } from "@/lib/utils";
import type { SkillLevel } from "@/data/skills";

const levelStyles: Record<SkillLevel, string> = {
  Strong: "border-sky-300/35 bg-sky-300/[0.12] text-sky-100",
  "Practical Experience": "border-violet-300/30 bg-violet-300/10 text-violet-100",
  Familiar: "border-gold/35 bg-gold/10 text-amber-100"
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
      <span className="text-sm font-semibold text-white">{name}</span>
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
