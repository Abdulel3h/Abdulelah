import { describe, expect, it } from "vitest";
import { noteRouteSlugs, projectRouteSlugs } from "@/data/route-manifest";
import { blogPosts } from "@/data/blog";
import { projectSlugs } from "@/data/projects";
import {
  getDirection,
  localizeHref,
  splitLocalePath,
  switchLocaleHref
} from "@/lib/i18n/config";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";
import { format, joinNames } from "@/lib/i18n/format";
import { resolveLocaleRoute } from "@/lib/i18n/routing";

describe("locale paths", () => {
  it("keeps English unprefixed and prefixes Arabic", () => {
    expect(localizeHref("/projects/chatub", "en")).toBe("/projects/chatub");
    expect(localizeHref("/projects/chatub", "ar")).toBe("/ar/projects/chatub");
    expect(localizeHref("/", "ar")).toBe("/ar");
    expect(localizeHref("/", "en")).toBe("/");
    expect(localizeHref("/contact#contact-form", "ar")).toBe("/ar/contact#contact-form");
  });

  it("never localizes files, API routes or external links", () => {
    expect(localizeHref("/resume/Abdulelah_AI_Engineer_CV.pdf", "ar")).toBe("/resume/Abdulelah_AI_Engineer_CV.pdf");
    expect(localizeHref("/api/contact", "ar")).toBe("/api/contact");
    expect(localizeHref("https://github.com/Abdulel3h", "ar")).toBe("https://github.com/Abdulel3h");
    expect(localizeHref("mailto:me@abdulelah.de", "ar")).toBe("mailto:me@abdulelah.de");
  });

  it("splits and switches the locale of a pathname", () => {
    expect(splitLocalePath("/ar/projects/chatub")).toEqual({ locale: "ar", path: "/projects/chatub" });
    expect(splitLocalePath("/en/about")).toEqual({ locale: "en", path: "/about" });
    expect(splitLocalePath("/about/")).toEqual({ locale: "en", path: "/about" });
    expect(switchLocaleHref("/projects/stadium", "ar")).toBe("/ar/projects/stadium");
    expect(switchLocaleHref("/ar/projects/stadium", "en")).toBe("/projects/stadium");
    expect(switchLocaleHref("/ar", "en")).toBe("/");
  });

  it("sets right-to-left only for Arabic", () => {
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });
});

describe("proxy locale routing", () => {
  it("rewrites known English paths to the internal /en tree", () => {
    expect(resolveLocaleRoute("/")).toEqual({ action: "rewrite", pathname: "/en" });
    expect(resolveLocaleRoute("/projects/chatub")).toEqual({ action: "rewrite", pathname: "/en/projects/chatub" });
  });

  it("redirects explicit /en URLs to their canonical form", () => {
    expect(resolveLocaleRoute("/en/about")).toEqual({ action: "redirect", pathname: "/about" });
    expect(resolveLocaleRoute("/en")).toEqual({ action: "redirect", pathname: "/" });
  });

  it("serves Arabic routes as they are", () => {
    expect(resolveLocaleRoute("/ar")).toEqual({ action: "pass" });
    expect(resolveLocaleRoute("/ar/blog/building-ai-products-accuracy-is-not-enough")).toEqual({ action: "pass" });
  });

  it("answers unknown pages with the localized 404", () => {
    expect(resolveLocaleRoute("/nope")).toEqual({ action: "not-found", pathname: "/en/status-404" });
    expect(resolveLocaleRoute("/ar/nope")).toEqual({ action: "not-found", pathname: "/ar/status-404" });
    expect(resolveLocaleRoute("/projects/unknown")).toEqual({ action: "not-found", pathname: "/en/status-404" });
    expect(resolveLocaleRoute("/ar/dal-accelerator-abd-7xq29")).toEqual({ action: "not-found", pathname: "/ar/status-404" });
  });

  it("leaves API routes, files and Next internals alone", () => {
    for (const path of ["/api/contact", "/resume/Abdulelah_AI_Engineer_CV.pdf", "/sitemap.xml", "/_next/static/x.js", "/opengraph-image"]) {
      expect(resolveLocaleRoute(path)).toEqual({ action: "pass" });
    }
  });

  it("keeps the route manifest in sync with the content data", () => {
    expect([...projectRouteSlugs].sort()).toEqual([...projectSlugs].sort());
    expect([...noteRouteSlugs].sort()).toEqual(blogPosts.map((post) => post.slug).sort());
  });
});

type Tree = { [key: string]: unknown };

function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return [`${path}[${value.length}]`, ...value.flatMap((item, index) => shape(item, `${path}[${index}]`))];
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Tree)
      .sort()
      .flatMap((key) => [`${path}.${key}`, ...shape((value as Tree)[key], `${path}.${key}`)]);
  }

  return [];
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value as Tree).flatMap(strings);
  return [];
}

describe("dictionaries", () => {
  it("have exactly the same structure in English and Arabic", () => {
    expect(shape(ar)).toEqual(shape(en));
  });

  it("contain no empty strings", () => {
    for (const text of [...strings(en), ...strings(ar)]) {
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  it("use one naming rule for the resume and CVs", () => {
    for (const text of [...strings(en), ...strings(ar)]) {
      expect(text).not.toMatch(/Résumé|résumé/);
    }
  });

  it("never describe the work as shipped or in production", () => {
    for (const text of strings(en)) {
      expect(text).not.toMatch(/\bshipped\b|\blaunched\b/i);
    }
  });

  it("formats templates and joins names per language", () => {
    expect(format("Follow up on {project}", { project: "ChatUB" })).toBe("Follow up on ChatUB");
    expect(joinNames(["ChatUB", "Stadium"], "en", "and more")).toBe("ChatUB and Stadium");
    expect(joinNames(["ChatUB", "Stadium"], "ar", "وغيرها")).toBe("ChatUB وStadium");
  });
});
