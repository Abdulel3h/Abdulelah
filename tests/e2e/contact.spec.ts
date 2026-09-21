import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("uses one native, labelled select for the topic and posts to /api/contact", async ({ page }) => {
    const form = page.locator("form[action='/api/contact']");

    await expect(form).toHaveAttribute("method", "post");
    await expect(form.getByRole("combobox")).toHaveCount(1);
    await expect(form.getByRole("combobox", { name: /What is this about\?/ })).toBeVisible();
    await expect(form.getByText("(optional)")).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy notice" })).toBeVisible();
  });

  test("keeps the honeypot out of the accessibility tree and tab order", async ({ page }) => {
    await expect(page.getByRole("textbox", { name: "Website" })).toHaveCount(0);

    const honeypot = page.locator("#contact-website");

    await expect(honeypot).toHaveCount(1);
    expect(await honeypot.evaluate((input) => input.closest("[inert]") !== null && input.tabIndex === -1)).toBe(true);
  });

  test("moves focus to the first invalid field and describes the error", async ({ page }) => {
    await page.getByRole("button", { name: "Send message" }).click();

    const name = page.getByRole("textbox", { name: /Name/ });

    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", "contact-name-error");
    await expect(page.locator("#contact-name-error")).toHaveText("Enter your name.");
    await expect(page.getByRole("status").filter({ hasText: "Please fix the highlighted fields." })).toBeVisible();
  });

  test("shows pending then success, sends JSON by POST and never puts details in the URL", async ({ page }) => {
    let method = "";
    let body: Record<string, string> = {};

    await page.route("**/api/contact", async (route) => {
      method = route.request().method();
      body = route.request().postDataJSON();
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, code: "sent" }) });
    });

    await page.getByRole("textbox", { name: /Name/ }).fill("Sara Test");
    await page.getByRole("textbox", { name: /Email/ }).fill("sara@example.com");
    await page.getByRole("combobox", { name: /What is this about\?/ }).selectOption("AI Project");
    await page.getByRole("textbox", { name: /Message/ }).fill("A short brief about an Arabic AI assistant.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
    await expect(page.getByText("Thank you — your message was sent.")).toBeVisible();

    expect(method).toBe("POST");
    expect(body).toMatchObject({ name: "Sara Test", email: "sara@example.com", interestType: "AI Project", source: "contact-page" });
    expect(page.url()).not.toContain("sara");
    expect(new URL(page.url()).search).toBe("");
    await expect(page.getByRole("textbox", { name: /Name/ })).toHaveValue("");
  });

  test("keeps what was typed when the server fails and offers a direct email", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false, code: "unavailable" }) })
    );

    await page.getByRole("textbox", { name: /Name/ }).fill("Sara Test");
    await page.getByRole("textbox", { name: /Email/ }).fill("sara@example.com");
    await page.getByRole("textbox", { name: /Message/ }).fill("Please keep this text.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText(/couldn’t be sent right now/)).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Message/ })).toHaveValue("Please keep this text.");
  });

  test("explains rate limiting", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ success: false, code: "rate_limited" }) })
    );

    await page.getByRole("textbox", { name: /Name/ }).fill("Sara");
    await page.getByRole("textbox", { name: /Email/ }).fill("sara@example.com");
    await page.getByRole("textbox", { name: /Message/ }).fill("Hello");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Please wait a few minutes/)).toBeVisible();
  });

  test("marks Arabic-capable fields for bidirectional text", async ({ page }) => {
    await expect(page.locator("#contact-name")).toHaveAttribute("dir", "auto");
    await expect(page.locator("#contact-message")).toHaveAttribute("dir", "auto");
    await expect(page.locator("#contact-email")).toHaveAttribute("dir", "ltr");
  });
});
