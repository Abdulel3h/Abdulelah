"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { ProductPreview } from "@/components/work/ProductPreview";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function WorkStory({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion();
  const flipped = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");

  const [name, ...rest] = project.title.split(" - ");
  const descriptor = rest.join(" — ");
  const kicker = project.category.split("/")[0].trim();
  const tagline = project.tagline ?? project.shortDescription;
  const flow = project.flow ?? project.technologies.slice(0, 4);
  const metrics = project.metrics ?? [];

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 48 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -8 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn("relative", flipped && "lg:order-2")}
      >
        <div
          className="absolute -inset-6 -z-10 rounded-[2.5rem]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(201,167,92,0.12), transparent 76%)"
          }}
          aria-hidden="true"
        />
        <ProductPreview kind={project.previewKind} />
      </motion.div>

      <div className={cn(flipped && "lg:order-1")}>
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl text-accent">{num}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-accent/40 via-white/10 to-transparent" />
          <span className="text-[0.66rem] uppercase tracking-[0.18em] text-paper-faint">
            {kicker} · {project.year}
          </span>
        </div>

        <h3 className="mt-6 font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
          {name}
        </h3>
        {descriptor ? (
          <p className="mt-1.5 text-sm uppercase tracking-[0.14em] text-paper-faint">
            {descriptor}
          </p>
        ) : null}

        <p className="mt-5 max-w-xl text-lg leading-8 text-paper">{tagline}</p>
        <p className="mt-3 max-w-xl text-sm leading-7 text-paper-dim">
          {project.shortDescription}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-paper-dim">
          {flow.map((step, stepIndex) => (
            <Fragment key={step}>
              {stepIndex > 0 ? (
                <ArrowRight className="h-3 w-3 text-accent/60" aria-hidden="true" />
              ) : null}
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1">
                {step}
              </span>
            </Fragment>
          ))}
        </div>

        {metrics.length ? (
          <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-6">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <p className="font-display text-lg leading-tight text-paper">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-paper-dim">{metric.label}</p>
              </div>
            ))}
          </div>
        ) : null}

        <p className="mt-6 text-sm text-paper-dim">
          Abdulelah&apos;s role —{" "}
          <span className="text-paper">{project.role}</span>
        </p>

        <Link
          href={`/projects/${project.slug}`}
          className="focus-ring group mt-7 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-accent-soft transition hover:text-accent"
        >
          Explore the build
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
}
