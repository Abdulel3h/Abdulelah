import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
import { BlogLanguageProvider } from "@/components/blog/BlogLanguageProvider";
import { BlogLanguageToggle } from "@/components/blog/BlogLanguageToggle";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Notes",
  description:
    "Notes by Abdulelah Alkhathami on AI agents, LLMs, cloud AI, privacy-first systems, and AI product thinking — written for students, builders, and decision-makers.",
  path: "/blog",
  keywords: [
    "Abdulelah Alkhathami notes",
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
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Notes", path: "/blog" }
        ])}
      />
      <BlogIndexContent />
      <BlogLanguageToggle />
    </BlogLanguageProvider>
  );
}
