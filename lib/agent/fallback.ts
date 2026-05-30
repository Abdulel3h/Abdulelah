import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/data/site";

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

export function getFallbackAgentResponse(message: string) {
  const normalized = message.toLowerCase();

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
    return "Choose the AI Engineer CV for technical roles involving AI development, NLP, LLMs, cloud deployment, and intelligent systems. Choose the AI Specialist CV for roles centered on AI solutions, adoption, analysis, dashboards, and cross-functional implementation. Both versions are available from the resume page.";
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
    return `You can contact Abdulelah at ${siteConfig.email}. He is based in ${siteConfig.location}. You can also review his LinkedIn profile at ${siteConfig.social.linkedin} or GitHub at ${siteConfig.social.github}.`;
  }

  if (includesAny(normalized, ["hire", "recruiter", "different", "fresh graduate"])) {
    return "Abdulelah is an Information Systems graduate and Junior AI Engineer with a portfolio of applied AI systems across education, sustainability, security, legal tech, fintech, and immersive learning. His strongest differentiators are project leadership on ChatUB, hands-on cloud AI work on Althil, security AI thinking through Absher Insight AI, and delivery experience shaped by national hackathons and training programs.";
  }

  if (includesAny(normalized, ["strongest", "best project", "projects", "portfolio"])) {
    return "Start with three projects: ChatUB for local NLP and LLM-based academic assistance, Althil for Google Cloud and sustainability decision support, and Absher Insight AI for proactive security analytics. Together they show project leadership, cloud AI exposure, and applied problem-solving across distinct domains.";
  }

  if (includesAny(normalized, ["30 seconds", "quick summary", "summarize", "summary", "who is"])) {
    return "Abdulelah Alkhathami is a Riyadh-based Information Systems graduate, Junior AI Engineer, and AI Solutions Specialist. He builds practical AI systems with NLP, LLM applications, cloud services, dashboards, and domain-aware product thinking. His portfolio includes six applied AI projects and experience from national hackathons, including KFUPM x Google Cloud, Absher x Tuwaiq, and SDAIA x Microsoft programs.";
  }

  return "Abdulelah Alkhathami is a Junior AI Engineer and AI Solutions Specialist focused on practical, context-aware AI systems. His portfolio spans six applied projects across education, cloud sustainability, digital security, legal tech, fintech, and immersive learning. A strong starting point is ChatUB, Althil, and Absher Insight AI, followed by the resume page for role-specific CV versions.";
}
