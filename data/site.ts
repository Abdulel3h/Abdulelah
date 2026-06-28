const fallbackSiteUrl = "https://www.abdulelah.de";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || fallbackSiteUrl;

export const siteConfig = {
  name: "Abdulelah Alkhathami",
  arabicName: "عبدالإله الخثعمي",
  brand: "Abdulelah AI",
  role: "AI Engineer | LLM Applications | Cloud AI",
  location: "Riyadh, Saudi Arabia",
  email: "me@abdulelah.de",
  // Role-based aliases. `primary` is the only address surfaced on public pages;
  // the rest are routed contextually by Agent Abdulelah (see lib/agent/contact-routing).
  contactEmails: {
    primary: "me@abdulelah.de",
    recruitment: "jobs@abdulelah.de",
    general: "contact@abdulelah.de",
    business: "business@abdulelah.de"
  },
  url: siteUrl,
  description:
    "Portfolio of Abdulelah Alkhathami (عبدالإله الخثعمي), an AI Engineer in Riyadh, Saudi Arabia, building LLM applications, RAG-style assistants, AI automation concepts, cloud AI systems, and Arabic AI experiences across education, security, sustainability, fintech, and legal tech.",
  keywords: [
    "Abdulelah Alkhathami",
    "عبدالإله الخثعمي",
    "AI Engineer",
    "LLM Engineer",
    "Generative AI Engineer",
    "AI Automation Engineer",
    "Applied Machine Learning Engineer",
    "Cloud AI Engineer",
    "AI Agents",
    "RAG Systems",
    "LLM Applications",
    "Arabic AI Systems",
    "NLP",
    "LLMs",
    "Cloud AI",
    "Google Cloud",
    "Azure AI",
    "Saudi Arabia",
    "Riyadh",
    "AI Portfolio",
    "ChatUB",
    "Althil",
    "Absher Insight AI"
  ],
  social: {
    linkedin: "https://linkedin.com/in/abdulelah-alkhathami-853845311",
    github: "https://github.com/Abdulel3h"
  },
  assets: {
    ogImage: "/images/og/abdulelah-ai-og.png",
    profileImage: "/images/profile/abdulelah-profile.png"
  },
  resumes: {
    engineer: "/resume/Abdulelah_AI_Engineer_CV.pdf",
    specialist: "/resume/Abdulelah_AI_Specialist_CV.pdf"
  }
};

export const contactLink = { label: "Contact", href: "/contact" };

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Achievements", href: "/achievements" },
  { label: "Skills", href: "/skills" },
  { label: "Resume", href: "/resume" }
];

export const quickLinks = [
  ...navLinks,
  contactLink,
  { label: "Privacy", href: "/privacy" },
  { label: "Insights", href: "/blog" },
  { label: "AI Journey", href: "/journey" }
];
