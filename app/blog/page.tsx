import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
import { BlogLanguageProvider } from "@/components/blog/BlogLanguageProvider";
import { BlogLanguageToggle } from "@/components/blog/BlogLanguageToggle";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

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
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Abdulelah AI Insights", path: "/blog" }
        ])}
      />
      <BlogIndexContent />
      <BlogLanguageToggle />
    </BlogLanguageProvider>
  );
}
