import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
import { BlogLanguageProvider } from "@/components/blog/BlogLanguageProvider";
import { BlogLanguageToggle } from "@/components/blog/BlogLanguageToggle";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Abdulelah AI Insights",
  description:
    "Practical AI insights about agents, LLMs, cloud AI, privacy-first systems, and applied artificial intelligence for students, builders, and decision-makers.",
  path: "/blog",
  keywords: [
    "Abdulelah AI Insights",
    "AI Agents",
    "LLMs",
    "Cloud AI",
    "Privacy-first AI",
    "Applied AI",
    "AI Education"
  ]
});

export default function BlogPage() {
  return (
    <BlogLanguageProvider>
      <BlogIndexContent />
      <BlogLanguageToggle />
    </BlogLanguageProvider>
  );
}
