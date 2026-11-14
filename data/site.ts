const fallbackSiteUrl = "https://www.abdulelah.de";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || fallbackSiteUrl;

export const siteConfig = {
  name: "Abdulelah Alkhathami",
  arabicName: "عبدالإله الخثعمي",
  brand: "Abdulelah Alkhathami",
  role: "Applied AI Engineer",
  positioning: "Applied AI Engineer · Arabic-first LLM applications & AI agents",
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
    "Abdulelah Alkhathami (عبدالإله الخثعمي) is an Applied AI Engineer in Riyadh, Saudi Arabia — Arabic-first LLM applications and AI agents. Eight applied AI projects across retail support, education, security, computer vision and sustainability, each with its status and evidence.",
  keywords: [
    "Abdulelah Alkhathami",
    "عبدالإله الخثعمي",
    "Applied AI Engineer",
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
    linkedin: "https://www.linkedin.com/in/abdulelahalkhathami",
    github: "https://github.com/Abdulel3h"
  },
  assets: {
    // One share image per language, same composition (scripts/generate-og.mjs).
    shareImages: {
      en: "/images/og/abdulelah-og-en.png",
      ar: "/images/og/abdulelah-og-ar.png"
    }
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
