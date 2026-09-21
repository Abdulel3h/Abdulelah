import { getBlogPostBySlug } from "@/data/blog";
import { getProject, getProjectBySlug, projectCounts } from "@/data/projects";
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

  return `Read "${post.title}" in Abdulelah's notes. ${post.excerpt} Key takeaway: ${post.content.takeaway}`;
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
    const arabic = getProject(profile.slug, "ar");

    if (!arabic) {
      return null;
    }

    if (kind === "technologies") {
      return [
        `التقنيات المستخدمة في ${profile.shortName}:`,
        ...arabic.technologies.map((technology) => `- ${technology}`),
        ...(arabic.technologiesNote ? ["", arabic.technologiesNote] : [])
      ].join("\n");
    }

    if (kind === "role") {
      return [
        `دور عبدالإله في ${profile.shortName}: ${arabic.role}.`,
        "",
        ...arabic.responsibilities.slice(0, 4).map((responsibility) => `- ${responsibility}`)
      ].join("\n");
    }

    if (kind === "impact") {
      return `ما تحقق في ${profile.shortName}: ${arabic.outcome}`;
    }

    if (kind === "technical") {
      return [
        `شرح تقني مختصر لـ ${profile.shortName}:`,
        ...arabic.approach.map((step) => `- ${step}`),
        "",
        `الحالة: ${arabic.statusDetail}`
      ].join("\n");
    }

    return [
      `ملخص ${profile.shortName} لمسؤول التوظيف:`,
      `- المجال: ${arabic.domain}`,
      `- دور عبدالإله: ${arabic.role}`,
      `- الحالة: ${arabic.statusDetail}`,
      `- أبرز التقنيات: ${arabic.technologies.join("، ")}`,
      `- النتيجة: ${arabic.outcome}`,
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
      const project = getProject(profile.slug, "ar");

      return project
        ? [
            profile.shortName,
            `- المجال: ${project.domain}`,
            `- دور عبدالإله: ${project.role}`,
            `- الحالة: ${project.statusDetail}`,
            `- التقنيات: ${project.technologies.slice(0, 5).join("، ")}`,
            ...(index < profiles.length - 1 ? [""] : [])
          ]
        : [];
    })
  ].join("\n");
}

function getArabicProjectExplanation(profile: ProjectGuideProfile) {
  const project = getProject(profile.slug, "ar");

  if (!project) {
    return "";
  }

  return [
    `${project.name} — ${project.descriptor}`,
    "",
    project.summary,
    "",
    `- دور عبدالإله: ${project.role}`,
    `- الحالة: ${project.statusDetail}`,
    `- التقنيات: ${project.technologies.join("، ")}`,
    `- النتيجة الموثّقة: ${project.outcome}`,
    `- أبرز القيود: ${project.limitations[0] ?? ""}`,
    project.links.github ? "- الكود منشور في مستودع عام على GitHub." : "- لا يوجد كود منشور لهذا المشروع."
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

  if (includesAny(normalized, ["كود", "مستودع", "github", "جيت هب", "المصدر"])) {
    return [
      `لدى عبدالإله ${projectCounts.publicRepositories} مشاريع بكود منشور في مستودعات عامة على GitHub:`,
      "",
      "- ChatUB: مساعد أكاديمي عربي يعمل محليًا (مشروع تخرج، نموذج أولي عامل)",
      "- Absher Insight AI: رصد مخاطر سلوكية بقواعد قابلة للتفسير على بيانات اصطناعية (نموذج أولي في هاكاثون)",
      "- Stadium: مراقبة الحشود عند بوابات الملاعب بالرؤية الحاسوبية (نموذج أولي عامل بناه منفردًا)",
      "",
      "أما Althil فكوده غير منشور، وQanouni وVirtual Astronauts وMedad تصوّرات دون كود منشور."
    ].join("\n");
  }

  if (includesAny(normalized, ["تواصل", "اتواصل", "ايميل", "لينكد"])) {
    const channel = resolveContactChannel(message);
    const routedEmail = getContactEmail(channel);
    const channelIntro =
      channel === "recruitment"
        ? `للوظائف والتوظيف، تواصل مع عبدالإله عبر ${routedEmail}.`
        : channel === "business"
          ? `للاستشارات والأعمال، تواصل مع عبدالإله عبر ${routedEmail}.`
          : `يمكنك التواصل مع عبدالإله مباشرة عبر ${routedEmail}.`;

    return `${channelIntro} كما يمكنك إرسال رسالة خاصة عبر نموذج Abdulelah's guide أو صفحة التواصل. ستجد أزرار التواصل المناسبة بالأسفل.`;
  }

  if (includesAny(normalized, ["مقال", "مقالات", "كتب عن"])) {
    return [
      "كتب عبدالإله مقالات عن بناء أنظمة AI عملية، ومنها موضوعات مثل Context Engineering و AI Agents والأمن الرقمي الاستباقي والتخطيط الحضري الذكي.",
      "",
      "يمكنك استعراض المقالات من زر الإجراءات بالأسفل."
    ].join("\n");
  }

  const mentioned = getMentionedProjectProfiles(message)[0];

  if (mentioned) {
    return getArabicProjectExplanation(mentioned);
  }

  if (includesAny(normalized, ["كلاود", "سحابة", "cloud", "google cloud", "azure"])) {
    return [
      "أبرز خبرة سحابية لعبدالإله هي Althil، النموذج الأولي الذي بناه مع فريقه في هاكاثون الكوكب الذكي مع Google Cloud.",
      "",
      "- جُهّزت الأنظمة الخلفية في حاوية للعمل على Google Cloud Run.",
      "- تضمّن تصميم الهاكاثون BigQuery وCloud Storage وVertex AI، لكن الكود غير منشور فلا يمكن التحقق منه علنًا.",
      "- Qanouni تصوّر خُطّط له حول خدمات Azure AI دون تنفيذ منشور."
    ].join("\n");
  }

  if (includesAny(normalized, ["اقوي مشروع", "افضل مشروع", "مشاريعه", "مشاريع"])) {
    return [
      "أقوى نقطة بداية هي المشاريع الثلاثة التي يمكن التحقق منها في الكود:",
      "",
      "- ChatUB: مساعد أكاديمي عربي يعمل محليًا — مشروع تخرج قاده، ونموذج أولي عامل",
      "- Stadium: مراقبة الحشود عند البوابات بالرؤية الحاسوبية — نموذج أولي عامل بناه منفردًا",
      "- Absher Insight AI: رصد مخاطر سلوكية بقواعد قابلة للتفسير — نموذج أولي في هاكاثون",
      "",
      "ولا يُدّعى أن أيًا منها قيد التشغيل الفعلي؛ حالة كل مشروع وقيوده مذكورة في دراسة الحالة."
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
    "عبدالإله الخثعمي مطوّر منتجات ذكاء اصطناعي في الرياض، وخريج نظم المعلومات من جامعة بيشة.",
    "",
    `في أعماله ${projectCounts.total} مشاريع تطبيقية: ${projectCounts.prototypes} نماذج أولية عاملة (${projectCounts.publicRepositories} منها بكود منشور) و${projectCounts.concepts} تصوّرات.`,
    "- ChatUB: مساعد أكاديمي عربي يعمل محليًا (مشروع تخرج قاده)",
    "- Stadium: مراقبة الحشود بالرؤية الحاسوبية (بناه منفردًا)",
    "- Absher Insight AI: رصد مخاطر سلوكية قابل للتفسير (هاكاثون)",
    "",
    "ووصل مع فريقه إلى أفضل 30 في برنامج AthkaU من سدايا ومايكروسوفت."
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
    return `${blogPostSummary("local-ai-systems-and-the-future-of-university-services")} It relates directly to ChatUB, the local Arabic academic assistant prototype Abdulelah led for University of Bisha students.`;
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
    return `${blogPostSummary("from-reactive-security-to-predictive-ai-security")} It connects to Absher Insight AI, his explainable behavioural-risk prototype built on synthetic data.`;
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

  if (includesAny(normalized, ["github", "code", "repository", "repositories", "source"])) {
    return "Three projects have public repositories on GitHub: ChatUB (Arabic academic assistant with local generation — graduation project, working prototype), Absher Insight AI (explainable behavioural-risk flags on synthetic data — hackathon prototype) and Stadium (computer-vision gate monitoring — solo working prototype). Althil's code is not public, and Qanouni, Virtual Astronauts and Medad are concepts without public code.";
  }

  if (includesAny(normalized, ["stadium", "crowd", "gate", "computer vision", "yolo"])) {
    return `${projectSummary("stadium")} It is a solo working prototype that runs on local video or a webcam; it has not been calibrated for a real venue, and no counting-accuracy figure is claimed.`;
  }

  if (includesAny(normalized, ["chatub", "academic", "university"])) {
    return `${projectSummary("chatub")} It was Abdulelah's graduation project, which he led: a working prototype that matches Arabic questions to curated FAQ entries and generates the answer with a locally served model. It has not been deployed to students, and no accuracy figure is claimed.`;
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
    return `${projectSummary("althil")} It is a hackathon prototype built with a team at the KFUPM x Google Cloud Intelligent Planet Hackathon: sun-path and heat analysis, street-imagery analysis and shade recommendations, with the backend containerised for Cloud Run. The code is not public, so the BigQuery, Cloud Storage and Vertex AI parts of the design cannot be verified here.`;
  }

  if (includesAny(normalized, ["absher", "security", "ueba", "risk"])) {
    return `${projectSummary("absher-insight-ai")} It is a hackathon prototype from the Absher Tuwaiq Hackathon with public code: explainable, rule-based risk flags on synthetic data and an operations dashboard. It is not affiliated with Absher or any government entity and is not a deployed system.`;
  }

  if (
    includesAny(normalized, ["cv", "resume", "ai engineer profile", "ai specialist profile"]) ||
    (normalized.includes("compare") &&
      includesAny(normalized, ["ai engineer", "ai specialist", "profile"]))
  ) {
    return getCvRecommendationResponse(getCvRecommendation(resolvedMessage));
  }

  if (includesAny(normalized, ["cloud", "azure", "vertex", "bigquery", "cloud run"])) {
    return "Abdulelah's main cloud evidence is Althil, a Google Cloud hackathon prototype whose backend was containerised for Cloud Run; the design also called for BigQuery, Cloud Storage and Vertex AI, but the code is not public. Qanouni is a concept planned around Azure AI Services.";
  }

  if (includesAny(normalized, ["nlp", "llm", "ai agent", "generative ai"])) {
    return "Abdulelah's clearest NLP and LLM evidence is ChatUB: Arabic preprocessing, multilingual sentence-embedding retrieval over curated FAQs and answer generation with a locally served model (public code, working prototype). Qanouni is a concept designed around Azure AI language services. His skills list AI agents as a developing area.";
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

    return `${channelIntro} You can also send a private message through Abdulelah's guide or the contact page. He is based in ${siteConfig.location}. Use the action buttons below to email him, open the contact form, or view his LinkedIn.`;
  }

  if (includesAny(normalized, ["hire", "recruiter", "different", "fresh graduate"])) {
    return getRecruiterRoleResponse(
      getRecruiterRoleProfile("General Hiring Fit")!
    );
  }

  if (includesAny(normalized, ["strongest", "best project", "projects", "portfolio"])) {
    return "Start with the three projects you can verify in code: ChatUB (Arabic academic assistant with local generation — graduation project he led), Stadium (computer-vision gate monitoring — solo working prototype) and Absher Insight AI (explainable security analytics on synthetic data — hackathon prototype). None is claimed to be in production; each case study lists its status and limitations.";
  }

  if (includesAny(normalized, ["30 seconds", "quick summary", "summarize", "summary", "who is"])) {
    return "Abdulelah Alkhathami is an AI product builder in Riyadh — agents, RAG and Arabic AI — and an Information Systems graduate of the University of Bisha. His portfolio has seven applied AI projects: four working prototypes (three with public code: ChatUB, Absher Insight AI and Stadium) and three concepts. He reached the Top 30 of SDAIA x Microsoft's AthkaU and has built prototypes at national hackathons, including KFUPM x Google Cloud and Absher x Tuwaiq.";
  }

  return "Abdulelah Alkhathami is an AI product builder focused on practical, context-aware AI. His portfolio spans seven applied projects across education, security, computer vision, sustainability, legal tech, fintech and immersive learning — four working prototypes and three concepts. A strong starting point is ChatUB, Stadium and Absher Insight AI (all with public code), followed by the resume page for the two role-specific CVs.";
}
