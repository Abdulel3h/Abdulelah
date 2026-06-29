import type { Metadata } from "next";
import { ReadingPath } from "@/components/agent/ReadingPath";
import { WorkIndex } from "@/components/work/WorkIndex";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Seven products Abdulelah Alkhathami designed and built — across education, urban sustainability, government security, legal guidance, fintech inclusion, immersive VR learning, and computer-vision safety.",
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

      <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">The work</p>
          <h1 className="font-display text-4xl font-medium leading-[1.02] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
            Seven products. Seven real problems.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">
            From a university&apos;s AI assistant to a city&apos;s cooling strategy —
            each one began as a problem worth solving, and became a working system.
            Hover any title to look inside.
          </p>
        </div>
      </section>

      <section className="container-shell section-space">
        <WorkIndex />
        <div className="mt-16 border-t border-white/[0.08] pt-12">
          <ReadingPath page="projects" />
        </div>
      </section>
    </>
  );
}
