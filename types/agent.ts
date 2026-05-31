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
  | "missing_key"
  | "invalid_response"
  | "request_failed"
  | "model_error"
  | "evaluation_failed";

export type AgentQuality = {
  score: number;
  passed: boolean;
};

export type AgentApiResponse = {
  answer: string;
  actions: AgentAction[];
  mode: AgentMode;
  quality: AgentQuality;
  debugCode?: AgentDebugCode;
};

export type AgentChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  actions?: AgentAction[];
  mode?: AgentMode;
  isError?: boolean;
};
