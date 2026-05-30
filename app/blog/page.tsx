import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Insights",
  description:
    "Placeholder AI insights and article structure for future MDX content by Abdulelah Alkhathami.",
  path: "/blog"
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="AI thinking, product context, and applied lessons."
        subtitle="A clean structure for future MDX articles that can show how Abdulelah thinks about AI systems, not only how he builds them."
      />
      <section className="container-shell section-space">
        <div className="grid gap-5 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.title} className="glass-card group rounded-2xl p-6 transition hover:-translate-y-1 hover:border-sky-300/30">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <Badge className="mt-6">{post.category}</Badge>
              <h2 className="mt-4 text-xl font-semibold text-white">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
              <Button type="button" variant="outline" className="mt-6 cursor-not-allowed text-slate-400" disabled>
                Coming soon
              </Button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
