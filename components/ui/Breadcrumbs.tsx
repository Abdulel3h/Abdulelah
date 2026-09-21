import { ChevronRight } from "lucide-react";
import Link from "next/link";

/** Breadcrumb trail; the separator mirrors in right-to-left layouts. */
export function Breadcrumbs({
  label,
  items
}: {
  label: string;
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-paper-dim">
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="focus-ring inline-flex min-h-11 items-center rounded transition hover:text-paper"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-paper">
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRight className="h-3.5 w-3.5 text-paper-faint rtl:-scale-x-100" aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
