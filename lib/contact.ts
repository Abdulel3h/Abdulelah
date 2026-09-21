export const AGENT_CONTACT_INTENTS = [
  "Hiring opportunity",
  "Collaboration",
  "AI project",
  "Hackathon / innovation program",
  "Speaking / content",
  "Other"
] as const;

export type AgentContactIntent = (typeof AGENT_CONTACT_INTENTS)[number];

/** Topics offered by the contact page form. Labels are localized in the UI. */
export const CONTACT_PAGE_INTERESTS = [
  "Hiring",
  "Collaboration",
  "AI Project",
  "Hackathon",
  "Other"
] as const;

export type ContactPageInterest = (typeof CONTACT_PAGE_INTERESTS)[number];

export const CONTACT_SOURCES = [
  "contact-page",
  "agent-abdulelah",
  "ai-navigator"
] as const;

export type ContactSource = (typeof CONTACT_SOURCES)[number];
export type ContactPriority = "High" | "Medium" | "Low";

export type ContactRequest = {
  name: string;
  email: string;
  company: string;
  interestType: string;
  message: string;
  website: string;
  source: ContactSource;
};

export type ContactField = "name" | "email" | "company" | "interestType" | "message";
export type ContactFieldError = "required" | "email" | "too_long" | "interest";
export type ContactFieldErrors = Partial<Record<ContactField, ContactFieldError>>;

export type ContactValidation =
  | { ok: true; data: ContactRequest }
  | { ok: false; errors: ContactFieldErrors };

export type ContactLeadSummary = {
  priority: ContactPriority;
  reason: string;
  recommendedFollowUp: string;
};

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const HIGH_PRIORITY_MESSAGE_PATTERN =
  /\b(hiring|job|interview|recruiter|company|opportunity)\b|توظيف|وظيفة|مقابلة|شركة|فرصة/i;
const MEDIUM_PRIORITY_MESSAGE_PATTERN =
  /\b(collaborat(?:e|ion)|ai project|hackathon|innovation)\b|تعاون|مشروع\s*(?:ai|ذكاء اصطناعي)?|هاكاثون|ابتكار/i;

export const CONTACT_MAX_LENGTHS: Record<ContactField, number> = {
  name: 120,
  email: 254,
  company: 160,
  interestType: 80,
  message: 5_000
};

// Control characters other than tab and newline, plus bidi override
// characters that can be used to disguise text in an email client.
const UNSAFE_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

/** Single-line field: no line breaks, no control characters, collapsed spaces. */
export function sanitizeLine(value: unknown) {
  return readString(value)
    .replace(UNSAFE_CHARACTERS, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Multi-line field: normalized line endings, no control characters. */
export function sanitizeMessage(value: unknown) {
  return readString(value)
    .replace(/\r\n?/g, "\n")
    .replace(UNSAFE_CHARACTERS, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function readSource(value: unknown): ContactSource {
  return CONTACT_SOURCES.includes(value as ContactSource)
    ? (value as ContactSource)
    : "contact-page";
}

function isAgentContactSource(source: ContactSource) {
  return source === "agent-abdulelah" || source === "ai-navigator";
}

function isAgentContactIntent(value: string): value is AgentContactIntent {
  return AGENT_CONTACT_INTENTS.includes(value as AgentContactIntent);
}

export function isValidEmail(value: string) {
  return value.length <= CONTACT_MAX_LENGTHS.email && EMAIL_PATTERN.test(value);
}

/**
 * Validates and sanitizes a contact submission (JSON body or form fields).
 * Shared by the browser form — for instant, field-level feedback — and the
 * server, which never trusts the client.
 */
export function validateContactRequest(body: unknown): ContactValidation {
  const payload =
    typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};
  const source = readSource(payload.source);
  const data: ContactRequest = {
    name: sanitizeLine(payload.name),
    email: sanitizeLine(payload.email).replace(/\s+/g, ""),
    company: sanitizeLine(payload.company),
    interestType: sanitizeLine(payload.interestType),
    message: sanitizeMessage(payload.message),
    website: sanitizeLine(payload.website),
    source
  };
  const errors: ContactFieldErrors = {};

  if (!data.name) errors.name = "required";
  if (!data.email) errors.email = "required";
  else if (!isValidEmail(data.email)) errors.email = "email";
  if (!data.message) errors.message = "required";

  if (isAgentContactSource(source)) {
    if (!isAgentContactIntent(data.interestType)) errors.interestType = "interest";
  } else if (data.interestType && !CONTACT_PAGE_INTERESTS.includes(data.interestType as ContactPageInterest)) {
    errors.interestType = "interest";
  }

  (Object.keys(CONTACT_MAX_LENGTHS) as ContactField[]).forEach((field) => {
    if (!errors[field] && data[field].length > CONTACT_MAX_LENGTHS[field]) {
      errors[field] = "too_long";
    }
  });

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

/**
 * Backwards-compatible parser: the sanitized request, or null when invalid.
 * A filled honeypot short-circuits validation so the caller can quietly drop
 * the submission.
 */
export function parseContactRequest(body: unknown): ContactRequest | null {
  const payload =
    typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;

  if (!payload) {
    return null;
  }

  const website = sanitizeLine(payload.website);

  if (website) {
    return {
      name: "",
      email: "",
      company: "",
      interestType: "",
      message: "",
      website,
      source: readSource(payload.source)
    };
  }

  const result = validateContactRequest(payload);

  return result.ok ? result.data : null;
}

export function createContactLeadSummary(
  contactRequest: ContactRequest
): ContactLeadSummary {
  if (
    contactRequest.interestType === "Hiring opportunity" ||
    contactRequest.interestType === "Hiring" ||
    HIGH_PRIORITY_MESSAGE_PATTERN.test(contactRequest.message)
  ) {
    return {
      priority: "High",
      reason: contactRequest.interestType.startsWith("Hiring")
        ? "The visitor selected a hiring topic."
        : "The message contains hiring or opportunity language.",
      recommendedFollowUp:
        "Reply within one business day to confirm the role details and suggest a short introductory call."
    };
  }

  if (
    ["Collaboration", "AI project", "AI Project", "Hackathon / innovation program", "Hackathon"].includes(
      contactRequest.interestType
    ) ||
    MEDIUM_PRIORITY_MESSAGE_PATTERN.test(contactRequest.message)
  ) {
    return {
      priority: "Medium",
      reason:
        "The message is about collaboration, an AI project, or an innovation program.",
      recommendedFollowUp:
        "Review the opportunity and reply with the most relevant portfolio example and a suggested next step."
    };
  }

  return {
    priority: "Low",
    reason: "The message is general or the opportunity type is not yet clear.",
    recommendedFollowUp:
      "Reply when convenient with a relevant portfolio link or a short clarification question."
  };
}

export function createContactEmailSubject(contactRequest: ContactRequest) {
  const subjectName = sanitizeLine(contactRequest.name);
  const intent = sanitizeLine(contactRequest.interestType || "Other");

  return isAgentContactSource(contactRequest.source)
    ? `New Agent Abdulelah message: ${intent} from ${subjectName}`
    : `New portfolio contact message (${intent}) from ${subjectName}`;
}

export function createContactEmailText(contactRequest: ContactRequest) {
  const leadSummary = createContactLeadSummary(contactRequest);

  return [
    `Source: ${
      isAgentContactSource(contactRequest.source)
        ? "Agent Abdulelah"
        : "Abdulelah Portfolio Contact Page"
    }`,
    `Intent: ${contactRequest.interestType || "Not provided"}`,
    `Name: ${contactRequest.name}`,
    `Email: ${contactRequest.email}`,
    `Company: ${contactRequest.company || "Not provided"}`,
    "",
    "Message:",
    contactRequest.message,
    "",
    `Timestamp: ${new Date().toISOString()}`,
    `Suggested priority: ${leadSummary.priority}`,
    `Reason for priority: ${leadSummary.reason}`,
    `Recommended follow-up: ${leadSummary.recommendedFollowUp}`
  ].join("\n");
}
