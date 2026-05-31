export type AgentSafetyCategory =
  | "allowed"
  | "prompt-injection"
  | "secret-request"
  | "unrelated-task";

export type AgentSafetyResult = {
  allowed: boolean;
  category: AgentSafetyCategory;
};

const PORTFOLIO_SCOPE_RESPONSE =
  "I can only help with Abdulelah Alkhathami's portfolio, projects, blog insights, skills, resume, and contact information.";

const PROTECTED_INFORMATION_RESPONSE =
  "I can't reveal or override private instructions, secrets, or system details. I'm Abdulelah AI Navigator, so I can only help with Abdulelah Alkhathami's public portfolio, projects, blog insights, skills, resume, and contact information.";

const PROMPT_INJECTION_PATTERNS = [
  /\bignore\b.{0,40}\b(previous|prior|above|system|developer)\b.{0,30}\binstructions?\b/i,
  /\bignore\b.{0,30}\b(your|all|the)?\s*(instructions?|rules?|prompt|scope)\b/i,
  /\b(reveal|show|print|display|repeat|return|dump)\b.{0,45}\b(system prompt|hidden prompt|developer prompt|internal prompt|hidden instructions?)\b/i,
  /\b(act as|pretend to be|become)\b.{0,35}\b(another|different|unrestricted|general)\b.{0,20}\b(assistant|bot|ai)\b/i,
  /\b(bypass|override|disable|remove|break|evade)\b.{0,35}\b(restrictions?|rules?|guardrails?|safety|scope|instructions?)\b/i,
  /\b(answer anything|answer everything|unrestricted mode|developer mode|jailbreak)\b/i,
  /(?:اعرض|اظهر|اكتب|اكشف).{0,25}(?:تعليمات النظام|التعليمات المخفية|system prompt)/i,
  /(?:تجاهل|انس|اترك).{0,20}(?:التعليمات|التوجيهات|القيود)/i,
  /(?:اكسر|تجاوز|تخط).{0,20}(?:القيود|الحماية|التعليمات)/i,
  /(?:تصرف|اشتغل).{0,20}(?:كمساعد|مساعد).{0,15}(?:ثاني|اخر|آخر)/i
];

const SENSITIVE_REQUEST_PATTERNS = [
  /\b(show|reveal|print|display|return|dump|give|list|expose|tell me|what are)\b.{0,35}\b(api[-_\s]?keys?|secret keys?|tokens?|credentials?|passwords?)\b/i,
  /\b(show|reveal|print|display|return|dump|give|list|expose)\b.{0,35}\b(environment variables?|env vars?|process\.env)\b/i,
  /\b(show|reveal|print|display|return|dump|give|list|expose)\b.{0,35}\b(server logs?|stack traces?|raw errors?)\b/i,
  /\b(show|reveal|print|display|return|dump|give|list|expose)\b.{0,35}\b(system prompts?|hidden prompts?|internal prompts?|hidden instructions?)\b/i,
  /\b(user-submitted|visitor|contact)\b.{0,30}\b(messages?|submissions?|emails?)\b/i,
  /\b(disclose|reveal|show|print|dump)\b.{0,30}\b(secrets?|private|internal)\b/i,
  /(?:اعرض|اظهر|اكشف|عطني|عطيني|هات).{0,20}(?:مفتاح|مفاتيح).{0,10}(?:api|البيئة)/i,
  /(?:اعرض|اظهر|اكشف|عطني|عطيني|هات).{0,20}(?:الاسرار|الأسرار|متغيرات البيئة|سجلات الخادم|سجلات السيرفر)/i
];

const UNRELATED_TASK_PATTERNS = [
  /\b(write|generate|create|build|debug|fix|review|solve|do)\b.{0,45}\b(code|script|function|component|program|app|application|homework|assignment)\b/i,
  /\b(explain|teach me|what is)\b.{0,30}\b(react|next\.?js|python|javascript|typescript)\b/i,
  /(?:اكتب|سوي|سو|ابن|صلح|حل).{0,25}(?:كود|بايثون|تطبيق|برنامج|واجبي|الواجب)/i,
  /(?:اشرح|علمني).{0,20}(?:react|رياكت|بايثون|جافاسكربت|تايب سكربت)/i
];

function matchesAny(message: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(message));
}

export function classifyAgentMessage(message: string): AgentSafetyResult {
  if (matchesAny(message, PROMPT_INJECTION_PATTERNS)) {
    return { allowed: false, category: "prompt-injection" };
  }

  if (matchesAny(message, SENSITIVE_REQUEST_PATTERNS)) {
    return { allowed: false, category: "secret-request" };
  }

  if (matchesAny(message, UNRELATED_TASK_PATTERNS)) {
    return { allowed: false, category: "unrelated-task" };
  }

  return { allowed: true, category: "allowed" };
}

export function getSafetyRefusal(safety: AgentSafetyResult) {
  return safety.category === "prompt-injection" ||
    safety.category === "secret-request"
    ? PROTECTED_INFORMATION_RESPONSE
    : PORTFOLIO_SCOPE_RESPONSE;
}

export function getPortfolioScopeResponse() {
  return PORTFOLIO_SCOPE_RESPONSE;
}
