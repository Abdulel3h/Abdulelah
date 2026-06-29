import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkStory } from "@/components/work/WorkStory";
import { featuredProjects } from "@/data/projects";

export function FeaturedWork() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="flex flex-col gap-6 border-b border-white/[0.07] pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">Selected work</p>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl lg:text-5xl">
              A studio of one.
              <span className="block text-paper/55">Here is what I&apos;ve built.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-paper-dim">
            Each product began as a real problem in education, sustainability, or
            security — and became a working system. These are three of them.
          </p>
        </div>

        <div className="mt-16 space-y-24 lg:space-y-32">
          {featuredProjects.map((project, index) => (
            <WorkStory key={project.slug} project={project} index={index} />
          ))}
        </div>

        <div className="mt-20 flex justify-center border-t border-white/[0.07] pt-12">
          <Link
            href="/projects"
            className="focus-ring group inline-flex items-center gap-2 rounded-full text-sm font-semibold text-paper transition hover:text-accent-soft"
          >
            See the full body of work
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
