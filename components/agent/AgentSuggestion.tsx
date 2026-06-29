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
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-medium text-paper-dim transition hover:border-accent/35 hover:bg-accent/[0.08] hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="h-px w-3 shrink-0 bg-accent/70" aria-hidden="true" />
      {children}
    </button>
  );
}
