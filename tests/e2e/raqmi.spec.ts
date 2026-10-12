import AxeBuilder from "@axe-core/playwright";
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

test.describe("Raqmi authorization gate", () => {
  const DENIED_CALL = 'lookup_order({"order_id": "5521"})';
  const ALLOWED_CALL = 'lookup_order({"order_id": "1024"})';

  test("opens on the captured denial and lets the reader run the allowed lookup, by keyboard or click", async ({
    page
  }) => {
    await page.goto("/projects/raqmi");

    const boundary = page.getByRole("region", { name: "The moment that matters" });
    const denied = boundary.getByRole("radio", { name: /Order 5521/ });
    const allowed = boundary.getByRole("radio", { name: /Order 1024/ });

    await expect(denied).toBeChecked();
    await expect(boundary.getByText(DENIED_CALL)).toBeVisible();
    await expect(boundary.getByText(ALLOWED_CALL)).toBeHidden();

    // Native radios: the arrow keys choose, in either reading direction.
    await denied.focus();
    await page.keyboard.press("ArrowUp");
    await expect(allowed).toBeChecked();
    await expect(allowed).toBeFocused();
    await expect(boundary.getByText(ALLOWED_CALL)).toBeVisible();
    await expect(boundary.getByText("Allowed — the session owns order 1024")).toBeVisible();
    await expect(boundary.getByText(DENIED_CALL)).toBeHidden();
    // The signal replays for the chosen scenario.
    await expect.poll(() => boundary.locator(".ds-gate").evaluate((gate) => gate.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);

    // The whole option is the target, for a finger as much as a pointer.
    await boundary.getByText("Order 5521", { exact: true }).click();
    await expect(denied).toBeChecked();
    await expect(boundary.getByText("DENIED · authorization_denied")).toBeVisible();
    await expect(boundary.getByText(/captured in the live DeepSeek run/)).toBeVisible();
  });

  test("reads the same in Arabic, with code kept whole and left to right", async ({ page }) => {
    await page.goto("/ar/projects/raqmi");

    const boundary = page.getByRole("region", { name: "اللحظة الفاصلة" });

    await boundary.getByRole("radio", { name: /الطلب 1024/ }).check();
    await expect(boundary.getByText("سُمح: الجلسة تملك الطلب 1024")).toBeVisible();
    await expect(boundary.getByText(ALLOWED_CALL)).toHaveAttribute("dir", "ltr");
    // "lookup_order" inside Arabic is one isolate, so RTL never reorders it.
    await expect(boundary.locator('[data-scenario="allowed"] span[lang="en"][dir="ltr"]', { hasText: /^lookup_order$/ })).toHaveCount(1);
  });

  test("switches with CSS alone when JavaScript is off", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/projects/raqmi");

    const boundary = page.locator("section[aria-labelledby='boundary']");

    await expect(boundary.getByText(DENIED_CALL)).toBeVisible();
    await boundary.getByText("Order 1024", { exact: true }).click();
    await expect(boundary.getByText(ALLOWED_CALL)).toBeVisible();
    await expect(boundary.getByText(DENIED_CALL)).toBeHidden();
    await context.close();
  });

  test("under reduced motion the switch is instant, nothing plays and there is nothing to replay", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/projects/raqmi");

    const gate = page.locator(".ds-gate");

    await gate.scrollIntoViewIfNeeded();
    await gate.getByText("Order 1024", { exact: true }).click();
    await expect(gate.getByText(ALLOWED_CALL)).toBeVisible();
    expect(
      await gate.evaluate(
        (element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length
      )
    ).toBe(0);
    await expect(gate.getByRole("button", { name: "Replay" })).toBeHidden();
  });

  // The signal only raises a value's brightness, or dims it to a tone that
  // still clears AA, so the gate passes axe at any moment of its motion —
  // scanned right after a switch, without waiting.
  for (const [path, choice] of [
    ["/projects/raqmi", "Order 1024"],
    ["/ar/projects/raqmi", "الطلب 1024"]
  ] as const) {
    test(`axe passes mid-signal with either scenario chosen: ${path}`, async ({ page }) => {
      await page.goto(path);

      const gate = page.locator(".ds-gate");

      for (const label of [choice, choice.replace("1024", "5521")]) {
        await gate.getByText(label, { exact: true }).click();

        const results = await new AxeBuilder({ page })
          .include(".ds-gate")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();

        expect(results.violations.map((violation) => violation.id), label).toEqual([]);
      }
    });
  }
});
