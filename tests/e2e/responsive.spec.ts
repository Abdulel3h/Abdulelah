import { expect, test } from "@playwright/test";

const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const englishPaths = [
  "/",
  "/projects",
  "/projects/absher-insight-ai",
  "/about",
  "/contact",
  "/resume",
  "/skills",
  "/achievements",
  "/blog",
  "/blog/why-context-matters-more-than-prompts-in-ai-agents",
  "/privacy"
];
// Every English page and its Arabic twin.
const paths = englishPaths.flatMap((path) => [path, path === "/" ? "/ar" : `/ar${path}`]);

test.describe("responsive layout", () => {
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width, height: 900 });

      for (const path of paths) {
        await page.goto(path);

        const overflow = await page.evaluate(() => {
          const root = document.documentElement;
          const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);

              return (
                rect.width > 0 &&
                (rect.right > root.clientWidth + 1 || rect.left < -1) &&
                style.position !== "fixed" &&
                !element.closest("[aria-hidden='true'], .sr-only, [inert], .skip-link")
              );
            })
            .slice(0, 5)
            .map((element) => `${element.tagName}.${String(element.className).slice(0, 60)}`);

          return { scroll: root.scrollWidth - root.clientWidth, offenders };
        });

        expect(overflow.scroll, `${path} @ ${width}px ${JSON.stringify(overflow.offenders)}`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("the guide launcher and back-to-top button never overlap", async ({ page }) => {
    for (const width of [320, 375, 768]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/projects");
      await page.mouse.wheel(0, 2400);
      await page.waitForTimeout(400);

      const launcher = await page.getByRole("button", { name: /Ask Abdulelah/ }).boundingBox();
      const top = await page.getByRole("button", { name: "Back to top" }).boundingBox();

      expect(launcher).not.toBeNull();
      expect(top).not.toBeNull();

      if (launcher && top) {
        const overlap = !(launcher.x > top.x + top.width || top.x > launcher.x + launcher.width);

        expect(overlap, `${width}px`).toBe(false);
        expect(launcher.height).toBeGreaterThanOrEqual(44);
        expect(top.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("primary controls are at least 44px tall on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    for (const name of ["View selected work", "Choose a CV", "Menu"]) {
      const box = await page.getByRole(name === "Menu" ? "button" : "link", { name, exact: true }).first().boundingBox();

      expect(box?.height ?? 0, name).toBeGreaterThanOrEqual(44);
    }
  });

  test("the mobile menu opens, offers search and language, and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");

    const toggle = page.getByRole("button", { name: "Menu", exact: true });

    await toggle.click();

    const menu = page.getByRole("dialog", { name: "Site menu" });

    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /About/ })).toHaveAttribute("aria-current", "page");
    await expect(menu.getByRole("button", { name: "Search the site" })).toBeVisible();
    await expect(menu.getByRole("link", { name: /العربية/ })).toHaveAttribute("href", "/ar/about");
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
  });
});
