export type AgentActionType = "internal" | "external" | "download" | "contact";

export type AgentAction = {
  label: string;
  href: string;
  type: AgentActionType;
};

export type AgentMode = "deepseek" | "fallback";

export type AgentQuality = {
  score: number;
  passed: boolean;
};

export type AgentApiResponse = {
  answer: string;
  actions: AgentAction[];
  mode: AgentMode;
  quality: AgentQuality;
};

export type AgentChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  actions?: AgentAction[];
  mode?: AgentMode;
  isError?: boolean;
};
