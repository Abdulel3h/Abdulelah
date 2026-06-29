import { achievements } from "@/data/achievements";
import { blogPosts } from "@/data/blog";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { journeyTimeline } from "@/data/timeline";
import {
  getMentionedProjectProfiles,
  getProjectContextGuide,
  isPortfolioTourRequest,
  isProjectComparisonRequest,
  isProjectExplainerRequest
} from "@/lib/agent/project-guide";
import {
  getRecruiterRoleProfile,
  isCvRecommendationRequest,
  isGeneralHiringFitRequest,
  recruiterRoleProfiles
} from "@/lib/agent/recruiter";
import { containsArabic } from "@/lib/text-direction";
import type {
  AgentHistoryMessage,
  AgentIntent,
  AgentProjectName,
  AgentSessionContext
} from "@/types/agent";

export const MAX_AGENT_HISTORY_TURNS = 8;

const MAX_HISTORY_MESSAGE_LENGTH = 600;
const MAX_ROLE_INTEREST_LENGTH = 120;
const AGENT_PROJECT_NAMES = [
  "ChatUB",
  "Althil",
  "Absher Insight AI",
  "Qanouni",
  "Medad",
  "Virtual Astronauts"
] as const satisfies readonly AgentProjectName[];
const AGENT_INTENTS = [
  "project_explanation",
  "technical_details",
  "recruiter_fit",
  "cv_recommendation",
  "contact",
  "portfolio_tour",
  "comparison"
] as const satisfies readonly AgentIntent[];
const AGENT_CV_RECOMMENDATIONS = [
  "ai-engineer",
  "ai-specialist",
  "both"
] as const satisfies readonly NonNullable<AgentSessionContext["lastRecommendedCV"]>[];

export const EMPTY_AGENT_SESSION_CONTEXT: AgentSessionContext = {
  lastProject: null,
  lastIntent: null,
  lastRoleInterest: null,
  lastLanguage: null,
  lastRecommendedCV: null
};

export type AgentConversationMemory = {
  history: AgentHistoryMessage[];
  sessionContext: AgentSessionContext;
};

export type AgentProjectFollowUpKind =
  | "technologies"
  | "role"
  | "impact"
  | "technical"
  | "recruiter-summary";

function normalizeConversationText(message: string) {
  return message
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

function cleanMemoryText(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .trim()
        .slice(0, maxLength)
    : "";
}

function includesAny(message: string, terms: string[]) {
  return terms.some((term) =>
    message.includes(normalizeConversationText(term))
  );
}

function isAllowedValue<const T extends string>(
  value: unknown,
  allowedValues: readonly T[]
): value is T {
  return typeof value === "string" && allowedValues.includes(value as T);
}

function getRecommendedCvFromAnswer(
  answer: string
): AgentSessionContext["lastRecommendedCV"] {
  const normalized = normalizeConversationText(answer);
  const hasEngineer = normalized.includes("ai engineer cv");
  const hasSpecialist = normalized.includes("ai specialist cv");

  if (hasEngineer && hasSpecialist) {
    return "both";
  }

  if (hasEngineer) {
    return "ai-engineer";
  }

  if (hasSpecialist) {
    return "ai-specialist";
  }

  return null;
}

function getMessageIntent(message: string): AgentIntent | null {
  const normalized = normalizeConversationText(message);

  if (isProjectComparisonRequest(message)) {
    return "comparison";
  }

  if (isPortfolioTourRequest(message)) {
    return "portfolio_tour";
  }

  if (isCvRecommendationRequest(message)) {
    return "cv_recommendation";
  }

  if (
    includesAny(normalized, [
      "contact",
      "email",
      "reach",
      "connect",
      "تواصل",
      "اتواصل",
      "ايميل"
    ])
  ) {
    return "contact";
  }

  if (
    getRecruiterRoleProfile(message) ||
    isGeneralHiringFitRequest(message)
  ) {
    return "recruiter_fit";
  }

  if (getProjectFollowUpKind(message)) {
    return "technical_details";
  }

  if (
    getMentionedProjectProfiles(message).length > 0 ||
    isProjectExplainerRequest(message)
  ) {
    return "project_explanation";
  }

  return null;
}

export function sanitizeAgentHistory(value: unknown): AgentHistoryMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .flatMap((entry) => {
      if (
        typeof entry !== "object" ||
        entry === null ||
        !("role" in entry) ||
        !("content" in entry) ||
        (entry.role !== "user" && entry.role !== "assistant")
      ) {
        return [];
      }

      const content = cleanMemoryText(entry.content, MAX_HISTORY_MESSAGE_LENGTH);

      return content ? [{ role: entry.role, content }] : [];
    })
    .slice(-MAX_AGENT_HISTORY_TURNS);
}

export function sanitizeAgentSessionContext(
  value: unknown
): AgentSessionContext {
  if (typeof value !== "object" || value === null) {
    return { ...EMPTY_AGENT_SESSION_CONTEXT };
  }

  const lastRoleInterest =
    "lastRoleInterest" in value
      ? cleanMemoryText(value.lastRoleInterest, MAX_ROLE_INTEREST_LENGTH)
      : "";

  return {
    lastProject:
      "lastProject" in value &&
      isAllowedValue(value.lastProject, AGENT_PROJECT_NAMES)
        ? value.lastProject
        : null,
    lastIntent:
      "lastIntent" in value && isAllowedValue(value.lastIntent, AGENT_INTENTS)
        ? value.lastIntent
        : null,
    lastRoleInterest: lastRoleInterest || null,
    lastLanguage:
      "lastLanguage" in value &&
      (value.lastLanguage === "ar" || value.lastLanguage === "en")
        ? value.lastLanguage
        : null,
    lastRecommendedCV:
      "lastRecommendedCV" in value &&
      isAllowedValue(value.lastRecommendedCV, AGENT_CV_RECOMMENDATIONS)
        ? value.lastRecommendedCV
        : null
  };
}

export function getProjectFollowUpKind(
  message: string
): AgentProjectFollowUpKind | null {
  const normalized = normalizeConversationText(message);

  if (
    includesAny(normalized, [
      "what technologies",
      "which technologies",
      "technologies",
      "tech stack",
      "وش التقنيات",
      "وش تقنياته",
      "التقنيات"
    ])
  ) {
    return "technologies";
  }

  if (
    includesAny(normalized, [
      "what was his role",
      "what was your role",
      "my role",
      "his role",
      "وش دوري فيه",
      "وش دوره فيه",
      "وش كان دوره",
      "دوري فيه"
    ])
  ) {
    return "role";
  }

  if (
    includesAny(normalized, [
      "why does it matter",
      "why is it important",
      "why important",
      "what is the benefit",
      "benefit",
      "وش فائدته",
      "ليش مهم",
      "اهميته"
    ])
  ) {
    return "impact";
  }

  if (
    includesAny(normalized, [
      "explain it technically",
      "technical explanation",
      "technically",
      "اشرحها تقنيا",
      "اشرحه تقنيا",
      "تقنيا"
    ])
  ) {
    return "technical";
  }

  if (
    includesAny(normalized, [
      "give me a recruiter summary",
      "recruiter summary",
      "summary for recruiter",
      "عطيني ملخص للريكروتر",
      "ملخص للريكروتر"
    ])
  ) {
    return "recruiter-summary";
  }

  return null;
}

export function isContinueAnswerRequest(message: string) {
  const normalized = normalizeConversationText(message)
    .trim()
    .replace(/[؟?!.,،]+$/, "");

  return [
    "continue",
    "continue answer",
    "continue the answer",
    "كمل",
    "كمل الاجابة",
    "تابع",
    "تابع الاجابة"
  ].includes(normalized);
}

export function resolveAgentFollowUp(
  message: string,
  sessionContext: AgentSessionContext
) {
  const mentionedProjects = getMentionedProjectProfiles(message);

  if (isContinueAnswerRequest(message)) {
    const topic = sessionContext.lastProject
      ? `Continue the previous portfolio answer about ${sessionContext.lastProject}.`
      : sessionContext.lastRoleInterest
        ? `Continue the previous portfolio answer for the ${sessionContext.lastRoleInterest} hiring role.`
        : "Continue the previous portfolio answer using the recent history.";

    return `${message}\n${topic} Add useful omitted details without repeating the previous response.`;
  }

  if (
    sessionContext.lastProject &&
    isProjectComparisonRequest(message) &&
    mentionedProjects.length === 1 &&
    mentionedProjects[0].shortName !== sessionContext.lastProject
  ) {
    return `${message}\nCompare ${sessionContext.lastProject} and ${mentionedProjects[0].shortName}.`;
  }

  if (
    sessionContext.lastProject &&
    getProjectFollowUpKind(message) &&
    mentionedProjects.length === 0
  ) {
    return `${message}\nReferenced project: ${sessionContext.lastProject}.`;
  }

  if (
    sessionContext.lastRoleInterest &&
    isCvRecommendationRequest(message)
  ) {
    return `${message}\nHiring role context: ${sessionContext.lastRoleInterest}.`;
  }

  return message;
}

export function updateAgentSessionContext({
  answer,
  message,
  sessionContext
}: {
  answer: string;
  message: string;
  sessionContext: AgentSessionContext;
}): AgentSessionContext {
  const resolvedMessage = resolveAgentFollowUp(message, sessionContext);
  const mentionedProjects = getMentionedProjectProfiles(message);
  const mentionedProject = mentionedProjects[0]?.shortName;
  const recruiterRole = getRecruiterRoleProfile(resolvedMessage);
  const recommendedCv = getRecommendedCvFromAnswer(answer);

  return {
    lastProject:
      isAllowedValue(mentionedProject, AGENT_PROJECT_NAMES)
        ? mentionedProject
        : sessionContext.lastProject,
    lastIntent: getMessageIntent(resolvedMessage) ?? sessionContext.lastIntent,
    lastRoleInterest:
      recruiterRole?.label ?? sessionContext.lastRoleInterest,
    lastLanguage: containsArabic(message) ? "ar" : "en",
    lastRecommendedCV:
      recommendedCv ?? sessionContext.lastRecommendedCV
  };
}

export function buildConversationMemoryContext({
  history,
  sessionContext
}: AgentConversationMemory) {
  return JSON.stringify(
    {
      recentHistory: sanitizeAgentHistory(history),
      sessionContext: sanitizeAgentSessionContext(sessionContext)
    },
    null,
    2
  );
}

function list(values: string[]) {
  return values.join(", ");
}

export function buildPortfolioContext() {
  const projectContext = projects
    .map(
      (project) =>
        [
          `- ${project.title}`,
          `  Category: ${project.category}`,
          `  Summary: ${project.shortDescription}`,
          `  Role: ${project.role}`,
          `  Technologies: ${list(project.technologies)}`,
          `  Approach: ${list(project.technicalApproach)}`,
          project.context ? `  Context: ${project.context}` : null,
          `  Impact: ${project.impact}`,
          project.links?.github
            ? `  Source (verified public GitHub repo): ${project.links.github}`
            : null
        ]
          .filter(Boolean)
          .join("\n")
    )
    .join("\n");

  const achievementContext = achievements
    .map(
      (achievement) =>
        `- ${achievement.title} (${achievement.organization}, ${achievement.year}): ${achievement.description}`
    )
    .join("\n");

  const skillContext = skillGroups
    .map(
      (group) =>
        `- ${group.title}: ${group.skills
          .map((skill) => `${skill.name} (${skill.level})`)
          .join(", ")}`
    )
    .join("\n");

  const timelineContext = journeyTimeline
    .map((event) => `- ${event.year}: ${event.title}. ${event.description}`)
    .join("\n");

  const blogContext = blogPosts
    .map(
      (post) =>
        [
          `- ${post.title}`,
          `  Category: ${post.category}`,
          `  Audience: ${list(post.audience)}`,
          `  Tags: ${list(post.tags)}`,
          `  Summary: ${post.excerpt}`,
          `  Key takeaway: ${post.content.takeaway}`
        ].join("\n")
    )
    .join("\n");

  const recruiterContext = recruiterRoleProfiles
    .map(
      (profile) =>
        [
          `- ${profile.label}`,
          `  Fit summary: ${profile.fitSummary}`,
          `  Best matching projects: ${list(profile.projects)}`,
          `  Matching skills: ${list(profile.skills)}`,
          `  Recommended CV: ${profile.recommendedCv}`,
          `  Suggested next action: ${profile.nextAction}`
        ].join("\n")
    )
    .join("\n");

  return [
    "PROFILE",
    `Name: ${siteConfig.name}`,
    `Role: ${siteConfig.role}`,
    "Education: Information Systems graduate from University of Bisha",
    `Location: ${siteConfig.location}`,
    "GitHub profile: available through an action button.",
    "LinkedIn profile: available through an action button.",
    "Positioning: Junior AI Engineer, AI Solutions Specialist, applied AI builder, project leader, and hackathon-tested AI talent.",
    "",
    "CONTACT ROUTING",
    "Share the email address that matches the visitor's intent. You may write these email addresses directly in your answer text.",
    `- Recruitment, job openings, roles, and hiring: ${siteConfig.contactEmails.recruitment}`,
    `- Business, consulting, freelance, and partnership inquiries: ${siteConfig.contactEmails.business}`,
    `- General inquiries and other questions: ${siteConfig.contactEmails.general}`,
    `- Primary direct email when intent is unclear: ${siteConfig.contactEmails.primary}`,
    "Abdulelah has no public phone number; never invent or share one. Always offer the in-chat contact form and the contact page as alternatives to email.",
    "",
    "RESUMES",
    "- AI Engineer CV: available through an action button. Best for technical AI development, NLP, LLMs, cloud deployment, and intelligent systems engineering roles.",
    "- AI Specialist CV: available through an action button. Best for AI solutions, business use cases, adoption, analysis, dashboards, and cross-functional implementation roles.",
    "",
    "RECRUITER GUIDE",
    "Use this guide for recruiter mode, role-fit questions, and CV recommendations. Keep recruiter answers concise and structured with a fit summary, matching projects, matching skills, recommended CV, and next action.",
    recruiterContext,
    "",
    "PROJECT EXPLAINER GUIDE",
    "For individual project questions, explain the problem, solution, Abdulelah's role, technologies, why it matters, best related job fit, and recommended CV. Support simple explanations, technical explanations, recruiter summaries, a 60-second portfolio tour, and structured comparisons.",
    getProjectContextGuide(),
    "",
    "PROJECTS",
    projectContext,
    "",
    "ACHIEVEMENTS",
    achievementContext,
    "",
    "SKILLS",
    skillContext,
    "",
    "TIMELINE",
    timelineContext,
    "",
    "ABDULELAH AI INSIGHTS BLOG",
    "Positioning: A practical public AI knowledge hub covering AI agents, LLMs, cloud AI, privacy-first systems, applied AI, and the impact of AI across education, business, government, and daily work.",
    blogContext
  ].join("\n");
}
