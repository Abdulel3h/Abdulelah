const fallbackSiteUrl = "https://www.abdulelah.de";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || fallbackSiteUrl;

export const siteConfig = {
  name: "Abdulelah Alkhathami",
  brand: "Abdulelah AI",
  role: "Junior AI Engineer | AI Solutions Specialist",
  location: "Riyadh, Saudi Arabia",
  email: "Abdul0l0h.0@gmail.com",
  phone: "+966 53 764 8807",
  url: siteUrl,
  description:
    "Portfolio of Abdulelah Alkhathami, a Junior AI Engineer and AI Solutions Specialist building practical, context-aware AI systems for real-world impact across NLP, LLMs, cloud AI, education, security, sustainability, fintech, and legal tech.",
  keywords: [
    "Abdulelah Alkhathami",
    "AI Engineer",
    "AI Specialist",
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
