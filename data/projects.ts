export type Project = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  problem: string;
  solution: string;
  role: string;
  responsibilities: string[];
  technologies: string[];
  features: string[];
  impact: string;
  year: string;
  context?: string;
  technicalApproach: string[];
  lessons?: string;
  quote?: string;
  gallery: string[];
  links?: {
    github?: string;
    demo?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "chatub",
    title: "ChatUB - Local AI Academic Assistant",
    category: "Education AI / Local AI / NLP / LLMs",
    shortDescription:
      "A local AI academic assistant for University of Bisha students, designed to answer questions based on official academic regulations, procedures, and documents.",
    problem:
      "University students often struggle to access accurate academic information because regulations, procedures, and announcements are distributed across multiple sources. Answers may differ depending on who students ask, while students need fast, clear, and reliable guidance.",
    solution:
      "ChatUB was designed as a local AI academic assistant for University of Bisha students. Instead of giving generic answers, it uses official university academic content to provide context-aware responses aligned with real regulations and procedures.",
    role: "Project Leader",
    responsibilities: [
      "Defined the product vision and problem scope",
      "Led the team throughout the graduation project",
      "Made the strategic decision to build ChatUB as a local AI system",
      "Focused on privacy, reliability, and future institutional adoption",
      "Guided the design of the AI behavior and content structure",
      "Balanced accuracy, simplicity, scalability, and contextual understanding"
    ],
    technologies: [
      "AI",
      "NLP",
      "LLMs",
      "Intelligent Search",
      "Local AI System",
      "Knowledge Structuring"
    ],
    features: [
      "Academic question answering",
      "Context-aware responses",
      "University-specific knowledge",
      "Privacy-conscious local architecture",
      "Simple student-friendly interface"
    ],
    impact:
      "ChatUB demonstrated how AI can support university students when it is designed around context, privacy, and trusted information sources.",
    year: "2025",
    technicalApproach: [
      "NLP to understand student questions",
      "LLM-based response generation",
      "Intelligent search over official academic content",
      "Local AI system approach to improve privacy and reliability",
      "Structured knowledge based on University of Bisha academic documents"
    ],
    quote:
      "Real innovation starts when technology respects context, privacy, and real human needs.",
    gallery: [
      "Student question flow",
      "Academic knowledge structure",
      "Local AI response layer"
    ]
  },
  {
    slug: "althil",
    title: "Althil - Urban Thermal Comfort Decision-Support Platform",
    category: "Sustainability / Google Cloud / AI for Good",
    shortDescription:
      "A decision-support platform for improving urban thermal comfort by helping planners identify effective shade canopy locations based on sun paths, heat exposure, and location data.",
    context:
      "Developed during the Intelligent Planet Hackathon hosted by KFUPM in collaboration with Google Cloud.",
    problem:
      "Urban planners need better tools to understand heat exposure and identify where shade canopies can improve thermal comfort over time. Traditional planning may not fully account for sun paths, location data, and changing heat exposure patterns.",
    solution:
      "Althil helps planners identify where shade canopies would be most effective based on sun paths, heat exposure, and location data.",
    role: "Backend Developer & Cloud Architecture Contributor",
    responsibilities: [
      "Contributed to backend development",
      "Supported the cloud architecture direction",
      "Integrated analysis services across the platform",
      "Worked with the team under hackathon constraints",
      "Helped connect location data, analysis, and explainable insights"
    ],
    technologies: [
      "Google Cloud Run",
      "BigQuery",
      "Cloud Storage",
      "Vertex AI",
      "Maps",
      "Heat Visualization",
      "Image Analysis"
    ],
    features: [
      "Interactive map-based planning",
      "Heat exposure visualization",
      "Shade canopy recommendation support",
      "AI-powered analysis",
      "Report and asset storage",
      "Conversational explanation layer"
    ],
    impact:
      "Althil supports sustainable cooling strategies by helping cities improve comfort without increasing energy consumption.",
    year: "2026",
    technicalApproach: [
      "Google Cloud Run for scalable backend services",
      "BigQuery for analytical data processing",
      "Cloud Storage for reports and assets",
      "Vertex AI for intelligent analysis and recommendations",
      "Map-based interaction and heat visualization",
      "Conversational agent for explaining insights"
    ],
    lessons:
      "This project strengthened experience in cloud-native design, data-driven decision-making, and cross-functional collaboration under real constraints.",
    gallery: [
      "Thermal comfort map",
      "Shade recommendation view",
      "Cloud analysis pipeline"
    ]
  },
  {
    slug: "absher-insight-ai",
    title: "Absher Insight AI - Proactive Digital Security Platform",
    category: "AI Security / Government Tech / UEBA",
    shortDescription:
      "An AI-driven proactive digital security concept designed to predict risks before incidents occur by analyzing behavioral patterns and anomalies.",
    context: "Developed during Absher Tuwaiq Hackathon.",
    problem:
      "Many digital security systems are reactive. They respond after suspicious activity or incidents occur. Government digital systems need smarter approaches that can identify risk patterns earlier.",
    solution:
      "Absher Insight AI is an AI-driven digital security concept focused on proactive risk prediction rather than reactive incident response.",
    role: "AI Security Solution Contributor",
    responsibilities: [
      "Contributed to the proactive AI security concept",
      "Helped shape behavior-based risk scenarios",
      "Supported dashboard and decision-support thinking",
      "Focused on privacy-by-design analysis using synthetic data"
    ],
    technologies: [
      "AI",
      "UEBA",
      "Synthetic Data",
      "Behavioral Analytics",
      "Dashboard Design",
      "Anomaly Detection"
    ],
    features: [
      "User behavior pattern analysis",
      "Risk prediction",
      "Anomaly detection",
      "Adaptive behavioral analytics",
      "Security dashboard",
      "Decision-support insights"
    ],
    impact:
      "The project presented a vision for a new generation of government digital security: smarter, proactive, and sustainable.",
    year: "2025",
    technicalApproach: [
      "Privacy-by-design synthetic data environment",
      "Realistic user behavior simulation",
      "UEBA behavioral analytics",
      "Anomaly detection",
      "Scenario-based security testing",
      "Interactive dashboard for decision support"
    ],
    quote: "True innovation does not wait for the perfect moment. It creates it.",
    gallery: [
      "Behavior risk model",
      "Security dashboard concept",
      "Synthetic scenario testing"
    ]
  },
  {
    slug: "qanouni",
    title: "Qanouni - AI Legal Advisor",
    category: "LegalTech / AI Advisor",
    shortDescription:
      "An AI-powered legal advisor system designed to help private sector employees understand labor rights and legal procedures.",
    problem:
      "Private sector employees often struggle to understand labor rights, legal procedures, and workplace regulations.",
    solution:
      "Qanouni simplifies labor-related legal information through an AI advisor that explains rights, procedures, and next steps in accessible language.",
    role: "AI Developer / Solution Architect",
    responsibilities: [
      "Designed the AI advisor flow",
      "Mapped user needs into legal guidance scenarios",
      "Worked on model integration and cloud service alignment",
      "Structured responses for clarity and responsible use"
    ],
    technologies: [
      "Azure AI Services",
      "NLP",
      "AI Chatbot",
      "Data Analysis",
      "Model Integration",
      "Cloud Deployment"
    ],
    features: [
      "Legal question answering",
      "Labor rights guidance",
      "Simplified legal explanations",
      "AI-powered recommendations"
    ],
    impact:
      "Qanouni helps users better understand legal rights and procedures through accessible AI guidance.",
    year: "2024",
    technicalApproach: [
      "Azure AI Services for intelligent language capabilities",
      "NLP for understanding labor-related questions",
      "AI chatbot interface for guided support",
      "Data analysis for structuring common legal needs",
      "Model integration and cloud deployment planning"
    ],
    gallery: [
      "Legal advisor conversation",
      "Rights guidance flow",
      "Recommendation layer"
    ]
  },
  {
    slug: "medad",
    title: "Medad - Financial Inclusion Banking App",
    category: "Fintech / AI Analytics",
    shortDescription:
      "A financial inclusion banking app designed to support underserved communities using AI-driven insights and personalized recommendations.",
    problem:
      "Underserved communities may face barriers to accessing financial services and personalized banking guidance.",
    solution:
      "Medad promotes financial inclusion through a banking app concept that uses AI-driven insights, intelligent dashboards, and personalized recommendations.",
    role: "AI & Dashboard Developer",
    responsibilities: [
      "Contributed to AI-driven insight design",
      "Built dashboard concepts for decision visibility",
      "Supported data visualization and recommendation logic",
      "Connected product goals with inclusive user needs"
    ],
    technologies: [
      "AI Analytics",
      "Power BI",
      "Data Visualization",
      "Dashboard Design",
      "Scalable Platform Architecture"
    ],
    features: [
      "Personalized financial recommendations",
      "Intelligent dashboards",
      "AI-driven insights",
      "User-friendly banking experience"
    ],
    impact:
      "Medad shows how AI can make financial services more inclusive and personalized.",
    year: "2025",
    technicalApproach: [
      "AI analytics for user and service insights",
      "Power BI dashboards for decision visibility",
      "Data visualization for financial behavior patterns",
      "Scalable platform architecture planning"
    ],
    gallery: [
      "Financial insight dashboard",
      "Personal recommendation view",
      "Inclusion product flow"
    ]
  },
  {
    slug: "virtual-astronauts",
    title: "Virtual Astronauts - VR + AI Educational Experience",
    category: "VR / AI Education",
    shortDescription:
      "An immersive VR and AI educational experience for exploring the universe through dynamic AI-generated content.",
    problem:
      "Traditional science education can feel static and less engaging for complex topics like space and astronomy.",
    solution:
      "Virtual Astronauts creates an immersive educational experience that uses VR and AI to help users explore the universe interactively.",
    role: "AI Model Developer",
    responsibilities: [
      "Worked on AI model behavior for learning content",
      "Supported dynamic content generation ideas",
      "Aligned AI outputs with an educational VR experience",
      "Contributed to user experience optimization"
    ],
    technologies: [
      "VR",
      "AI Models",
      "Dynamic Content Generation",
      "Educational Technology",
      "User Experience Optimization"
    ],
    features: [
      "Immersive universe exploration",
      "AI-generated learning content",
      "Interactive educational experience",
      "Engaging science learning environment"
    ],
    impact:
      "The project demonstrated how AI and VR can make education more interactive, memorable, and engaging.",
    year: "2024",
    technicalApproach: [
      "VR environment for immersive exploration",
      "AI models for dynamic learning content",
      "Content generation aligned with educational goals",
      "User experience optimization for engagement"
    ],
    gallery: [
      "VR exploration concept",
      "AI learning content engine",
      "Astronomy education journey"
    ]
  }
];

export const featuredProjects = projects.slice(0, 3);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const projectFilters = [
  "All",
  "AI",
  "NLP",
  "Cloud",
  "Security",
  "Education",
  "Sustainability",
  "FinTech",
  "LegalTech",
  "VR"
];
