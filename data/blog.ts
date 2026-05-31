export type BlogPost = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  audience: string[];
  tags: string[];
  date: string;
  readingTime: string;
  featured?: boolean;
  sourceType: "original" | "curated" | "global-pulse";
  sourceName?: string;
  sourceUrl?: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      bullets?: string[];
    }[];
    takeaway: string;
  };
};

export const blogCategories = [
  "All",
  "AI Agents",
  "AI Fundamentals",
  "Education AI",
  "AI Security",
  "AI for Sustainability",
  "AI for Students",
  "AI for Everyone",
  "AI Product Thinking"
];

export const blogAudiences = [
  "Everyone",
  "Students",
  "Developers",
  "Business",
  "Recruiters",
  "Decision-makers"
];

export const blogPosts: BlogPost[] = [
  {
    slug: "why-context-matters-more-than-prompts-in-ai-agents",
    title: "Why Context Matters More Than Prompts in AI Agents",
    subtitle:
      "The strongest AI agents are shaped by what they can see, remember, use, and safely do.",
    excerpt:
      "Prompt quality matters, but reliable AI agents depend on context: trusted knowledge, memory, tools, policies, user history, and the environment around the model.",
    category: "AI Agents",
    audience: ["Students", "Developers", "Business"],
    tags: ["AI Agents", "Context Engineering", "LLMs", "RAG", "Memory"],
    date: "2026-05-31",
    readingTime: "6 min read",
    featured: true,
    sourceType: "original",
    content: {
      intro:
        "A clever prompt can improve an answer. It cannot, by itself, turn a language model into a dependable agent. When an AI system needs to support real work, the more important question is not only what instruction it received. The question is what useful context surrounded that instruction.",
      sections: [
        {
          heading: "A prompt is only one layer",
          body:
            "A prompt tells the model what to do now. Context engineering decides what the system knows before it responds, what it can retrieve, which tools it may call, and where it must stop. This is the difference between a polished demo and a system people can trust.",
          bullets: [
            "System rules define purpose, tone, and boundaries.",
            "Knowledge retrieval brings the right documents into the moment.",
            "Memory preserves useful history without exposing unnecessary data.",
            "Tools let the agent act on verified systems instead of guessing."
          ]
        },
        {
          heading: "Context changes the quality of decisions",
          body:
            "Imagine two university assistants answering the same student question. One sees only a generic prompt. The other can search official regulations, identify the student's situation, respect privacy rules, and explain where its answer came from. The second assistant is not better because its wording is more creative. It is better because its environment is more responsible."
        },
        {
          heading: "The practical agent stack",
          body:
            "A useful agent usually combines a model with a small set of deliberate layers. Each layer should earn its place by improving accuracy, safety, or usability.",
          bullets: [
            "Instructions: what the agent is for and what it must not do.",
            "Retrieval: the trusted knowledge sources available for the task.",
            "Memory: the minimum useful history needed for continuity.",
            "Tools: the actions the agent is allowed to perform.",
            "Evaluation: checks that reveal when the agent is uncertain or wrong."
          ]
        },
        {
          heading: "Build the environment, not only the prompt",
          body:
            "Teams often spend too long tuning prompt phrases while the real gaps sit elsewhere: missing documents, unclear permissions, weak tool definitions, or no feedback loop. Prompt design still matters. It works best as one part of a wider context strategy."
        }
      ],
      takeaway:
        "A reliable AI agent is a model inside a well-designed environment. Better context, clearer boundaries, and trusted tools usually create more value than endlessly rewriting a prompt."
    }
  },
  {
    slug: "local-ai-systems-and-the-future-of-university-services",
    title: "Local AI Systems and the Future of University Services",
    subtitle:
      "University assistants become more useful when they understand institutional context and treat privacy as a design requirement.",
    excerpt:
      "ChatUB offers a practical example of why universities need context-aware, privacy-conscious AI assistants grounded in official academic knowledge.",
    category: "Education AI",
    audience: ["Students", "Universities", "Decision-makers"],
    tags: ["Local AI", "Education", "Privacy", "ChatUB", "NLP"],
    date: "2026-05-30",
    readingTime: "6 min read",
    sourceType: "original",
    content: {
      intro:
        "University services contain a surprising amount of friction. Students need quick answers about procedures, regulations, and academic decisions, but the relevant information may be spread across documents, portals, and offices. AI can help, provided the system is designed around the university's real context.",
      sections: [
        {
          heading: "Generic answers are not enough",
          body:
            "A public chatbot may explain a general academic concept, but students often need institution-specific guidance. They need to know which regulation applies, what the next step is, and where to verify the answer. A useful university assistant must be grounded in official content."
        },
        {
          heading: "What ChatUB was designed to explore",
          body:
            "ChatUB, Abdulelah's graduation project, was designed as a local AI academic assistant for University of Bisha students. Its direction focused on official academic documents, context-aware responses, and a privacy-conscious architecture rather than generic question answering.",
          bullets: [
            "Use trusted university knowledge as the response foundation.",
            "Explain procedures in student-friendly language.",
            "Keep institutional privacy and reliability visible in the architecture.",
            "Create a foundation that could support future university adoption."
          ]
        },
        {
          heading: "Local AI is a strategic choice",
          body:
            "Local does not automatically mean perfect, and every deployment still needs careful evaluation. But local or institution-controlled AI can give universities more control over sensitive data, knowledge updates, system behavior, and governance decisions."
        },
        {
          heading: "Start with high-value, bounded services",
          body:
            "The best early university use cases are often narrow enough to evaluate clearly: academic FAQs, procedure navigation, document search, student-service triage, and staff knowledge support. A focused assistant can be more valuable than a broad assistant that tries to answer everything."
        }
      ],
      takeaway:
        "University AI should be designed as a trusted service layer: grounded in official knowledge, clear about its limits, and thoughtful about privacy from the beginning."
    }
  },
  {
    slug: "from-chatbots-to-ai-agents-what-actually-changed",
    title: "From Chatbots to AI Agents: What Actually Changed?",
    subtitle:
      "The shift is not about a new label. It is about systems that can use tools, follow workflows, and support decisions.",
    excerpt:
      "A chatbot answers. An AI agent can work through a goal using context, tools, rules, and a defined workflow. Here is the difference without the jargon.",
    category: "AI Fundamentals",
    audience: ["Everyone", "Students", "Business"],
    tags: ["Chatbots", "AI Agents", "Automation", "Tools"],
    date: "2026-05-29",
    readingTime: "5 min read",
    sourceType: "original",
    content: {
      intro:
        "The words chatbot and AI agent are often used as if they mean the same thing. They overlap, but the distinction matters. Understanding it helps teams choose the right level of complexity for the problem they actually have.",
      sections: [
        {
          heading: "A chatbot focuses on conversation",
          body:
            "A chatbot usually receives a message and returns a response. It may answer FAQs, explain information, or guide a user through a known set of options. For many services, that is exactly what is needed."
        },
        {
          heading: "An agent can move through a workflow",
          body:
            "An agent is designed to work toward a goal. It may decide which source to consult, use a tool, compare results, ask for missing information, or stop when a rule requires human review.",
          bullets: [
            "Retrieve a document before answering a policy question.",
            "Check a system before reporting an order status.",
            "Summarize options and flag uncertainty for a decision-maker.",
            "Follow a sequence of approved steps without skipping controls."
          ]
        },
        {
          heading: "More capability creates more responsibility",
          body:
            "Every additional tool or workflow step creates new questions. What is the agent allowed to access? Which actions require confirmation? How are errors detected? When should a human take over? Good agent design is as much about boundaries as it is about intelligence."
        },
        {
          heading: "Choose the simplest useful system",
          body:
            "Not every problem needs an autonomous workflow. A clear retrieval assistant may solve a user need better than a complex agent. The goal is not to add the most advanced label. The goal is to build the smallest dependable system that creates value."
        }
      ],
      takeaway:
        "The meaningful change from chatbot to agent is controlled action: using context and tools to support a goal while respecting explicit boundaries."
    }
  },
  {
    slug: "how-ai-can-support-smarter-urban-planning",
    title: "How AI Can Support Smarter Urban Planning",
    subtitle:
      "Data, cloud services, and explainable AI can help cities make more informed decisions about thermal comfort.",
    excerpt:
      "Althil shows how AI can help urban planners reason about heat exposure, sun paths, and shade locations to support more comfortable cities.",
    category: "AI for Sustainability",
    audience: ["Cities", "Students", "Decision-makers"],
    tags: ["AI for Good", "Sustainability", "Cloud AI", "Althil", "Smart Cities"],
    date: "2026-05-28",
    readingTime: "6 min read",
    sourceType: "original",
    content: {
      intro:
        "Cities face practical questions that sit at the intersection of data, environment, and human experience. Where would shade improve pedestrian comfort most? How can planners compare locations over time? AI is useful here when it supports a decision rather than pretending to replace the planner.",
      sections: [
        {
          heading: "Urban comfort is a decision problem",
          body:
            "Heat exposure is not uniform. Different locations experience different patterns based on time, sun paths, surrounding structures, and how people move through a place. Planning better shade requires a view that is both spatial and analytical."
        },
        {
          heading: "What Althil explored",
          body:
            "Althil was developed during the KFUPM x Google Cloud Intelligent Planet Hackathon. The platform concept helps planners identify effective shade canopy locations using heat exposure, sun paths, location data, visual analysis, and conversational explanations.",
          bullets: [
            "Maps for place-based interaction.",
            "Heat visualization for clearer planning conversations.",
            "Cloud analysis for handling structured location data.",
            "AI-supported recommendations that remain explainable to users."
          ]
        },
        {
          heading: "Cloud AI can connect the layers",
          body:
            "A cloud-native architecture can connect analytics, reports, storage, visualization, and an explanation layer. In Althil, services such as Cloud Run, BigQuery, Cloud Storage, and Vertex AI shaped the proposed technical direction."
        },
        {
          heading: "AI should make the decision easier to inspect",
          body:
            "The most valuable planning systems do not hide behind a score. They help users understand why a location may matter, compare scenarios, and bring human judgment into the final decision."
        }
      ],
      takeaway:
        "AI can support smarter cities when it turns environmental data into understandable decision support, while keeping planners in control of the final choice."
    }
  },
  {
    slug: "from-reactive-security-to-predictive-ai-security",
    title: "From Reactive Security to Predictive AI Security",
    subtitle:
      "Behavioral signals can help security teams identify unusual patterns earlier and investigate with better context.",
    excerpt:
      "AI security can move beyond reacting after incidents by using behavioral analytics, anomaly detection, and decision-support dashboards to surface risk patterns earlier.",
    category: "AI Security",
    audience: ["Cybersecurity", "Government", "Decision-makers"],
    tags: ["AI Security", "UEBA", "Anomaly Detection", "Absher Insight AI"],
    date: "2026-05-27",
    readingTime: "6 min read",
    sourceType: "original",
    content: {
      intro:
        "Security systems often become visible after something has already gone wrong. A suspicious login, unusual sequence of actions, or sudden pattern change may be noticed only when a rule is triggered. AI can help teams investigate risk earlier by looking at behavior in context.",
      sections: [
        {
          heading: "Predictive does not mean certain",
          body:
            "AI should not be treated as a machine that predicts incidents with perfect certainty. Its value is narrower and more practical: it can surface patterns that deserve attention, prioritize investigation, and give analysts a stronger starting point."
        },
        {
          heading: "Behavior adds useful context",
          body:
            "User and Entity Behavior Analytics, often called UEBA, compares activity patterns over time. When behavior changes in an unusual way, a security team can inspect the signal alongside other evidence.",
          bullets: [
            "Detect unusual access patterns or sequences.",
            "Compare activity against an established baseline.",
            "Prioritize signals by risk instead of treating every alert equally.",
            "Give analysts a dashboard for informed review."
          ]
        },
        {
          heading: "What Absher Insight AI explored",
          body:
            "Absher Insight AI was developed as a proactive digital security concept during the Absher Tuwaiq Hackathon. The concept used synthetic data, behavioral analytics, anomaly detection, and dashboard thinking to explore privacy-conscious risk prediction."
        },
        {
          heading: "Human review remains essential",
          body:
            "Security AI should support analysts, not make unexplained judgments about people. Teams need transparent signals, careful governance, privacy protections, and review paths for false positives."
        }
      ],
      takeaway:
        "Predictive AI security is most credible when it helps humans notice meaningful risk patterns earlier, with privacy, transparency, and review built into the system."
    }
  },
  {
    slug: "what-every-student-should-know-about-ai-in-2026",
    title: "What Every Student Should Know About AI in 2026",
    subtitle:
      "AI literacy is becoming a practical advantage in every field, not only in computer science.",
    excerpt:
      "A practical guide for students from any major: understand what AI can do, use it responsibly, and build career advantage through better questions and real projects.",
    category: "AI for Students",
    audience: ["Students", "Everyone"],
    tags: ["AI Learning", "Careers", "Skills", "Productivity"],
    date: "2026-05-26",
    readingTime: "7 min read",
    sourceType: "original",
    content: {
      intro:
        "Students do not need to become machine-learning researchers to benefit from AI. They do need a clear mental model, responsible habits, and enough practical experience to recognize where AI helps and where it can mislead.",
      sections: [
        {
          heading: "Start with literacy, not hype",
          body:
            "Learn the basic vocabulary: models, prompts, context, retrieval, hallucinations, privacy, evaluation, and automation. You do not need advanced mathematics to begin. You need to understand what kind of system you are using and what evidence supports its answer."
        },
        {
          heading: "Use AI as a thinking partner",
          body:
            "AI can help you outline, compare, practice, explain, and revise. It should not replace your judgment or produce work you cannot defend. The strongest users ask better questions and verify the important parts.",
          bullets: [
            "Ask for explanations at different levels of difficulty.",
            "Use AI to identify gaps in your understanding.",
            "Verify claims with trusted course or domain sources.",
            "Avoid sharing private academic, personal, or organizational data."
          ]
        },
        {
          heading: "Build one small project in your domain",
          body:
            "A business student might analyze a service workflow. A design student might prototype a clearer AI experience. An information-systems student might build a knowledge assistant. Small applied projects show that you can connect AI to a real need."
        },
        {
          heading: "Career advantage comes from combinations",
          body:
            "The most interesting opportunities often sit between fields: AI and education, AI and finance, AI and sustainability, AI and public services. Your existing specialty becomes more valuable when you understand how AI can support it responsibly."
        }
      ],
      takeaway:
        "Students should treat AI as a new layer of professional literacy: learn the concepts, protect privacy, verify important outputs, and build something useful in your own field."
    }
  },
  {
    slug: "ai-for-non-technical-people-a-simple-mental-model",
    title: "AI for Non-Technical People: A Simple Mental Model",
    subtitle:
      "Think of AI as a system that combines input, context, tools, and boundaries to produce a useful result.",
    excerpt:
      "A plain-language model for understanding AI products without getting lost in jargon, whether you run a business, study another field, or make decisions.",
    category: "AI for Everyone",
    audience: ["Everyone", "Business"],
    tags: ["AI Basics", "Productivity", "Decision-making"],
    date: "2026-05-25",
    readingTime: "5 min read",
    sourceType: "original",
    content: {
      intro:
        "AI explanations can become complicated too quickly. A simpler model is often more useful: an AI product takes an input, combines it with context and allowed tools, and produces an output inside a set of boundaries.",
      sections: [
        {
          heading: "Four parts are enough to begin",
          body:
            "You can understand many AI products by asking four questions.",
          bullets: [
            "Input: what question, document, image, or signal enters the system?",
            "Context: what useful background information can the system see?",
            "Tools: what can the system search, calculate, or update?",
            "Boundaries: what must it avoid, confirm, or send to a human?"
          ]
        },
        {
          heading: "A familiar example",
          body:
            "Consider an AI assistant for a university. A student's question is the input. Official academic regulations are context. Search is a tool. Privacy rules and escalation paths are boundaries. The model matters, but the whole system creates the service."
        },
        {
          heading: "Ask value questions before technology questions",
          body:
            "Business teams do not need to begin by choosing a model. Begin with the workflow. Where do people lose time? Which decisions need better information? What mistakes would be costly? Which data is sensitive?"
        },
        {
          heading: "Look for a clear role for humans",
          body:
            "Credible AI products make human responsibility visible. People should know when an answer needs review, how to correct the system, and what the system is not designed to decide."
        }
      ],
      takeaway:
        "You do not need deep technical knowledge to ask good AI questions. Focus on the input, context, tools, boundaries, and the human decision that the system is meant to support."
    }
  },
  {
    slug: "building-ai-products-accuracy-is-not-enough",
    title: "Building AI Products: Accuracy Is Not Enough",
    subtitle:
      "A credible AI product must earn trust through reliability, privacy, usability, evaluation, and honest boundaries.",
    excerpt:
      "Good AI products need more than an accurate model. They need reliable workflows, clear UX, privacy choices, feedback loops, evaluation, and a plan for uncertainty.",
    category: "AI Product Thinking",
    audience: ["Developers", "Business", "Product", "Recruiters"],
    tags: ["AI Evaluation", "UX", "Trust", "Privacy", "Deployment"],
    date: "2026-05-24",
    readingTime: "7 min read",
    sourceType: "original",
    content: {
      intro:
        "A model can perform well in a test and still produce a weak product. Users experience a whole system: the interface, response time, privacy choices, failure states, explanations, and the moment when a human needs to step in.",
      sections: [
        {
          heading: "Accuracy is one metric, not the product",
          body:
            "Teams should measure whether answers are useful and correct, but also whether the system behaves consistently under real conditions. A product that is impressive in a demo and confusing in ordinary use will not create durable value."
        },
        {
          heading: "Trust is designed into the workflow",
          body:
            "Users need signals that help them judge an AI output. That may include source references, visible uncertainty, review steps, plain-language explanations, and careful limits on what the AI can do.",
          bullets: [
            "Reliability: does the product behave consistently?",
            "Privacy: is data handled with deliberate limits?",
            "UX: can users understand what happened and what to do next?",
            "Evaluation: are mistakes measured and improved over time?",
            "Boundaries: does the system stop when human judgment is needed?"
          ]
        },
        {
          heading: "Deployment changes the questions",
          body:
            "Once an AI product leaves the prototype stage, teams need to monitor performance, costs, errors, user feedback, and changing knowledge. The product needs an operating model, not only a model endpoint."
        },
        {
          heading: "Good AI products are honest",
          body:
            "The best experiences do not overstate what AI can do. They make the system's purpose clear, communicate uncertainty, and give users a practical next step when the AI reaches its limit."
        }
      ],
      takeaway:
        "Build AI as a dependable product, not a model showcase. Accuracy matters most when it is joined by privacy, usability, evaluation, and clear human responsibility."
    }
  }
];

export const featuredBlogPost =
  blogPosts.find((post) => post.featured) ?? blogPosts[0];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric"
  }).format(new Date(date));
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  return blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.category === post.category ? 4 : 0) +
        candidate.tags.filter((tag) => post.tags.includes(tag)).length +
        candidate.audience.filter((audience) => post.audience.includes(audience))
          .length
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
