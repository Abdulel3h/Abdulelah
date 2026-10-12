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

  test("the Arabic home leads with the five working projects", async ({ page }) => {
    await page.goto("/ar");

    for (const name of ["رقمي", "ChatUB", "Althil", "Absher Insight AI", "Stadium"]) {
      await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
    }

    // Latin names inside Arabic are isolated and announced as English.
    await expect(page.locator("main [lang='en']").first()).toHaveAttribute("dir", "ltr");
    await expect(page.locator("meta[property='og:image']")).toHaveAttribute("content", /abdulelah-og-ar\.png$/);
  });

  test("the Arabic project index filters working prototypes and concepts", async ({ page }) => {
    await page.goto("/ar/projects");

    const list = page.getByRole("list", { name: "قائمة المشاريع" });

    await expect(list.getByRole("listitem")).toHaveCount(8);
    await page.getByRole("button", { name: "تصوّرات" }).click();
    await expect(list.getByRole("listitem")).toHaveCount(3);
    await expect(page.getByRole("button", { name: "تصوّرات" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "تعمل بكود منشور" }).click();
    await expect(list.getByRole("listitem")).toHaveCount(5);
  });

  test("the Arabic case study answers problem, build, role and result first", async ({ page }) => {
    await page.goto("/ar/projects/chatub");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ChatUB");

    for (const heading of ["في سطور", "كيف يعمل", "قرارات شكّلته", "بصراحة", "ما يمكنك التحقق منه"]) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }

    await expect(page.getByText("تصوّر توضيحي").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /المشروع التالي/ })).toHaveAttribute("href", "/ar/projects/althil");
  });

  test("the Arabic mobile menu marks the page, offers English and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ar/about");

    const toggle = page.getByRole("button", { name: "القائمة" });

    await toggle.click();

    const menu = page.getByRole("dialog", { name: "قائمة الموقع" });

    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /عنّي/ })).toHaveAttribute("aria-current", "page");
    await expect(menu.getByRole("link", { name: "Read in English" })).toHaveAttribute("href", "/about");
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
  });

  test("the English home leads with the same five working projects", async ({ page }) => {
    await page.goto("/");

    for (const name of ["Raqmi", "ChatUB", "Althil", "Absher Insight AI", "Stadium"]) {
      await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
    }

    await expect(page.locator("meta[property='og:image']")).toHaveAttribute("content", /abdulelah-og-en\.png$/);
  });

  test("the English project index filters working prototypes and concepts", async ({ page }) => {
    await page.goto("/projects");

    const list = page.getByRole("list", { name: "All projects" });

    await expect(list.getByRole("listitem")).toHaveCount(8);
    await page.getByRole("button", { name: "Concepts" }).click();
    await expect(list.getByRole("listitem")).toHaveCount(3);
    await expect(page.getByRole("button", { name: "Concepts" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Working, with public code" }).click();
    await expect(list.getByRole("listitem")).toHaveCount(5);
  });

  test("the English case study walks into the same next project", async ({ page }) => {
    await page.goto("/projects/chatub");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ChatUB");
    await expect(page.getByRole("link", { name: /Next project/ })).toHaveAttribute("href", "/projects/althil");
  });

  test("the language switch keeps the project in both directions", async ({ page }) => {
    await page.goto("/ar/projects/qanouni");
    await page.getByRole("link", { name: "English" }).first().click();
    await expect(page).toHaveURL(/\/projects\/qanouni$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Qanouni");

    await page.getByRole("link", { name: "العربية" }).first().click();
    await expect(page).toHaveURL(/\/ar\/projects\/qanouni$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Qanouni");
  });

  test("every page has the same structure in English and Arabic", async ({ page }) => {
    test.setTimeout(120_000);

    const paths = [
      "/",
      "/projects",
      "/projects/stadium",
      "/projects/raqmi",
      "/about",
      "/contact",
      "/resume",
      "/skills",
      "/achievements",
      "/blog",
      "/blog/why-context-matters-more-than-prompts-in-ai-agents",
      "/privacy"
    ];

    async function outline() {
      return page.evaluate(() => {
        const main = document.querySelector("main") ?? document.body;
        const count = (selector: string) => main.querySelectorAll(selector).length;

        return {
          h1: count("h1"),
          h2: count("h2"),
          h3: count("h3"),
          lists: count("ol, ul"),
          regions: Array.from(main.querySelectorAll("[aria-labelledby]")).map((element) => element.getAttribute("aria-labelledby")),
          header: Boolean(document.querySelector("header.ds-header")),
          footer: Boolean(document.querySelector("footer"))
        };
      });
    }

    for (const path of paths) {
      await page.goto(path);
      const english = await outline();

      await page.goto(path === "/" ? "/ar" : `/ar${path}`);
      const arabic = await outline();

      expect(arabic, path).toEqual(english);
    }
  });

  test("the English menu marks the page, offers Arabic and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");

    const toggle = page.getByRole("button", { name: "Menu", exact: true });

    await toggle.click();

    const menu = page.getByRole("dialog", { name: "Site menu" });

    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /About/ })).toHaveAttribute("aria-current", "page");
    await expect(menu.getByRole("link", { name: "اقرأ بالعربية" })).toHaveAttribute("href", "/ar/about");
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
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
