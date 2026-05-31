import type { Metadata } from "next";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { GlobalPulse } from "@/components/blog/GlobalPulse";
import { PageHero } from "@/components/ui/PageHero";
import { blogCategories, blogPosts, featuredBlogPost } from "@/data/blog";
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
    <>
      <PageHero
        eyebrow="AI Knowledge Hub"
        title="Abdulelah AI Insights"
        subtitle="Practical ideas about AI agents, LLMs, cloud AI, privacy-first systems, and applied AI for students, builders, and decision-makers."
        stats={[
          { value: String(blogPosts.length), label: "Original articles" },
          { value: String(blogCategories.length - 1), label: "AI topic areas" },
          { value: "Static-first", label: "Credible knowledge, no fake live data" },
          { value: "Global", label: "Useful across backgrounds and specialties" }
        ]}
      />

      <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
        <p className="badge mb-5">Start here</p>
        <FeaturedPost post={featuredBlogPost} />
      </section>

      <section className="container-shell section-space">
        <div className="max-w-3xl">
          <p className="badge mb-4">Knowledge library</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Explore practical AI ideas
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Search by topic or choose the audience closest to your goals. Each
            article is written to be useful without flattening the technical
            details that matter.
          </p>
        </div>
        <div className="mt-9">
          <BlogFilters posts={blogPosts} />
        </div>
      </section>

      <GlobalPulse />
      <BlogCTA />
    </>
  );
}
