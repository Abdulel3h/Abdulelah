import { expect, test, type Page } from "@playwright/test";

/**
 * The Signature Terminal: the opening's shell and the stacked chapters.
 * The shell must answer from the page's own facts, work by keyboard and
 * touch, never trap focus, and never hold back the name. The stack must
 * never hide a focused link, and must fall back to a plain column without
 * JavaScript and on short screens.
 */

const hero = (page: Page) => page.locator("section[aria-labelledby='hero-title']");

async function runCommand(page: Page, command: string) {
  const input = hero(page).getByRole("textbox", { name: /Type a command|اكتب أمرًا/ });

  await expect(input).toBeEditable();
  await input.fill(command);
  await input.press("Enter");
}

test.describe("the opening shell", () => {
  test("the name is painted at full size before any script, and the shell waits read-only", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.locator("#hero-title")).toHaveText(/Abdulelah\s*Alkhathami/);
    await expect(hero(page).getByRole("textbox")).toHaveAttribute("readonly", "");
    // Every chip that can work without JavaScript is a plain link.
    await expect(hero(page).getByRole("link", { name: "Raqmi", exact: true })).toHaveAttribute("href", "/projects/raqmi");
    await expect(hero(page).getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("href", "/contact");
    await context.close();
  });

  test("lists every project with its status, from the keyboard", async ({ page }) => {
    await page.goto("/");
    await runCommand(page, "projects");

    const log = hero(page).getByRole("log", { name: "Terminal output" });

    await expect(log).toContainText("8 projects · 5 working, with public code · 3 concepts");
    await expect(log.getByRole("link", { name: "Raqmi", exact: true })).toHaveAttribute("href", "/projects/raqmi");
    await expect(log).toContainText("Concept");
    await expect(log).toContainText("Working prototype");
  });

  test("history, completion and an unknown command", async ({ page }) => {
    await page.goto("/");

    const input = hero(page).getByRole("textbox", { name: "Type a command" });

    await runCommand(page, "whoami");
    await expect(hero(page).getByRole("log")).toContainText("Applied AI Engineer");
    await input.press("ArrowUp");
    await expect(input).toHaveValue("whoami");
    await input.fill("proj");
    await input.press("Tab");
    await expect(input).toHaveValue("projects ");
    await expect(input).toBeFocused();
    await runCommand(page, "rm -rf /");
    await expect(hero(page).getByRole("log")).toContainText("command not found: rm");
  });

  test("Tab on an empty line moves focus on: the shell never traps the keyboard", async ({ page }) => {
    await page.goto("/");

    const input = hero(page).getByRole("textbox", { name: "Type a command" });

    await input.focus();
    await page.keyboard.press("Tab");
    await expect(input).not.toBeFocused();
  });

  test("the Selected work chip types its command and carries the reader to the work", async ({ page }) => {
    await page.goto("/");
    await hero(page).getByRole("link", { name: "Selected work", exact: true }).click();
    await expect(page.locator("#work-title")).toBeFocused();
    await expect(page.locator("#work-title")).toBeInViewport();
  });

  test("open <name> navigates to the case study", async ({ page }) => {
    await page.goto("/");
    await runCommand(page, "open stadium");
    await expect(page).toHaveURL(/\/projects\/stadium$/, { timeout: 15_000 });
  });

  test("answers Arabic words in Arabic", async ({ page }) => {
    await page.goto("/ar");
    await runCommand(page, "مشاريع");

    const log = hero(page).getByRole("log", { name: "مخرجات الطرفية" });

    await expect(log).toContainText("8 مشاريع");
    await expect(log.getByRole("link", { name: "رقمي" })).toHaveAttribute("href", "/ar/projects/raqmi");
  });

  test("ask opens the guide with the question", async ({ page }) => {
    await page.goto("/");
    await runCommand(page, "ask");
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("the stacked chapters", () => {
  test("stack on a desktop, and a covered card is brought back when focus enters it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const stack = page.locator(".stack");

    await expect(stack).toHaveAttribute("data-armed", "true");

    // Scroll until the third card covers the second.
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".stack-card"));
      const list = document.querySelector<HTMLElement>(".stack")!;
      const gap = parseFloat(getComputedStyle(list).rowGap);
      const top = list.getBoundingClientRect().top + window.scrollY + cards[0].offsetHeight + cards[1].offsetHeight + 2 * gap;

      window.scrollTo(0, top - 200);
    });
    await expect
      .poll(() => page.locator("#chatub .stack-shade").evaluate((shade) => Number(getComputedStyle(shade).opacity)))
      .toBeGreaterThan(0.15);

    const link = page.locator("#chatub").getByRole("link", { name: /Case study/ });

    await link.focus();

    // The focused link is the topmost element at its own centre: nothing covers it.
    await expect
      .poll(() =>
        link.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);

          return Boolean(hit && element.contains(hit));
        })
      )
      .toBe(true);
  });

  test("every card's links stay reachable on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    for (const slug of ["raqmi", "chatub", "althil", "absher-insight-ai", "stadium"]) {
      const link = page.locator(`#${slug}`).getByRole("link", { name: /Case study/ });

      await link.scrollIntoViewIfNeeded();
      await link.focus();
      await expect(link).toBeInViewport();
    }
  });

  test("is a plain column without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.locator(".stack")).not.toHaveAttribute("data-armed", "true");
    expect(await page.locator("#raqmi").evaluate((card) => getComputedStyle(card).position)).toBe("relative");
    await context.close();
  });

  test("holds still under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.locator("#althil").scrollIntoViewIfNeeded();
    expect(await page.locator("#raqmi").evaluate((card) => getComputedStyle(card).transform)).toBe("none");
    expect(await page.locator("#hero-title .sh-decode").first().evaluate((name) => getComputedStyle(name, "::after").animationName)).toBe(
      "none"
    );
  });

  test("falls back to a column on a short screen", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.goto("/");
    await page.locator("#chatub").scrollIntoViewIfNeeded();
    await expect(page.locator(".stack")).not.toHaveAttribute("data-armed", "true");
  });

  test("on a phone the cards do not stack; each chapter's title bar sticks instead", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ar");
    await page.locator("#althil").scrollIntoViewIfNeeded();
    await expect(page.locator(".stack")).not.toHaveAttribute("data-armed", "true");
    expect(await page.locator("#althil .stack-bar").evaluate((bar) => getComputedStyle(bar).position)).toBe("sticky");
    expect(await page.locator("#althil").evaluate((card) => getComputedStyle(card).position)).toBe("relative");
  });
});
