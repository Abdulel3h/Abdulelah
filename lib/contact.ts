export const AGENT_CONTACT_INTENTS = [
  "Hiring opportunity",
  "Collaboration",
  "AI project",
  "Hackathon / innovation program",
  "Speaking / content",
  "Other"
] as const;

export type AgentContactIntent = (typeof AGENT_CONTACT_INTENTS)[number];

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

export type ContactLeadSummary = {
  priority: ContactPriority;
  reason: string;
  recommendedFollowUp: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HIGH_PRIORITY_MESSAGE_PATTERN =
  /\b(hiring|job|interview|recruiter|company|opportunity)\b|توظيف|وظيفة|مقابلة|شركة|فرصة/i;
const MEDIUM_PRIORITY_MESSAGE_PATTERN =
  /\b(collaborat(?:e|ion)|ai project|hackathon|innovation)\b|تعاون|مشروع\s*(?:ai|ذكاء اصطناعي)?|هاكاثون|ابتكار/i;

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

function isAgentContactSource(source: ContactSource) {
  return source === "agent-abdulelah" || source === "ai-navigator";
}

function isAgentContactIntent(value: string): value is AgentContactIntent {
  return AGENT_CONTACT_INTENTS.includes(value as AgentContactIntent);
}

function sanitizeEmailLine(value: string) {
  return value.replace(/[\r\n]+/g, " ");
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
    !contactRequest.message ||
    (contactRequest.source === "agent-abdulelah" &&
      !isAgentContactIntent(contactRequest.interestType))
  ) {
    return null;
  }

  const hasOverlyLongValue = Object.entries(MAX_LENGTHS).some(
    ([key, maxLength]) =>
      contactRequest[key as keyof typeof MAX_LENGTHS].length > maxLength
  );

  return hasOverlyLongValue ? null : contactRequest;
}

export function createContactLeadSummary(
  contactRequest: ContactRequest
): ContactLeadSummary {
  if (
    contactRequest.interestType === "Hiring opportunity" ||
    HIGH_PRIORITY_MESSAGE_PATTERN.test(contactRequest.message)
  ) {
    return {
      priority: "High",
      reason:
        contactRequest.interestType === "Hiring opportunity"
          ? "The visitor selected Hiring opportunity."
          : "The message contains hiring or opportunity language.",
      recommendedFollowUp:
        "Reply within one business day to confirm the role details and suggest a short introductory call."
    };
  }

  if (
    ["Collaboration", "AI project", "Hackathon / innovation program"].includes(
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
  const subjectName = sanitizeEmailLine(contactRequest.name);
  const intent = sanitizeEmailLine(contactRequest.interestType || "Other");

  return isAgentContactSource(contactRequest.source)
    ? `New Agent Abdulelah message: ${intent} from ${subjectName}`
    : `New portfolio contact message from ${subjectName}`;
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
