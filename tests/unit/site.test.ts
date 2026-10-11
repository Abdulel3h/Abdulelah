import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mixed } from "@/components/site/mixed";
import { projectTints } from "@/components/site/tints";
import { projectSlugs } from "@/data/projects";
import { locales } from "@/lib/i18n/config";
import { projectBriefs, siteCopy } from "@/lib/i18n/experience";

const NNBSP = "\u202f";

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/** Every key path of an object, so two locales can be compared by shape. */
function shape(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => shape(item, `${prefix}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => shape(item, prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
}

describe("site copy", () => {
  it("has the same shape in English and Arabic", () => {
    expect(shape(siteCopy("en")).sort()).toEqual(shape(siteCopy("ar")).sort());
  });

  for (const locale of locales) {
    it(`${locale}: a short brief and a tint for every project, and nothing else`, () => {
      const briefs = projectBriefs(locale);

      expect(Object.keys(briefs).sort()).toEqual([...projectSlugs].sort());
      expect(Object.keys(projectTints).sort()).toEqual([...projectSlugs].sort());

      for (const brief of Object.values(briefs)) {
        for (const text of Object.values(brief)) {
          expect(text.trim().length).toBeGreaterThan(10);
          // A one-line brief, not a paragraph.
          expect(text.length).toBeLessThan(170);
        }
      }
    });

    it(`${locale}: never claims production use and uses one numeral system`, () => {
      const all = [...strings(siteCopy(locale)), ...strings(projectBriefs(locale))];

      for (const text of all) {
        expect(text.trim().length).toBeGreaterThan(0);
        // Western digits only — no Arabic-Indic digits mixed in.
        expect(text).not.toMatch(/[\u0660-\u0669\u06F0-\u06F9]/);
        expect(text).not.toMatch(/قيد التشغيل الفعلي|أُطلق للمستخدمين|\b(shipped|launched|in production|went live|is live|live (dashboard|system|product))\b/i);
      }
    });
  }

  it("keeps English and Arabic briefs equally dense", () => {
    for (const slug of projectSlugs) {
      const en = projectBriefs("en")[slug];
      const ar = projectBriefs("ar")[slug];

      for (const key of Object.keys(en) as (keyof typeof en)[]) {
        // English runs longer in characters than Arabic; never twice as long.
        expect(en[key].length, `${slug}.${key}`).toBeLessThan(ar[key].length * 2);
      }
    }
  });
});

describe("mixed-script text", () => {
  it("isolates every Latin run as left-to-right English on Arabic pages", () => {
    const html = renderToStaticMarkup(mixed("بنيت Raqmi باستخدام Python وLLM APIs", "ar") as never);

    expect(html).toContain('<span lang="en" dir="ltr">Raqmi</span>');
    expect(html).toContain('<span lang="en" dir="ltr">Python</span>');
    expect(html).toContain('<span lang="en" dir="ltr">LLM APIs</span>');
  });

  it("keeps «و» readable before a multi-word Latin name only", () => {
    const multi = renderToStaticMarkup(mixed("Qanouni وVirtual Astronauts", "ar") as never);
    const single = renderToStaticMarkup(mixed("ChatUB وAlthil", "ar") as never);

    expect(multi).toContain(`و${NNBSP}<span lang="en" dir="ltr">Virtual Astronauts</span>`);
    expect(single).toContain('و<span lang="en" dir="ltr">Althil</span>');
    expect(single).not.toContain(NNBSP);
  });

  it("leaves pure Arabic untouched and keeps punctuation outside the isolate", () => {
    expect(mixed("نموذج أولي عامل", "ar")).toBe("نموذج أولي عامل");

    const html = renderToStaticMarkup(mixed("واجهة (Google Cloud).", "ar") as never);

    expect(html).toBe('واجهة (<span lang="en" dir="ltr">Google Cloud</span>).');
  });

  it("leaves English untouched and isolates Arabic runs on English pages", () => {
    expect(mixed("Built with Python and LLM APIs", "en")).toBe("Built with Python and LLM APIs");

    const html = renderToStaticMarkup(mixed("Abdulelah (عبدالإله الخثعمي) in Riyadh", "en") as never);

    expect(html).toBe('Abdulelah (<span lang="ar" dir="rtl">عبدالإله الخثعمي</span>) in Riyadh');
  });
});
