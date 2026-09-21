/**
 * English copy for every shared surface and page.
 *
 * Content rules (kept identical in ar.ts):
 * - "Resume" names the page and its navigation item. "CV" names the two
 *   downloadable documents (AI Engineer CV, AI Specialist CV). "Résumé" is
 *   never used.
 * - Project maturity is described with the status labels below only. Nothing
 *   is called shipped, launched, live or in production.
 * - Public repositories are "public code", never "open source": the
 *   repositories carry no licence file.
 */
import type { Locale } from "@/lib/i18n/config";

export const en = {
  locale: "en" as Locale,
  common: {
    name: "Abdulelah Alkhathami",
    firstName: "Abdulelah",
    lastName: "Alkhathami",
    arabicName: "عبدالإله الخثعمي",
    skipToContent: "Skip to main content",
    opensInNewTab: "opens in a new tab",
    backToTop: "Back to top",
    email: "Email",
    location: "Riyadh, Saudi Arabia",
    copyEmail: "Copy email address",
    copy: "Copy email",
    copied: "Copied",
    copyFailed: "Copy failed — select the address instead",
    download: "Download",
    readMore: "Read more",
    homeAria: "Abdulelah Alkhathami — home",
    breadcrumb: "Breadcrumb",
    pdf: "PDF"
  },
  language: {
    label: "Language",
    switchTo: "العربية",
    switchToLabel: "Read this page in Arabic",
    current: "English"
  },
  nav: {
    primary: "Primary",
    home: "Home",
    about: "About",
    projects: "Projects",
    resume: "Resume",
    contact: "Contact",
    more: "More",
    moreLabel: "More pages",
    achievements: "Recognition",
    skills: "Skills",
    notes: "Notes",
    privacy: "Privacy",
    github: "GitHub",
    linkedin: "LinkedIn",
    githubProfile: "GitHub profile",
    linkedinProfile: "LinkedIn profile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Site menu",
    hiringTitle: "Here for hiring?",
    selectedWork: "View selected work",
    chooseCv: "Choose a CV",
    guideSummary: "Get the 30-second summary",
    guideSummaryPrompt: "Give me the 30-second summary of Abdulelah for someone who’s hiring.",
    searchSite: "Search the site",
    startConversation: "Start a conversation"
  },
  search: {
    trigger: "Search",
    shortcut: "Ctrl K",
    title: "Search the site",
    description: "Type to filter pages, projects, notes and actions. Use the arrow keys to move and Enter to open.",
    placeholder: "Search pages, projects and notes…",
    inputLabel: "Search pages, projects and notes",
    empty: "No results. Try a project name, a technology or a page.",
    groups: {
      pages: "Pages",
      projects: "Projects",
      notes: "Notes",
      actions: "Actions"
    },
    actions: {
      askGuide: "Ask Abdulelah’s guide",
      engineerCv: "Download the AI Engineer CV",
      specialistCv: "Download the AI Specialist CV",
      github: "Open GitHub profile",
      email: "Email me@abdulelah.de"
    },
    tip: "Press Ctrl K or ⌘ K anywhere to search.",
    close: "Close search"
  },
  status: {
    live: "Live",
    production: "In production",
    pilot: "Pilot",
    "working-prototype": "Working prototype",
    "graduation-project": "Graduation project",
    "hackathon-prototype": "Hackathon prototype",
    concept: "Concept"
  },
  evidenceType: {
    "public-repository": "Public repository",
    "program-record": "Program record",
    "private-evidence": "Private project evidence"
  },
  projectFacts: {
    role: "Role",
    status: "Status",
    evidence: "Evidence",
    year: "Year",
    domain: "Domain",
    stack: "Stack",
    conceptVisualization: "Concept visualization",
    conceptVisualizationNote: "Illustrative sketch of the idea — not a product screenshot.",
    viewCaseStudy: "Read the case study",
    viewCode: "View code on GitHub",
    discussSimilar: "Discuss similar work"
  },
  home: {
    metaTitle: "Abdulelah Alkhathami — AI Product Builder · Agents, RAG & Arabic AI",
    chapters: {
      label: "Chapters",
      identity: "Identity",
      work: "Work",
      approach: "Approach",
      range: "Range",
      belief: "Belief",
      connect: "Next step"
    },
    metaDescription:
      "Abdulelah Alkhathami is an AI product builder in Riyadh — agents, RAG and Arabic AI. Explore seven applied AI projects, the evidence behind each, and two role-specific CVs.",
    hero: {
      eyebrow: "Riyadh, Saudi Arabia · Open to AI engineering roles & collaborations",
      positioning: "AI Product Builder · Agents, RAG & Arabic AI",
      leadStart: "I design and build",
      leadEmphasis: "intelligent products",
      leadEnd:
        "— where software, AI and considered design meet. From a local Arabic academic assistant to explainable security analytics, I turn real problems into working systems.",
      primary: "View selected work",
      secondary: "Choose a CV",
      tertiary: "About me",
      proofLabel: "At a glance",
      proof: ["7 applied AI projects", "3 with public code", "Top 30 · SDAIA × Microsoft AthkaU"],
      portraitAlt: "Portrait of Abdulelah Alkhathami"
    },
    work: {
      eyebrow: "Selected work",
      title: "A studio of one.",
      titleAccent: "Three projects you can verify in code.",
      intro:
        "Each began as a real problem — in a university, on a security desk, at a stadium gate — and became a working prototype with a public repository.",
      seeAll: "See all seven projects"
    },
    approach: {
      eyebrow: "How I build",
      title: "A way of working, not a job title.",
      principles: [
        {
          title: "Context over hype",
          body: "I start with the environment, not the model. The best system is the one that actually fits the place it serves."
        },
        {
          title: "Privacy by design",
          body: "Trust is a feature. I default to local-first thinking and data practices that respect the people behind the data."
        },
        {
          title: "Working systems first",
          body: "An idea means little until it runs. I build something real, show its limits honestly, then make it sharper."
        },
        {
          title: "Details are the product",
          body: "Craft compounds. The small decisions — wording, timing, spacing — are the ones people actually feel."
        }
      ]
    },
    range: {
      eyebrow: "Range",
      title: "One way of thinking, across very different problems.",
      intro:
        "From a classroom to a city’s heat map to a stadium gate — the domain changes, the care doesn’t. Select a domain to see the project behind it.",
      explore: "Explore",
      domains: [
        {
          label: "Education",
          slug: "chatub",
          blurb: "ChatUB — an Arabic academic assistant built around one university’s own FAQ content, not generic answers."
        },
        {
          label: "Digital security",
          slug: "absher-insight-ai",
          blurb: "Absher Insight AI — explainable rules that flag risky behaviour early, prototyped on synthetic data."
        },
        {
          label: "Computer vision",
          slug: "stadium",
          blurb: "Stadium — people counting at stadium gates that recommends where staff should move."
        },
        {
          label: "Sustainability",
          slug: "althil",
          blurb: "Althil — sun-path and heat analysis to place shade where it improves comfort most."
        },
        {
          label: "Legal",
          slug: "qanouni",
          blurb: "Qanouni — a concept for explaining labour rights in language an employee can act on."
        },
        {
          label: "Immersive learning",
          slug: "virtual-astronauts",
          blurb: "Virtual Astronauts — a VR concept with AI narration for learning space science."
        },
        {
          label: "Fintech",
          slug: "medad",
          blurb: "Medad — an inclusive-banking concept that turns spending data into clear guidance."
        }
      ]
    },
    belief: {
      eyebrow: "What I believe",
      statement:
        "Anyone can add intelligence to a product. The part I care about is making it feel calm, trustworthy, and obvious — so the person on the other side never has to think about the machine at all."
    },
    closing: {
      eyebrow: "Next step",
      title: "Let’s build something worth remembering.",
      intro: "Pick the path that fits why you’re here — each one is a single step away.",
      paths: [
        {
          audience: "Hiring",
          body: "Two CVs — engineering or solutions focused. Choose the one that fits the role.",
          cta: "Choose a CV",
          href: "/resume"
        },
        {
          audience: "Building something",
          body: "Send a short brief about the problem, and I’ll reply with the most relevant work.",
          cta: "Send a project brief",
          href: "/contact"
        },
        {
          audience: "Reviewing code",
          body: "Three projects have public repositories with architecture notes and honest limitations.",
          cta: "Open GitHub",
          href: "github"
        }
      ],
      direct: "Or write directly:"
    }
  },
  projectsPage: {
    metaTitle: "Projects",
    metaDescription:
      "Seven applied AI projects by Abdulelah Alkhathami — four working prototypes and three concepts — each with its role, status and evidence.",
    eyebrow: "The work",
    title: "Seven projects. Seven real problems.",
    intro:
      "Four are working prototypes — three with public code — and three are concepts. Every case study states the role, the evidence and the limits.",
    instruction: "Select a project to explore the system, role, and evidence.",
    listLabel: "All projects",
    previewLabel: "Project preview",
    open: "Open"
  },
  caseStudy: {
    backToProjects: "All projects",
    sections: {
      context: "Context",
      problem: "The problem",
      constraints: "Constraints",
      solution: "Solution",
      responsibility: "My responsibility",
      architecture: "Architecture & workflow",
      decisions: "Decisions",
      outcome: "Verified outcome",
      limitations: "Limitations",
      next: "What would come next"
    },
    architectureNotes: "How it works",
    evidence: {
      title: "Evidence",
      intro: "What a reviewer can check today — and what is not claimed.",
      statusLabel: "Status",
      itemsLabel: "Evidence",
      notClaimed: "Not claimed",
      stack: "Stack"
    },
    conceptTitle: "The idea, sketched",
    lessonLabel: "Looking back",
    relatedTitle: "Related projects",
    closingTitle: "Working on something similar?",
    closingBody:
      "Tell me about the problem, or pick the CV that fits the role — either way you’ll get a direct reply.",
    closingPrimary: "Discuss similar work",
    closingSecondary: "Choose a CV",
    notFoundTitle: "Project not found"
  },
  about: {
    metaTitle: "About",
    metaDescription:
      "Abdulelah Alkhathami is an AI product builder from Riyadh — how he thinks, how he works, and the path from his first hackathon to seven applied AI projects.",
    eyebrow: "About",
    title: "I build things",
    titleAccent: "that didn’t exist yesterday.",
    intro:
      "I’m Abdulelah — an AI product builder from Riyadh. I like taking a messy, real-world problem and turning it into something people can pick up and use.",
    portraitAlt: "Portrait of Abdulelah Alkhathami",
    whoEyebrow: "Who I am",
    whoTitle: "A builder, first.",
    who: [
      "I studied Information Systems at the University of Bisha, but I learned the most by building — across education, security, sustainability, computer vision, legal guidance, fintech and immersive learning. Some of that work became working prototypes; some remains concepts, and I label it that way.",
      "Those projects taught me that good products are shaped by domain understanding as much as technology. The model is never the point; the person on the other side of the screen is.",
      "I led ChatUB as my graduation project, built prototypes at national hackathons, and reached the Top 30 of SDAIA × Microsoft’s AthkaU. I’m happiest with an unsolved problem in front of me."
    ],
    cueTitle: "Prefer the two-minute version?",
    cueBody: "Ask the guide how Abdulelah thinks, what he cares about and where he’s strongest.",
    cuePrompt: "Give me the two-minute overview of who Abdulelah is, how he thinks, and where he’s strongest.",
    cueCta: "Give me the overview",
    pathEyebrow: "The path",
    pathTitle: "From a first hackathon final to seven applied AI projects.",
    workEyebrow: "How I work",
    workTitle: "The way a problem becomes a product.",
    approach: [
      {
        title: "Understand the context",
        body: "I start with the environment, not the model. Who is affected, what they trust, what already exists — that’s where the real design lives."
      },
      {
        title: "Find the real problem",
        body: "The stated problem is rarely the actual one. I keep asking until the friction is obvious and the goal is sharp."
      },
      {
        title: "Build the smallest thing that works",
        body: "A rough system that runs beats a perfect plan that doesn’t. I get to something real, fast, and learn from it."
      },
      {
        title: "Refine until it feels effortless",
        body: "Then I sweat the details — wording, timing, spacing — until the whole thing feels calm and obvious to use."
      }
    ],
    toolsEyebrow: "What I reach for",
    toolsTitle: "The tools, when the work calls for them.",
    toolsIntro: "Not a checklist — just what I keep close. Anything marked core is where I’m strongest.",
    core: "core",
    quote: "Real innovation starts when technology respects context, privacy, and real human needs.",
    closingTitle: "If you’re building something that matters, let’s talk.",
    closingBody: "Hiring, collaborating or just curious how something was made — I’d like to hear from you.",
    closingPrimary: "Start a conversation",
    closingSecondary: "See the work"
  },
  resume: {
    metaTitle: "Resume",
    metaDescription:
      "Abdulelah Alkhathami at a glance — focus, education, evidence and recognition — plus two role-specific CVs to download.",
    eyebrow: "Resume",
    title: "The short version.",
    intro: "Everything important in thirty seconds — then choose the CV that fits the role you’re hiring for.",
    glanceLabel: "At a glance",
    glance: [
      { label: "Now", value: "AI product builder — agents, RAG and Arabic AI" },
      { label: "Looking for", value: "AI engineering roles and applied-AI collaborations" },
      { label: "Education", value: "Information Systems — University of Bisha, 2026" },
      { label: "Based in", value: "Riyadh, Saudi Arabia" },
      { label: "Selected work", value: "Seven applied AI projects: four working prototypes, three concepts" },
      { label: "Recognition", value: "Top 30 — SDAIA × Microsoft AthkaU" },
      { label: "Code", value: "Public repositories for ChatUB, Absher Insight AI and Stadium" }
    ],
    versionsLabel: "Two CVs — choose your angle",
    versions: [
      {
        key: "engineer",
        title: "AI Engineer CV",
        positioning:
          "For technical roles: building, integrating and deploying AI systems with NLP, LLMs, retrieval and cloud services.",
        button: "Download the Engineer CV"
      },
      {
        key: "specialist",
        title: "AI Specialist CV",
        positioning:
          "For solution-focused roles: spotting AI opportunities, translating business needs and driving adoption through analysis and dashboards.",
        button: "Download the Specialist CV"
      }
    ],
    fileMeta: "PDF · 64 KB · English",
    cueTitle: "Not sure which one fits?",
    cueBody: "Tell the guide the role you’re hiring for and it will point you to the right CV.",
    cuePrompt: "Which CV should I download — the AI Engineer or the AI Specialist version? Help me decide for the role I’m hiring for.",
    cueCta: "Help me choose",
    closingTitle: "Want the long version?",
    closingBody: "The work says more than any CV — see how each project was thought through, and what’s still open.",
    closingPrimary: "See the work",
    closingSecondary: "Start a conversation"
  },
  achievements: {
    metaTitle: "Recognition",
    metaDescription:
      "Where Abdulelah Alkhathami’s work has been tested — national hackathons, the SDAIA × Microsoft AthkaU Top 30 and a CITC innovation final.",
    eyebrow: "Recognition",
    title: "Where the work has been tested.",
    intro:
      "I learn fastest under real constraints. These are the rooms where ideas had to hold up — a Top 30 finish in SDAIA × Microsoft’s AthkaU, national hackathons with Google Cloud and Absher, and a CITC innovation final.",
    closingTitle: "The next room is the interesting one.",
    closingBody: "If you’re running a team, a program or a problem worth solving — let’s talk.",
    closingPrimary: "Start a conversation",
    closingSecondary: "See the work"
  },
  skills: {
    metaTitle: "Skills",
    metaDescription:
      "The capabilities Abdulelah Alkhathami builds with — AI and machine learning, cloud, data and product craft — with an honest read on depth.",
    eyebrow: "Capabilities",
    title: "What I build with — and how far.",
    intro:
      "No progress bars, no inflated scores. Just an honest read: where I’m strongest, what I’ve used in real projects, and where I’m still growing.",
    legend: {
      core: "Core — strongest, lead with it",
      practical: "Practical — used in real projects",
      familiar: "Familiar — still growing"
    },
    levels: {
      Strong: "Core",
      "Practical Experience": "Practical",
      Familiar: "Familiar"
    },
    closingTitle: "Skills only matter when they’re put to work.",
    closingBody: "See how they came together in the projects — or tell me what you’re trying to build.",
    closingPrimary: "See the work",
    closingSecondary: "Start a conversation"
  },
  blog: {
    metaTitle: "Notes",
    metaDescription:
      "Notes by Abdulelah Alkhathami on AI agents, LLMs, cloud AI, privacy-first systems and AI product thinking — for students, builders and decision-makers.",
    notFoundTitle: "Note not found"
  },
  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Contact Abdulelah Alkhathami about AI engineering roles, collaborations or a project — by email or through a short form.",
    eyebrow: "Contact",
    title: "Let’s build something.",
    titleAccent: "Tell me what you’re making.",
    intro:
      "Hiring, collaborating or curious about a project — every message comes straight to my inbox, and I reply personally.",
    directLine: "The direct line",
    channelsLabel: "Other channels",
    basedIn: "Based in",
    guideNote: "In a hurry? Ask Abdulelah’s guide — it knows the work and can point you to the right project or CV.",
    guideButton: "Ask the guide",
    formLabel: "Or send a short note",
    form: {
      title: "Contact form",
      requiredHint: "Fields marked required must be filled in.",
      required: "required",
      optional: "optional",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      company: "Company or organization",
      companyPlaceholder: "Where you work",
      interest: "What is this about?",
      interests: {
        Hiring: "Hiring for a role",
        Collaboration: "Collaboration",
        "AI Project": "An AI project",
        Hackathon: "Hackathon or program",
        Other: "Something else"
      },
      message: "Message",
      messagePlaceholder: "The role, project or idea — a few lines is plenty.",
      messageHint: "Up to 5,000 characters.",
      submit: "Send message",
      sending: "Sending…",
      privacy:
        "Your message is emailed to Abdulelah and used only to reply. It is not shared with the AI guide.",
      privacyLink: "Privacy notice",
      errors: {
        summary: "Please fix the highlighted fields.",
        nameRequired: "Enter your name.",
        emailRequired: "Enter your email address.",
        emailInvalid: "Enter an email address like name@example.com.",
        messageRequired: "Write a short message.",
        tooLong: "This is too long — please shorten it.",
        interestInvalid: "Choose what this is about."
      },
      success: "Thank you — your message was sent. I’ll reply by email.",
      successTitle: "Message sent",
      rateLimited: "Several messages were just sent from this connection. Please wait a few minutes and try again.",
      verification: "We couldn’t verify this submission. Reload the page and try again, or email me directly.",
      serverError: "Your message couldn’t be sent right now. Nothing was lost — try again, or email me directly at",
      networkError: "The connection dropped before your message was sent. Your text is still here — try again."
    }
  },
  contactResult: {
    sentTitle: "Message sent",
    sentBody: "Thank you — your message reached Abdulelah’s inbox. You’ll get a reply by email.",
    failedTitle: "Your message wasn’t sent",
    failedBody:
      "Something went wrong before it could be delivered. Go back to the form to try again — your browser may have kept what you wrote — or email Abdulelah directly.",
    backToForm: "Back to the form",
    home: "Home"
  },
  privacy: {
    metaTitle: "Privacy",
    metaDescription:
      "How this site handles data: which providers are used for analytics, contact email and the AI guide, what they receive, and what is never collected.",
    eyebrow: "Privacy",
    title: "What this site collects — and what it doesn’t.",
    intro:
      "This notice describes exactly what the code does. There are no advertising trackers, no tracking cookies and no visitor profiles.",
    updated: "Last updated: September 2026",
    sections: [
      {
        title: "Analytics (Vercel Web Analytics)",
        points: [
          "Page views are counted with Vercel Web Analytics, which is cookieless and reports aggregated numbers — it does not build a profile of you.",
          "A few anonymous events are recorded to understand which paths are useful: a project opened, an evidence link opened, a CV downloaded (Engineer or Specialist), the email address copied, the guide opened, and a contact form successfully sent.",
          "Real-user performance is measured the same way: loading speed (LCP), responsiveness (INP) and layout stability (CLS), with the page path, the language and a coarse device class (mobile, tablet or desktop) based on screen width.",
          "No names, email addresses, message text or questions are ever sent as analytics. Data is retained under Vercel’s analytics retention policy."
        ]
      },
      {
        title: "Contact form (Resend)",
        points: [
          "When you send the form, your name, email address, optional company, the topic you chose and your message are emailed to Abdulelah through Resend, an email delivery service.",
          "The message is used only to reply to you. It is not stored in a database by this site and is never sent to the AI guide or to DeepSeek.",
          "The same applies to messages sent from inside the guide."
        ]
      },
      {
        title: "Abdulelah’s guide (DeepSeek)",
        points: [
          "The guide answers only from this site’s portfolio content. When the AI service is enabled, your question and up to eight recent messages from the conversation are sent to DeepSeek, an AI model provider, to check the question is in scope and to generate the answer. If the service is unavailable, answers come from built-in portfolio text instead.",
          "This site’s server does not save your questions; it logs only technical status, such as which answer path was used. DeepSeek processes requests under its own terms and privacy policy.",
          "The conversation lives in this browser tab only: it disappears when you reload or close the tab, and the Clear button erases it together with the list of projects you viewed in this session.",
          "Please don’t share sensitive personal, financial, medical or confidential information with the guide."
        ]
      },
      {
        title: "Abuse protection",
        points: [
          "Forms and the guide are rate limited. The limiter keeps a salted, one-way hash of your network address — never the raw address — in Upstash Redis (or in server memory as a fallback) for the length of the limit window.",
          "When enabled, Cloudflare Turnstile checks that form submissions and guide questions come from a person. After a passing check, a short-lived, signed security cookie (valid for 30 minutes) keeps the conversation from being challenged again. It is not used for tracking."
        ]
      },
      {
        title: "In your browser",
        points: [
          "Session storage remembers which case studies you opened during this visit, so the site can suggest what to read next. It never leaves your browser and is cleared when the tab closes or when you clear the guide’s conversation."
        ]
      }
    ],
    contactTitle: "Questions about privacy?",
    contactBody: "Email Abdulelah directly and you’ll get a personal reply."
  },
  notFound: {
    metaTitle: "404 — Page not found",
    eyebrow: "Error 404",
    title: "This page couldn’t be found.",
    titleAccent: "It may have moved.",
    body: "The address may be mistyped, or the page may have been renamed. These will get you back on track:",
    search: "Search the site",
    links: {
      home: "Home",
      projects: "Projects",
      about: "About",
      contact: "Contact"
    }
  },
  error: {
    eyebrow: "Something broke",
    title: "Well, that wasn’t",
    titleAccent: "supposed to happen.",
    body: "An unexpected error interrupted this page. Try again, or head back home and keep exploring.",
    retry: "Try again",
    home: "Back home"
  },
  footer: {
    tagline:
      "AI product builder in Riyadh — agents, RAG and Arabic AI, with the evidence and limits of each project stated plainly.",
    navTitle: "Pages",
    profilesTitle: "Profiles",
    rights: "All rights reserved.",
    copyright: "© {year} Abdulelah Alkhathami"
  },
  readingPath: {
    comparePrefix: "Compare",
    with: "with",
    compareBody: "You looked at it earlier — see how the same thinking changes shape.",
    storyTitle: "Want the story behind {name}?",
    storyBody: "How it started, the hardest part, and what he would change next time.",
    storyPrompt: "Tell me the story behind {name} — how it started, the hardest part, the key trade-offs, and what you would improve.",
    startChatubTitle: "New here? Start with ChatUB",
    startChatubBody: "His graduation project — the clearest look at how he works, with public code.",
    afterCvTitle: "You’ve read the CV — here’s the evidence",
    afterCvBody: "Start with ChatUB, the graduation project he led, with public code.",
    publicCodeTitle: "Looking for code you can review?",
    publicCodeBody: "Stadium was built solo — detection, decision rules, API and dashboard.",
    nextTitle: "You’ve explored {names}. See {next} next",
    nextBody: "Keep following the thread through the rest of the work.",
    allSeenTitle: "You’ve seen them all",
    allSeenBody: "Tell the guide the role you’re hiring for and it will point to the strongest fit.",
    allSeenPrompt:
      "I’ve looked through all of Abdulelah’s projects — which one best fits the role I’m hiring for, and why?",
    and: "and",
    andMore: "and more"
  },
  agent: {
    launcher: "Ask Abdulelah",
    launcherLabel: "Ask Abdulelah — a guide to the work",
    title: "Abdulelah’s guide",
    subtitle: "Answers only from what’s on this site",
    subtitleBlocked: "Keeping to the work on this site",
    welcome:
      "I’m a guide to Abdulelah’s work — the projects, the thinking behind them and where he’d fit. Ask me anything; I’ll stick to what’s on this site and link you to the evidence.",
    suggestionsTitle: "Try a question",
    suggestions: [
      "Give me the 30-second summary",
      "Show the strongest projects",
      "Which CV fits my role?",
      "Which projects have public code?",
      "What did he build in ChatUB?",
      "How do I contact Abdulelah?"
    ],
    followUpsTitle: "Follow up on {project}",
    followUps: ["Technologies", "His role", "Technical explanation", "Recruiter summary"],
    viewCaseStudy: "View case study",
    sendMessageCta: "Send Abdulelah a message",
    inputLabel: "Ask Abdulelah’s guide a question",
    inputPlaceholder: "Ask about the work…",
    send: "Send",
    clear: "Clear",
    clearLabel: "Clear the conversation and this visit’s memory",
    cleared: "Conversation cleared.",
    close: "Close",
    closeLabel: "Close Abdulelah’s guide",
    thinking: "The guide is writing an answer…",
    you: "You",
    guide: "Abdulelah’s guide",
    errorGeneric:
      "I couldn’t reach the guide just now. Please try again in a moment, or use the contact page.",
    errorOffline: "You seem to be offline. Check your connection and try again.",
    rateLimited: "You’ve asked several questions in a short time. Please wait a minute, then try again.",
    verification: "The question couldn’t be verified. Reload the page and ask again.",
    contactAction: "Contact Abdulelah",
    disclosure:
      "Answers use this site’s content only. When the AI service is on, your question and recent messages are sent to DeepSeek to write the answer. The chat stays in this tab and is erased on reload or with Clear.",
    privacyLink: "Privacy",
    newAnswer: "New answer from the guide",
    contactForm: {
      title: "Send Abdulelah a message",
      body: "Delivered to Abdulelah by email (via Resend). It isn’t shared with the AI.",
      close: "Close the message form",
      intentLegend: "What would you like to discuss?",
      intents: {
        "Hiring opportunity": "Hiring opportunity",
        Collaboration: "Collaboration",
        "AI project": "AI project",
        "Hackathon / innovation program": "Hackathon or innovation program",
        "Speaking / content": "Speaking or content",
        Other: "Something else"
      },
      intentLabel: "Topic",
      change: "Change",
      name: "Name",
      email: "Email",
      company: "Company",
      optional: "optional",
      message: "Message",
      messagePlaceholder: "Tell Abdulelah about the role or opportunity.",
      submit: "Send message",
      sending: "Sending…",
      success: "Your message was sent to Abdulelah.",
      unverified: "We couldn’t verify this submission. Reload the page and try again.",
      error: "Something went wrong. Please email Abdulelah directly at",
      rateLimited: "Please wait a few minutes before sending another message.",
      invalid: "Please check your name, email and message.",
      privacy: "Privacy notice"
    }
  }
};

export type Dictionary = typeof en;
