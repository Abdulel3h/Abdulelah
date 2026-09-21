import { expect, test } from "@playwright/test";

test.describe("hero", () => {
  test("essential content is visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");

    const hero = page.locator("section[aria-labelledby='hero-title']");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Abdulelah");
    await expect(hero.getByText("AI Product Builder · Agents, RAG & Arabic AI")).toBeVisible();
    await expect(hero.getByText(/I design and build/)).toBeVisible();
    await expect(hero.getByRole("link", { name: "View selected work" })).toBeVisible();
    await expect(hero.getByRole("list", { name: "At a glance" })).toContainText("3 with public code");

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
