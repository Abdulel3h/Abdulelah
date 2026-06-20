import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Github,
  Layers3,
  Lightbulb,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { ProjectArchitectureFlow } from "@/components/projects/ProjectArchitectureFlow";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProjectBySlug, projects } from "@/data/projects";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found"
    };
  }

  return createPageMetadata({
    title: project.title,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
    type: "article"
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const relatedProjects = [
    projects[(projectIndex + 1) % projects.length],
    projects[(projectIndex + 2) % projects.length]
  ].filter(Boolean);
  const overviewCards = [
    { title: "Problem", body: project.problem, icon: Lightbulb },
    { title: "Solution", body: project.solution, icon: Sparkles },
    { title: "My Role", body: project.role, icon: ShieldCheck },
    { title: "Impact", body: project.impact, icon: Layers3 }
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` }
        ])}
      />
      <section className="container-shell pt-12 sm:pt-16 lg:pt-20">
        <Link
          href="/projects"
          className="focus-ring mb-8 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Projects
        </Link>

        <div className="premium-panel p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-20" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="badge mb-5">{project.category}</p>
            <h1 className="max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {project.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links?.demo ? (
                <ButtonLink href={project.links.demo} external>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Demo
                </ButtonLink>
              ) : null}
              {project.links?.github ? (
                <ButtonLink href={project.links.github} variant="secondary" external>
                  <Github className="h-4 w-4" aria-hidden="true" />
                  GitHub
                </ButtonLink>
              ) : null}
              <ButtonLink href="/contact" variant="gold">
                Discuss Similar Work
              </ButtonLink>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-lg font-semibold text-white">Case study profile</h2>
            <dl className="mt-6 grid gap-5">
              <div>
                <dt className="text-sm text-slate-400">Role</dt>
                <dd className="mt-1 font-semibold text-white">{project.role}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">Year</dt>
                <dd className="mt-1 font-semibold text-white">{project.year}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">Technologies</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
          </div>
        </div>
      </section>

      {project.context ? (
        <section className="container-shell pb-12">
          <div className="rounded-3xl border border-sky-300/20 bg-sky-300/10 p-6 text-sky-50">
            <p className="text-sm font-semibold">Context</p>
            <p className="mt-2 leading-7 text-sky-100/90">{project.context}</p>
          </div>
        </section>
      ) : null}

      <section className="section-space section-band">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.title} className="glass-card rounded-3xl p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 text-xl font-semibold text-white">{card.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="My role"
            title={project.role}
            description="Responsibilities focused on shaping the solution, connecting technical choices to user needs, and helping move the idea into a coherent working concept."
          />
          <div className="grid gap-3">
            {project.responsibilities.map((responsibility) => (
              <div
                key={responsibility}
                className="subtle-card flex gap-3 rounded-2xl p-4 text-sm leading-7 text-slate-300"
              >
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                {responsibility}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space section-band">
        <div className="container-shell">
          <SectionHeader
            eyebrow="Technical architecture"
            title="How the solution was structured"
            description="Each case study is grounded in a practical technical approach, from local AI knowledge design to cloud-native analysis and behavioral analytics."
          />
          <div className="mt-10">
            <ProjectArchitectureFlow project={project} />
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {project.technicalApproach.map((item) => (
              <div key={item} className="glass-card flex gap-4 rounded-2xl p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
                  <Layers3 className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="grid gap-8 lg:grid-cols-2">
          <article>
            <SectionHeader eyebrow="Key features" title="What the project enables" />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <div key={feature} className="subtle-card flex gap-3 rounded-2xl p-4 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                  {feature}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card rounded-3xl p-6 sm:p-8">
            <p className="badge mb-5">Impact</p>
            <h2 className="text-2xl font-semibold text-white">Applied value</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{project.impact}</p>
            {project.lessons ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">Lessons Learned</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{project.lessons}</p>
              </div>
            ) : null}
            {project.quote ? (
              <blockquote className="mt-6 border-l-2 border-gold pl-5 text-lg font-medium leading-8 text-amber-100">
                {project.quote}
              </blockquote>
            ) : null}
          </article>
        </div>
      </section>

      <section className="section-space section-band">
        <div className="container-shell">
          <SectionHeader
            eyebrow="Gallery"
            title="Future media placeholders"
            description="Elegant slots ready for screenshots, architecture diagrams, prototype screens, or demo visuals."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {project.gallery.map((item) => (
              <div
                key={item}
                className="relative min-h-56 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(124,58,237,0.10),rgba(201,168,76,0.09))] p-5"
              >
                <div className="absolute inset-0 bg-soft-grid bg-[length:24px_24px] opacity-30" />
                <div className="absolute bottom-5 left-5 right-5 h-24 rounded-2xl border border-white/10 bg-slate-950/35" />
                <p className="relative badge">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <SectionHeader
          eyebrow="Related projects"
          title="Continue exploring applied AI work"
          description="Move through the portfolio by domain, role, and technical approach."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {relatedProjects.map((related) => (
            <Link
              key={related.slug}
              href={`/projects/${related.slug}`}
              className="focus-ring glass-card group rounded-2xl p-6 transition hover:-translate-y-1 hover:border-sky-300/35"
            >
              <p className="badge mb-4">{related.category}</p>
              <h2 className="text-xl font-semibold text-white">{related.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{related.shortDescription}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
                View case study
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
