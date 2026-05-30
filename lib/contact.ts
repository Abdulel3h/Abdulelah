export const CONTACT_SOURCES = ["contact-page", "ai-navigator"] as const;

export type ContactSource = (typeof CONTACT_SOURCES)[number];

export type ContactRequest = {
  name: string;
  email: string;
  company: string;
  interestType: string;
  message: string;
  website: string;
  source: ContactSource;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  company: 160,
  interestType: 80,
  message: 5_000
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readSource(value: unknown): ContactSource {
  return CONTACT_SOURCES.includes(value as ContactSource)
    ? (value as ContactSource)
    : "contact-page";
}

export function parseContactRequest(body: unknown): ContactRequest | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const contactRequest: ContactRequest = {
    name: readString(payload.name),
    email: readString(payload.email),
    company: readString(payload.company),
    interestType: readString(payload.interestType),
    message: readString(payload.message),
    website: readString(payload.website),
    source: readSource(payload.source)
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

export function createContactEmailSubject(contactRequest: ContactRequest) {
  const subjectName = contactRequest.name.replace(/[\r\n]+/g, " ");

  return contactRequest.source === "ai-navigator"
    ? `New AI Navigator message from ${subjectName}`
    : `New portfolio contact message from ${subjectName}`;
}

export function createContactEmailText(contactRequest: ContactRequest) {
  return [
    `Source: ${
      contactRequest.source === "ai-navigator"
        ? "Abdulelah AI Navigator"
        : "Abdulelah Portfolio Contact Page"
    }`,
    `Name: ${contactRequest.name}`,
    `Email: ${contactRequest.email}`,
    `Company: ${contactRequest.company || "Not provided"}`,
    `Interest Type: ${contactRequest.interestType || "Not provided"}`,
    "",
    "Message:",
    contactRequest.message,
    "",
    `Timestamp: ${new Date().toISOString()}`
  ].join("\n");
}
