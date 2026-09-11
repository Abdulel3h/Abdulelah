import { Resend } from "resend";
import {
  createContactEmailSubject,
  createContactEmailText,
  parseContactRequest
} from "@/lib/contact";
import { readJsonBody } from "@/lib/http/read-json-body";
import { applyRateLimit } from "@/lib/rate-limit";
import { checkBotProtection } from "@/lib/security/bot-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TO_EMAIL = "me@abdulelah.de";
const DEFAULT_FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";
const ERROR_MESSAGE = "Unable to send message right now. Please email me directly.";
const VERIFICATION_MESSAGE =
  "We couldn't verify this submission. Please reload the page and try again.";
// Largest valid contact payload is a 5,000-char message plus short fields and a
// Turnstile token. Enforced against the actual bytes read, not Content-Length.
const MAX_BODY_BYTES = 24_000;

function jsonError(status: number, message = ERROR_MESSAGE) {
  return Response.json(
    {
      success: false,
      message
    },
    { status }
  );
}

function jsonSuccess() {
  return Response.json({
    success: true,
    message: "Message sent successfully."
  });
}

function readTurnstileToken(payload: unknown) {
  return typeof payload === "object" &&
    payload !== null &&
    "turnstileToken" in payload
    ? (payload as { turnstileToken: unknown }).turnstileToken
    : undefined;
}

export async function POST(request: Request) {
  const rateLimit = await applyRateLimit(request, {
    namespace: "contact",
    limit: 5,
    windowMs: 15 * 60_000
  });

  if (!rateLimit.allowed) {
    return Response.json(
      {
        success: false,
        message: "Please wait before sending another message."
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds)
        }
      }
    );
  }

  const body = await readJsonBody(request, MAX_BODY_BYTES);

  if (!body.ok) {
    return jsonError(body.status);
  }

  const contactRequest = parseContactRequest(body.data);

  if (!contactRequest) {
    return jsonError(400);
  }

  // Honeypot: answer as if it succeeded so a bot learns nothing, and never
  // spend a Turnstile verification or an email on it.
  if (contactRequest.website) {
    return jsonSuccess();
  }

  const botCheck = await checkBotProtection({
    request,
    token: readTurnstileToken(body.data)
  });

  if (!botCheck.ok) {
    return jsonError(403, VERIFICATION_MESSAGE);
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return jsonError(500);
  }

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL,
      replyTo: contactRequest.email,
      subject: createContactEmailSubject(contactRequest),
      text: createContactEmailText(contactRequest)
    });

    if (error) {
      return jsonError(500);
    }

    return jsonSuccess();
  } catch {
    return jsonError(500);
  }
}
