import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Resolves once every finite animation and transition running on the page
 * has finished (a dialog's entrance, a reveal's movement), so axe reads
 * settled colours. A real signal from the Web Animations API, not a sleep:
 * it waits exactly as long as the motion takes on this machine. Only
 * time-based motion counts: infinite or paused animations never finish, and
 * scroll-driven ones (the background drift, `animation-timeline: scroll()`)
 * follow the scroll position rather than the clock.
 */
async function motionSettled(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.timeline === document.timeline &&
            animation.playState === "running" &&
            animation.effect?.getComputedTiming().iterations !== Infinity
        )
        .map((animation) => animation.finished.catch(() => undefined))
    ).then(() => undefined)
  );
}

const WCAG = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

const pages = [
  "/",
  "/about",
  "/projects",
  "/projects/chatub",
  "/projects/stadium",
  "/projects/raqmi",
  "/projects/qanouni",
  "/resume",
  "/achievements",
  "/skills",
  "/blog",
  "/blog/why-context-matters-more-than-prompts-in-ai-agents",
  "/contact",
  "/privacy",
  "/ar",
  "/ar/about",
  "/ar/projects",
  "/ar/projects/stadium",
  "/ar/projects/raqmi",
  "/ar/projects/qanouni",
  "/ar/resume",
  "/ar/achievements",
  "/ar/skills",
  "/ar/contact",
  "/ar/privacy",
  "/ar/blog",
  "/ar/blog/why-context-matters-more-than-prompts-in-ai-agents"
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

  // One full-page scan per test: two in one test could outlast its time
  // budget when every worker is scanning at once.
  test("axe: open search dialog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Search/ }).click();

    const search = page.getByRole("dialog");

    await expect(search).toBeVisible();
    await expect(search.getByRole("combobox")).toBeFocused();
    await page.keyboard.type("ai");
    await expect(search.getByRole("option").first()).toBeVisible();
    // The dialog fades in (sheet-in); scan it once it has.
    await motionSettled(page);

    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });

  test("axe: open guide", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Ask Abdulelah/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await motionSettled(page);

    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});

test.describe("scroll reveals", () => {
  // Text that rises into view stays fully opaque at every moment, so its
  // contrast never depends on when it is measured. It used to fade from
  // opacity 0 (the hidden state in globals.css), and an axe scan that
  // overlapped a fade failed color-contrast at random (see .ds-rise in
  // site.css).
  for (const path of ["/", "/ar"]) {
    test(`rising text moves but never fades: ${path}`, async ({ page }) => {
      await page.addInitScript(() => {
        const properties: string[] = [];

        (window as unknown as { __rise: string[] }).__rise = properties;
        document.addEventListener(
          "transitionrun",
          (event) => {
            if ((event.target as Element).matches?.(".ds-rise[data-reveal]")) {
              properties.push((event as TransitionEvent).propertyName);
            }
          },
          true
        );
      });
      await page.goto(path);

      const rising = page.locator(".ds-rise[data-reveal]");
      const hidden = page.locator('.ds-rise[data-reveal="hidden"]');

      // Below the fold the milestones wait out of place, but fully opaque…
      await expect(hidden.first()).toBeAttached();
      expect(Array.from(new Set(await hidden.evaluateAll((items) => items.map((item) => getComputedStyle(item).opacity))))).toEqual([
        "1"
      ]);

      // …and rise into place once they scroll in.
      for (const item of await rising.all()) await item.scrollIntoViewIfNeeded();
      await expect(hidden).toHaveCount(0);
      await motionSettled(page);

      const properties = await page.evaluate(() => (window as unknown as { __rise: string[] }).__rise);

      expect(properties).toContain("transform");
      expect(properties).not.toContain("opacity");
    });
  }
});

test.describe("page transitions", () => {
  // A page change settles half a rem into place but never fades, so its text
  // is never shown below its own contrast (see .page-enter in globals.css).
  test("a page change moves into place without fading its text", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);

    const main = page.locator("main.page-enter");

    await expect(main).toHaveCount(1);

    const properties = await main.evaluate((element) =>
      element.getAnimations().flatMap((animation) =>
        (animation.effect as KeyframeEffect).getKeyframes().flatMap((frame) => Object.keys(frame))
      )
    );

    expect(properties).toContain("transform");
    expect(properties).not.toContain("opacity");
    await expect(main).toHaveCSS("opacity", "1");
  });
});

test.describe("automated accessibility of the menu", () => {
  for (const [path, name] of [
    ["/about", "Menu"],
    ["/ar/about", "القائمة"]
  ] as const) {
    test(`axe: open menu on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      await page.getByRole("button", { name, exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.waitForTimeout(900);

      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();

      expect(results.violations.map((violation) => violation.id)).toEqual([]);
    });
  }
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of ["/", "/ar", "/projects/raqmi", "/ar/projects/raqmi"]) {
    test(`every section is visible immediately while scrolling: ${path}`, async ({ page }) => {
      await page.goto(path);

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
  }

  test("the search dialog passes axe with motion reduced, and nothing waits to appear", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Search/ }).click();

    const search = page.getByRole("dialog");

    await expect(search).toBeVisible();
    await page.keyboard.type("ai");
    await expect(search.getByRole("option").first()).toBeVisible();

    // Hydrated (the dialog opened), yet nothing is held back for a scroll,
    // and no entrance is still running.
    await expect(page.locator('[data-reveal="hidden"]')).toHaveCount(0);
    expect(
      await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.timeline === document.timeline && animation.playState === "running").length
      )
    ).toBe(0);

    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });

  test("the guide passes axe with motion reduced", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Ask Abdulelah/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
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
