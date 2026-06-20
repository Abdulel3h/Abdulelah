import { siteConfig } from "@/data/site";

export type ContactChannel = "recruitment" | "business" | "general" | "primary";

function normalizeContactText(message: string) {
  return message
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[ً-ٰٟ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

const BUSINESS_TERMS = [
  "consult",
  "consulting",
  "consultancy",
  "freelance",
  "contract work",
  "partnership",
  "partner with",
  "work with us",
  "build for us",
  "business inquiry",
  "business opportunity",
  "استشارة",
  "استشارية",
  "عمل حر",
  "شراكة",
  "تعاون تجاري"
];

const RECRUITMENT_TERMS = [
  "job",
  "jobs",
  "recruit",
  "recruiter",
  "recruitment",
  "hiring",
  "hire",
  "vacancy",
  "open role",
  "open position",
  "career",
  "توظيف",
  "وظيفة",
  "وظائف",
  "تعيين",
  "شاغر"
];

const GENERAL_TERMS = [
  "contact",
  "reach",
  "get in touch",
  "connect",
  "email",
  "message",
  "تواصل",
  "اتواصل",
  "اتصال",
  "ايميل",
  "رسالة"
];

function includesAny(normalized: string, terms: string[]) {
  return terms.some((term) => normalized.includes(normalizeContactText(term)));
}

/**
 * Routes a visitor message to the most relevant contact alias. Business and
 * recruitment intents take priority over a generic "contact" mention so a
 * recruiter or client lands on the dedicated inbox rather than the catch-all.
 */
export function resolveContactChannel(message: string): ContactChannel {
  const normalized = normalizeContactText(message);

  if (includesAny(normalized, BUSINESS_TERMS)) {
    return "business";
  }

  if (includesAny(normalized, RECRUITMENT_TERMS)) {
    return "recruitment";
  }

  if (includesAny(normalized, GENERAL_TERMS)) {
    return "general";
  }

  return "primary";
}

export function getContactEmail(channel: ContactChannel): string {
  const { contactEmails } = siteConfig;

  switch (channel) {
    case "recruitment":
      return contactEmails.recruitment;
    case "business":
      return contactEmails.business;
    case "general":
      return contactEmails.general;
    default:
      return contactEmails.primary;
  }
}

export function getRoutedContactEmail(message: string): string {
  return getContactEmail(resolveContactChannel(message));
}
