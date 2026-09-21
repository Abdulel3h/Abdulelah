import { describe, expect, it } from "vitest";
import { getProjects, projectCounts, projects } from "@/data/projects";
import { buildPortfolioContext } from "@/lib/agent/context";
import { getFallbackAgentResponse } from "@/lib/agent/fallback";

const STATUSES = [
  "live",
  "production",
  "pilot",
  "working-prototype",
  "graduation-project",
  "hackathon-prototype",
  "concept"
];

describe("project evidence", () => {
  it("counts seven projects: four prototypes, three concepts, three with public code", () => {
    expect(projectCounts).toEqual({ total: 7, prototypes: 4, concepts: 3, publicRepositories: 3 });
  });

  it("gives every project a verified status, role, evidence and limits in both languages", () => {
    for (const locale of ["en", "ar"] as const) {
      for (const project of getProjects(locale)) {
        expect(STATUSES).toContain(project.status);
        expect(project.role.length).toBeGreaterThan(3);
        expect(project.statusDetail.length).toBeGreaterThan(20);
        expect(project.summary.length).toBeGreaterThan(20);
        expect(project.domain.length).toBeGreaterThan(2);
        expect(project.year).toMatch(/^20\d\d$/);
        expect(project.evidence.length).toBeGreaterThan(0);
        expect(project.limitations.length).toBeGreaterThan(0);
        expect(project.next.length).toBeGreaterThan(0);
        expect(project.constraints.length).toBeGreaterThan(0);
        expect(project.decisions.length).toBeGreaterThan(0);
        expect(project.outcome.length).toBeGreaterThan(20);
        expect(project.notClaimed.length).toBeGreaterThan(10);
      }
    }
  });

  it("never claims a stronger status than the evidence allows", () => {
    for (const project of getProjects("en")) {
      // Nothing in the portfolio is live or in production.
      expect(["live", "production", "pilot"]).not.toContain(project.status);

      // A repository link only exists where the evidence type is a public repository.
      expect(Boolean(project.links.github)).toBe(project.evidenceType === "public-repository");

      const text = JSON.stringify(project);

      expect(text).not.toMatch(/\bshipped\b|\blaunched\b|open[- ]source/i);
    }
  });

  it("labels concepts as concepts and links no code for them", () => {
    const concepts = getProjects("en").filter((project) => project.status === "concept");

    expect(concepts.map((project) => project.slug).sort()).toEqual(["medad", "qanouni", "virtual-astronauts"]);
    for (const project of concepts) {
      expect(project.links.github).toBeUndefined();
      expect(project.evidence.some((item) => item.href?.startsWith("http"))).toBe(false);
    }
  });

  it("keeps the English guide view aligned with the page data", () => {
    const chatub = projects.find((project) => project.slug === "chatub");

    expect(chatub?.title).toBe("ChatUB - Local Arabic academic assistant");
    expect(chatub?.impact).toContain("working prototype");
  });

  it("gives the guide status and limits for every project", () => {
    const context = buildPortfolioContext();

    for (const project of projects) {
      expect(context).toContain(project.name);
    }

    expect(context).toContain("Status:");
    expect(context).toContain("Limitations:");
    expect(context).toMatch(/Never call any project shipped/);
  });

  it("answers code and summary questions without overclaiming", () => {
    const code = getFallbackAgentResponse("Which projects have public code?");

    expect(code).toContain("ChatUB");
    expect(code).toContain("Stadium");
    expect(code).toContain("Absher Insight AI");

    const arabic = getFallbackAgentResponse("أي المشاريع لها كود منشور؟");

    expect(arabic).toContain("Stadium");
    expect(getFallbackAgentResponse("Give me the 30-second summary")).not.toMatch(/shipped|production-ready/i);
  });
});
