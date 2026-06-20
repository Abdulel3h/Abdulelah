export type AgentActionType =
  | "internal"
  | "external"
  | "download"
  | "contact"
  | "email"
  | "prompt";

type AgentLinkAction = {
  label: string;
  href: string;
  type: Exclude<AgentActionType, "prompt">;
};

type AgentPromptAction = {
  label: string;
  href: string;
  prompt: string;
  type: "prompt";
};

export type AgentAction = AgentLinkAction | AgentPromptAction;

export type AgentMode = "deepseek" | "fallback" | "blocked";

export type AgentFinishReason =
  | "stop"
  | "length"
  | "content_filter"
  | "unknown";

export type AgentHistoryMessage = {
  role: "assistant" | "user";
  content: string;
};

export type AgentProjectName =
  | "ChatUB"
  | "Althil"
  | "Absher Insight AI"
  | "Qanouni"
  | "Medad"
  | "Virtual Astronauts";

export type AgentIntent =
  | "project_explanation"
  | "technical_details"
  | "recruiter_fit"
  | "cv_recommendation"
  | "contact"
  | "portfolio_tour"
  | "comparison";

export type AgentSessionContext = {
  lastProject: AgentProjectName | null;
  lastIntent: AgentIntent | null;
  lastRoleInterest: string | null;
  lastLanguage: "ar" | "en" | null;
  lastRecommendedCV: "ai-engineer" | "ai-specialist" | "both" | null;
};

export type AgentDebugCode =
  | "sent_to_deepseek"
  | "blocked_prompt_injection"
  | "blocked_secret_request"
  | "blocked_unrelated_task"
  | "blocked_high_risk_advice"
  | "scope_rejected"
  | "invalid_request"
  | "rate_limited"
  | "missing_key"
  | "request_failed"
  | "model_error"
  | "provider_failed"
  | "output_truncated"
  | "evaluation_failed";

export type AgentQuality = {
  score: number;
  passed: boolean;
};

export type AgentRuntimeProof = {
  mode: AgentMode;
  debugCode: AgentDebugCode;
  model: string;
  providerAttempted: boolean;
  providerSucceeded: boolean;
  scopeJudgeAttempted: boolean;
  scopeJudgeAllowed: boolean;
  scopeJudgeReason: string;
  durationMs: number;
  finishReason?: AgentFinishReason;
};

export type AgentApiResponse = AgentRuntimeProof & {
  answer: string;
  actions: AgentAction[];
  quality: AgentQuality;
  sessionContext: AgentSessionContext;
};

export type AgentChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  actions?: AgentAction[];
  mode?: AgentMode;
  runtime?: AgentRuntimeProof;
  isError?: boolean;
};
