import { getBlogPostBySlug } from "@/data/blog";
import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/data/site";
import {
  getCvRecommendation,
  getCvRecommendationResponse,
  getRecruiterModeResponse,
  getRecruiterRoleProfile,
  getRecruiterRoleResponse,
  isCvRecommendationRequest,
  isGeneralHiringFitRequest,
  isRecruiterModeRequest
} from "@/lib/agent/recruiter";
import {
  getMentionedProjectProfiles,
  getPortfolioTourResponse,
  getProjectComparisonMenuResponse,
  getProjectComparisonResponse,
  getProjectExplainerMenuResponse,
  getProjectExplanationResponse,
  getRequestedProjectDepth,
  isPortfolioTourRequest,
  isProjectComparisonMenuRequest,
  isProjectComparisonRequest,
  isProjectExplainerRequest
} from "@/lib/agent/project-guide";
import { classifyAgentMessage, getSafetyRefusal } from "@/lib/agent/safety";
import { containsArabic } from "@/lib/text-direction";

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

  if (includesAny(normalized, ["تواصل", "اتواصل", "ايميل", "لينكد", "github"])) {
    return "يمكنك التواصل مع عبدالإله من خلال نموذج الرسائل الخاص أو صفحة التواصل. ستجد خيارات التواصل المناسبة في أزرار الإجراءات بالأسفل.";
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

export function getFallbackAgentResponse(message: string) {
  const safety = classifyAgentMessage(message);

  if (!safety.allowed) {
    return getSafetyRefusal(safety, message);
  }

  if (containsArabic(message)) {
    return getArabicFallbackAgentResponse(message);
  }

  const normalized = message.toLowerCase();
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
    "prompts"
  ]);

  if (isPortfolioTourRequest(message)) {
    return getPortfolioTourResponse();
  }

  if (isProjectComparisonRequest(message)) {
    return isProjectComparisonMenuRequest(message)
      ? getProjectComparisonMenuResponse()
      : getProjectComparisonResponse(mentionedProjects);
  }

  if (isProjectExplainerRequest(message) && mentionedProjects.length === 0) {
    return getProjectExplainerMenuResponse();
  }

  if (mentionedProjects.length > 0) {
    return getProjectExplanationResponse(
      mentionedProjects[0],
      getRequestedProjectDepth(message)
    );
  }

  if (isRecruiterModeRequest(message)) {
    return getRecruiterModeResponse();
  }

  if (recruiterRole) {
    return getRecruiterRoleResponse(recruiterRole);
  }

  if (isCvRecommendationRequest(message)) {
    return getCvRecommendationResponse(getCvRecommendation(message));
  }

  if (isGeneralHiringFitRequest(message)) {
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
    return getCvRecommendationResponse(getCvRecommendation(message));
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

  if (includesAny(normalized, ["contact", "email", "reach", "connect"])) {
    return `You can send Abdulelah a private message through Agent Abdulelah or the contact page. He is based in ${siteConfig.location}. Use the action buttons below to open his LinkedIn profile or GitHub.`;
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
    return "Abdulelah Alkhathami is a Riyadh-based Information Systems graduate, Junior AI Engineer, and AI Solutions Specialist. He builds practical AI systems with NLP, LLM applications, cloud services, dashboards, and domain-aware product thinking. His portfolio includes six applied AI projects and experience from national hackathons, including KFUPM x Google Cloud, Absher x Tuwaiq, and SDAIA x Microsoft programs.";
  }

  return "Abdulelah Alkhathami is a Junior AI Engineer and AI Solutions Specialist focused on practical, context-aware AI systems. His portfolio spans six applied projects across education, cloud sustainability, digital security, legal tech, fintech, and immersive learning. A strong starting point is ChatUB, Althil, and Absher Insight AI, followed by the resume page for role-specific CV versions.";
}
