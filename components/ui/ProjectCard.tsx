"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProjectCard({
  project,
  index = 0
}: {
  project: Project;
  index?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.05 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl transition"
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative min-h-40 border-b border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(124,58,237,0.12),rgba(201,168,76,0.09))] p-5">
        <div className="absolute inset-0 bg-soft-grid bg-[length:26px_26px] opacity-35 transition group-hover:scale-105" />
        <span className="shimmer-line absolute inset-x-0 top-0 h-px overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1/2 animate-[shimmer_5.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </span>
        <div className="relative flex items-start justify-between gap-4">
          <Badge className="max-w-[78%]">{project.category}</Badge>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-sky-100 shadow-glow transition group-hover:border-sky-300/45">
            <Code2 className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div className="relative mt-9 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-200">{project.year}</p>
          <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">
          {project.shortDescription}
        </p>
        <p className="mt-5 text-sm text-slate-400">
          Role: <span className="text-slate-200">{project.role}</span>
        </p>
        <p className="mt-3 border-l border-gold/45 pl-3 text-sm leading-6 text-slate-300">
          {project.impact}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="muted">
              {tech}
            </Badge>
          ))}
        </div>
        <Button asChild variant="secondary" className="mt-6 group-hover:border-sky-300/50 group-hover:bg-sky-300/15">
          <Link href={`/projects/${project.slug}`}>
            View Case Study
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
