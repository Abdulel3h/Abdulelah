import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TO_EMAIL = "Abdul0l0h.0@gmail.com";
const DEFAULT_FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";
const ERROR_MESSAGE = "Unable to send message right now. Please email me directly.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  company: 160,
  interestType: 80,
  message: 5_000
};

type ContactRequest = {
  name: string;
  email: string;
  company: string;
  interestType: string;
  message: string;
  website: string;
};

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

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseContactRequest(body: unknown): ContactRequest | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const contactRequest = {
    name: readString(payload.name),
    email: readString(payload.email),
    company: readString(payload.company),
    interestType: readString(payload.interestType),
    message: readString(payload.message),
    website: readString(payload.website)
  };

  if (contactRequest.website) {
    return contactRequest;
  }

  if (
    !contactRequest.name ||
    !contactRequest.email ||
    !EMAIL_PATTERN.test(contactRequest.email) ||
    !contactRequest.message
  ) {
    return null;
  }

  const hasOverlyLongValue = Object.entries(MAX_LENGTHS).some(
    ([key, maxLength]) =>
      contactRequest[key as keyof typeof MAX_LENGTHS].length > maxLength
  );

  return hasOverlyLongValue ? null : contactRequest;
}

function createEmailText(contactRequest: ContactRequest) {
  return [
    `Name: ${contactRequest.name}`,
    `Email: ${contactRequest.email}`,
    `Company: ${contactRequest.company || "Not provided"}`,
    `Interest Type: ${contactRequest.interestType || "Not provided"}`,
    "",
    "Message:",
    contactRequest.message,
    "",
    "Source: Abdulelah Portfolio Website",
    `Timestamp: ${new Date().toISOString()}`
  ].join("\n");
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

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return jsonError(500);
  }

  const resend = new Resend(apiKey);
  const subjectName = contactRequest.name.replace(/[\r\n]+/g, " ");

  try {
    // TODO: Add a durable IP-aware rate limiter if public form abuse becomes an issue.
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL,
      replyTo: contactRequest.email,
      subject: `New portfolio contact message from ${subjectName}`,
      text: createEmailText(contactRequest)
    });

    if (error) {
      return jsonError(500);
    }

    return jsonSuccess();
  } catch {
    return jsonError(500);
  }
}
