import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/contact/route";
import {
  createContactEmailSubject,
  parseContactRequest,
  sanitizeLine,
  sanitizeMessage,
  validateContactRequest
} from "@/lib/contact";

const valid = {
  name: "Sara",
  email: "sara@example.com",
  company: "",
  interestType: "Hiring",
  message: "We have an AI engineering role.",
  source: "contact-page"
};

let ip = 0;

function request(body: string, headers: Record<string, string>) {
  ip += 1;

  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    body,
    headers: { "x-forwarded-for": `10.0.0.${ip}`, host: "localhost:3000", ...headers }
  });
}

describe("contact validation", () => {
  it("accepts a complete submission", () => {
    expect(validateContactRequest(valid).ok).toBe(true);
  });

  it("reports each missing or invalid field", () => {
    const result = validateContactRequest({ ...valid, name: " ", email: "not-an-email", message: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual({ name: "required", email: "email", message: "required" });
    }
  });

  it("rejects unknown topics and oversized fields", () => {
    const result = validateContactRequest({ ...valid, interestType: "Spam", message: "x".repeat(5001) });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.interestType).toBe("interest");
      expect(result.errors.message).toBe("too_long");
    }
  });

  it("strips control and bidi-override characters and header line breaks", () => {
    const rlo = String.fromCharCode(0x202e);
    const nul = String.fromCharCode(0);

    expect(sanitizeLine(`Sara${nul}\r\nBcc: x@y.z${rlo}`)).toBe("Sara Bcc: x@y.z");
    expect(sanitizeMessage("line one\r\nline two")).toBe("line one\nline two");
    expect(createContactEmailSubject({ ...valid, website: "", source: "contact-page", name: "A\nB" })).not.toContain("\n");
  });

  it("keeps Arabic content intact", () => {
    const result = validateContactRequest({ ...valid, name: "عبدالله", message: "لدينا فرصة وظيفية في الذكاء الاصطناعي." });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("عبدالله");
    }
  });

  it("lets a filled honeypot through quietly so it can be dropped", () => {
    expect(parseContactRequest({ website: "https://spam.example" })?.website).toBe("https://spam.example");
  });
});

describe("POST /api/contact", () => {
  it("returns field errors for an invalid JSON submission", async () => {
    const response = await POST(
      request(JSON.stringify({ ...valid, email: "bad" }), { "content-type": "application/json" })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ success: false, code: "invalid", errors: { email: "email" } });
  });

  it("answers a bot-filled honeypot as if it succeeded", async () => {
    const response = await POST(
      request(JSON.stringify({ ...valid, website: "spam" }), { "content-type": "application/json" })
    );

    expect(response.status).toBe(200);
  });

  it("refuses a cross-site form post", async () => {
    const body = new URLSearchParams({ ...valid, locale: "en" }).toString();
    const response = await POST(
      request(body, { "content-type": "application/x-www-form-urlencoded", origin: "https://evil.example" })
    );

    expect(response.status).toBe(403);
  });

  it("handles the no-JavaScript form post with a redirect that carries no personal data", async () => {
    const body = new URLSearchParams({ ...valid, locale: "ar" }).toString();
    const response = await POST(
      request(body, { "content-type": "application/x-www-form-urlencoded", origin: "http://localhost:3000" })
    );

    expect(response.status).toBe(303);

    const location = response.headers.get("location") ?? "";

    // Email delivery is not configured in tests, so the honest outcome is the
    // failure page — in the right language, with nothing from the form.
    expect(location).toMatch(/\/ar\/contact\/(sent|failed)$/);
    expect(location).not.toContain("sara");
    expect(location).not.toContain("?");
  });
});
