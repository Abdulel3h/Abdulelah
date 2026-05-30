"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { projectFilters, projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const projectMetrics = [
  { value: "6", label: "Projects" },
  { value: "6", label: "Domains" },
  { value: "Cloud + AI", label: "Deployment thinking" },
  { value: "Leadership", label: "Delivery focus" }
];

const domains = [
  { label: "Education", projects: "ChatUB, Virtual Astronauts" },
  { label: "Sustainability", projects: "Althil" },
  { label: "Security", projects: "Absher Insight AI" },
  { label: "LegalTech", projects: "Qanouni" },
  { label: "FinTech", projects: "Medad" }
];

export function ProjectsFilter() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const filter = activeFilter.toLowerCase();
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const searchable = [
        project.category,
        project.title,
        project.shortDescription,
        project.role,
        project.impact,
        ...project.technologies
      ]
        .join(" ")
        .toLowerCase();

      const matchesFilter = activeFilter === "All" || searchable.includes(filter);
      const matchesSearch = !query || searchable.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {projectMetrics.map((metric) => (
          <Card key={metric.label} className="p-5">
            <p className="text-xl font-semibold text-white">{metric.value}</p>
            <p className="mt-1 text-sm text-slate-400">{metric.label}</p>
          </Card>
        ))}
      </div>

      <label className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl">
        <Search className="h-5 w-5 shrink-0 text-sky-200" aria-hidden="true" />
        <span className="sr-only">Search projects</span>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search projects, domains, or technologies..."
          className="border-0 bg-transparent px-0 shadow-none"
        />
      </label>

      <div
        className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
        aria-label="Project filters"
      >
        {projectFilters.map((filter) => (
          <Button
            key={filter}
            type="button"
            variant={activeFilter === filter ? "secondary" : "outline"}
            size="sm"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "shrink-0",
              activeFilter === filter && "border-sky-300/60 bg-sky-300/15 text-sky-100"
            )}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
      {!filteredProjects.length ? (
        <Card className="mt-10 p-8 text-center text-slate-300">
          No project matches that search yet. Try a domain like NLP, Cloud, Security, or Education.
        </Card>
      ) : null}

      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-white">Projects by domain</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {domains.map((domain) => (
            <Card key={domain.label} className="p-5">
              <p className="text-sm font-semibold text-sky-100">{domain.label}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{domain.projects}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
