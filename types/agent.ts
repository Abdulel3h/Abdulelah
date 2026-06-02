export type AgentActionType =
  | "internal"
  | "external"
  | "download"
  | "contact"
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
};

export type AgentApiResponse = AgentRuntimeProof & {
  answer: string;
  actions: AgentAction[];
  quality: AgentQuality;
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
