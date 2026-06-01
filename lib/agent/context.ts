import { achievements } from "@/data/achievements";
import { blogPosts } from "@/data/blog";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { journeyTimeline } from "@/data/timeline";
import { getProjectContextGuide } from "@/lib/agent/project-guide";
import { recruiterRoleProfiles } from "@/lib/agent/recruiter";

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
          `  Impact: ${project.impact}`
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
          `  Article URL: /blog/${post.slug}`,
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
    `Email: ${siteConfig.email}`,
    `GitHub: ${siteConfig.social.github}`,
    `LinkedIn: ${siteConfig.social.linkedin}`,
    "Positioning: Junior AI Engineer, AI Solutions Specialist, applied AI builder, project leader, and hackathon-tested AI talent.",
    "",
    "RESUMES",
    `- AI Engineer CV: ${siteConfig.resumes.engineer}. Best for technical AI development, NLP, LLMs, cloud deployment, and intelligent systems engineering roles.`,
    `- AI Specialist CV: ${siteConfig.resumes.specialist}. Best for AI solutions, business use cases, adoption, analysis, dashboards, and cross-functional implementation roles.`,
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
