import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "The work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-[78svh] flex-col justify-center py-24">
      <p className="eyebrow mb-6">Error 404</p>
      <h1 className="font-display text-5xl font-medium leading-[0.98] tracking-[-0.01em] text-paper sm:text-6xl lg:text-7xl">
        This page didn&apos;t{" "}
        <span className="italic text-paper/55">make it to production.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-paper-dim">
        The link may have moved, or the case study isn&apos;t published yet.
        Here&apos;s the way back.
      </p>
      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="focus-ring group inline-flex items-center gap-1.5 rounded text-base font-medium text-paper transition-colors hover:text-accent"
            >
              {link.label}
              <ArrowUpRight
                className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
