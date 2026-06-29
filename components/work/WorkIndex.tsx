"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { ProductPreview } from "@/components/work/ProductPreview";
import { projects } from "@/data/projects";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function WorkIndex() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];
  const [activeName] = active.title.split(" - ");

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <ol>
        {projects.map((project, index) => {
          const [name] = project.title.split(" - ");
          const kicker = project.category.split("/")[0].trim();
          const isActive = index === activeIndex;

          return (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className="focus-ring group block rounded-lg border-b border-white/[0.08] py-6"
              >
                <div className="flex items-center gap-5">
                  <span
                    className={cn(
                      "font-display text-sm tabular-nums transition-colors",
                      isActive ? "text-accent" : "text-paper-faint"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2
                      className={cn(
                        "font-display text-2xl font-medium leading-tight transition-colors sm:text-3xl lg:text-[2.4rem]",
                        isActive
                          ? "text-paper"
                          : "text-paper/75 lg:text-paper/45 lg:group-hover:text-paper/80"
                      )}
                    >
                      {name}
                    </h2>
                    <p className="mt-1 truncate text-[0.68rem] uppercase tracking-[0.16em] text-paper-faint">
                      {kicker} · {project.year}
                    </p>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all",
                      isActive
                        ? "translate-x-0 text-accent opacity-100"
                        : "-translate-x-2 text-paper-faint opacity-0 group-hover:opacity-100"
                    )}
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-5 lg:hidden">
                  <ProductPreview kind={project.previewKind} />
                  <p className="mt-3 text-sm leading-7 text-paper-dim">
                    {project.tagline ?? project.shortDescription}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-28">
          <motion.div
            key={active.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: ease.out }}
          >
            <div className="relative">
              <div
                className="absolute -inset-6 -z-10 rounded-[2.5rem]"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(201,167,92,0.12), transparent 76%)"
                }}
                aria-hidden="true"
              />
              <ProductPreview kind={active.previewKind} />
            </div>

            <p className="mt-6 max-w-md text-lg leading-8 text-paper">
              {active.tagline ?? active.shortDescription}
            </p>

            {active.flow ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-paper-dim">
                {active.flow.map((step, index) => (
                  <Fragment key={step}>
                    {index > 0 ? (
                      <ArrowRight className="h-3 w-3 text-accent/60" aria-hidden="true" />
                    ) : null}
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1">
                      {step}
                    </span>
                  </Fragment>
                ))}
              </div>
            ) : null}

            <Link
              href={`/projects/${active.slug}`}
              className="focus-ring group mt-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-accent-soft transition hover:text-accent"
            >
              Explore {activeName}
              <ArrowUpRight
                className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
