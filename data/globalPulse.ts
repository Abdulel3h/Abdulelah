export type GlobalPulseItem = {
  title: string;
  summary: string;
  category: string;
  sourceLabel?: string;
  sourceUrl?: string;
  updatedAt?: string;
};

export const globalPulseItems: GlobalPulseItem[] = [
  {
    title: "AI Agents are becoming product interfaces",
    summary:
      "The important shift is not a new chat window. It is the move toward AI experiences that can retrieve context, use approved tools, and guide users through real workflows.",
    category: "AI Agents"
  },
  {
    title: "Local AI and privacy are becoming strategic priorities",
    summary:
      "Organizations are paying closer attention to where data travels, which knowledge sources an AI system uses, and how much control they retain over sensitive workflows.",
    category: "Privacy-first AI"
  },
  {
    title: "AI evaluation is becoming as important as AI generation",
    summary:
      "Teams are looking beyond impressive outputs toward repeatable ways to measure reliability, usefulness, safety, and failure patterns before AI reaches users.",
    category: "AI Product Thinking"
  }
];
