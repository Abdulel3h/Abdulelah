import { expect, test } from "@playwright/test";

test.describe("hero", () => {
  test("essential content is visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");

    const hero = page.locator("section[aria-labelledby='hero-title']");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Abdulelah");
    await expect(hero.getByText("AI product builder · Riyadh")).toBeVisible();
    await expect(hero.getByText(/I turn/)).toBeVisible();
    await expect(hero.getByRole("link", { name: "View selected work" })).toBeVisible();
    // The margin notes carry the evidence behind the statement.
    await expect(hero.getByRole("list", { name: "Margin notes" })).toContainText("5 with public code");
    await expect(hero.getByRole("list", { name: "On this page" }).getByRole("listitem")).toHaveCount(5);

    for (const selector of ["#hero-title", "section[aria-labelledby='hero-title'] p"]) {
      const opacity = await page.locator(selector).first().evaluate((element) => getComputedStyle(element).opacity);

      expect(opacity).toBe("1");
    }

    await context.close();
  });

  test("hero text is fully opaque in the server HTML, before any script runs", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const heroStart = html.indexOf('id="hero-title"');
    const heroChunk = html.slice(Math.max(0, heroStart - 2000), heroStart + 4000);

    expect(heroStart).toBeGreaterThan(0);
    expect(heroChunk).not.toMatch(/opacity:\s*0[;"]/);
    expect(html).not.toContain('data-reveal="hidden"');
  });

  for (const [path, name, href, title] of [
    ["/", /^New project\s*:\s*Raqmi\s*\./, "/projects/raqmi", "Raqmi"],
    ["/ar", /^مشروع جديد\s*:\s*رقمي\s*\./, "/ar/projects/raqmi", "رقمي"]
  ] as const) {
    test(`a notice above the name opens Raqmi, by keyboard too: ${path}`, async ({ page }) => {
      await page.goto(path);

      const hero = page.locator("section[aria-labelledby='hero-title']");
      // Named "New project: Raqmi. The model proposes…" — the hidden
      // punctuation gives a screen reader its pauses.
      const notice = hero.getByRole("link", { name });

      // One link, part of the hero: no dialog, nothing to dismiss.
      await expect(notice).toHaveCount(1);
      await expect(notice).toBeVisible();
      await expect(notice).toHaveAttribute("href", href);
      await expect(page.getByRole("dialog")).toHaveCount(0);

      const [noticeBox, titleBox] = await Promise.all([notice.boundingBox(), page.locator("#hero-title").boundingBox()]);

      expect(noticeBox!.y + noticeBox!.height).toBeLessThan(titleBox!.y);

      // It is the first stop in the page's content for a keyboard.
      let presses = 0;

      while (presses < 30 && !(await notice.evaluate((element) => element === document.activeElement))) {
        await page.keyboard.press("Tab");
        presses += 1;
      }

      await expect(notice).toBeFocused();
      expect(await notice.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
      await page.keyboard.press("Enter");
      // The case study is the longest page; give its navigation room under a busy run.
      await expect(page).toHaveURL(new RegExp(`${href}$`), { timeout: 20_000 });
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    });
  }

  test("the notice fits a 320px phone as a comfortable touch target, and holds still under reduced motion", async ({
    page
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const path of ["/", "/ar"]) {
      await page.goto(path);

      const notice = page.locator(".ds-notice");
      const box = (await notice.boundingBox())!;

      expect(box.x, path).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, path).toBeLessThanOrEqual(320);
      expect(box.height, path).toBeGreaterThanOrEqual(44);
      expect(await notice.evaluate((element) => getComputedStyle(element).animationName), path).toBe("none");
    }
  });

  test("the primary action and CV choice are reachable in two steps", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Choose a CV" }).first().click();
    await expect(page).toHaveURL(/\/resume$/);
    await expect(page.getByRole("link", { name: /Download the Engineer CV/ })).toHaveAttribute(
      "href",
      "/resume/Abdulelah_AI_Engineer_CV.pdf"
    );
  });
});
