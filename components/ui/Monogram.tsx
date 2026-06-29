type MonogramProps = {
  className?: string;
  /** When provided, the mark is announced to assistive tech; otherwise it is decorative. */
  title?: string;
};

/**
 * "AA" — Abdulelah Alkhathami. Two monoline A's sharing a single base, drawn in
 * currentColor. A quiet signature mark: no circuits, no sparkles, no AI motifs.
 */
export function Monogram({ className, title }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 48 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <g
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 37 L14 6 L24 37" />
        <path d="M24 37 L34 6 L44 37" />
        <path d="M8 25 H20" />
        <path d="M28 25 H40" />
      </g>
    </svg>
  );
}
