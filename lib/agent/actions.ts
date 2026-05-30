import { siteConfig } from "@/data/site";
import type { AgentAction } from "@/types/agent";

const actions = {
  chatub: {
    label: "View ChatUB",
    href: "/projects/chatub",
    type: "internal"
  },
  althil: {
    label: "View Althil",
    href: "/projects/althil",
    type: "internal"
  },
  absher: {
    label: "View Absher Insight AI",
    href: "/projects/absher-insight-ai",
    type: "internal"
  },
  projects: {
    label: "View Projects",
    href: "/projects",
    type: "internal"
  },
  skills: {
    label: "View Skills",
    href: "/skills",
    type: "internal"
  },
  resume: {
    label: "View Resume",
    href: "/resume",
    type: "internal"
  },
  contact: {
    label: "Contact Abdulelah",
    href: "/contact",
    type: "internal"
  },
  navigatorContact: {
    label: "Send Abdulelah a message",
    href: "#agent-contact",
    type: "contact"
  },
  engineerResume: {
    label: "Download AI Engineer CV",
    href: siteConfig.resumes.engineer,
    type: "download"
  },
  specialistResume: {
    label: "Download AI Specialist CV",
    href: siteConfig.resumes.specialist,
    type: "download"
  },
  github: {
    label: "Open GitHub",
    href: siteConfig.social.github,
    type: "external"
  },
  linkedin: {
    label: "Open LinkedIn",
    href: siteConfig.social.linkedin,
    type: "external"
  }
} satisfies Record<string, AgentAction>;

function includesAny(message: string, terms: string[]) {
  return terms.some((term) => message.includes(term));
}

export function getAgentActions(message: string): AgentAction[] {
  const normalized = message.toLowerCase();
  const results: AgentAction[] = [];

  function add(...nextActions: AgentAction[]) {
    for (const action of nextActions) {
      if (!results.some((result) => result.href === action.href)) {
        results.push(action);
      }
    }
  }

  if (includesAny(normalized, ["chatub", "academic", "university"])) {
    add(actions.chatub);
  }

  if (
    includesAny(normalized, [
      "althil",
      "thermal",
      "shade",
      "google cloud",
      "sustainability",
      "cloud"
    ])
  ) {
    add(actions.althil);
  }

  if (includesAny(normalized, ["absher", "security", "ueba", "risk"])) {
    add(actions.absher);
  }

  if (includesAny(normalized, ["nlp", "llm", "agent", "skill", "cloud"])) {
    add(actions.skills);
  }

  if (
    includesAny(normalized, ["cv", "resume"]) ||
    (normalized.includes("compare") &&
      includesAny(normalized, ["ai engineer", "ai specialist", "profile"]))
  ) {
    add(actions.engineerResume, actions.specialistResume, actions.resume);
  }

  if (includesAny(normalized, ["github", "code", "repository"])) {
    add(actions.github);
  }

  if (includesAny(normalized, ["linkedin"])) {
    add(actions.linkedin);
  }

  if (includesAny(normalized, ["contact", "email", "reach", "connect"])) {
    add(actions.navigatorContact, actions.contact, actions.linkedin);
  }

  if (
    includesAny(normalized, [
      "hire",
      "recruiter",
      "summary",
      "profile",
      "projects",
      "strongest",
      "best",
      "different"
    ])
  ) {
    add(actions.projects, actions.resume, actions.contact);
  }

  if (results.length === 0) {
    add(actions.projects, actions.resume, actions.contact);
  }

  return results.slice(0, 4);
}

export function getPortfolioRedirectActions(): AgentAction[] {
  return [actions.projects, actions.resume, actions.navigatorContact];
}
