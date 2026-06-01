import { getProjectBySlug, projects, type Project } from "@/data/projects";

export type ProjectExplanationDepth = "simple" | "technical" | "recruiter";

export type ProjectGuideProfile = {
  slug: string;
  shortName: string;
  aliases: string[];
  bestJobFit: string;
  recommendedCv: "engineer" | "specialist";
};

const projectGuideProfiles: ProjectGuideProfile[] = [
  {
    slug: "chatub",
    shortName: "ChatUB",
    aliases: ["chatub", "مشروع chatub"],
    bestJobFit: "Junior AI Engineer, NLP / LLM application, or intelligent search role",
    recommendedCv: "engineer"
  },
  {
    slug: "althil",
    shortName: "Althil",
    aliases: ["althil", "الظل", "مشروع الظل"],
    bestJobFit: "Cloud AI, data platform, or AI solutions engineering role",
    recommendedCv: "engineer"
  },
  {
    slug: "absher-insight-ai",
    shortName: "Absher Insight AI",
    aliases: ["absher insight ai", "absher", "أبشر", "ابشر", "مشروع أبشر", "مشروع ابشر"],
    bestJobFit: "AI security, analytics, or AI solutions specialist role",
    recommendedCv: "specialist"
  },
  {
    slug: "qanouni",
    shortName: "Qanouni",
    aliases: ["qanouni", "قانوني"],
    bestJobFit: "AI solutions engineer, NLP, or responsible AI implementation role",
    recommendedCv: "engineer"
  },
  {
    slug: "medad",
    shortName: "Medad",
    aliases: ["medad", "مداد"],
    bestJobFit: "AI solutions specialist, analytics, or dashboard implementation role",
    recommendedCv: "specialist"
  },
  {
    slug: "virtual-astronauts",
    shortName: "Virtual Astronauts",
    aliases: ["virtual astronauts", "astronauts", "رواد الفضاء الافتراضيين"],
    bestJobFit: "AI product, educational technology, or immersive learning role",
    recommendedCv: "engineer"
  }
];

const projectGuideBySlug = new Map(
  projectGuideProfiles.map((profile) => [profile.slug, profile])
);

function normalizeProjectMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

function includesAny(message: string, terms: string[]) {
  return terms.some((term) => message.includes(normalizeProjectMessage(term)));
}

function getProjectProfile(slug: string) {
  return projectGuideBySlug.get(slug);
}

function getProjectAndProfile(slug: string) {
  const project = getProjectBySlug(slug);
  const profile = getProjectProfile(slug);

  return project && profile ? { profile, project } : null;
}

function getProjectName(project: Project) {
  return project.title.split(" - ")[0];
}

function getTechnicalFocus(project: Project) {
  return project.technicalApproach.slice(0, 4).join(", ");
}

function summarizeComparisonValue(value: string, maxLength: number) {
  return value.length > maxLength
    ? `${value.slice(0, maxLength).replace(/\s+\S*$/, "")}...`
    : value;
}

export function getProjectGuideProfile(slug: string) {
  return getProjectProfile(slug);
}

export function getProjectGuideProfiles() {
  return projectGuideProfiles;
}

export function getMentionedProjectProfiles(message: string) {
  const normalized = normalizeProjectMessage(message);

  return projectGuideProfiles.filter((profile) =>
    includesAny(normalized, profile.aliases)
  );
}

export function getRequestedProjectDepth(
  message: string
): ProjectExplanationDepth {
  const normalized = normalizeProjectMessage(message);

  if (
    includesAny(normalized, [
      "technically",
      "technical explanation",
      "technical",
      "تقنيا",
      "تقني"
    ])
  ) {
    return "technical";
  }

  if (
    includesAny(normalized, [
      "for a recruiter",
      "recruiter summary",
      "recruiter",
      "للتوظيف",
      "للريكروتر"
    ])
  ) {
    return "recruiter";
  }

  return "simple";
}

export function isPortfolioTourRequest(message: string) {
  const normalized = normalizeProjectMessage(message);

  return includesAny(normalized, [
    "start portfolio tour",
    "portfolio tour",
    "60-second portfolio tour",
    "60 second portfolio tour",
    "ابدأ جولة سريعة",
    "ابدا جولة سريعة",
    "جولة سريعة"
  ]);
}

export function isProjectExplainerRequest(message: string) {
  const normalized = normalizeProjectMessage(message);

  return includesAny(normalized, [
    "explain a project",
    "project explainer",
    "show project options",
    "اشرح مشروع",
    "وش مشروع"
  ]);
}

export function isProjectComparisonRequest(message: string) {
  const normalized = normalizeProjectMessage(message);

  return includesAny(normalized, [
    "compare",
    "difference between",
    "differences between",
    "قارن",
    "الفرق بين",
    "وش الفرق"
  ]);
}

export function isProjectComparisonMenuRequest(message: string) {
  const normalized = normalizeProjectMessage(message).trim();

  return [
    "compare projects",
    "show comparison options",
    "قارن المشاريع"
  ].includes(normalized);
}

export function getPortfolioTourResponse() {
  return [
    "60-second portfolio tour",
    "",
    "1. Who Abdulelah is: An Information Systems graduate, Junior AI Engineer, and AI Solutions Specialist focused on practical, context-aware AI systems.",
    "2. Leadership and local AI: ChatUB is his graduation project, a local academic assistant built around official university knowledge, NLP, LLM applications, intelligent search, privacy, and reliability.",
    "3. Cloud AI: Althil connects Google Cloud Run, BigQuery, Cloud Storage, Vertex AI, maps, and analysis for urban thermal comfort decisions.",
    "4. Security AI: Absher Insight AI explores proactive digital security through synthetic data, UEBA, behavioral analytics, anomaly detection, and dashboard thinking.",
    "5. Supporting projects: Qanouni adds legal-tech guidance, Medad adds AI analytics and dashboards for financial inclusion, and Virtual Astronauts adds immersive AI learning.",
    "6. Best next action: View the project case studies, download the CV closest to your role, or contact Abdulelah."
  ].join("\n");
}

export function getProjectExplainerMenuResponse() {
  return [
    "Project explainer",
    "",
    "Choose a project from Abdulelah's portfolio:",
    "- ChatUB",
    "- Althil",
    "- Absher Insight AI",
    "- Qanouni",
    "- Medad",
    "- Virtual Astronauts",
    "",
    "You can ask for a simple explanation, a technical explanation, or a recruiter summary."
  ].join("\n");
}

export function getProjectComparisonMenuResponse() {
  return [
    "Project comparison",
    "",
    "Choose a comparison from Abdulelah's portfolio:",
    "- Compare ChatUB and Althil",
    "- Compare ChatUB and Absher Insight AI",
    "- Compare Althil and Absher Insight AI",
    "- Compare all projects",
    "",
    "I will compare the domain, problem, technical focus, Abdulelah's role, hiring signal, and relevant job fit."
  ].join("\n");
}

export function getProjectExplanationResponse(
  profile: ProjectGuideProfile,
  depth: ProjectExplanationDepth
) {
  const entry = getProjectAndProfile(profile.slug);

  if (!entry) {
    return "";
  }

  const { project } = entry;
  const depthLabel =
    depth === "technical"
      ? "Technical explanation"
      : depth === "recruiter"
        ? "Recruiter summary"
        : "Simple explanation";
  const technologySummary =
    depth === "technical"
      ? `${project.technologies.join(", ")}. Technical approach: ${getTechnicalFocus(project)}.`
      : project.technologies.join(", ");

  return [
    `${depthLabel}: ${getProjectName(project)}`,
    "",
    `- Problem: ${project.problem}`,
    `- Solution: ${project.solution}`,
    `- Abdulelah's role: ${project.role}`,
    `- Technologies: ${technologySummary}`,
    `- Why it matters: ${project.impact}`,
    `- Best related job fit: ${profile.bestJobFit}`,
    `- Recommended CV: ${profile.recommendedCv === "engineer" ? "AI Engineer CV" : "AI Specialist CV"}`
  ].join("\n");
}

function getComparisonSection(profile: ProjectGuideProfile) {
  const entry = getProjectAndProfile(profile.slug);

  if (!entry) {
    return "";
  }

  const { project } = entry;
  const technicalFocus = project.technicalApproach.slice(0, 3).join(", ");

  return [
    `${profile.shortName}`,
    `- Domain: ${project.category}`,
    `- Problem: ${summarizeComparisonValue(project.problem, 82)}`,
    `- Technical focus: ${summarizeComparisonValue(technicalFocus, 92)}`,
    `- Abdulelah's role: ${summarizeComparisonValue(project.role, 82)}`,
    `- Best hiring signal: ${summarizeComparisonValue(project.impact, 82)}`,
    `- Relevant job fit: ${summarizeComparisonValue(profile.bestJobFit, 65)}`
  ].join("\n");
}

export function getProjectComparisonResponse(profiles: ProjectGuideProfile[]) {
  const selectedProfiles =
    profiles.length >= 2 ? profiles : projectGuideProfiles.slice(0, 3);
  const title =
    profiles.length >= 2
      ? `Project comparison: ${selectedProfiles.map((profile) => profile.shortName).join(" vs ")}`
      : "Project comparison: flagship projects";

  return [
    title,
    "",
    ...selectedProfiles.flatMap((profile, index) => [
      getComparisonSection(profile),
      ...(index < selectedProfiles.length - 1 ? [""] : [])
    ]),
    "",
    "Best next step: Open the case studies for the projects closest to your hiring needs."
  ].join("\n");
}

export function getProjectContextGuide() {
  return projectGuideProfiles
    .map((profile) => {
      const project = getProjectBySlug(profile.slug);

      return project
        ? `- ${profile.shortName}: Best job fit: ${profile.bestJobFit}. Recommended CV: ${profile.recommendedCv}.`
        : "";
    })
    .filter(Boolean)
    .join("\n");
}

export function getAllProjectSlugs() {
  return projects.map((project) => project.slug);
}
