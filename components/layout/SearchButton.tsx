"use client";

import { Search } from "lucide-react";
import { openSearch } from "@/lib/ui-events";

/** Opens the site search dialog; focus returns here when it closes. */
export function SearchButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => openSearch({ returnFocusTo: event.currentTarget })}
      className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] px-4 text-base font-medium text-paper transition hover:border-accent/40 hover:text-accent-soft"
    >
      <Search className="h-4 w-4 text-accent" aria-hidden="true" />
      {label}
    </button>
  );
}
