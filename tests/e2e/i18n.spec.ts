import { expect, test } from "@playwright/test";

test.describe("English and Arabic", () => {
  test("Arabic pages declare lang and right-to-left direction", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("عبدالإله");
    await expect(page).toHaveTitle("عبدالإله الخثعمي — مطوّر منتجات الذكاء الاصطناعي");
  });

  test("English pages are left-to-right and mark embedded Arabic correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    const arabic = page.locator("[lang='ar']");
    const count = await arabic.count();

    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      await expect(arabic.nth(index)).toHaveAttribute("dir", "rtl");
    }
  });

  test("the language switch keeps the reader on the same page", async ({ page }) => {
    await page.goto("/projects/stadium");
    await page.getByRole("link", { name: /العربية/ }).first().click();
    await expect(page).toHaveURL(/\/ar\/projects\/stadium$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.getByRole("link", { name: /English/ }).first().click();
    await expect(page).toHaveURL(/\/projects\/stadium$/);
  });

  test("localized metadata with canonical and hreflang", async ({ page }) => {
    await page.goto("/ar/projects/chatub");
    await expect(page).toHaveTitle(/ChatUB — مساعد أكاديمي عربي يعمل محليًا \| عبدالإله الخثعمي/);
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "https://www.abdulelah.de/ar/projects/chatub");
    await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveAttribute("href", "https://www.abdulelah.de/projects/chatub");
    await expect(page.locator("link[rel='alternate'][hreflang='x-default']")).toHaveAttribute("href", "https://www.abdulelah.de/projects/chatub");
    await expect(page.locator("meta[property='og:locale']")).toHaveAttribute("content", "ar_SA");
  });

  test("the Arabic guide has an Arabic interface", async ({ page }) => {
    await page.goto("/ar");
    await page.getByRole("button", { name: /اسأل عبدالإله/ }).click();

    const dialog = page.getByRole("dialog", { name: "دليل عبدالإله" });

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "أي المشاريع لها كود منشور؟" })).toBeVisible();
    await expect(dialog.getByRole("textbox", { name: "اطرح سؤالًا على دليل عبدالإله" })).toHaveAttribute("dir", "auto");
  });

  test("explicit /en URLs redirect to the canonical English URL", async ({ request }) => {
    const response = await request.get("/en/about", { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers().location).toMatch(/\/about$/);
  });
});

test.describe("404", () => {
  test("unknown English page: 404 status, title, noindex and useful links", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("404 — Page not found | Abdulelah Alkhathami");
    await expect(page.locator("meta[name='robots'][content*='noindex']").first()).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("This page couldn’t be found.");

    for (const name of ["Home", "Projects", "About", "Contact"]) {
      await expect(page.getByRole("main").getByRole("link", { name, exact: true })).toBeVisible();
    }

    await expect(page.getByRole("main").getByRole("button", { name: "Search the site" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("isn’t published yet");
  });

  test("unknown Arabic page is localized", async ({ page }) => {
    const response = await page.goto("/ar/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("404 — الصفحة غير موجودة | عبدالإله الخثعمي");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });
});
