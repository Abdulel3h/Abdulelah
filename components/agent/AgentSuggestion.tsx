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
      className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.04] px-3.5 py-1.5 text-start text-xs font-medium text-paper transition hover:border-accent/40 hover:bg-accent/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="h-px w-3 shrink-0 bg-accent/70" aria-hidden="true" />
      <span dir="auto">{children}</span>
    </button>
  );
}
