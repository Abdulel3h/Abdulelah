import { expect, test } from "@playwright/test";

const slugs = ["chatub", "absher-insight-ai", "stadium", "althil", "qanouni", "virtual-astronauts", "medad"];

test.describe("projects and evidence", () => {
  test("the index shows status, evidence and role for all seven projects without hover", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByText("Select a project to explore the system, role, and evidence.")).toBeVisible();

    const list = page.getByRole("list", { name: "All projects" });

    await expect(list.getByRole("listitem")).toHaveCount(7);
    await expect(list.locator("[data-status]")).toHaveCount(7);
    await expect(list.locator("[data-status='concept']")).toHaveCount(3);
    await expect(page.locator("body")).not.toContainText(/shipped|Hover any title/i);
  });

  for (const slug of slugs) {
    test(`case study ${slug} has a standard evidence panel and honest limits`, async ({ page }) => {
      await page.goto(`/projects/${slug}`);

      const evidence = page.locator("#evidence");

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(evidence.getByRole("heading", { name: "Evidence" })).toBeVisible();
      await expect(evidence.locator("[data-status]")).toBeVisible();
      await expect(evidence.getByText("Not claimed", { exact: true })).toBeVisible();

      for (const heading of ["Context", "The problem", "Constraints", "Solution", "My responsibility", "Architecture & workflow", "Decisions", "Verified outcome", "Limitations", "What would come next"]) {
        await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
      }

      await expect(page.getByText("Concept visualization").first()).toBeVisible();
    });
  }

  test("one H1 per main page", async ({ page }) => {
    for (const path of ["/", "/about", "/projects", "/resume", "/achievements", "/skills", "/blog", "/contact", "/privacy", "/ar", "/ar/projects/chatub"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }), path).toHaveCount(1);
    }
  });

  test("the homepage ends with a single closing section before the footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home-closing-title")).toHaveCount(1);
    await expect(page.locator("footer")).not.toContainText("Have an idea worth building?");
  });
});
