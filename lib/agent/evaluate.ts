import type { AgentAction } from "@/types/agent";

export const MIN_AGENT_QUALITY_SCORE = 85;

export type AgentEvaluation = {
  passed: boolean;
  score: number;
  reasons: string[];
};

type EvaluateAgentAnswerOptions = {
  actions: AgentAction[];
  answer: string;
  responseKind: "portfolio" | "refusal";
};

const PORTFOLIO_ANCHORS =
  /\b(abdulelah|portfolio|chatub|althil|absher|qanouni|medad|virtual astronauts?|resume|cv|github|linkedin|university of bisha|ai engineer|ai solutions specialist|projects?|skills?|contact)\b|عبد\s?ال[اإ]له|مشاريع?|مهارات?|السيرة|التواصل/i;

const REFUSAL_ANCHORS =
  /\b(only help|can only help|can't reveal|cannot reveal|public portfolio|portfolio context)\b|لا أستطيع|لا يمكنني|فقط/i;

const SECRET_LEAK_PATTERNS = [
  /\b(DEEPSEEK_API_KEY|RESEND_API_KEY|CONTACT_TO_EMAIL|CONTACT_FROM_EMAIL|process\.env)\b/i,
  /\bBearer\s+[A-Za-z0-9._-]{8,}\b/i,
  /\b(sk|key|token|secret)[-_][A-Za-z0-9_-]{12,}\b/i,
  /\b(system prompt|hidden instructions?|developer prompt)\s*:/i,
  /\bat\s+[\w./\\-]+\.(?:ts|tsx|js|mjs):\d+/i,
  /(?:مفتاح|مفاتيح).{0,10}(?:api|البيئة)|(?:تعليمات النظام|الأسرار|متغيرات البيئة)/i
];

const UNRELATED_ADVICE_PATTERNS = [
  /```/,
  /\bnpm\s+(?:install|run)\b/i,
  /\b(import|export|const|let|function|class)\s+[\w{]/i,
  /\bconsult (?:a|your) (?:doctor|lawyer|financial advisor)\b/i,
  /(?:اكتب|سوي|سو).{0,20}(?:كود|تطبيق)|(?:استشر|راجع).{0,15}(?:طبيب|محامي)/i
];

const EXAGGERATED_CLAIM_PATTERNS = [
  /\b(senior engineer|expert|founder|chief|ceo)\b/i,
  /\b(worked|works|employed)\s+(?:at|for)\b/i,
  /\b(client|customer)s?\b/i,
  /\b\d+(?:\.\d+)?%\b/
];

function deduct(
  state: AgentEvaluation,
  amount: number,
  reason: string,
  condition: boolean
) {
  if (!condition) {
    return;
  }

  state.score -= amount;
  state.reasons.push(reason);
}

export function evaluateAgentAnswer({
  actions,
  answer,
  responseKind
}: EvaluateAgentAnswerOptions): AgentEvaluation {
  const evaluation: AgentEvaluation = {
    passed: true,
    score: 100,
    reasons: []
  };
  const trimmedAnswer = answer.trim();

  deduct(evaluation, 100, "missing-answer", !trimmedAnswer);
  deduct(evaluation, 20, "answer-too-long", trimmedAnswer.length > 1_800);
  deduct(
    evaluation,
    100,
    "protected-information-risk",
    SECRET_LEAK_PATTERNS.some((pattern) => pattern.test(trimmedAnswer))
  );
  deduct(
    evaluation,
    55,
    "unrelated-advice-risk",
    UNRELATED_ADVICE_PATTERNS.some((pattern) => pattern.test(trimmedAnswer))
  );
  deduct(
    evaluation,
    40,
    "unsupported-claim-risk",
    EXAGGERATED_CLAIM_PATTERNS.some((pattern) => pattern.test(trimmedAnswer))
  );
  deduct(
    evaluation,
    35,
    "missing-portfolio-grounding",
    responseKind === "portfolio" && !PORTFOLIO_ANCHORS.test(trimmedAnswer)
  );
  deduct(
    evaluation,
    80,
    "missing-scope-refusal",
    responseKind === "refusal" && !REFUSAL_ANCHORS.test(trimmedAnswer)
  );
  deduct(evaluation, 10, "missing-actions", actions.length === 0);

  evaluation.score = Math.max(0, evaluation.score);
  evaluation.passed = evaluation.score >= MIN_AGENT_QUALITY_SCORE;

  return evaluation;
}
