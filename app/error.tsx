"use client";

import Link from "next/link";
import { ArrowUpRight, RotateCcw } from "lucide-react";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container-shell flex min-h-[78svh] flex-col justify-center py-24">
      <p className="eyebrow mb-6">Something broke</p>
      <h1 className="font-display text-5xl font-medium leading-[0.98] tracking-[-0.01em] text-paper sm:text-6xl lg:text-7xl">
        Well, that wasn&apos;t{" "}
        <span className="italic text-paper/55">supposed to happen.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-paper-dim">
        An unexpected error interrupted this page. Try it again, or head back home
        and keep exploring.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={reset}
          className="focus-ring group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-900 transition hover:bg-accent-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
        <Link
          href="/"
          className="focus-ring group inline-flex items-center gap-1.5 rounded text-base font-medium text-paper transition-colors hover:text-accent"
        >
          Back home
          <ArrowUpRight
            className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </main>
  );
}
