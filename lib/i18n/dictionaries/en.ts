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
  nav: {
    primary: "Primary",
    home: "Home",
    about: "About",
    projects: "Projects",
    resume: "Resume",
    contact: "Contact",
    achievements: "Recognition",
    skills: "Skills",
    notes: "Notes",
    privacy: "Privacy",
    guideSummaryPrompt: "Give me the 30-second summary of Abdulelah for someone who’s hiring.",
    searchSite: "Search the site"
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
  projectFacts: {
    conceptVisualization: "Concept visualization",
    conceptVisualizationNote: "Illustrative sketch of the idea — not a product screenshot."
  },
  home: {
    metaTitle: "Abdulelah Alkhathami — AI Product Builder · Agents, RAG & Arabic AI",
    metaDescription:
      "Abdulelah Alkhathami is an AI product builder in Riyadh — agents, RAG and Arabic AI. Explore seven applied AI projects, the evidence behind each, and two role-specific CVs."
  },
  projectsPage: {
    metaTitle: "Projects",
    metaDescription:
      "Seven applied AI projects by Abdulelah Alkhathami — four working prototypes and three concepts — each with its role, status and evidence."
  },
  caseStudy: {
    notFoundTitle: "Project not found"
  },
  about: {
    metaTitle: "About",
    metaDescription:
      "Abdulelah Alkhathami is an AI product builder from Riyadh — how he thinks, how he works, and the path from his first hackathon to seven applied AI projects.",
    cueTitle: "Prefer the two-minute version?",
    cueBody: "Ask the guide how Abdulelah thinks, what he cares about and where he’s strongest.",
    cuePrompt: "Give me the two-minute overview of who Abdulelah is, how he thinks, and where he’s strongest.",
    cueCta: "Give me the overview"
  },
  resume: {
    metaTitle: "Resume",
    metaDescription:
      "Abdulelah Alkhathami at a glance — focus, education, evidence and recognition — plus two role-specific CVs to download.",
    glance: [
      { label: "Now", value: "AI product builder — agents, RAG and Arabic AI" },
      { label: "Looking for", value: "AI engineering roles and applied-AI collaborations" },
      { label: "Education", value: "Information Systems — University of Bisha, 2026" },
      { label: "Based in", value: "Riyadh, Saudi Arabia" },
      { label: "Selected work", value: "Seven applied AI projects: four working prototypes, three concepts" },
      { label: "Recognition", value: "Top 30 — SDAIA × Microsoft AthkaU" },
      { label: "Code", value: "Public repositories for ChatUB, Althil, Absher Insight AI and Stadium" }
    ],
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
    cueCta: "Help me choose"
  },
  achievements: {
    metaTitle: "Recognition",
    metaDescription:
      "Where Abdulelah Alkhathami’s work has been tested — national hackathons, the SDAIA × Microsoft AthkaU Top 30 and a CITC innovation final."
  },
  skills: {
    metaTitle: "Skills",
    metaDescription:
      "The capabilities Abdulelah Alkhathami builds with — AI and machine learning, cloud, data and product craft — with an honest read on depth.",
    legend: {
      core: "Core — strongest, lead with it",
      practical: "Practical — used in real projects",
      familiar: "Familiar — still growing"
    },
    levels: {
      Strong: "Core",
      "Practical Experience": "Practical",
      Familiar: "Familiar"
    }
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
    basedIn: "Based in",
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
    ]
  },
  notFound: {
    metaTitle: "404 — Page not found",
    eyebrow: "An address that leads nowhere",
    title: "This page couldn’t be found.",
    body: "It may have moved. These will get you back:",
    search: "Search the site",
    links: {
      home: "Home",
      projects: "Projects",
      about: "About",
      contact: "Contact"
    }
  },
  error: {
    eyebrow: "Unexpected error",
    title: "Something went wrong here.",
    body: "Try again, or head back home.",
    retry: "Try again",
    home: "Back home"
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
