export type AgentActionType = "internal" | "external" | "download";

export type AgentAction = {
  label: string;
  href: string;
  type: AgentActionType;
};

export type AgentMode = "deepseek" | "fallback";

export type AgentApiResponse = {
  answer: string;
  actions: AgentAction[];
  mode: AgentMode;
};

export type AgentChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  actions?: AgentAction[];
  mode?: AgentMode;
  isError?: boolean;
};
