"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container-shell flex min-h-[70vh] items-center justify-center py-24">
      <section className="glass-card max-w-2xl rounded-2xl p-8 text-center">
        <p className="badge mx-auto mb-5 w-fit">Something went wrong</p>
        <h1 className="text-3xl font-semibold text-paper sm:text-4xl">
          This page hit an unexpected error.
        </h1>
        <p className="mt-4 text-paper-dim">
          You can try loading it again, or head back to the home page and
          continue exploring the portfolio from there.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-900 transition hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-paper transition hover:border-accent/40 hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
