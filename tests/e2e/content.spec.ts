import { expect, test } from "@playwright/test";

const slugs = ["chatub", "absher-insight-ai", "stadium", "althil", "qanouni", "virtual-astronauts", "medad"];

test.describe("projects and evidence", () => {
  test("the index shows status, domain and code for all seven projects without hover", async ({ page }) => {
    await page.goto("/projects");

    const list = page.getByRole("list", { name: "All projects" });

    await expect(list.getByRole("listitem")).toHaveCount(7);
    await expect(list.locator("[data-status]")).toHaveCount(7);
    await expect(list.locator("[data-status='concept']")).toHaveCount(3);
    await expect(list.getByText("Code: GitHub")).toHaveCount(4);
    await expect(page.locator("body")).not.toContainText(/shipped|Hover any title/i);
  });

  for (const slug of slugs) {
    test(`case study ${slug} answers the brief first and states its evidence and limits`, async ({ page }) => {
      await page.goto(`/projects/${slug}`);

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator("header [data-status]").first()).toBeVisible();

      for (const heading of ["In brief", "How it works", "Decisions that shaped it", "The honest part", "What you can verify"]) {
        await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
      }

      for (const line of ["The problem", "What was built", "My role", "Outcome"]) {
        await expect(page.getByRole("region", { name: "In brief" }).getByText(line, { exact: true })).toBeVisible();
      }

      await expect(page.getByRole("heading", { level: 3, name: "Not claimed" })).toBeVisible();
      await expect(page.getByText("Concept visualization").first()).toBeVisible();

      // The full record is kept, one disclosure away.
      await page.getByText("The full record").click();
      await expect(page.getByRole("heading", { level: 3, name: "Constraints" })).toBeVisible();
    });
  }

  test("one H1 per main page, in both languages", async ({ page }) => {
    test.setTimeout(120_000);

    for (const path of ["/", "/about", "/projects", "/resume", "/achievements", "/skills", "/blog", "/contact", "/privacy"]) {
      for (const url of [path, path === "/" ? "/ar" : `/ar${path}`]) {
        await page.goto(url);
        await expect(page.getByRole("heading", { level: 1 }), url).toHaveCount(1);
      }
    }
  });

  test("the homepage ends with a single closing section before the footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home-closing-title")).toHaveCount(1);
    await expect(page.locator("footer")).not.toContainText("Have an idea worth building?");
  });
});
