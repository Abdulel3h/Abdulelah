import "server-only";
import {
  hasDeepSeekApiKey,
  requestDeepSeekCompletion
} from "@/lib/agent/deepseek";

export type ScopeJudgeReason =
  | "portfolio_related"
  | "recruiter_related"
  | "project_related"
  | "skills_related"
  | "resume_related"
  | "contact_related"
  | "blog_related"
  | "unclear_but_possible"
  | "unrelated_general"
  | "unrelated_task"
  | "unsafe_request";

export type ScopeJudgeResult = {
  allowed: boolean;
  reason: ScopeJudgeReason;
  confidence: number;
};

export type ScopeJudgeDecision = ScopeJudgeResult & {
  attempted: boolean;
  failed: boolean;
};

const SCOPE_JUDGE_PROMPT =
  'You are the scope classifier for Agent Abdulelah, a portfolio assistant. Allow questions about Abdulelah Alkhathami\'s public portfolio, projects, project explanations, comparisons, portfolio tour, articles, AI insights, skills, achievements, resume, contact information, hiring fit, recruiter mode, role matching, CV selection, and website navigation. Be permissive with short, vague, Arabic, English, and Saudi/Najdi questions when they could reasonably refer to Abdulelah, such as "What does he know?", "Why hire him?", "وش عنده؟", "وش يعرف؟", and "هل يناسبنا؟". For those, return allowed=true with unclear_but_possible or the closest allowed reason. Reject clearly unrelated general questions, unrelated work requests, and unsafe requests. Return JSON only: {"allowed":boolean,"reason":"portfolio_related|recruiter_related|project_related|skills_related|resume_related|contact_related|blog_related|unclear_but_possible|unrelated_general|unrelated_task|unsafe_request","confidence":number}. Do not answer the question.';

const VALID_REASONS = new Set<ScopeJudgeReason>([
  "portfolio_related",
  "recruiter_related",
  "project_related",
  "skills_related",
  "resume_related",
  "contact_related",
  "blog_related",
  "unclear_but_possible",
  "unrelated_general",
  "unrelated_task",
  "unsafe_request"
]);

const ALLOWED_REASONS = new Set<ScopeJudgeReason>([
  "portfolio_related",
  "recruiter_related",
  "project_related",
  "skills_related",
  "resume_related",
  "contact_related",
  "blog_related",
  "unclear_but_possible"
]);

const PORTFOLIO_NAMES = [
  "abdulelah",
  "عبدالاله",
  "عبد الاله",
  "chatub",
  "althil",
  "الظل",
  "absher",
  "ابشر",
  "qanouni",
  "قانوني",
  "medad",
  "مداد",
  "virtual astronauts"
];

const PORTFOLIO_TERMS = [
  "portfolio",
  "project",
  "projects",
  "skill",
  "skills",
  "achievement",
  "achievements",
  "experience",
  "resume",
  "cv",
  "contact",
  "email",
  "linkedin",
  "github",
  "hire",
  "recruiter",
  "hiring",
  "role",
  "position",
  "match him",
  "ai engineer",
  "ai specialist",
  "cloud",
  "nlp",
  "llm",
  "blog",
  "article",
  "articles",
  "insight",
  "insights",
  "read",
  "context engineering",
  "education ai",
  "ai product thinking",
  "portfolio tour",
  "project explainer",
  "compare projects",
  "difference between",
  "website",
  "مشروع",
  "مشاريع",
  "مهارات",
  "مهارته",
  "خبرته",
  "انجاز",
  "إنجاز",
  "سيرة",
  "تواصل",
  "ايميل",
  "إيميل",
  "نوظفه",
  "وظف",
  "ملخص",
  "الكلاود",
  "السحابة",
  "الذكاء الاصطناعي",
  "جولة",
  "قارن",
  "الفرق",
  "وش مشروع",
  "الموقع"
];

const RECRUITER_TERMS = [
  "why should we hire him",
  "why hire him",
  "hiring fit",
  "compare him",
  "his experience",
  "recruiter mode",
  "match him to a role",
  "match him to this role",
  "ai engineer",
  "ai specialist",
  "junior ai engineer",
  "ai solutions specialist",
  "ai solutions engineer",
  "cloud ai / data role",
  "internship",
  "coop",
  "وش يميزه",
  "ليش نوظفه",
  "وش خبرته",
  "عطيني ملخص عنه",
  "ملخص للريكروتر",
  "اي سيرة احمل",
  "هل يناسب وظيفة ai engineer",
  "هل يناسب وظيفة ai specialist"
];

const UNRELATED_TERMS = [
  "capital of",
  "medical advice",
  "legal advice",
  "financial advice",
  "quantum physics",
  "what is react",
  "explain react",
  "python loops",
  "weather",
  "current news",
  "tell me a joke",
  "give me a recipe",
  "how to cook",
  "عاصمة فرنسا",
  "نصيحة طبية",
  "نصيحة قانونية",
  "نصيحة مالية",
  "فيزياء الكم",
  "اشرح react",
  "اشرح رياكت",
  "عطني نكتة",
  "وصفة طبخ"
];

const UNRELATED_TASK_PATTERNS = [
  /^\s*(?:please\s+)?(?:write|generate|create|make|draft|translate|summarize)\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?(?:poem|essay|story|email|recipe|cover letter)\b/i,
  /(?:^|\s)(?:اكتب|سوي|سو|ترجم|لخص).{0,20}(?:قصيدة|مقال|قصة|ايميل|إيميل|وصفة|خطاب)/i
];

const CLEARLY_UNRELATED_GENERAL_PATTERNS = [
  /^\s*(?:what|who|where|when)\s+(?:is|are|was|were)\b/i,
  /^\s*(?:explain|teach me|tell me about|how (?:do|does|can|to))\b/i,
  /(?:^|\s)(?:وش هو|وش هي|ما هو|ما هي|اشرح|علمني|كيف)\b/i
];

const POSSIBLE_PORTFOLIO_REFERENCE_PATTERN =
  /\b(?:he|him|his)\b|(?:عنه|عنده|معه|خبرته|مهاراته|مشروعه|مقالاته|سيرته|نوظفه|يناسبنا)/i;

const SKILLS_TERMS = [
  "skill",
  "skills",
  "experience",
  "python",
  "cloud",
  "nlp",
  "llm",
  "azure",
  "google cloud",
  "what does he know",
  "does he know",
  "مهارات",
  "مهارته",
  "خبرته",
  "وش يعرف",
  "وش عنده",
  "الكلاود",
  "السحابة",
  "يعرف python"
];

const PROJECT_TERMS = [
  "project",
  "projects",
  "strongest project",
  "best project",
  "chatub",
  "althil",
  "الظل",
  "absher",
  "ابشر",
  "qanouni",
  "قانوني",
  "medad",
  "مداد",
  "virtual astronauts",
  "compare",
  "difference between",
  "مشروع",
  "مشاريع",
  "اقوى مشروع",
  "أقوى مشروع",
  "قارن",
  "الفرق",
  "جولة"
];

const BLOG_TERMS = [
  "blog",
  "article",
  "articles",
  "insight",
  "insights",
  "written",
  "مقال",
  "مقالات",
  "مقالاته",
  "وش كتب"
];

function normalizeMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

function includesAny(message: string, terms: string[]) {
  return terms.some((term) => message.includes(normalizeMessage(term)));
}

function matchesAny(message: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(message));
}

function clampConfidence(confidence: number) {
  return Math.max(0, Math.min(1, confidence));
}

function parseScopeJudgeResult(content: string): ScopeJudgeResult | null {
  const json = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  try {
    const result = JSON.parse(json) as Record<string, unknown>;

    if (
      typeof result.allowed !== "boolean" ||
      typeof result.reason !== "string" ||
      !VALID_REASONS.has(result.reason as ScopeJudgeReason) ||
      typeof result.confidence !== "number" ||
      !Number.isFinite(result.confidence)
    ) {
      return null;
    }

    const reason = result.reason as ScopeJudgeReason;

    if (result.allowed !== ALLOWED_REASONS.has(reason)) {
      return null;
    }

    return { allowed: result.allowed, reason, confidence: clampConfidence(result.confidence) };
  } catch {
    return null;
  }
}

export function judgePortfolioScopeLocally(message: string): ScopeJudgeResult {
  const normalized = normalizeMessage(message);

  if (includesAny(normalized, UNRELATED_TERMS)) {
    return { allowed: false, reason: "unrelated_general", confidence: 0.95 };
  }

  if (matchesAny(normalized, UNRELATED_TASK_PATTERNS)) {
    return { allowed: false, reason: "unrelated_task", confidence: 0.95 };
  }

  if (includesAny(normalized, RECRUITER_TERMS)) {
    return { allowed: true, reason: "recruiter_related", confidence: 0.9 };
  }

  if (
    includesAny(normalized, ["contact", "email", "linkedin", "github", "تواصل", "ايميل", "إيميل"])
  ) {
    return { allowed: true, reason: "contact_related", confidence: 0.9 };
  }

  if (includesAny(normalized, ["resume", "cv", "سيرة"])) {
    return { allowed: true, reason: "resume_related", confidence: 0.9 };
  }

  if (includesAny(normalized, BLOG_TERMS)) {
    return { allowed: true, reason: "blog_related", confidence: 0.9 };
  }

  if (includesAny(normalized, PROJECT_TERMS)) {
    return { allowed: true, reason: "project_related", confidence: 0.9 };
  }

  if (includesAny(normalized, SKILLS_TERMS)) {
    return { allowed: true, reason: "skills_related", confidence: 0.9 };
  }

  if (
    includesAny(normalized, PORTFOLIO_NAMES) ||
    includesAny(normalized, PORTFOLIO_TERMS)
  ) {
    return { allowed: true, reason: "portfolio_related", confidence: 0.85 };
  }

  if (POSSIBLE_PORTFOLIO_REFERENCE_PATTERN.test(normalized)) {
    return { allowed: true, reason: "unclear_but_possible", confidence: 0.65 };
  }

  if (matchesAny(normalized, CLEARLY_UNRELATED_GENERAL_PATTERNS)) {
    return { allowed: false, reason: "unrelated_general", confidence: 0.85 };
  }

  return { allowed: true, reason: "unclear_but_possible", confidence: 0.55 };
}

export async function judgePortfolioScope(
  message: string
): Promise<ScopeJudgeDecision> {
  if (!hasDeepSeekApiKey()) {
    return {
      ...judgePortfolioScopeLocally(message),
      attempted: false,
      failed: false
    };
  }

  try {
    const content = await requestDeepSeekCompletion({
      messages: [
        {
          role: "system",
          content: SCOPE_JUDGE_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      maxTokens: 120,
      temperature: 0
    });
    const result = parseScopeJudgeResult(content);

    return {
      ...(result ?? judgePortfolioScopeLocally(message)),
      attempted: true,
      failed: !result
    };
  } catch {
    return {
      ...judgePortfolioScopeLocally(message),
      attempted: true,
      failed: true
    };
  }
}
