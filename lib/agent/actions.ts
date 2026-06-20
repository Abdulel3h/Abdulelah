import { siteConfig } from "@/data/site";
import {
  getContactEmail,
  resolveContactChannel
} from "@/lib/agent/contact-routing";
import {
  getCvRecommendation,
  getRecruiterRoleProfile,
  isCvRecommendationRequest,
  isGeneralHiringFitRequest,
  isRecruiterModeRequest,
  type RecruiterCvRecommendation,
  type RecruiterRoleProfile
} from "@/lib/agent/recruiter";
import {
  getMentionedProjectProfiles,
  getProjectGuideProfiles,
  isPortfolioTourRequest,
  isProjectComparisonMenuRequest,
  isProjectComparisonRequest,
  isProjectExplainerRequest,
  type ProjectGuideProfile
} from "@/lib/agent/project-guide";
import { containsArabic } from "@/lib/text-direction";
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
  qanouni: {
    label: "View Qanouni",
    href: "/projects/qanouni",
    type: "internal"
  },
  medad: {
    label: "View Medad",
    href: "/projects/medad",
    type: "internal"
  },
  virtualAstronauts: {
    label: "View Virtual Astronauts",
    href: "/projects/virtual-astronauts",
    type: "internal"
  },
  projects: {
    label: "View All Projects",
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
  },
  recruiterJuniorEngineer: {
    label: "Junior AI Engineer",
    href: "#recruiter-junior-ai-engineer",
    prompt: "I am hiring for a Junior AI Engineer",
    type: "prompt"
  },
  recruiterSolutionsSpecialist: {
    label: "AI Solutions Specialist",
    href: "#recruiter-ai-solutions-specialist",
    prompt: "We need an AI Solutions Specialist",
    type: "prompt"
  },
  recruiterSolutionsEngineer: {
    label: "AI Solutions Engineer",
    href: "#recruiter-ai-solutions-engineer",
    prompt: "We need an AI Solutions Engineer",
    type: "prompt"
  },
  recruiterCloudAiData: {
    label: "Cloud AI / Data Role",
    href: "#recruiter-cloud-ai-data",
    prompt: "We need a Cloud AI / Data Role",
    type: "prompt"
  },
  recruiterInternshipCoop: {
    label: "Internship / COOP",
    href: "#recruiter-internship-coop",
    prompt: "We are hiring for an Internship / COOP role",
    type: "prompt"
  },
  recruiterGeneralFit: {
    label: "General Hiring Fit",
    href: "#recruiter-general-hiring-fit",
    prompt: "Give me a General Hiring Fit summary",
    type: "prompt"
  }
} satisfies Record<string, AgentAction>;

const recruiterRoleActions = [
  actions.recruiterJuniorEngineer,
  actions.recruiterSolutionsSpecialist,
  actions.recruiterSolutionsEngineer,
  actions.recruiterCloudAiData,
  actions.recruiterInternshipCoop,
  actions.recruiterGeneralFit
];

const projectViewActions: Record<string, AgentAction> = {
  chatub: actions.chatub,
  althil: actions.althil,
  "absher-insight-ai": actions.absher,
  qanouni: actions.qanouni,
  medad: actions.medad,
  "virtual-astronauts": actions.virtualAstronauts
};

function createPromptAction(
  label: string,
  href: string,
  prompt: string
): AgentAction {
  return {
    label,
    href,
    prompt,
    type: "prompt"
  };
}

function createEmailAction(email: string): AgentAction {
  return {
    label: `Email ${email}`,
    href: `mailto:${email}`,
    type: "email"
  };
}

export function getContinueAnswerAction(message: string): AgentAction {
  const isArabic = containsArabic(message);

  return createPromptAction(
    isArabic ? "كمل الإجابة" : "Continue answer",
    "#continue-answer",
    isArabic ? "كمل الإجابة" : "Continue answer"
  );
}

function getProjectCvAction(profile: ProjectGuideProfile) {
  return profile.recommendedCv === "engineer"
    ? actions.engineerResume
    : actions.specialistResume;
}

function getProjectPickerActions() {
  return [
    ...getProjectGuideProfiles().map((profile) =>
      createPromptAction(
        profile.shortName,
        `#explain-${profile.slug}`,
        `Explain ${profile.shortName}`
      )
    ),
    actions.projects
  ];
}

function getProjectDepthActions(profile: ProjectGuideProfile) {
  return [
    createPromptAction(
      "Simple explanation",
      `#explain-${profile.slug}-simple`,
      `Explain ${profile.shortName} simply`
    ),
    createPromptAction(
      "Technical explanation",
      `#explain-${profile.slug}-technical`,
      `Explain ${profile.shortName} technically`
    ),
    createPromptAction(
      "Recruiter summary",
      `#explain-${profile.slug}-recruiter`,
      `Explain ${profile.shortName} for a recruiter`
    ),
    projectViewActions[profile.slug],
    actions.projects,
    actions.skills,
    getProjectCvAction(profile),
    actions.navigatorContact
  ] satisfies AgentAction[];
}

function getProjectComparisonMenuActions() {
  return [
    createPromptAction(
      "ChatUB vs Althil",
      "#compare-chatub-althil",
      "Compare ChatUB and Althil"
    ),
    createPromptAction(
      "ChatUB vs Absher Insight AI",
      "#compare-chatub-absher",
      "Compare ChatUB and Absher Insight AI"
    ),
    createPromptAction(
      "Althil vs Absher Insight AI",
      "#compare-althil-absher",
      "Compare Althil and Absher Insight AI"
    ),
    actions.projects
  ];
}

function getProjectComparisonActions(profiles: ProjectGuideProfile[]) {
  const selectedProfiles =
    profiles.length >= 2 ? profiles : getProjectGuideProfiles().slice(0, 3);

  return [
    ...selectedProfiles.map((profile) => projectViewActions[profile.slug]),
    actions.projects,
    actions.skills,
    actions.navigatorContact
  ].filter(Boolean);
}

function getCvActions(recommendation: RecruiterCvRecommendation) {
  if (recommendation === "engineer") {
    return [actions.engineerResume, actions.resume, actions.projects, actions.navigatorContact];
  }

  if (recommendation === "specialist") {
    return [actions.specialistResume, actions.resume, actions.projects, actions.navigatorContact];
  }

  return [actions.engineerResume, actions.specialistResume, actions.resume];
}

function getRecruiterFitActions(profile: RecruiterRoleProfile) {
  const recruitmentEmail = createEmailAction(getContactEmail("recruitment"));

  return profile.recommendedCv === "both"
    ? [
        actions.engineerResume,
        actions.specialistResume,
        recruitmentEmail,
        actions.projects,
        actions.navigatorContact
      ]
    : [
        profile.recommendedCv === "engineer"
          ? actions.engineerResume
          : actions.specialistResume,
        recruitmentEmail,
        actions.projects,
        actions.skills,
        actions.navigatorContact
      ];
}

function includesAny(message: string, terms: string[]) {
  return terms.some((term) => message.includes(term));
}

function normalizeActionText(message: string) {
  return message
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

const MAX_EVIDENCE_ACTIONS = 5;
const projectEvidenceMatchers = [
  {
    action: actions.chatub,
    terms: ["chatub", "local ai", "academic", "university", "nlp", "llm"]
  },
  {
    action: actions.althil,
    terms: ["althil", "cloud ai", "google cloud", "vertex ai", "bigquery", "cloud run"]
  },
  {
    action: actions.absher,
    terms: ["absher", "security ai", "ueba", "behavioral analytics", "anomaly detection"]
  },
  {
    action: actions.qanouni,
    terms: ["qanouni", "legal tech", "labor rights"]
  },
  {
    action: actions.medad,
    terms: ["medad", "fintech", "financial inclusion"]
  },
  {
    action: actions.virtualAstronauts,
    terms: ["virtual astronauts", "immersive learning"]
  }
];

export function enrichAgentActions(
  answer: string,
  initialActions: AgentAction[]
) {
  const normalized = normalizeActionText(answer);
  const promptActions = initialActions.filter((action) => action.type === "prompt");
  const evidenceActions: AgentAction[] = initialActions.filter(
    (action) => action.type !== "prompt"
  );

  function add(action: AgentAction) {
    if (!evidenceActions.some((currentAction) => currentAction.href === action.href)) {
      evidenceActions.push(action);
    }
  }

  for (const matcher of projectEvidenceMatchers) {
    if (includesAny(normalized, matcher.terms)) {
      add(matcher.action);
    }
  }

  if (
    includesAny(normalized, [
      "skill",
      "experience",
      "nlp",
      "llm",
      "cloud",
      "security",
      "dashboard",
      "analytics",
      "مهارات",
      "خبرة",
      "كلاود",
      "السحابة",
      "الامن",
      "لوحة معلومات"
    ])
  ) {
    add(actions.skills);
  }

  if (normalized.includes("ai engineer cv")) {
    add(actions.engineerResume);
  }

  if (normalized.includes("ai specialist cv")) {
    add(actions.specialistResume);
  }

  if (
    includesAny(normalized, ["cv", "resume", "سيرة"]) &&
    !evidenceActions.some((action) => action.type === "download")
  ) {
    add(actions.resume);
  }

  if (
    includesAny(normalized, [
      "contact abdulelah",
      "contact page",
      "reach",
      "hiring",
      "hire",
      "recruiter",
      "open role",
      "تواصل",
      "التواصل",
      "اتواصل",
      "توظيف"
    ])
  ) {
    add(actions.navigatorContact);
  }

  // Surface any contact alias the answer mentions, prioritized so the email
  // button is not crowded out of the action cap by project-evidence buttons.
  const detectedEmailActions: AgentAction[] = [];

  for (const email of Object.values(siteConfig.contactEmails)) {
    const href = `mailto:${email}`;

    if (
      normalized.includes(email.toLowerCase()) &&
      !detectedEmailActions.some((action) => action.href === href)
    ) {
      detectedEmailActions.push(createEmailAction(email));
    }
  }

  const prioritizedEvidence = [
    ...detectedEmailActions,
    ...evidenceActions.filter(
      (action) =>
        !detectedEmailActions.some((email) => email.href === action.href)
    )
  ];

  return [
    ...promptActions,
    ...prioritizedEvidence.slice(0, MAX_EVIDENCE_ACTIONS)
  ];
}

export function getAgentActions(message: string): AgentAction[] {
  const normalized = normalizeActionText(message);
  const results: AgentAction[] = [];
  const recruiterRole = getRecruiterRoleProfile(message);
  const mentionedProjects = getMentionedProjectProfiles(message);
  const wantsBlog = includesAny(normalized, [
    "article",
    "articles",
    "blog",
    "insight",
    "read",
    "context engineering",
    "context matters",
    "prompts",
    "مقال",
    "مقالات",
    "وش كتب"
  ]);

  function add(...nextActions: AgentAction[]) {
    for (const action of nextActions) {
      if (!results.some((result) => result.href === action.href)) {
        results.push(action);
      }
    }
  }

  if (isPortfolioTourRequest(message)) {
    return [actions.projects, actions.engineerResume, actions.navigatorContact];
  }

  if (isProjectComparisonRequest(message)) {
    return isProjectComparisonMenuRequest(message)
      ? getProjectComparisonMenuActions()
      : getProjectComparisonActions(mentionedProjects);
  }

  if (isProjectExplainerRequest(message) && mentionedProjects.length === 0) {
    return getProjectPickerActions();
  }

  if (mentionedProjects.length > 0) {
    return getProjectDepthActions(mentionedProjects[0]);
  }

  if (isRecruiterModeRequest(message)) {
    return recruiterRoleActions;
  }

  if (recruiterRole) {
    return getRecruiterFitActions(recruiterRole);
  }

  if (isCvRecommendationRequest(message)) {
    return getCvActions(getCvRecommendation(message));
  }

  if (isGeneralHiringFitRequest(message)) {
    return getRecruiterFitActions(
      getRecruiterRoleProfile("General Hiring Fit")!
    );
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
      "cloud",
      "الكلاود",
      "السحابة"
    ])
  ) {
    add(actions.althil);
  }

  if (includesAny(normalized, ["absher", "security", "ueba", "risk"])) {
    add(actions.absher);
  }

  if (
    includesAny(normalized, [
      "nlp",
      "llm",
      "agent",
      "skill",
      "cloud",
      "مهارات",
      "يعرف",
      "خبرة",
      "الكلاود",
      "السحابة"
    ])
  ) {
    add(actions.skills);
  }

  if (
    includesAny(normalized, ["cv", "resume", "سيرة"]) ||
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
    add(
      createEmailAction(getContactEmail(resolveContactChannel(message))),
      actions.navigatorContact,
      actions.contact,
      actions.linkedin
    );
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
      "different",
      "مشروع",
      "مشاريع",
      "اقوي",
      "افضل",
      "نوظف",
      "توظيف"
    ])
  ) {
    add(actions.projects, actions.resume, actions.navigatorContact);
  }

  if (results.length === 0) {
    add(actions.projects, actions.resume, actions.navigatorContact);
  }

  return results.slice(0, 4);
}

export function getPortfolioRedirectActions(): AgentAction[] {
  return [actions.projects, actions.resume, actions.navigatorContact];
}
