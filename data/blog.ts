export type BlogPost = {
  title: string;
  category: string;
  excerpt: string;
};

export const blogPosts: BlogPost[] = [
  {
    title: "Why Context Matters More Than Prompts in AI Agents",
    category: "AI Agents",
    excerpt:
      "Strong AI systems depend on context, constraints, and trusted knowledge sources, not prompt wording alone."
  },
  {
    title: "Local AI Systems and the Future of University Services",
    category: "Education AI",
    excerpt:
      "Local AI can help universities provide more reliable guidance while respecting privacy and institutional trust."
  },
  {
    title: "How AI Can Support Smarter Urban Planning",
    category: "Sustainability",
    excerpt:
      "AI and cloud analytics can help planners understand heat exposure, shade needs, and city comfort over time."
  },
  {
    title: "From Reactive Security to Predictive AI Security",
    category: "AI Security",
    excerpt:
      "Behavioral analytics and anomaly detection can help digital platforms identify risk patterns earlier."
  },
  {
    title: "Lessons from Building AI Projects Across Different Domains",
    category: "AI Engineering",
    excerpt:
      "Education, legal tech, fintech, security, and sustainability all require AI systems that fit real user needs."
  }
];
