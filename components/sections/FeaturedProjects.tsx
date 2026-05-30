import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { featuredProjects } from "@/data/projects";

export function FeaturedProjects() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Selected work"
            title="Featured Case Studies"
            description="Three flagship projects showing local AI leadership, cloud-native sustainability analysis, and proactive AI security thinking."
          />
          <ButtonLink href="/projects" variant="secondary" showArrow className="shrink-0">
            View all projects
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
