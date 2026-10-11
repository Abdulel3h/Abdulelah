/**
 * English copy for the site's compositions (components/site).
 *
 * Same shape and the same density as the Arabic (./ar.ts): one short line
 * where the Arabic has one short line. Written as plain English, not a
 * translation, and reusing the existing English wording where it was already
 * right (lib/i18n/dictionaries/en.ts). Every fact restates data/projects.ts,
 * data/achievements.ts or data/site.ts — nothing is added to them.
 */
import type { ProjectBrief, SiteCopy } from "./ar";

export const enBriefs: Record<string, ProjectBrief> = {
  chatub: {
    line: "An Arabic academic assistant for University of Bisha students, with every step running on a local machine.",
    problem: "University rules are spread across documents and offices, and the answer can depend on who you ask.",
    built: "A Flask app matches each question to the closest FAQ entry by meaning; a local model served by Ollama writes the answer.",
    role: "I led the graduation team from idea to working prototype, and chose to keep retrieval and generation on the machine.",
    result: "A working prototype with public code. Not deployed to students, and no accuracy figure is claimed."
  },
  althil: {
    line: "Suggests where urban planners should add shade, from the sun’s path, the heat at a site and a photo of it.",
    problem: "Street heat shifts with the sun’s path, and static plans rarely account for it.",
    built:
      "One FastAPI app computes sun position and a 0–100 heat-risk score, recommends a shade type and exports a report, in a container ready for Cloud Run.",
    role: "I built the backend and merged the analysis services into one deployable app, as part of a hackathon team.",
    result: "A hackathon prototype with public code. Urban density is simulated, and no measured cooling effect is claimed."
  },
  "absher-insight-ai": {
    line: "Flags risky sign-in behaviour early, with rules that explain every alert — built on synthetic data.",
    problem:
      "An account takeover looks like a valid sign-in from an unusual place or hour, and an analyst needs to know why it was flagged.",
    built: "A FastAPI service scores each access event with rules that state their reasons, and feeds an operations dashboard as events arrive.",
    role: "I helped shape the proactive-security idea and the risk scenarios, and supported the dashboard design and decision logic.",
    result: "A runnable prototype with public code. Not affiliated with any government entity, and no accuracy figures are claimed."
  },
  stadium: {
    line: "Counts people at stadium gates from video, flags crowding early and suggests where to move staff.",
    problem: "Crowding at an entrance turns dangerous before anyone has counted it, and gate staff only see their own queue.",
    built: "YOLO detects people in each frame, a decision engine sets the status of four gates, and a dashboard refreshes every two seconds.",
    role: "I built it solo: the detection, the decision engine, the API and the dashboard.",
    result: "A working prototype with public code. Not calibrated for a real venue, and no counting accuracy is claimed."
  },
  qanouni: {
    line: "A concept for an advisor that explains labour rights to private-sector employees in plain language.",
    problem: "Many employees don’t know their labour rights, or what to do next.",
    built: "An advisor design that maps an employee’s question to the right labour-law topic, built around Azure AI language services.",
    role: "I designed the advisor’s path from a question to clear next steps, and wrote its answers for responsible use.",
    result: "One of two ideas that took the team to the AthkaU Top 30. A concept, with no published prototype."
  },
  "virtual-astronauts": {
    line: "A concept for a VR experience, narrated by AI, for learning space science.",
    problem: "Science can feel static, especially subjects as hard to picture as space.",
    built: "A VR environment for exploring the universe, with AI-generated narration that follows what the learner looks at.",
    role: "I designed how the learning content is generated and narrated, and fitted it to the learning journey.",
    result: "Reached the AthkaU Top 30 alongside Qanouni. A concept, with no published build."
  },
  medad: {
    line: "A banking-app concept that turns spending data into clear guidance for the people banks overlook.",
    problem: "Underserved groups rarely get financial guidance that fits their situation.",
    built: "Dashboard and recommendation designs that turn analytics into insight instead of raw numbers.",
    role: "I helped design the insights and dashboard concepts, and tied the product goals to what users need.",
    result: "A product concept with dashboard designs. No published prototype."
  }
};

export const enCopy: SiteCopy = {
  quote: { open: "“", close: "”" },
  header: {
    homeAria: "Abdulelah Alkhathami — home",
    search: "Search",
    searchAria: "Search the site",
    menu: "Menu",
    contact: "Contact",
    otherLanguage: "العربية",
    otherLanguageShort: "عربي"
  },
  menu: {
    title: "Site menu",
    close: "Close",
    quick: "Shortcuts",
    guide: "The 30-second summary, from the guide",
    elsewhere: "Elsewhere",
    readOther: "اقرأ بالعربية"
  },
  home: {
    kicker: "AI product builder · Riyadh",
    statement: {
      before: "I turn",
      gloss1: "AI",
      middle: "into",
      gloss2: "products",
      gloss3: "people understand",
      end: "."
    },
    notes: {
      1: "LLM · Agents · RAG · Computer Vision",
      2: "{total} projects, {code} with public code",
      3: "Arabic first, with privacy by design"
    },
    notesLabel: "Margin notes",
    primary: "View selected work",
    secondary: "Choose a CV",
    portraitAlt: "Portrait of Abdulelah Alkhathami",
    stripLabel: "On this page",
    work: {
      kicker: "Selected work",
      title: "Four working prototypes.",
      titleSoft: "Public code, limits in writing.",
      role: "Role",
      status: "Status",
      code: "Code",
      noCode: "No public code",
      howItWorks: "How it works",
      caseStudy: "Case study",
      openCode: "Open the code"
    },
    concepts: {
      title: "And three concepts",
      body: "Ideas designed and presented, with no published prototype — and labelled that way.",
      all: "All projects"
    },
    recognition: {
      kicker: "Milestones",
      title: "Where the work was tested.",
      all: "All recognition",
      built: "Built there"
    },
    belief: {
      kicker: "What I believe",
      statement:
        "Adding intelligence to a product is easy. The hard part is keeping it calm, clear and trustworthy — until people forget there’s a machine behind it."
    },
    closing: {
      kicker: "Next step",
      title: "Have an idea or an opening?",
      titleSoft: "Write to me. I reply personally.",
      resume: "Resume and CVs",
      contactPage: "Contact form"
    }
  },
  projects: {
    kicker: "Projects",
    title: "Seven projects.",
    titleSoft: "Four working, three concepts.",
    filterLabel: "Filter projects",
    filters: { all: "All", working: "Working, with public code", concept: "Concepts" },
    count: "{n} of 7",
    listLabel: "All projects",
    previewLabel: "Project preview",
    open: "Open the case study"
  },
  caseStudy: {
    all: "All projects",
    inLines: "In brief",
    problem: "The problem",
    built: "What was built",
    role: "My role",
    result: "Outcome",
    how: "How it works",
    decisions: "Decisions that shaped it",
    honest: "The honest part",
    notClaimed: "Not claimed",
    limitations: "Limits today",
    next: "If it continued",
    evidence: "What you can verify",
    stack: "Stack",
    full: "The full record",
    fullHint: "Context, constraints and engineering notes, as written.",
    context: "Context",
    constraints: "Constraints",
    responsibilities: "Responsibilities",
    approach: "Engineering notes",
    nextProject: "Next project",
    previousProject: "Previous",
    discuss: "Discuss similar work",
    year: "Year",
    code: "Code",
    stages: ["Input", "Processing", "Intelligence", "Output"]
  },
  about: {
    kicker: "About",
    title: "I build things that didn’t exist yesterday.",
    lede: "I’m Abdulelah, from Riyadh. I take a messy, real problem and turn it into something people can use.",
    portraitAlt: "Portrait of Abdulelah Alkhathami",
    facts: [
      { label: "Education", value: "Information Systems — University of Bisha, 2026" },
      { label: "Focus", value: "LLM · Agents · RAG · Arabic NLP" },
      { label: "City", value: "Riyadh" }
    ],
    thinkKicker: "How I think",
    think: [
      { title: "Context before the model", body: "I start with the place and the people, then choose the technology." },
      { title: "The smallest thing that works", body: "A simple system that runs beats a perfect plan on paper." },
      { title: "Privacy from the start", body: "Local processing, and synthetic data when it’s needed." },
      { title: "Honest about limits", body: "I call a prototype a prototype, and a concept a concept." }
    ],
    pathKicker: "The path",
    pathTitle: "From a first hackathon final to seven projects.",
    toolsKicker: "What I work with",
    toolsTitle: "The tools, when the work calls for them.",
    toolsCore: "Strongest",
    toolsPractical: "Used in projects",
    toolsAll: "All skills",
    linksKicker: "Find me here",
    cv: "Resume",
    quote: "Real innovation starts when technology respects context, privacy, and real human needs."
  },
  resume: {
    kicker: "Resume",
    title: "The short version.",
    lede: "Everything that matters in thirty seconds — then choose the CV that fits the role.",
    glanceLabel: "At a glance",
    versionsKicker: "Two CVs",
    evidenceTitle: "Evidence before the CV",
    evidenceBody: "Four projects with public code say more than any page.",
    evidenceCta: "See the projects"
  },
  contact: {
    kicker: "Contact",
    title: "Let’s build something.",
    lede: "Hiring, collaborating or a question about a project. Messages reach my inbox, and I reply personally.",
    direct: "The direct line",
    elsewhere: "Elsewhere",
    basedIn: "Riyadh, Saudi Arabia",
    formTitle: "Or leave a short message",
    guideTitle: "In a hurry?",
    guideBody: "Ask the guide. It knows the work and can point you to the right project or CV."
  },
  skills: {
    kicker: "Skills",
    title: "What I build with — and how far.",
    lede: "No bars, no percentages. An honest read: where I’m strongest, what I’ve actually used, and what I’m still learning.",
    closing: "Skills show in the work.",
    closingCta: "See the projects"
  },
  achievements: {
    kicker: "Recognition",
    title: "Where the work was tested.",
    lede: "Hackathons and national programs where the ideas had to hold up.",
    built: "Built there",
    closing: "The next challenge is the interesting one.",
    closingCta: "Get in touch"
  },
  notes: {
    kicker: "Notes",
    title: "I write about what I build.",
    lede: "Practical notes on agents, language models, privacy and building AI products.",
    featured: "Start here",
    library: "All notes",
    read: "Read",
    takeaway: "Takeaway",
    related: "Read next",
    all: "All notes",
    askGuide: "Ask the guide about this note",
    source: "Source",
    audienceSeparator: ", "
  },
  privacy: {
    kicker: "Privacy",
    contactTitle: "A question about privacy?",
    contactBody: "Email me directly. I reply personally."
  },
  footer: {
    line: "I build AI products, and state each project’s evidence and limits.",
    riyadh: "Riyadh",
    timeLabel: "Current time in Riyadh",
    pages: "Pages",
    rights: "All rights reserved"
  }
};
