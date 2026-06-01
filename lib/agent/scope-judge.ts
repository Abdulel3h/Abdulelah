import "server-only";
import {
  hasDeepSeekApiKey,
  requestDeepSeekCompletion
} from "@/lib/agent/deepseek";

export type ScopeJudgeReason =
  | "portfolio_related"
  | "recruiter_related"
  | "contact_related"
  | "resume_related"
  | "project_related"
  | "unrelated"
  | "unclear";

export type ScopeJudgeResult = {
  allowed: boolean;
  reason: ScopeJudgeReason;
  confidence: number;
};

export type ScopeJudgeDecision = ScopeJudgeResult & {
  attempted: boolean;
};

const SCOPE_JUDGE_PROMPT =
  'You are a strict scope classifier for Agent Abdulelah. Decide if the user\'s question is about Abdulelah Alkhathami\'s public portfolio, projects, project explanations, project comparisons, portfolio tour, blog articles, AI insights, skills, achievements, resume, contact information, hiring fit, recruiter mode, role matching, CV selection, or website navigation. Allow related Arabic, English, and Saudi/Najdi phrasing. If unclear but reasonably portfolio-related, allow it. Return JSON only: {"allowed":boolean,"reason":"portfolio_related|recruiter_related|contact_related|resume_related|project_related|unrelated|unclear","confidence":number}. Do not answer the question.';

const VALID_REASONS = new Set<ScopeJudgeReason>([
  "portfolio_related",
  "recruiter_related",
  "contact_related",
  "resume_related",
  "project_related",
  "unrelated",
  "unclear"
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
  "explain",
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
  "اشرح",
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
  "quantum physics",
  "what is react",
  "explain react",
  "weather",
  "current news",
  "عاصمة فرنسا",
  "نصيحة طبية",
  "نصيحة قانونية",
  "فيزياء الكم",
  "اشرح react",
  "اشرح رياكت"
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

    return {
      allowed: result.allowed,
      reason: result.reason as ScopeJudgeReason,
      confidence: clampConfidence(result.confidence)
    };
  } catch {
    return null;
  }
}

export function judgePortfolioScopeLocally(message: string): ScopeJudgeResult {
  const normalized = normalizeMessage(message);

  if (includesAny(normalized, UNRELATED_TERMS)) {
    return { allowed: false, reason: "unrelated", confidence: 0.95 };
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

  if (
    includesAny(normalized, PORTFOLIO_NAMES) ||
    includesAny(normalized, PORTFOLIO_TERMS)
  ) {
    return {
      allowed: true,
      reason: includesAny(normalized, ["project", "projects", "مشروع", "مشاريع", "chatub", "althil", "الظل", "absher", "ابشر", "qanouni", "قانوني", "medad", "مداد", "virtual astronauts", "compare", "قارن", "الفرق", "اشرح", "جولة"])
        ? "project_related"
        : "portfolio_related",
      confidence: 0.85
    };
  }

  return { allowed: false, reason: "unclear", confidence: 0.55 };
}

export async function judgePortfolioScope(
  message: string
): Promise<ScopeJudgeDecision> {
  if (!hasDeepSeekApiKey()) {
    return {
      ...judgePortfolioScopeLocally(message),
      attempted: false
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
      attempted: true
    };
  } catch {
    return {
      ...judgePortfolioScopeLocally(message),
      attempted: true
    };
  }
}
