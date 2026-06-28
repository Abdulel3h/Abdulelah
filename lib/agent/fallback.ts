import { getBlogPostBySlug } from "@/data/blog";
import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/data/site";
import {
  EMPTY_AGENT_SESSION_CONTEXT,
  getProjectFollowUpKind,
  isContinueAnswerRequest,
  resolveAgentFollowUp
} from "@/lib/agent/context";
import {
  getContactEmail,
  resolveContactChannel
} from "@/lib/agent/contact-routing";
import {
  getCvRecommendation,
  getCvRecommendationResponse,
  getRecruiterModeResponse,
  getRecruiterRoleProfile,
  getRecruiterRoleResponse,
  isCvRecommendationRequest,
  isGeneralHiringFitRequest,
  isRecruiterModeRequest,
  type RecruiterCvRecommendation
} from "@/lib/agent/recruiter";
import {
  getMentionedProjectProfiles,
  getPortfolioTourResponse,
  getProjectComparisonMenuResponse,
  getProjectComparisonResponse,
  getProjectExplainerMenuResponse,
  getProjectExplanationResponse,
  getProjectGuideProfiles,
  getRequestedProjectDepth,
  isPortfolioTourRequest,
  isProjectComparisonMenuRequest,
  isProjectComparisonRequest,
  isProjectExplainerRequest,
  type ProjectGuideProfile
} from "@/lib/agent/project-guide";
import { classifyAgentMessage, getSafetyRefusal } from "@/lib/agent/safety";
import { containsArabic } from "@/lib/text-direction";
import type { AgentSessionContext } from "@/types/agent";

function includesAny(message: string, terms: string[]) {
  return terms.some((term) => message.includes(term));
}

function projectSummary(slug: string) {
  const project = getProjectBySlug(slug);

  if (!project) {
    return "";
  }

  return `${project.title}. ${project.shortDescription} Abdulelah's role: ${project.role}. Key technologies and methods: ${project.technologies.join(", ")}.`;
}

function blogPostSummary(slug: string) {
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return "";
  }

  return `Read "${post.title}" in Abdulelah AI Insights. ${post.excerpt} Key takeaway: ${post.content.takeaway}`;
}

function normalizeArabicMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

function getSessionProjectProfile(sessionContext: AgentSessionContext) {
  return sessionContext.lastProject
    ? getProjectGuideProfiles().find(
        (profile) => profile.shortName === sessionContext.lastProject
      )
    : undefined;
}

function getProjectFollowUpResponse(
  message: string,
  sessionContext: AgentSessionContext
) {
  const kind = getProjectFollowUpKind(message);

  if (!kind) {
    return null;
  }

  const profile =
    getMentionedProjectProfiles(message)[0] ??
    getSessionProjectProfile(sessionContext);

  if (!profile) {
    if (kind === "recruiter-summary") {
      return null;
    }

    return containsArabic(message)
      ? "حدد اسم المشروع أولًا، مثل ChatUB أو Althil، وبعدها أشرح لك التفاصيل."
      : "Please name a project first, such as ChatUB or Althil, and I will explain the details.";
  }

  const project = getProjectBySlug(profile.slug);

  if (!project) {
    return null;
  }

  if (containsArabic(message)) {
    if (kind === "technologies") {
      return [
        `التقنيات المستخدمة في ${profile.shortName}:`,
        ...project.technologies.map((technology) => `- ${technology}`)
      ].join("\n");
    }

    if (kind === "role") {
      return [
        `دور عبدالإله في ${profile.shortName}: ${project.role}.`,
        "",
        ...project.responsibilities
          .slice(0, 4)
          .map((responsibility) => `- ${responsibility}`)
      ].join("\n");
    }

    if (kind === "impact") {
      return `أهمية ${profile.shortName}: ${project.impact}`;
    }

    if (kind === "technical") {
      return [
        `شرح تقني مختصر لمشروع ${profile.shortName}:`,
        ...project.technicalApproach.map((step) => `- ${step}`)
      ].join("\n");
    }

    return [
      `ملخص ${profile.shortName} للريكروتر:`,
      `- المجال: ${project.category}`,
      `- دور عبدالإله: ${project.role}`,
      `- أبرز التقنيات: ${project.technologies.join(", ")}`,
      `- الأثر: ${project.impact}`,
      `- أنسب مسار وظيفي: ${profile.bestJobFit}`
    ].join("\n");
  }

  if (kind === "technologies") {
    return [
      `Technologies used in ${profile.shortName}:`,
      ...project.technologies.map((technology) => `- ${technology}`)
    ].join("\n");
  }

  if (kind === "role") {
    return [
      `Abdulelah's role in ${profile.shortName}: ${project.role}.`,
      "",
      ...project.responsibilities
        .slice(0, 4)
        .map((responsibility) => `- ${responsibility}`)
    ].join("\n");
  }

  if (kind === "impact") {
    return `Why ${profile.shortName} matters: ${project.impact}`;
  }

  if (kind === "technical") {
    return [
      `Technical explanation: ${profile.shortName}`,
      ...project.technicalApproach.map((step) => `- ${step}`)
    ].join("\n");
  }

  return [
    `Recruiter summary: ${profile.shortName}`,
    `- Domain: ${project.category}`,
    `- Abdulelah's role: ${project.role}`,
    `- Technologies: ${project.technologies.join(", ")}`,
    `- Impact: ${project.impact}`,
    `- Best related job fit: ${profile.bestJobFit}`
  ].join("\n");
}

function getContinueFallbackResponse(
  message: string,
  sessionContext: AgentSessionContext
) {
  if (!isContinueAnswerRequest(message)) {
    return null;
  }

  if (sessionContext.lastProject) {
    const profile = getSessionProjectProfile(sessionContext);
    const project = profile ? getProjectBySlug(profile.slug) : undefined;

    if (profile && project) {
      return containsArabic(message)
        ? [
            `تكملة تفاصيل ${profile.shortName}:`,
            "- مسؤوليات إضافية:",
            ...project.responsibilities
              .slice(0, 4)
              .map((responsibility) => `- ${responsibility}`),
            "- خصائص مهمة:",
            ...project.features
              .slice(0, 3)
              .map((feature) => `- ${feature}`),
            `- الأثر: ${project.impact}`
          ].join("\n")
        : [
            `More details about ${profile.shortName}:`,
            "- Additional responsibilities:",
            ...project.responsibilities
              .slice(0, 4)
              .map((responsibility) => `- ${responsibility}`),
            "- Notable features:",
            ...project.features
              .slice(0, 3)
              .map((feature) => `- ${feature}`),
            `- Impact: ${project.impact}`
          ].join("\n");
    }
  }

  const recruiterRole = sessionContext.lastRoleInterest
    ? getRecruiterRoleProfile(
        `Hiring role context: ${sessionContext.lastRoleInterest}`
      )
    : undefined;

  if (recruiterRole) {
    return getRecruiterRoleResponse(recruiterRole);
  }

  return containsArabic(message)
    ? "حدد المشروع أو مسار التوظيف الذي تريد إكماله، وسأتابع من النقطة المناسبة."
    : "Please name the project or hiring track you want to continue, and I will pick up from the relevant point.";
}

function getArabicProjectComparisonResponse(profiles: ProjectGuideProfile[]) {
  return [
    `مقارنة المشاريع: ${profiles.map((profile) => profile.shortName).join(" مقابل ")}`,
    "",
    ...profiles.flatMap((profile, index) => {
      const project = getProjectBySlug(profile.slug);

      return project
        ? [
            profile.shortName,
            `- المجال: ${project.category}`,
            `- دور عبدالإله: ${project.role}`,
            `- التركيز التقني: ${project.technologies.slice(0, 5).join(", ")}`,
            `- الأثر: ${project.impact}`,
            ...(index < profiles.length - 1 ? [""] : [])
          ]
        : [];
    })
  ].join("\n");
}

function getArabicCvRecommendationResponse(
  recommendation: RecruiterCvRecommendation
) {
  if (recommendation === "engineer") {
    return [
      "السيرة الأنسب لهذا الدور هي AI Engineer CV.",
      "",
      "- مناسبة لأدوار تطوير AI التقنية و NLP و LLMs و Cloud AI.",
      "- الخطوة التالية: نزّل AI Engineer CV ثم راجع المشاريع الأقرب للدور."
    ].join("\n");
  }

  if (recommendation === "specialist") {
    return [
      "السيرة الأنسب لهذا الدور هي AI Specialist CV.",
      "",
      "- مناسبة لأدوار تبني حلول AI وحالات الاستخدام ولوحات المعلومات والتحليل.",
      "- الخطوة التالية: نزّل AI Specialist CV ثم راجع المشاريع المرتبطة بالحلول."
    ].join("\n");
  }

  return [
    "إذا كان الدور عامًا، راجع النسختين:",
    "",
    "- AI Engineer CV للأدوار التقنية.",
    "- AI Specialist CV لأدوار الحلول والتحليل.",
    "- اختر النسخة الأقرب لمسار التوظيف."
  ].join("\n");
}

function getArabicFallbackAgentResponse(message: string) {
  const normalized = normalizeArabicMessage(message);

  if (includesAny(normalized, ["سيرة", "cv"])) {
    return [
      "لدى عبدالإله نسختان من السيرة الذاتية حسب نوع الدور:",
      "",
      "- AI Engineer CV: مناسب للأدوار التقنية التي تركز على NLP و LLMs و Cloud AI وتطوير الأنظمة الذكية.",
      "- AI Specialist CV: مناسب لأدوار تبني حلول AI وتحليل حالات الاستخدام ولوحات المعلومات.",
      "",
      "يمكنك تنزيل السيرة المناسبة من أزرار الإجراءات بالأسفل."
    ].join("\n");
  }

  if (resolveContactChannel(message) === "business") {
    return `للاستشارات أو الأعمال أو العمل الحر، يمكنك التواصل مع عبدالإله مباشرة عبر ${getContactEmail("business")}. يبني عبدالإله حلول ذكاء اصطناعي تطبيقية ويقدر يحدد الحل المناسب لاحتياجك. كما يمكنك إرسال رسالة عبر نموذج التواصل. ستجد أزرار التواصل بالأسفل.`;
  }

  if (includesAny(normalized, ["تواصل", "اتواصل", "ايميل", "لينكد", "github"])) {
    const channel = resolveContactChannel(message);
    const routedEmail = getContactEmail(channel);
    const channelIntro =
      channel === "recruitment"
        ? `للوظائف والتوظيف، تواصل مع عبدالإله عبر ${routedEmail}.`
        : channel === "business"
          ? `للاستشارات والأعمال، تواصل مع عبدالإله عبر ${routedEmail}.`
          : `يمكنك التواصل مع عبدالإله مباشرة عبر ${routedEmail}.`;

    return `${channelIntro} كما يمكنك إرسال رسالة خاصة عبر نموذج Agent Abdulelah أو صفحة التواصل. ستجد أزرار التواصل المناسبة بالأسفل.`;
  }

  if (includesAny(normalized, ["مقال", "مقالات", "كتب عن"])) {
    return [
      "كتب عبدالإله مقالات عن بناء أنظمة AI عملية، ومنها موضوعات مثل Context Engineering و AI Agents والأمن الرقمي الاستباقي والتخطيط الحضري الذكي.",
      "",
      "يمكنك استعراض المقالات من زر الإجراءات بالأسفل."
    ].join("\n");
  }

  if (includesAny(normalized, ["chatub", "شات"])) {
    return [
      "ChatUB هو مشروع تخرج قاده عبدالإله لبناء مساعد أكاديمي محلي لطلاب جامعة بيشة.",
      "",
      "يركز المشروع على:",
      "- استخدام المصادر الأكاديمية الرسمية",
      "- تطبيقات NLP و LLMs",
      "- البحث الذكي والإجابات المرتبطة بالسياق",
      "- الخصوصية والموثوقية",
      "",
      "أهمية المشروع أنه يوضح قدرة عبدالإله على تحويل احتياج جامعي حقيقي إلى نظام AI عملي."
    ].join("\n");
  }

  if (includesAny(normalized, ["althil", "الظل"])) {
    return [
      "Althil من أقوى أمثلة عبدالإله في Cloud AI والاستدامة.",
      "",
      "يستخدم المشروع خدمات Google Cloud مثل:",
      "- Cloud Run",
      "- BigQuery",
      "- Cloud Storage",
      "- Vertex AI",
      "",
      "الهدف هو دعم قرارات تحسين الراحة الحرارية في المدن باستخدام البيانات والتحليل الذكي."
    ].join("\n");
  }

  if (includesAny(normalized, ["absher", "ابشر", "أبشر", "امن", "الأمن"])) {
    return [
      "Absher Insight AI هو مفهوم للأمن الرقمي الاستباقي شارك فيه عبدالإله.",
      "",
      "يركز على:",
      "- UEBA وتحليل السلوك",
      "- اكتشاف الأنماط غير المعتادة",
      "- توقع المخاطر قبل وقوع الحوادث",
      "- عرض النتائج في لوحة معلومات تساعد على اتخاذ القرار"
    ].join("\n");
  }

  if (includesAny(normalized, ["كلاود", "سحابة", "cloud", "google cloud", "azure"])) {
    return [
      "لدى عبدالإله خبرة تطبيقية في Cloud AI من خلال مشاريع تستخدم Google Cloud و Azure AI Services.",
      "",
      "أبرز مثال هو Althil، ويشمل:",
      "- Cloud Run",
      "- BigQuery",
      "- Cloud Storage",
      "- Vertex AI",
      "",
      "كما يضيف مشروع Qanouni خبرة في Azure AI Services وتكامل النماذج."
    ].join("\n");
  }

  if (includesAny(normalized, ["اقوي مشروع", "افضل مشروع", "مشاريعه", "مشاريع"])) {
    return [
      "أقوى نقطة بداية في مشاريع عبدالإله هي:",
      "",
      "- ChatUB: مساعد أكاديمي محلي يعتمد على NLP و LLMs",
      "- Althil: منصة Cloud AI للاستدامة باستخدام Google Cloud",
      "- Absher Insight AI: مفهوم للأمن الرقمي الاستباقي وتحليل السلوك",
      "",
      "هذه المشاريع توضح تنوع خبرته وقدرته على بناء حلول مرتبطة بسياق حقيقي."
    ].join("\n");
  }

  if (includesAny(normalized, ["يعرف", "مهارات", "خبرته", "وش عنده", "وش يميز"])) {
    return [
      "يركز عبدالإله على بناء حلول AI تطبيقية مرتبطة بمشكلات حقيقية.",
      "",
      "من أبرز مهاراته:",
      "- Python وتكامل واجهات API",
      "- NLP و LLM Applications",
      "- Cloud AI باستخدام Google Cloud و Azure AI Services",
      "- AI Agents والبحث الذكي",
      "- تحليل البيانات ولوحات المعلومات",
      "",
      "يمكنك استعراض المشاريع والسيرة من أزرار الإجراءات بالأسفل."
    ].join("\n");
  }

  return [
    "عبدالإله الخثعمي خريج نظم معلومات ومهتم ببناء حلول ذكاء اصطناعي تطبيقية.",
    "",
    "يركز عمله على:",
    "- أنظمة AI تعليمية مثل ChatUB",
    "- حلول Cloud AI مثل Althil باستخدام Google Cloud",
    "- مفاهيم الأمن الرقمي الاستباقي مثل Absher Insight AI",
    "- تطبيقات NLP و LLMs و AI Agents",
    "",
    "للتوظيف، أفضل نقطة قوة لديه هي أنه يبني نماذج عملية مرتبطة بسياق حقيقي."
  ].join("\n");
}

export function getFallbackAgentResponse(
  message: string,
  sessionContext: AgentSessionContext = EMPTY_AGENT_SESSION_CONTEXT
) {
  const safety = classifyAgentMessage(message);

  if (!safety.allowed) {
    return getSafetyRefusal(safety, message);
  }

  const resolvedMessage = resolveAgentFollowUp(message, sessionContext);
  const continueResponse = getContinueFallbackResponse(
    message,
    sessionContext
  );
  const projectFollowUpResponse = getProjectFollowUpResponse(
    message,
    sessionContext
  );

  if (continueResponse) {
    return continueResponse;
  }

  if (projectFollowUpResponse) {
    return projectFollowUpResponse;
  }

  if (containsArabic(message)) {
    if (isCvRecommendationRequest(resolvedMessage)) {
      return getArabicCvRecommendationResponse(
        getCvRecommendation(resolvedMessage)
      );
    }

    const mentionedProjects = getMentionedProjectProfiles(resolvedMessage);

    if (isProjectComparisonRequest(resolvedMessage)) {
      return mentionedProjects.length >= 2
        ? getArabicProjectComparisonResponse(mentionedProjects)
        : getProjectComparisonMenuResponse();
    }

    return getArabicFallbackAgentResponse(resolvedMessage);
  }

  const normalized = resolvedMessage.toLowerCase();
  const recruiterRole = getRecruiterRoleProfile(resolvedMessage);
  const mentionedProjects = getMentionedProjectProfiles(resolvedMessage);
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

  if (isPortfolioTourRequest(resolvedMessage)) {
    return getPortfolioTourResponse();
  }

  if (isProjectComparisonRequest(resolvedMessage)) {
    return isProjectComparisonMenuRequest(resolvedMessage)
      ? getProjectComparisonMenuResponse()
      : getProjectComparisonResponse(mentionedProjects);
  }

  if (
    isProjectExplainerRequest(resolvedMessage) &&
    mentionedProjects.length === 0
  ) {
    return getProjectExplainerMenuResponse();
  }

  if (mentionedProjects.length > 0) {
    return getProjectExplanationResponse(
      mentionedProjects[0],
      getRequestedProjectDepth(resolvedMessage)
    );
  }

  if (isRecruiterModeRequest(resolvedMessage)) {
    return getRecruiterModeResponse();
  }

  if (recruiterRole) {
    return getRecruiterRoleResponse(recruiterRole);
  }

  if (isCvRecommendationRequest(resolvedMessage)) {
    return getCvRecommendationResponse(getCvRecommendation(resolvedMessage));
  }

  if (isGeneralHiringFitRequest(resolvedMessage)) {
    return getRecruiterRoleResponse(
      getRecruiterRoleProfile("General Hiring Fit")!
    );
  }

  if (
    includesAny(normalized, ["context engineering", "context matters", "prompts"]) ||
    (wantsBlog && includesAny(normalized, ["ai agent", "agents"]))
  ) {
    return `${blogPostSummary("why-context-matters-more-than-prompts-in-ai-agents")} It explains that agent quality depends on the full environment around the model: trusted knowledge, memory, tools, policies, user history, and evaluation, not prompt wording alone.`;
  }

  if (wantsBlog && includesAny(normalized, ["chatub", "academic", "university"])) {
    return `${blogPostSummary("local-ai-systems-and-the-future-of-university-services")} It relates directly to ChatUB, Abdulelah's local AI academic assistant concept for University of Bisha students.`;
  }

  if (
    wantsBlog &&
    includesAny(normalized, ["althil", "thermal", "shade", "sustainability", "urban"])
  ) {
    return `${blogPostSummary("how-ai-can-support-smarter-urban-planning")} It connects to Althil and its cloud-supported approach to urban thermal comfort decisions.`;
  }

  if (
    wantsBlog &&
    includesAny(normalized, ["absher", "security", "ueba", "risk"])
  ) {
    return `${blogPostSummary("from-reactive-security-to-predictive-ai-security")} It connects to Absher Insight AI and its privacy-conscious behavioral analytics concept.`;
  }

  if (wantsBlog && includesAny(normalized, ["student", "students"])) {
    return `${blogPostSummary("what-every-student-should-know-about-ai-in-2026")} Students may also find "From Chatbots to AI Agents: What Actually Changed?" useful as an accessible foundation.`;
  }

  if (
    wantsBlog ||
    includesAny(normalized, ["what should i read first", "where should i start"])
  ) {
    return `Start with ${blogPostSummary("why-context-matters-more-than-prompts-in-ai-agents")} For a simpler foundation, continue with "From Chatbots to AI Agents: What Actually Changed?" Non-technical readers can begin with "AI for Non-Technical People: A Simple Mental Model."`;
  }

  if (includesAny(normalized, ["chatub", "academic", "university"])) {
    return `${projectSummary("chatub")} ChatUB uses official university academic content to provide context-aware guidance while emphasizing privacy, reliability, and a local AI architecture. It was Abdulelah's graduation project.`;
  }

  if (
    includesAny(normalized, [
      "althil",
      "thermal",
      "shade",
      "google cloud",
      "sustainability"
    ])
  ) {
    return `${projectSummary("althil")} Built during the KFUPM x Google Cloud Intelligent Planet Hackathon, Althil is the strongest portfolio example for cloud AI: Cloud Run, BigQuery, Cloud Storage, Vertex AI, maps, heat visualization, image analysis, and conversational insights support urban thermal comfort decisions.`;
  }

  if (includesAny(normalized, ["absher", "security", "ueba", "risk"])) {
    return `${projectSummary("absher-insight-ai")} Built during the Absher Tuwaiq Hackathon, the concept focuses on proactive digital security using synthetic data, UEBA, behavioral analytics, anomaly detection, risk prediction, and a decision-support dashboard.`;
  }

  if (
    includesAny(normalized, ["cv", "resume", "ai engineer profile", "ai specialist profile"]) ||
    (normalized.includes("compare") &&
      includesAny(normalized, ["ai engineer", "ai specialist", "profile"]))
  ) {
    return getCvRecommendationResponse(getCvRecommendation(resolvedMessage));
  }

  if (includesAny(normalized, ["cloud", "azure", "vertex", "bigquery", "cloud run"])) {
    return "Abdulelah has hands-on cloud AI exposure across Google Cloud and Azure AI Services. Althil is the strongest cloud-native example, using Cloud Run, BigQuery, Cloud Storage, and Vertex AI. Qanouni adds Azure AI Services, NLP, model integration, and cloud deployment planning.";
  }

  if (includesAny(normalized, ["nlp", "llm", "ai agent", "generative ai"])) {
    return "Abdulelah's NLP and LLM work is grounded in applied systems. ChatUB combines NLP, LLM-based response generation, intelligent search, and official academic knowledge. Qanouni uses NLP and Azure AI Services for accessible legal guidance. Althil includes a conversational layer for explaining cloud-generated insights. His portfolio also lists AI Agents as a developing skill area.";
  }

  if (includesAny(normalized, ["qanouni", "legal", "labor rights"])) {
    return `${projectSummary("qanouni")} Qanouni helps private sector employees understand labor rights and legal procedures through accessible AI guidance using Azure AI Services, NLP, model integration, and cloud deployment planning.`;
  }

  if (includesAny(normalized, ["medad", "fintech", "financial inclusion", "banking"])) {
    return `${projectSummary("medad")} Medad explores financial inclusion through AI-driven insights, dashboards, data visualization, and personalized recommendations for underserved communities.`;
  }

  if (includesAny(normalized, ["virtual astronauts", "vr", "space", "astronaut"])) {
    return `${projectSummary("virtual-astronauts")} Virtual Astronauts combines VR and AI-generated learning content to make universe exploration more interactive and engaging.`;
  }

  if (resolveContactChannel(resolvedMessage) === "business") {
    return `For consulting, freelance, or business inquiries, you can email Abdulelah directly at ${getContactEmail("business")}. He builds practical, applied AI systems across education, cloud sustainability, security, legal tech, and fintech, and can scope a solution to your needs. You can also send a private message through the contact form. Use the action buttons below to email him or open the contact form.`;
  }

  if (includesAny(normalized, ["contact", "email", "reach", "connect"])) {
    const channel = resolveContactChannel(resolvedMessage);
    const routedEmail = getContactEmail(channel);
    const channelIntro =
      channel === "recruitment"
        ? `For roles and recruitment, email Abdulelah at ${routedEmail}.`
        : channel === "business"
          ? `For consulting, freelance, or business inquiries, email Abdulelah at ${routedEmail}.`
          : `You can email Abdulelah directly at ${routedEmail}.`;

    return `${channelIntro} You can also send a private message through Agent Abdulelah or the contact page. He is based in ${siteConfig.location}. Use the action buttons below to email him, open the contact form, or view his LinkedIn.`;
  }

  if (includesAny(normalized, ["hire", "recruiter", "different", "fresh graduate"])) {
    return getRecruiterRoleResponse(
      getRecruiterRoleProfile("General Hiring Fit")!
    );
  }

  if (includesAny(normalized, ["strongest", "best project", "projects", "portfolio"])) {
    return "Start with three projects: ChatUB for local NLP and LLM-based academic assistance, Althil for Google Cloud and sustainability decision support, and Absher Insight AI for proactive security analytics. Together they show project leadership, cloud AI exposure, and applied problem-solving across distinct domains.";
  }

  if (includesAny(normalized, ["30 seconds", "quick summary", "summarize", "summary", "who is"])) {
    return "Abdulelah Alkhathami is a Riyadh-based Information Systems graduate and AI Engineer focused on LLM applications, RAG-style assistants, AI automation concepts, cloud services, dashboards, and domain-aware product thinking. His portfolio includes six applied AI projects and experience from national hackathons, including KFUPM x Google Cloud, Absher x Tuwaiq, and SDAIA x Microsoft programs.";
  }

  return "Abdulelah Alkhathami is an AI Engineer focused on practical, context-aware AI systems, LLM applications, automation concepts, and cloud AI. His portfolio spans six applied projects across education, cloud sustainability, digital security, legal tech, fintech, and immersive learning. A strong starting point is ChatUB, Althil, and Absher Insight AI, followed by the resume page for role-specific CV versions.";
}
