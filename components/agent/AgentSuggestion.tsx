import { Sparkles } from "lucide-react";

export function AgentSuggestion({
  children,
  disabled,
  onSelect
}: {
  children: string;
  disabled?: boolean;
  onSelect: (prompt: string) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(children)}
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-left text-xs font-medium text-paper-dim transition hover:border-accent/35 hover:bg-accent/[0.08] hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
      {children}
    </button>
  );
}
