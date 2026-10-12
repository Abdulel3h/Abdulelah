import { expect, test } from "@playwright/test";

const REPOSITORY = "https://github.com/Abdulel3h/llm-application-engineering-Raqmi";

test.describe("Raqmi", () => {
  test("the English case study tells the story, with its evidence and scope", async ({ page }) => {
    await page.goto("/projects/raqmi");

    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Raqmi");
    await expect(page.locator("header").getByRole("link", { name: /Open the code/ })).toHaveAttribute("href", REPOSITORY);

    for (const heading of [
      "Not every request is a question",
      "The principle",
      "How it works",
      "The moment that matters",
      "Evaluation",
      "What failed",
      "Guardrails, and their limits",
      "A return is more than JSON",
      "Two model paths, one boundary",
      "The honest part",
      "What you can verify"
    ]) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }

    // The denial is told exactly as the captured run printed it.
    const boundary = page.getByRole("region", { name: "The moment that matters" });

    await expect(boundary.getByText('lookup_order({"order_id": "5521"})')).toBeVisible();
    await expect(boundary.getByText("DENIED · authorization_denied")).toBeVisible();

    // The failures are listed, not hidden.
    await expect(page.getByRole("region", { name: "What failed" }).getByRole("listitem")).toHaveCount(5);
    await expect(page.getByText("51 of 56", { exact: false }).first()).toBeVisible();

    for (const document of ["Raqmi_Capstone.ipynb", "EVALUATION_REPORT.md", "TOOL_CALLING.md"]) {
      await expect(page.locator(`a[href="${REPOSITORY}/blob/main/${document}"]`)).toHaveCount(1);
    }
  });

  test("the Arabic case study is the same story, right to left", async ({ page }) => {
    await page.goto("/ar/projects/raqmi");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("رقمي");
    await expect(page.getByRole("heading", { level: 2, name: "ما الذي لم ينجح" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "اللحظة الفاصلة" })).toBeVisible();

    // Code and English quotes stay left-to-right inside the Arabic page.
    const boundary = page.getByRole("region", { name: "اللحظة الفاصلة" });

    await expect(boundary.locator("code").first()).toHaveAttribute("dir", "ltr");
    await expect(boundary.getByText("“Where is order 5521?”")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { level: 1 }).locator("[lang='ar']")).toHaveAttribute("dir", "rtl");
  });

  test("the language switch keeps Raqmi, both ways", async ({ page }) => {
    await page.goto("/projects/raqmi");
    await page.getByRole("link", { name: "العربية" }).first().click();
    await expect(page).toHaveURL(/\/ar\/projects\/raqmi$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("رقمي");

    await page.getByRole("link", { name: "English" }).first().click();
    await expect(page).toHaveURL(/\/projects\/raqmi$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Raqmi");
  });

  test("Raqmi leads the project index and the homepage in both languages", async ({ page }) => {
    for (const [path, href] of [
      ["/projects", "/projects/raqmi"],
      ["/ar/projects", "/ar/projects/raqmi"]
    ]) {
      await page.goto(path);
      await expect(page.locator("ol[aria-label] > li").first().locator("a")).toHaveAttribute("href", href);
    }

    await page.goto("/");
    await expect(page.locator("#raqmi")).toBeVisible();
    await expect(page.getByRole("list", { name: "On this page" }).getByRole("listitem").first()).toContainText("Raqmi");
  });

  test("metadata names Raqmi in each language, with canonical and hreflang", async ({ page }) => {
    await page.goto("/projects/raqmi");
    await expect(page).toHaveTitle("Raqmi — Bilingual AI retail support | Abdulelah Alkhathami");
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "https://www.abdulelah.de/projects/raqmi");
    await expect(page.locator("link[rel='alternate'][hreflang='ar']")).toHaveAttribute("href", "https://www.abdulelah.de/ar/projects/raqmi");

    await page.goto("/ar/projects/raqmi");
    await expect(page).toHaveTitle("رقمي — مساعد خدمة عملاء ذكي بلغتين | عبدالإله الخثعمي");
    await expect(page.locator("meta[property='og:locale']")).toHaveAttribute("content", "ar_SA");
  });

  test("search finds Raqmi by name and by subject", async ({ page }) => {
    for (const [path, query] of [
      ["/", "authorization"],
      ["/ar", "رقمي"]
    ]) {
      await page.goto(path);
      await page.keyboard.press("Control+k");

      const dialog = page.getByRole("dialog");

      await expect(dialog).toBeVisible();
      await page.keyboard.type(query);
      await expect(dialog.getByRole("option", { name: /Raqmi|رقمي/ }).first()).toBeVisible();
      await page.keyboard.press("Escape");
    }
  });
});
