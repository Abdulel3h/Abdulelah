import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-[70vh] items-center justify-center py-24">
      <section className="glass-card max-w-2xl rounded-2xl p-8 text-center">
        <p className="badge mx-auto mb-5 w-fit">404</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          This page is not available.
        </h1>
        <p className="mt-4 text-slate-300">
          The route may have moved, or the case study has not been published yet.
        </p>
        <Link
          href="/"
          className="focus-ring mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </section>
    </main>
  );
}
