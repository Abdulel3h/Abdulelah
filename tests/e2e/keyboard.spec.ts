import { expect, test, type Page } from "@playwright/test";

async function focusedElementInfo(page: Page) {
  return page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;

    if (!element || element === document.body) return null;

    const style = getComputedStyle(element);

    return {
      tag: element.tagName,
      text: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0, 60),
      outlineWidth: parseFloat(style.outlineWidth),
      outlineStyle: style.outlineStyle,
      top: element.getBoundingClientRect().top,
      bottom: element.getBoundingClientRect().bottom
    };
  });
}

test.describe("keyboard", () => {
  test("the skip link is first, visible on focus, and moves focus to the main content", async ({ page }) => {
    await page.goto("/projects");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Skip to main content" });

    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("the search dialog returns focus to its trigger", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("button", { name: /^Search/ });

    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Search the site" });
    const input = dialog.getByRole("combobox");

    await expect(dialog).toBeVisible();
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.getByRole("listbox")).toBeVisible();
    await input.fill("stadium");
    await expect(dialog.getByRole("option", { name: /Stadium/ })).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Ctrl+K search returns focus to whatever was focused before", async ({ page }) => {
    await page.goto("/about");

    const link = page.getByRole("link", { name: "Projects" }).first();

    await link.focus();
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog", { name: "Search the site" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(link).toBeFocused();
  });

  test("search navigates with the keyboard", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Search/ }).click();
    // Typing straight away is kept even if the dialog is still loading.
    await page.keyboard.type("chatub");

    const input = page.getByRole("dialog", { name: "Search the site" }).getByRole("combobox");

    await expect(input).toHaveValue("chatub");
    await expect(input).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/chatub$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ChatUB");
  });

  test("the More disclosure opens, closes with Escape and restores focus", async ({ page }) => {
    await page.goto("/");

    const more = page.getByRole("button", { name: "More" });

    await more.focus();
    await page.keyboard.press("Enter");
    await expect(more).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("list", { name: "More pages" }).getByRole("link", { name: "Recognition" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(more).toHaveAttribute("aria-expanded", "false");
    await expect(more).toBeFocused();
  });

  test("the guide is a modal dialog that traps focus and returns it to the launcher", async ({ page }) => {
    await page.goto("/");

    const launcher = page.getByRole("button", { name: /Ask Abdulelah/ });

    await launcher.click();

    const dialog = page.getByRole("dialog", { name: "Abdulelah’s guide" });

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("textbox", { name: "Ask Abdulelah’s guide a question" })).toBeFocused();

    for (let index = 0; index < 25; index += 1) {
      await page.keyboard.press("Tab");

      const inside = await page.evaluate(() => Boolean(document.activeElement?.closest("[data-agent-panel]")));

      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(launcher).toBeFocused();
  });

  test("the guide returns focus to an inline cue that opened it", async ({ page }) => {
    await page.route("**/api/agent", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          answer: "Abdulelah is an AI product builder in Riyadh.",
          actions: [{ label: "View All Projects", href: "/projects", type: "internal" }],
          mode: "fallback",
          scopeJudgeAllowed: true,
          quality: { score: 100, passed: true },
          sessionContext: { lastProject: null, lastIntent: null, lastRoleInterest: null, lastLanguage: "en", lastRecommendedCV: null }
        })
      })
    );
    await page.goto("/about");

    const cue = page.getByRole("button", { name: /Prefer the two-minute version/ });

    await cue.click();
    await expect(page.getByText("Abdulelah is an AI product builder in Riyadh.")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(cue).toBeFocused();
  });

  test("focus stays visible and is never hidden under the sticky header", async ({ page }) => {
    for (const path of ["/", "/projects", "/projects/chatub", "/contact", "/resume"]) {
      await page.goto(path);

      for (let index = 0; index < 18; index += 1) {
        await page.keyboard.press("Tab");

        const info = await focusedElementInfo(page);

        if (!info) continue;

        expect(info.outlineStyle, `${path} → ${info.tag} "${info.text}"`).not.toBe("none");
        expect(info.outlineWidth, `${path} → ${info.tag} "${info.text}"`).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
