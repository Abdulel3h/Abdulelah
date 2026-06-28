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
import { CompanionCue } from "@/components/agent/CompanionCue";
import { ProjectArchitectureFlow } from "@/components/projects/ProjectArchitectureFlow";
import { ProductPreview } from "@/components/work/ProductPreview";
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
          className="focus-ring mb-8 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-paper-dim transition hover:text-paper"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Projects
        </Link>

        <div className="premium-panel p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-20" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="badge mb-5">{project.category}</p>
            <h1 className="max-w-5xl text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              {project.title}
            </h1>
            {project.tagline ? (
              <p className="mt-6 max-w-3xl font-display text-2xl italic leading-snug text-paper">
                {project.tagline}
              </p>
            ) : null}
            <p className="mt-4 max-w-3xl text-base leading-8 text-paper-dim">
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
            <h2 className="text-lg font-semibold text-paper">Case study profile</h2>
            <dl className="mt-6 grid gap-5">
              <div>
                <dt className="text-sm text-paper-dim">Role</dt>
                <dd className="mt-1 font-semibold text-paper">{project.role}</dd>
              </div>
              <div>
                <dt className="text-sm text-paper-dim">Year</dt>
                <dd className="mt-1 font-semibold text-paper">{project.year}</dd>
              </div>
              <div>
                <dt className="text-sm text-paper-dim">Technologies</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-paper-dim"
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
          <div className="rounded-3xl border border-accent/20 bg-accent/10 p-6 text-accent">
            <p className="text-sm font-semibold">Context</p>
            <p className="mt-2 leading-7 text-accent/90">{project.context}</p>
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
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 text-xl font-semibold text-paper">{card.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-paper-dim">{card.body}</p>
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
                className="subtle-card flex gap-3 rounded-2xl p-4 text-sm leading-7 text-paper-dim"
              >
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
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
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                  <Layers3 className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-sm leading-7 text-paper-dim">{item}</p>
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
                <div key={feature} className="subtle-card flex gap-3 rounded-2xl p-4 text-sm text-paper-dim">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {feature}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card rounded-3xl p-6 sm:p-8">
            <p className="badge mb-5">Impact</p>
            <h2 className="text-2xl font-semibold text-paper">Applied value</h2>
            <p className="mt-4 text-sm leading-7 text-paper-dim">{project.impact}</p>
            {project.lessons ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-paper">Lessons Learned</p>
                <p className="mt-2 text-sm leading-7 text-paper-dim">{project.lessons}</p>
              </div>
            ) : null}
            {project.quote ? (
              <blockquote className="mt-6 border-l-2 border-accent pl-5 text-lg font-medium leading-8 text-accent-soft">
                {project.quote}
              </blockquote>
            ) : null}
          </article>
        </div>
      </section>

      {project.previewKind ? (
        <section className="section-space section-band">
          <div className="container-shell">
            <SectionHeader
              eyebrow="Inside the product"
              title="A look at how it works"
              description="A handcrafted preview of the experience — drawn to show the idea, not a stock screenshot."
            />
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="relative">
                <div
                  className="absolute -inset-6 -z-10 rounded-[2.5rem]"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(201,167,92,0.12), transparent 76%)"
                  }}
                  aria-hidden="true"
                />
                <ProductPreview kind={project.previewKind} />
              </div>
              {project.metrics ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-white/[0.08]">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="lg:py-5 lg:first:pt-0">
                      <p className="font-display text-2xl text-paper">{metric.value}</p>
                      <p className="mt-1 text-sm leading-6 text-paper-dim">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-shell pb-4">
        <CompanionCue
          title={`Want the story behind ${project.title.split(" - ")[0]}?`}
          body="I'll walk you through how it started, the hardest part, the trade-offs, and what I'd change next time."
          prompt={`Tell me the story behind ${project.title} — how it started, the hardest part, the key trade-offs, and what you would improve.`}
          cta="Tell me"
        />
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
              className="focus-ring glass-card group rounded-2xl p-6 transition hover:-translate-y-1 hover:border-accent/35"
            >
              <p className="badge mb-4">{related.category}</p>
              <h2 className="text-xl font-semibold text-paper">{related.title}</h2>
              <p className="mt-3 text-sm leading-7 text-paper-dim">{related.shortDescription}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
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
