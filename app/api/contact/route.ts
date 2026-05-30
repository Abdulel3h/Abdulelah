import { Resend } from "resend";
import {
  createContactEmailSubject,
  createContactEmailText,
  parseContactRequest
} from "@/lib/contact";
import { applyRuntimeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TO_EMAIL = "Abdul0l0h.0@gmail.com";
const DEFAULT_FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";
const ERROR_MESSAGE = "Unable to send message right now. Please email me directly.";
function jsonError(status: number) {
  return Response.json(
    {
      success: false,
      message: ERROR_MESSAGE
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

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError(400);
  }

  const contactRequest = parseContactRequest(body);

  if (!contactRequest) {
    return jsonError(400);
  }

  if (contactRequest.website) {
    return jsonSuccess();
  }

  const rateLimit = applyRuntimeRateLimit(request, {
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
