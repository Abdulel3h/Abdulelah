const fallbackSiteUrl = "https://www.abdulelah.de";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || fallbackSiteUrl;

export const siteConfig = {
  name: "Abdulelah Alkhathami",
  arabicName: "عبدالإله الخثعمي",
  brand: "Abdulelah Alkhathami",
  role: "AI Product Builder",
  positioning: "AI Product Builder · Agents, RAG & Arabic AI",
  tagline: "I build intelligent products.",
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
    "Abdulelah Alkhathami (عبدالإله الخثعمي) is an AI product builder in Riyadh, Saudi Arabia — AI agents, RAG and Arabic AI. Seven applied AI projects across education, security, computer vision and sustainability, each with its status and evidence.",
  keywords: [
    "Abdulelah Alkhathami",
    "عبدالإله الخثعمي",
    "AI Product Builder",
    "AI Engineer",
    "AI Solutions Specialist",
    "AI Agents",
    "RAG",
    "LLM Applications",
    "Arabic AI",
    "Arabic NLP",
    "Computer Vision",
    "Saudi Arabia",
    "Riyadh",
    "ChatUB",
    "Absher Insight AI",
    "Stadium",
    "Althil"
  ],
  social: {
    linkedin: "https://www.linkedin.com/in/abdulelah-alkhathami-853845311",
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

/** Primary navigation. Labels come from the locale dictionary (`nav.*`). */
export const primaryNav = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "resume", href: "/resume" }
] as const;

/** Pages behind the "More" disclosure. */
export const moreNav = [
  { key: "achievements", href: "/achievements" },
  { key: "skills", href: "/skills" },
  { key: "notes", href: "/blog" }
] as const;

export const footerNav = [
  ...primaryNav,
  ...moreNav,
  { key: "contact", href: "/contact" },
  { key: "privacy", href: "/privacy" }
] as const;

export type NavKey = (typeof footerNav)[number]["key"];
