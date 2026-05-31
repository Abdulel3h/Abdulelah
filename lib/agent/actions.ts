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
  blog: {
    label: "Explore AI Insights",
    href: "/blog",
    type: "internal"
  },
  contextArticle: {
    label: "Read Context Engineering Article",
    href: "/blog/why-context-matters-more-than-prompts-in-ai-agents",
    type: "internal"
  },
  studentArticle: {
    label: "Read Student AI Guide",
    href: "/blog/what-every-student-should-know-about-ai-in-2026",
    type: "internal"
  },
  chatubArticle: {
    label: "Read Local AI Article",
    href: "/blog/local-ai-systems-and-the-future-of-university-services",
    type: "internal"
  },
  althilArticle: {
    label: "Read Urban Planning Article",
    href: "/blog/how-ai-can-support-smarter-urban-planning",
    type: "internal"
  },
  securityArticle: {
    label: "Read Predictive Security Article",
    href: "/blog/from-reactive-security-to-predictive-ai-security",
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
  const wantsBlog = includesAny(normalized, [
    "article",
    "articles",
    "blog",
    "insight",
    "read",
    "context engineering",
    "context matters",
    "prompts"
  ]);

  function add(...nextActions: AgentAction[]) {
    for (const action of nextActions) {
      if (!results.some((result) => result.href === action.href)) {
        results.push(action);
      }
    }
  }

  if (
    includesAny(normalized, ["context engineering", "context matters", "prompts"]) ||
    (wantsBlog && includesAny(normalized, ["ai agent", "agents"]))
  ) {
    add(actions.contextArticle, actions.blog);
  }

  if (wantsBlog && includesAny(normalized, ["student", "students"])) {
    add(actions.studentArticle, actions.blog);
  }

  if (wantsBlog && includesAny(normalized, ["chatub", "academic", "university"])) {
    add(actions.chatubArticle, actions.blog);
  }

  if (
    wantsBlog &&
    includesAny(normalized, ["althil", "thermal", "shade", "sustainability", "urban"])
  ) {
    add(actions.althilArticle, actions.blog);
  }

  if (wantsBlog && includesAny(normalized, ["absher", "security", "ueba", "risk"])) {
    add(actions.securityArticle, actions.blog);
  }

  if (
    wantsBlog ||
    includesAny(normalized, ["what should i read first", "where should i start"])
  ) {
    add(actions.blog);
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
