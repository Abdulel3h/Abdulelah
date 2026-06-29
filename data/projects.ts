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
  /** Punchy product line for the studio showcase. */
  tagline?: string;
  /** Which handcrafted preview to render in the showcase / work index. */
  previewKind?: "chat" | "map" | "security" | "legal" | "fintech" | "vr" | "vision";
  /** Short architecture flow (3–4 steps) shown as connected chips. */
  flow?: string[];
  /** Outcome / signal metrics surfaced in the showcase. */
  metrics?: { value: string; label: string }[];
  /** Real, stated engineering & product decisions — grounded in the work, never invented. */
  decisions?: { title: string; body: string }[];
};

export const projects: Project[] = [
  {
    slug: "chatub",
    tagline: "Every academic answer, grounded in the real regulations.",
    previewKind: "chat",
    links: { github: "https://github.com/Abdulel3h/ChatUB" },
    decisions: [
      {
        title: "Local-first, not cloud",
        body: "I made the call to run ChatUB as a local AI system so student data and university content stay on-prem. Privacy and institutional trust mattered more than the convenience of a hosted model."
      },
      {
        title: "Grounded in official documents",
        body: "Answers are generated from the university's real regulations and procedures — not generic knowledge — so a student gets the same reliable guidance no matter who they ask."
      }
    ],
    flow: ["Student question", "NLP intent", "Retrieve official docs", "Grounded answer"],
    metrics: [
      { value: "Local-first", label: "Runs on-prem for data privacy" },
      { value: "Project Lead", label: "Led the graduation team" },
      { value: "Official sources", label: "Grounded, not generic answers" }
    ],
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
    tagline: "Designing cooler cities, one shaded street at a time.",
    previewKind: "map",
    decisions: [
      {
        title: "Cloud-native on Google Cloud",
        body: "Built on Cloud Run, BigQuery, and Vertex AI so the analysis could scale and stay maintainable — and so the team could move fast inside hackathon time limits."
      },
      {
        title: "Explain, don't just compute",
        body: "Added a conversational layer so planners get the reasoning behind each shade recommendation, not just a score they have to trust blindly."
      }
    ],
    flow: ["Location & sun data", "BigQuery analysis", "Vertex AI scoring", "Shade recommendation"],
    metrics: [
      { value: "Google Cloud", label: "Run · BigQuery · Vertex AI" },
      { value: "KFUPM × GC", label: "Intelligent Planet Hackathon" },
      { value: "Cooling, not cost", label: "Comfort without more energy" }
    ],
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
    tagline: "Security that predicts risk, instead of reacting to it.",
    previewKind: "security",
    links: { github: "https://github.com/Abdulel3h/absher-insight" },
    decisions: [
      {
        title: "Proactive over reactive",
        body: "Designed around predicting risk from behavioural patterns before an incident — rather than the usual model of responding after something has already gone wrong."
      },
      {
        title: "Privacy by design, on synthetic data",
        body: "Modelled everything on synthetic user behaviour so the concept could be tested and demonstrated without ever touching real personal data."
      }
    ],
    flow: ["Behavior signals", "UEBA analytics", "Anomaly detection", "Risk score"],
    metrics: [
      { value: "Proactive", label: "Predict risk before incidents" },
      { value: "Privacy-by-design", label: "Synthetic-data UEBA" },
      { value: "Tuwaiq", label: "Absher security hackathon" }
    ],
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
    tagline: "Labor rights, explained in plain language.",
    previewKind: "legal",
    decisions: [
      {
        title: "Plain language over legal jargon",
        body: "Structured answers to explain labour rights and the next steps in language a non-lawyer can actually act on — the goal was clarity, not sounding legal."
      },
      {
        title: "Guidance, used responsibly",
        body: "Framed responses for responsible use: a way to understand rights and procedures, not a replacement for formal legal advice."
      }
    ],
    flow: ["Worker's question", "Map to labor law", "Azure AI reasoning", "Clear next steps"],
    metrics: [
      { value: "Azure AI", label: "Language understanding" },
      { value: "Plain language", label: "Rights made readable" },
      { value: "Guided steps", label: "Not just answers" }
    ],
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
    tagline: "Banking that includes everyone.",
    previewKind: "fintech",
    decisions: [
      {
        title: "Inclusion-first",
        body: "Designed the experience around underserved users who are usually an afterthought in banking products — the people who need guidance the most."
      },
      {
        title: "Insight over raw data",
        body: "Turned analytics into clear, personalized recommendations through dashboards, instead of handing people raw numbers to decode."
      }
    ],
    flow: ["User & spend data", "AI analytics", "Personalized insight", "Inclusive guidance"],
    metrics: [
      { value: "Inclusion", label: "Built for the underserved" },
      { value: "Power BI", label: "Insight dashboards" },
      { value: "Personalized", label: "AI recommendations" }
    ],
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
    tagline: "Step inside the universe to learn it.",
    previewKind: "vr",
    decisions: [
      {
        title: "Immersion over lecture",
        body: "Chose an explorable VR environment so learners experience the universe directly, instead of reading about it and hoping it sticks."
      },
      {
        title: "Living, AI-generated content",
        body: "Used AI to generate dynamic learning content aligned to the experience, so it stays fresh and engaging rather than a fixed script."
      }
    ],
    flow: ["VR environment", "AI content engine", "Dynamic narration", "Guided exploration"],
    metrics: [
      { value: "Immersive", label: "Learn by exploring" },
      { value: "AI-generated", label: "Living content" },
      { value: "Engagement", label: "Memorable science" }
    ],
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
  },
  {
    slug: "stadium",
    tagline: "See the crowd forming before it becomes a crush.",
    previewKind: "vision",
    links: { github: "https://github.com/Abdulel3h/Stadium" },
    decisions: [
      {
        title: "Vision over new hardware",
        body: "Used computer vision on ordinary camera feeds instead of installing new sensors — cheaper to deploy and it works with the cameras a venue already has."
      },
      {
        title: "Recommend an action, not just an alarm",
        body: "The decision engine doesn't only flag a busy gate — it recommends where to move staff, so the output is something an operator can act on immediately."
      }
    ],
    flow: ["Camera feed", "YOLO detection", "Zone & status logic", "Live dashboard & alerts"],
    metrics: [
      { value: "Real-time", label: "~2s dashboard refresh" },
      { value: "4 zones", label: "Configurable gate areas" },
      { value: "Solo build", label: "End to end by Abdulelah" }
    ],
    title: "Stadium - Crowd & Gate Monitoring with Computer Vision",
    category: "Computer Vision / Operations / Safety",
    shortDescription:
      "A computer-vision system that watches stadium gate zones in real time, flags crowding before it becomes dangerous, and recommends how to redistribute staff.",
    problem:
      "Crowd build-up at stadium gates can turn dangerous quickly, and staff often react only once a zone is already overflowing. Operators need to see congestion forming early enough to act.",
    solution:
      "Stadium uses computer vision to count and track people across gate zones, classify each gate's status, and recommend where to move staff before a zone overflows.",
    role: "Solo Developer",
    responsibilities: [
      "Built the full system end to end as a solo project",
      "Implemented YOLO-based person detection and per-zone tracking",
      "Designed the decision engine for gate status and alerts",
      "Built the Flask API and the live monitoring dashboard"
    ],
    technologies: [
      "Python",
      "YOLO (Ultralytics)",
      "OpenCV",
      "Flask",
      "NumPy",
      "JavaScript"
    ],
    features: [
      "Real-time person detection across four gate zones",
      "Gate status: normal, busy, critical, overflow",
      "Crowding alerts and incident logging",
      "Staff distribution recommendations",
      "ETA estimation",
      "Live dashboard polling every two seconds"
    ],
    impact:
      "Stadium shows how computer vision on existing cameras can turn a safety blind spot into an early-warning system operators can act on.",
    year: "2026",
    technicalApproach: [
      "YOLO (Ultralytics) for person detection and tracking",
      "Frame-by-frame assignment of people to configurable gate zones",
      "A decision engine that classifies gate status and raises alerts",
      "Flask API exposing live status at /api/status",
      "HTML/JS dashboard polling the API every two seconds"
    ],
    gallery: [
      "Gate zone detection",
      "Crowding decision engine",
      "Live operations dashboard"
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
