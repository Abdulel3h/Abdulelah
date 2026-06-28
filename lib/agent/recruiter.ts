import { getContactEmail } from "@/lib/agent/contact-routing";

export type RecruiterCvRecommendation = "engineer" | "specialist" | "both";

export type RecruiterRoleId =
  | "junior-ai-engineer"
  | "ai-solutions-specialist"
  | "ai-solutions-engineer"
  | "cloud-ai-data"
  | "internship-coop"
  | "general-hiring-fit";

export type RecruiterRoleProfile = {
  id: RecruiterRoleId;
  label: string;
  fitSummary: string;
  projects: string[];
  skills: string[];
  recommendedCv: RecruiterCvRecommendation;
  nextAction: string;
};

export const recruiterRoleProfiles: RecruiterRoleProfile[] = [
  {
    id: "junior-ai-engineer",
    label: "AI Engineer",
    fitSummary:
      "Abdulelah is a strong early-career AI engineering candidate because he has built applied AI systems using NLP, LLM applications, cloud AI, and intelligent search across multiple domains.",
    projects: ["ChatUB", "Althil", "Absher Insight AI"],
    skills: [
      "NLP",
      "LLM Applications",
      "Google Cloud",
      "Azure AI Services",
      "Python",
      "API Integration"
    ],
    recommendedCv: "engineer",
    nextAction: "Download the AI Engineer CV, then review the flagship projects."
  },
  {
    id: "ai-solutions-specialist",
    label: "AI Solutions Specialist",
    fitSummary:
      "Abdulelah fits AI solutions specialist roles through practical AI use-case design, dashboard thinking, cross-functional implementation, and an ability to translate domain needs into clear solution concepts.",
    projects: ["Qanouni", "Medad", "Absher Insight AI"],
    skills: [
      "AI-Driven Insights",
      "Dashboard Design",
      "Data Visualization",
      "Azure AI Services",
      "Analytical Thinking",
      "Communication"
    ],
    recommendedCv: "specialist",
    nextAction: "Download the AI Specialist CV, then review the solution-focused projects."
  },
  {
    id: "ai-solutions-engineer",
    label: "AI Solutions Engineer",
    fitSummary:
      "Abdulelah is a promising AI solutions engineering candidate because his portfolio combines technical AI integration with cloud architecture, product framing, and explainable user-facing experiences.",
    projects: ["ChatUB", "Althil", "Qanouni"],
    skills: [
      "NLP",
      "LLM Applications",
      "API Integration",
      "Cloud Architecture",
      "Azure AI Services",
      "Problem Solving"
    ],
    recommendedCv: "engineer",
    nextAction: "Download the AI Engineer CV and review ChatUB, Althil, and Qanouni."
  },
  {
    id: "cloud-ai-data",
    label: "Cloud AI / Data Role",
    fitSummary:
      "Abdulelah brings practical cloud AI and data exposure through projects that connect backend services, analytics, model capabilities, storage, dashboards, and decision-support interfaces.",
    projects: ["Althil", "Qanouni", "Medad"],
    skills: [
      "Google Cloud Run",
      "Vertex AI",
      "BigQuery",
      "Cloud Storage",
      "Azure AI Services",
      "SQL"
    ],
    recommendedCv: "engineer",
    nextAction: "Download the AI Engineer CV and start with the Althil case study."
  },
  {
    id: "internship-coop",
    label: "Internship / COOP",
    fitSummary:
      "Abdulelah is a strong internship or COOP candidate for teams seeking practical AI foundations, fast learning, project leadership, and exposure to varied applied domains.",
    projects: ["ChatUB", "Althil", "Absher Insight AI"],
    skills: [
      "Python",
      "NLP",
      "Problem Solving",
      "Adaptability",
      "Team Leadership",
      "Continuous Learning"
    ],
    recommendedCv: "engineer",
    nextAction: "Download the AI Engineer CV, review the featured projects, and contact Abdulelah."
  },
  {
    id: "general-hiring-fit",
    label: "General Hiring Fit",
    fitSummary:
      "Abdulelah is an Information Systems graduate with a recruiter-friendly mix of applied AI projects, cloud exposure, solution design, project leadership, and hackathon-tested delivery across distinct domains.",
    projects: ["ChatUB", "Althil", "Absher Insight AI"],
    skills: [
      "NLP",
      "LLM Applications",
      "Cloud Architecture",
      "Dashboard Design",
      "Problem Solving",
      "Communication"
    ],
    recommendedCv: "both",
    nextAction: "Review both CV tracks, then choose the one closest to the open role."
  }
];

const recruiterRoleById = new Map(
  recruiterRoleProfiles.map((profile) => [profile.id, profile])
);

function normalizeRecruiterMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

function includesAny(message: string, terms: string[]) {
  return terms.some((term) => message.includes(normalizeRecruiterMessage(term)));
}

function getRoleProfile(id: RecruiterRoleId) {
  return recruiterRoleById.get(id);
}

export function isRecruiterModeRequest(message: string) {
  const normalized = normalizeRecruiterMessage(message);

  return includesAny(normalized, [
    "recruiter mode",
    "match him to a role",
    "match him to this role",
    "role options",
    "hiring role",
    "وضع التوظيف",
    "طابقه مع وظيفة"
  ]);
}

export function isCvRecommendationRequest(message: string) {
  const normalized = normalizeRecruiterMessage(message);

  return includesAny(normalized, [
    "which cv",
    "what cv",
    "cv should",
    "which resume",
    "what resume",
    "resume should",
    "اي cv",
    "أي cv",
    "cv احمل",
    "cv أحمل",
    "اي سيرة",
    "أي سيرة",
    "السيرة"
  ]);
}

export function isGeneralHiringFitRequest(message: string) {
  const normalized = normalizeRecruiterMessage(message);

  return includesAny(normalized, [
    "why hire",
    "why should we hire",
    "hiring fit",
    "recruiter summary",
    "summary for recruiter",
    "ليش نوظفه",
    "ملخص للريكروتر"
  ]);
}

export function getRecruiterRoleProfile(message: string) {
  const normalized = normalizeRecruiterMessage(message);
  const hasRoleIntent = includesAny(normalized, [
    "hiring",
    "hire",
    "role",
    "position",
    "fit",
    "need",
    "وظيفة",
    "يناسب",
    "توظيف"
  ]);

  if (
    includesAny(normalized, [
      "cloud ai / data",
      "cloud ai role",
      "cloud data role",
      "data role"
    ])
  ) {
    return getRoleProfile("cloud-ai-data");
  }

  if (includesAny(normalized, ["ai solutions specialist", "ai specialist"])) {
    return getRoleProfile("ai-solutions-specialist");
  }

  if (includesAny(normalized, ["ai solutions engineer"])) {
    return getRoleProfile("ai-solutions-engineer");
  }

  if (includesAny(normalized, ["internship", "coop", "co-op", "تدريب", "تعاوني"])) {
    return getRoleProfile("internship-coop");
  }

  if (includesAny(normalized, ["general hiring fit"])) {
    return getRoleProfile("general-hiring-fit");
  }

  if (
    includesAny(normalized, ["junior ai engineer"]) ||
    (hasRoleIntent && includesAny(normalized, ["ai engineer"]))
  ) {
    return getRoleProfile("junior-ai-engineer");
  }
}

export function getCvRecommendation(message: string): RecruiterCvRecommendation {
  const normalized = normalizeRecruiterMessage(message);

  if (
    includesAny(normalized, [
      "ai specialist",
      "ai solutions specialist",
      "ai adoption",
      "business use case",
      "dashboard",
      "solution consulting",
      "analysis",
      "implementation"
    ])
  ) {
    return "specialist";
  }

  if (
    includesAny(normalized, [
      "ai engineer",
      "technical ai",
      "nlp",
      "llm",
      "cloud deployment",
      "backend ai",
      "intelligent systems",
      "cloud ai",
      "data role"
    ])
  ) {
    return "engineer";
  }

  return "both";
}

function getCvLabel(recommendation: RecruiterCvRecommendation) {
  if (recommendation === "engineer") {
    return "AI Engineer CV";
  }

  if (recommendation === "specialist") {
    return "AI Specialist CV";
  }

  return "AI Engineer CV and AI Specialist CV";
}

export function getRecruiterModeResponse() {
  return [
    "Recruiter Mode",
    "",
    "Choose the hiring track that best matches your open role for Abdulelah:",
    "- AI Engineer",
    "- AI Solutions Specialist",
    "- AI Solutions Engineer",
    "- Cloud AI / Data Role",
    "- Internship / COOP",
    "- General Hiring Fit",
    "",
    "I will return a concise fit summary, matching projects and skills, the recommended CV, and useful next actions."
  ].join("\n");
}

export function getRecruiterRoleResponse(profile: RecruiterRoleProfile) {
  return [
    `Recruiter fit: ${profile.label}`,
    "",
    `- Fit summary: ${profile.fitSummary}`,
    `- Best matching projects: ${profile.projects.join(", ")}`,
    `- Matching skills: ${profile.skills.join(", ")}`,
    `- Recommended CV: ${getCvLabel(profile.recommendedCv)}`,
    `- Suggested next action: ${profile.nextAction}`,
    `- Recruitment contact: ${getContactEmail("recruitment")}`
  ].join("\n");
}

export function getCvRecommendationResponse(
  recommendation: RecruiterCvRecommendation
) {
  if (recommendation === "engineer") {
    return [
      "CV recommendation for Abdulelah",
      "",
      "- Recommended CV: AI Engineer CV",
      "- Best for: technical AI development, NLP, LLM applications, cloud deployment, backend AI, and intelligent systems.",
      "- Suggested next action: Download the AI Engineer CV, then review the most relevant projects."
    ].join("\n");
  }

  if (recommendation === "specialist") {
    return [
      "CV recommendation for Abdulelah",
      "",
      "- Recommended CV: AI Specialist CV",
      "- Best for: AI adoption, business use cases, dashboards, solution consulting, analysis, and cross-functional implementation.",
      "- Suggested next action: Download the AI Specialist CV, then review the solution-focused projects."
    ].join("\n");
  }

  return [
    "CV recommendation for Abdulelah",
    "",
    "- AI Engineer CV: Best for technical AI development, NLP, LLM applications, cloud deployment, backend AI, and intelligent systems.",
    "- AI Specialist CV: Best for AI adoption, business use cases, dashboards, solution consulting, analysis, and implementation.",
    "- Recommendation: If the role is still broad, download both CVs and choose the version closest to the hiring track."
  ].join("\n");
}
