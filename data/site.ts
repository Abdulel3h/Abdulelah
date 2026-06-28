const fallbackSiteUrl = "https://www.abdulelah.de";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || fallbackSiteUrl;

export const siteConfig = {
  name: "Abdulelah Alkhathami",
  arabicName: "عبدالإله الخثعمي",
  brand: "Abdulelah Alkhathami",
  role: "AI Engineer & Product Builder",
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
    "Abdulelah Alkhathami (عبدالإله الخثعمي) builds intelligent products — AI agents, RAG systems, LLM applications, and Arabic AI systems — across education, security, sustainability, fintech, and legal tech. Based in Riyadh, Saudi Arabia.",
  keywords: [
    "Abdulelah Alkhathami",
    "عبدالإله الخثعمي",
    "AI Engineer",
    "AI Solutions Specialist",
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
  { label: "Resume", href: "/resume" }
];

export const quickLinks = [
  ...navLinks,
  { label: "Achievements", href: "/achievements" },
  { label: "Skills", href: "/skills" },
  { label: "Writing", href: "/blog" },
  contactLink,
  { label: "Privacy", href: "/privacy" }
];
