import { describe, expect, it } from "vitest";
import { getProjects, projectCounts } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { complete, COMMANDS, findProject, parse, run, type ShellLine } from "@/lib/shell/commands";
import { buildShellData } from "@/lib/shell/data";

const en = buildShellData("en");
const ar = buildShellData("ar");

function text(lines: ShellLine[]) {
  return lines
    .map((line) => {
      switch (line.kind) {
        case "text":
          return line.text;
        case "pair":
          return `${line.label} ${line.value}`;
        case "link":
          return `${line.label} ${line.href}`;
        case "project":
          return `${line.name} ${line.status} ${line.href}`;
        case "command":
          return `${line.name} ${line.description}`;
        case "copy":
          return line.value;
      }
    })
    .join("\n");
}

describe("the opening shell", () => {
  it("documents every command it understands, in both languages", () => {
    for (const data of [en, ar]) {
      const help = run(data, "help");

      for (const command of COMMANDS) {
        expect(help.lines.some((line) => line.kind === "command" && line.name === command)).toBe(true);
        expect(data.copy.help[command]).toBeTruthy();
      }
    }
  });

  it("prints the site's own facts, never new ones", () => {
    const listing = run(en, "projects");
    const projects = listing.lines.filter((line) => line.kind === "project");

    expect(projects).toHaveLength(projectCounts.total);
    expect(text(listing.lines)).toContain(`${projectCounts.total} projects`);
    expect(text(listing.lines)).toContain(`${projectCounts.prototypes} working, with public code`);
    expect(text(listing.lines)).toContain(`${projectCounts.concepts} concepts`);

    // Every status is the one data/projects.ts gives the project.
    for (const project of getProjects("en")) {
      const line = projects.find((item) => item.kind === "project" && item.slug === project.slug);

      expect(line && line.kind === "project" && line.concept).toBe(project.status === "concept");
    }

    expect(text(run(en, "contact").lines)).toContain(siteConfig.email);
    expect(text(run(en, "cv").lines)).toContain(siteConfig.resumes.engineer);
    expect(text(run(en, "cv").lines)).toContain(siteConfig.resumes.specialist);
    expect(text(run(en, "whoami").lines)).toContain("Applied AI Engineer");
  });

  it("opens case studies by command, bare name, prefix or Arabic name", () => {
    expect(run(en, "open raqmi").effect).toEqual({ type: "navigate", href: "/projects/raqmi" });
    expect(run(en, "cd ~/projects/stadium").effect).toEqual({ type: "navigate", href: "/projects/stadium" });
    expect(run(en, "chatub").effect).toEqual({ type: "navigate", href: "/projects/chatub" });
    expect(run(en, "open alth").effect).toEqual({ type: "navigate", href: "/projects/althil" });
    expect(run(ar, "افتح رقمي").effect).toEqual({ type: "navigate", href: "/ar/projects/raqmi" });
    expect(run(ar, "open raqmi").effect).toEqual({ type: "navigate", href: "/ar/projects/raqmi" });
  });

  it("answers Arabic aliases with Arabic output", () => {
    expect(parse(ar, "مشاريع").command).toBe("projects");
    expect(parse(ar, "تواصل").command).toBe("contact");
    expect(text(run(ar, "مشاريع").lines)).toContain("تصوّرات");
  });

  it("moves the reader, asks the guide or switches language as effects", () => {
    expect(run(en, "work").effect).toEqual({ type: "scroll", target: "work" });
    expect(run(en, "cd work").effect).toEqual({ type: "scroll", target: "work" });
    expect(run(en, "ask what is Raqmi?").effect).toEqual({ type: "ask", prompt: "what is Raqmi?" });
    expect(run(en, "ask").effect).toEqual({ type: "ask", prompt: "" });
    expect(run(en, "lang").effect).toEqual({ type: "locale", href: "/ar" });
    expect(run(ar, "lang").effect).toEqual({ type: "locale", href: "/" });
    expect(run(en, "clear").effect).toEqual({ type: "clear" });
  });

  it("fails politely and never echoes markup as anything but text", () => {
    const unknown = run(en, "<img src=x onerror=alert(1)>");

    expect(unknown.effect).toBeUndefined();
    expect(unknown.lines).toHaveLength(1);
    expect(unknown.lines[0]).toMatchObject({ kind: "text", tone: "error" });
    expect(run(en, "open nothing-here").lines[0]).toMatchObject({ kind: "text", tone: "error" });
    expect(run(en, "   ").lines).toHaveLength(0);
    expect(findProject(en, "ra")).toBeUndefined();
  });

  it("completes commands and project names, and leaves ambiguity alone", () => {
    expect(complete(en, "proj")).toBe("projects ");
    expect(complete(en, "open sta")).toBe("open stadium");
    expect(complete(en, "c")).toBe("c");
    expect(complete(en, "open ")).toBe("open ");
  });
});
