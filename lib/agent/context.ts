import { achievements } from "@/data/achievements";
import { blogPosts } from "@/data/blog";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { journeyTimeline } from "@/data/timeline";

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
    .map((post) => `- ${post.title} (${post.category}): ${post.excerpt}`)
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
    "PORTFOLIO INSIGHTS",
    blogContext
  ].join("\n");
}
