import { expect, test } from "@playwright/test";

const slugs = ["raqmi", "chatub", "absher-insight-ai", "stadium", "althil", "qanouni", "virtual-astronauts", "medad"];

test.describe("projects and evidence", () => {
  test("the index shows status, domain and code for all eight projects without hover", async ({ page }) => {
    await page.goto("/projects");

    const list = page.getByRole("list", { name: "All projects" });

    await expect(list.getByRole("listitem")).toHaveCount(8);
    await expect(list.locator("[data-status]")).toHaveCount(8);
    await expect(list.locator("[data-status='concept']")).toHaveCount(3);
    await expect(list.getByText("Code: GitHub")).toHaveCount(5);
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

test.describe("brass labels", () => {
  const BRASS = "rgb(201, 167, 92)";
  const FAINT = "rgb(142, 137, 127)";

  // site.css loads after Tailwind's utilities, so a role's colour must not
  // outrank `text-accent` on the same element (see section 5 of site.css).
  for (const [path, brass] of [
    ["/projects/chatub", ["Not claimed", "Limits today", "If it continued", "Context", "Engineering notes"]],
    ["/ar/projects/raqmi", ["ما لا أدّعيه", "حدوده الآن", "لو استمر", "النطاق", "السياق"]],
    ["/blog/why-context-matters-more-than-prompts-in-ai-agents", ["Takeaway"]],
    ["/ar/blog/why-context-matters-more-than-prompts-in-ai-agents", ["الخلاصة"]]
  ] as const) {
    test(`labels meant to be brass are brass, the rest stay faint: ${path}`, async ({ page }) => {
      await page.goto(path);

      const labels = await page.locator(".ds-label").evaluateAll((elements) =>
        elements.map((element) => ({
          text: element.textContent?.trim() ?? "",
          accent: element.classList.contains("text-accent"),
          color: getComputedStyle(element).color
        }))
      );

      for (const text of brass) {
        expect(labels.find((label) => label.text === text), text).toMatchObject({ accent: true, color: BRASS });
      }

      for (const label of labels.filter((item) => !item.accent)) {
        expect(label.color, label.text).toBe(FAINT);
      }
    });
  }

  test("Raqmi's principle sets its second line in soft brass", async ({ page }) => {
    await page.goto("/projects/raqmi");

    const lines = page.locator("#principle + p .ds-h1");

    await expect(lines.first()).toHaveCSS("color", "rgb(242, 239, 231)");
    await expect(lines.nth(1)).toHaveCSS("color", "rgb(230, 210, 160)");
  });
});
