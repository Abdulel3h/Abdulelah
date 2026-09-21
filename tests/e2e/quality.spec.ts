import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/about",
  "/projects",
  "/projects/chatub",
  "/projects/qanouni",
  "/resume",
  "/achievements",
  "/skills",
  "/blog",
  "/blog/why-context-matters-more-than-prompts-in-ai-agents",
  "/contact",
  "/privacy",
  "/ar",
  "/ar/projects",
  "/ar/projects/stadium",
  "/ar/contact",
  "/ar/blog"
];

test.describe("automated accessibility", () => {
  for (const path of pages) {
    test(`axe: ${path}`, async ({ page }) => {
      await page.goto(path);
      // Scroll through once so client-only sections have rendered.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const summary = results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.slice(0, 3).map((node) => node.target.join(" "))
      }));

      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });
  }

  test("axe: open search dialog and guide", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Search/ }).click();
    await page.keyboard.type("ai");

    let results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();

    expect(results.violations.map((violation) => violation.id)).toEqual([]);

    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /Ask Abdulelah/ }).click();
    await page.waitForTimeout(500);
    results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("every section is visible immediately while scrolling", async ({ page }) => {
    await page.goto("/");

    const hidden = await page.evaluate(async () => {
      const found: string[] = [];

      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 30));
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
          if (getComputedStyle(element).opacity !== "1") found.push(element.className);
        });
      }

      return found;
    });

    expect(hidden).toEqual([]);
  });
});

test.describe("links and console", () => {
  test("every internal link resolves and pages log no console errors", async ({ page, request }) => {
    test.setTimeout(240_000);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    const pagesToVisit = Array.from(sitemap.matchAll(/<loc>https:\/\/www\.abdulelah\.de([^<]*)<\/loc>/g)).map((match) => match[1] || "/");
    const links = new Set<string>();
    const errors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`${page.url()}: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`${page.url()}: ${error.message}`));

    expect(pagesToVisit.length).toBeGreaterThan(40);

    for (const path of pagesToVisit) {
      const response = await page.goto(path);

      expect(response?.status(), path).toBe(200);

      const hrefs = await page.$$eval("a[href]", (anchors) => anchors.map((anchor) => anchor.getAttribute("href") ?? ""));

      hrefs
        .filter((href) => href.startsWith("/") && !href.startsWith("//"))
        .forEach((href) => links.add(href.split("#")[0] || "/"));
    }

    for (const href of Array.from(links)) {
      const response = await request.get(href, { maxRedirects: 0 });

      expect([200, 308], href).toContain(response.status());
    }

    expect(errors).toEqual([]);
  });
});
