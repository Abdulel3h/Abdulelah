export type AgentSafetyCategory =
  | "allowed"
  | "out-of-scope"
  | "prompt-injection"
  | "sensitive-request";

export type AgentSafetyResult = {
  allowed: boolean;
  category: AgentSafetyCategory;
};

const PORTFOLIO_SCOPE_RESPONSE =
  "I'm Abdulelah AI Navigator, so I can only help with Abdulelah Alkhathami's portfolio, projects, skills, resume, and contact information. You can ask me about ChatUB, Althil, Absher Insight AI, his AI skills, or which CV to download.";

const PROTECTED_INFORMATION_RESPONSE =
  "I can't reveal or override private instructions, secrets, or system details. I'm Abdulelah AI Navigator, so I can only help with Abdulelah Alkhathami's public portfolio, projects, skills, resume, and contact information.";

const PROMPT_INJECTION_PATTERNS = [
  /\bignore\b.{0,40}\b(previous|prior|above|system|developer)\b.{0,30}\binstructions?\b/i,
  /\b(reveal|show|print|display|repeat|return|dump)\b.{0,45}\b(system prompt|hidden prompt|developer prompt|internal prompt|hidden instructions?)\b/i,
  /\b(act as|pretend to be|become)\b.{0,35}\b(another|different|unrestricted|general)\b.{0,20}\b(assistant|bot|ai)\b/i,
  /\b(bypass|override|disable|remove|break|evade)\b.{0,35}\b(restrictions?|rules?|guardrails?|safety|scope|instructions?)\b/i,
  /\b(answer anything|answer everything|unrestricted mode|developer mode|jailbreak)\b/i
];

const SENSITIVE_REQUEST_PATTERNS = [
  /\b(api[-_\s]?keys?|secret keys?|tokens?|credentials?|passwords?)\b/i,
  /\b(environment variables?|env vars?|process\.env)\b/i,
  /\b(server logs?|stack traces?|raw errors?)\b/i,
  /\b(system prompts?|hidden prompts?|internal prompts?|hidden instructions?)\b/i,
  /\b(user-submitted|visitor|contact)\b.{0,30}\b(messages?|submissions?|emails?)\b/i,
  /\b(disclose|reveal|show|print|dump)\b.{0,30}\b(secrets?|private|internal)\b/i
];

const CLEARLY_UNRELATED_PATTERNS = [
  /\b(write|generate|create|debug|fix|review|teach|show|give|help)\b.{0,45}\b(code|script|function|component|program|python|javascript|typescript|react|sql|html|css)\b/i,
  /\b(what is|explain|teach me|how (?:do|does|can|should|to))\b.{0,40}\b(react|next\.?js|python|javascript|typescript|programming|coding|algorithm|database|api)\b/i,
  /\b(politics?|election|president|religion|religious|medical|diagnosis|treatment|legal advice|financial advice|investment|stock|crypto|homework|current news|latest news|weather|random fact|capital of)\b/i,
  /\b(hack|exploit|malware|phishing|ransomware|ddos|sql injection|credential stuffing)\b/i
];

const NAMED_PORTFOLIO_PATTERNS = [
  /\babdulelah\b/i,
  /\bchatub\b/i,
  /\balthil\b/i,
  /\babsher(?: insight ai)?\b/i,
  /\bqanouni\b/i,
  /\bmedad\b/i,
  /\bvirtual astronauts?\b/i,
  /\buniversity of bisha\b/i,
  /\b(?:ai engineer|ai specialist)\s+cv\b/i
];

const PORTFOLIO_CONTEXT_PATTERNS = [
  /\b(portfolio|projects?|skills?|achievements?|resume|cv|github|linkedin|contact|email|hackathons?|education|experience|work|profile|hire|recruiter|download|navigate|website)\b/i,
  /\b(him|his|he)\b/i
];

const PORTFOLIO_TECHNOLOGY_PATTERNS = [
  /\b(ai|nlp|llms?|cloud|google cloud|azure|vertex ai|bigquery|cloud run|security|ueba|sustainability|python|sql|power bi|dashboard)\b/i
];

const NATURAL_RECRUITER_PATTERNS = [
  /\bwhy\b.{0,30}\bhire\b.{0,20}\b(him|abdulelah)\b/i,
  /\bwhat\b.{0,20}\b(can|does)\b.{0,15}\b(he|him|abdulelah)\b.{0,20}\b(do|offer|build)\b/i,
  /\b(his|abdulelah'?s)\b.{0,30}\b(strongest|best|top)\b.{0,20}\b(work|projects?|skills?)\b/i,
  /\bwhat\b.{0,20}\bmakes?\b.{0,12}\b(him|abdulelah)\b.{0,20}\bdifferent\b/i,
  /\bhow\b.{0,20}\b(contact|reach|connect with)\b.{0,15}\b(him|abdulelah)\b/i,
  /\bwhich\b.{0,20}\b(cv|resume)\b.{0,20}\b(download|choose|use)\b/i,
  /\b(recruiter|hiring)\b.{0,25}\b(summary|fit|profile)\b/i
];

const PORTFOLIO_REQUEST_PATTERNS = [
  /\b(show|list|summarize|review|explore)\b.{0,30}\b(strongest|best|top|featured|all)?\s*projects?\b/i,
  /\bportfolio\b/i,
  /\b(achievements?|hackathons?|skills?|resume|cv)\b.{0,25}\b(summary|overview|details?|download|choose|recommend)\b/i
];

function matchesAny(message: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(message));
}

export function classifyAgentMessage(message: string): AgentSafetyResult {
  if (matchesAny(message, PROMPT_INJECTION_PATTERNS)) {
    return { allowed: false, category: "prompt-injection" };
  }

  if (matchesAny(message, SENSITIVE_REQUEST_PATTERNS)) {
    return { allowed: false, category: "sensitive-request" };
  }

  if (matchesAny(message, CLEARLY_UNRELATED_PATTERNS)) {
    return { allowed: false, category: "out-of-scope" };
  }

  if (
    matchesAny(message, NAMED_PORTFOLIO_PATTERNS) ||
    matchesAny(message, NATURAL_RECRUITER_PATTERNS) ||
    matchesAny(message, PORTFOLIO_REQUEST_PATTERNS)
  ) {
    return { allowed: true, category: "allowed" };
  }

  if (
    matchesAny(message, PORTFOLIO_CONTEXT_PATTERNS) &&
    matchesAny(message, PORTFOLIO_TECHNOLOGY_PATTERNS)
  ) {
    return { allowed: true, category: "allowed" };
  }

  if (
    /\b(his|him|he|abdulelah)\b/i.test(message) &&
    matchesAny(message, PORTFOLIO_CONTEXT_PATTERNS)
  ) {
    return { allowed: true, category: "allowed" };
  }

  return { allowed: false, category: "out-of-scope" };
}

export function getSafetyRefusal(safety: AgentSafetyResult) {
  return safety.category === "prompt-injection" ||
    safety.category === "sensitive-request"
    ? PROTECTED_INFORMATION_RESPONSE
    : PORTFOLIO_SCOPE_RESPONSE;
}

export function getPortfolioScopeResponse() {
  return PORTFOLIO_SCOPE_RESPONSE;
}
