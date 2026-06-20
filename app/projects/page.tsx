import type { Metadata } from "next";
import { ProjectsFilter } from "@/components/projects/ProjectsFilter";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "A collection of AI, cloud, NLP, security, sustainability, fintech, legal tech, and intelligent system projects by Abdulelah Alkhathami.",
  path: "/projects"
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" }
        ])}
      />
      <PageHero
        eyebrow="Projects"
        title="Applied AI case studies across cloud, NLP, security, and intelligent systems."
        subtitle="A collection of applied projects built across education, urban planning, government digital security, legal guidance, fintech inclusion, and VR learning."
        stats={[
          { value: "6", label: "Projects" },
          { value: "6", label: "Domains" },
          { value: "Cloud + AI", label: "Google Cloud and Azure exposure" },
          { value: "Leadership", label: "Graduation project and delivery" }
        ]}
      />
      <section className="container-shell section-space">
        <ProjectsFilter />
      </section>
    </>
  );
}
