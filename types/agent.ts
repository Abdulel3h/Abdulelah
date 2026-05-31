export type AgentActionType = "internal" | "external" | "download" | "contact";

export type AgentAction = {
  label: string;
  href: string;
  type: AgentActionType;
};

export type AgentMode = "deepseek" | "fallback" | "blocked";

export type AgentDebugCode =
  | "sent_to_deepseek"
  | "blocked_out_of_scope"
  | "blocked_prompt_injection"
  | "blocked_sensitive_request"
  | "invalid_request"
  | "rate_limited"
  | "missing_key"
  | "request_failed"
  | "model_error"
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
