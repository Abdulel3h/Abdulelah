import { describe, expect, it } from "vitest";
import { getProject, getProjects, projectCounts } from "@/data/projects";
import { evaluateAgentAnswer } from "@/lib/agent/evaluate";
import { getFallbackAgentResponse } from "@/lib/agent/fallback";
import { getMentionedProjectProfiles } from "@/lib/agent/project-guide";
import { locales } from "@/lib/i18n/config";
import { siteCopy } from "@/lib/i18n/experience";
import { buildSearchIndex } from "@/lib/search-index";

const REPOSITORY = "https://github.com/Abdulel3h/llm-application-engineering-Raqmi";

function shape(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => shape(item, `${prefix}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => shape(item, prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
}

describe("Raqmi", () => {
  it("is the first project in both languages, named in each script", () => {
    expect(getProjects("en")[0].slug).toBe("raqmi");
    expect(getProjects("ar")[0].slug).toBe("raqmi");
    expect(getProject("raqmi", "en")).toMatchObject({ name: "Raqmi", altName: "رقمي", status: "working-prototype" });
    expect(getProject("raqmi", "ar")).toMatchObject({ name: "رقمي", altName: "Raqmi" });
  });

  it("links the repository and the evidence documents, not a notebook screenshot", () => {
    const project = getProject("raqmi", "en")!;
    const hrefs = project.evidence.map((item) => item.href);

    expect(project.links.github).toBe(REPOSITORY);
    expect(hrefs).toEqual([
      REPOSITORY,
      `${REPOSITORY}/blob/main/Raqmi_Capstone.ipynb`,
      `${REPOSITORY}/blob/main/EVALUATION_REPORT.md`,
      `${REPOSITORY}/blob/main/TOOL_CALLING.md`
    ]);
  });

  it("tells the same story in English and Arabic", () => {
    const en = getProject("raqmi", "en")!;
    const ar = getProject("raqmi", "ar")!;

    expect(shape(ar.story)).toEqual(shape(en.story));
    expect(ar.highlights).toHaveLength(en.highlights!.length);
  });

  it("states each documented figure as its source wrote it", () => {
    for (const locale of locales) {
      const story = getProject("raqmi", locale)!.story!;

      // EVALUATION_REPORT.md / notebook cell 238a9f1b: 51/56 on both providers.
      expect(story.evaluation).toMatchObject({ passed: 51, total: 56 });
      expect(story.evaluation!.figures.map((figure) => figure.value)).toEqual(["29", "27", "24", "24 / 24"]);
      // The five DeepSeek FAQ failures, as printed by the failed-case reporter.
      expect(story.failures!.cases).toHaveLength(5);
      // GUARDRAILS.md: deterministic corpus, measured offline.
      expect(story.guardrails!.figures.map((figure) => figure.value)).toEqual(["32 / 32", "0 / 32", "0 / 56"]);
      // Structured output: 20 LIVE DeepSeek cases, 20/20 designed outcomes.
      expect(story.checks!.figures.map((figure) => figure.value)).toEqual(["20", "20 / 20"]);
      // TOOL_CALLING.md / notebook cell raqmi-tools-live: the denied cross-user lookup.
      const values = story.boundary!.rows.map((row) => row.value).join(" ");

      expect(values).toContain('lookup_order({"order_id": "5521"})');
      expect(values).toContain("authorization_denied");
    }
  });

  it("explores the boundary with captured scenarios only, and never quotes what was not printed", () => {
    for (const locale of locales) {
      const boundary = getProject("raqmi", locale)!.story!.boundary!;
      const gate = boundary.gate!;

      // The denial is the captured print itself (notebook cell raqmi-tools-live).
      expect(boundary.rows[1].value).toBe('lookup_order({"order_id": "5521"})');
      // TOOL_CALLING.md, "Final LIVE evidence": order 1024's lookup was issued
      // and executed live, but its message and reply were not printed — so
      // they are described, never put in quotation marks.
      expect(gate.allowed.rows[1].value).toBe('lookup_order({"order_id": "1024"})');
      for (const row of gate.allowed.rows.filter((item) => !item.code)) {
        expect(row.value, row.label).not.toMatch(/[“”"«»]/);
      }
      // Same rows, same order, in both scenarios.
      expect(gate.allowed.rows.map((row) => row.label)).toEqual(boundary.rows.map((row) => row.label));
      expect(gate.note).toMatch(/DeepSeek/);
    }
  });

  it("never overclaims", () => {
    for (const locale of locales) {
      const text = JSON.stringify(getProject("raqmi", locale));

      // Figures are counts with their scope, never percentages.
      expect(text).not.toMatch(/%/);
      expect(text).not.toMatch(
        /production[- ]ready|used by (?:real )?customers|real customer data|100 ?% secure|prevents prompt injection|blocks (?:all|every) attacks?|\brevenue\b|\bsavings\b|deflection|\bin production\b/i
      );
      expect(text).not.toMatch(/قيد التشغيل الفعلي|آمن تمامًا|يمنع كل الهجمات/);
    }

    const en = getProject("raqmi", "en")!;

    expect(en.notClaimed).toMatch(/not model accuracy/);
    expect(en.limitations.join(" ")).toMatch(/ALLaM’s native tool calling is untested/);
  });

  it("keeps the copy's project counts in step with the data", () => {
    const words = { en: { 5: "Five", 8: "Eight" }, ar: { 5: "خمسة", 8: "ثمانية" } } as const;

    expect(projectCounts).toMatchObject({ total: 8, prototypes: 5 });
    for (const locale of locales) {
      const copy = siteCopy(locale);

      expect(copy.projects.title).toContain(words[locale][8]);
      expect(copy.projects.titleSoft).toContain(words[locale][5]);
      expect(copy.home.work.title).toContain(words[locale][5]);
    }
  });

  it("can be found by its names and its subject, in both languages", () => {
    for (const locale of locales) {
      const entry = buildSearchIndex(locale).find((item) => item.id === "project-raqmi")!;
      const haystack = `${entry.label} ${entry.hint ?? ""} ${entry.keywords}`.toLowerCase();

      for (const term of ["raqmi", "رقمي", "authorization", "tool calling", "sdaia", "llm"]) {
        expect(haystack, `${locale}: ${term}`).toContain(term);
      }
    }
  });

  it("is known to the guide, with its figures scoped and no claims flagged", () => {
    const explained = getFallbackAgentResponse("Tell me about Raqmi");

    expect(explained).toContain("Raqmi");
    expect(explained).toContain("51 of 56");
    expect(explained).toContain("fictional data");

    const answer = getFallbackAgentResponse("How does the tool calling authorization work?");

    expect(answer).toContain("51 of 56");
    expect(answer).toContain("denied by application authorization");
    expect(answer).not.toMatch(/%|production-ready|real customers/i);
    expect(
      evaluateAgentAnswer({
        answer,
        actions: [{ label: "View Raqmi", href: "/projects/raqmi", type: "internal" }],
        responseKind: "portfolio"
      })
    ).toMatchObject({ passed: true, score: 100 });

    expect(getFallbackAgentResponse("وش مشروع رقمي؟")).toContain("رقمي");
  });

  it("finds Raqmi by name, but not in «الرقمية» (digital) or «رقمي» (my number)", () => {
    expect(getMentionedProjectProfiles("explain Raqmi").map((profile) => profile.slug)).toEqual(["raqmi"]);
    expect(getMentionedProjectProfiles("وش مشروع رقمي؟").map((profile) => profile.slug)).toEqual(["raqmi"]);
    expect(getMentionedProjectProfiles("الخدمات الرقمية")).toEqual([]);
    expect(getMentionedProjectProfiles("رقمي 0551234567")).toEqual([]);
  });

  it("lets the guide talk about customer support, but still flags claimed customers", () => {
    const actions = [{ label: "View Raqmi", href: "/projects/raqmi", type: "internal" as const }];
    const support = evaluateAgentAnswer({
      answer: "Raqmi is a customer support prototype for a fictional store; it refused another customer's order.",
      actions,
      responseKind: "portfolio"
    });

    expect(support.reasons).not.toContain("unsupported-claim-risk");

    for (const claim of ["Raqmi is used by customers in Riyadh.", "Abdulelah built it for his paying clients."]) {
      expect(evaluateAgentAnswer({ answer: claim, actions, responseKind: "portfolio" }).reasons).toContain(
        "unsupported-claim-risk"
      );
    }
  });
});
