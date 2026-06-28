"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Monogram } from "@/components/ui/Monogram";
import { openCompanion } from "@/lib/agent/companion";
import { useSession, type ViewedProject } from "@/lib/agent/session-memory";
import { projects } from "@/data/projects";

type Page = "projects" | "detail" | "resume" | "about";

type Suggestion = {
  title: string;
  body: string;
} & ({ href: string } | { prompt: string });

function shortName(title: string) {
  return title.split(" - ")[0];
}

function listNames(names: string[]) {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]}, and more`;
}

function compute(
  page: Page,
  slug: string | undefined,
  viewed: ViewedProject[],
  resumeViewed: boolean
): Suggestion | null {
  const viewedSlugs = new Set(viewed.map((entry) => entry.slug));
  const names = viewed.map((entry) => entry.name);

  if (page === "detail") {
    const current = projects.find((project) => project.slug === slug);
    const currentName = current ? shortName(current.title) : "this project";
    const others = viewed.filter((entry) => entry.slug !== slug);

    if (others.length) {
      const other = others[others.length - 1];
      return {
        title: `Compare ${currentName} with ${other.name}`,
        body: "You looked at it earlier — see how the same thinking changes shape.",
        href: `/projects/${other.slug}`
      };
    }

    return {
      title: `Want the story behind ${currentName}?`,
      body: "How it started, the hardest part, and what he'd change next time.",
      prompt: `Tell me the story behind ${current?.title ?? currentName} — how it started, the hardest part, the key trade-offs, and what you would improve.`
    };
  }

  if (page === "projects") {
    const nextUnviewed = projects.find((project) => !viewedSlugs.has(project.slug));

    if (viewed.length === 0) {
      return resumeViewed
        ? {
            title: "You've read the CV — here's the proof",
            body: "Start with ChatUB, the graduation project he led end to end.",
            href: "/projects/chatub"
          }
        : {
            title: "New here? Start with ChatUB",
            body: "His graduation project — the clearest look at how he works.",
            href: "/projects/chatub"
          };
    }

    const cloudAffinity = viewed.filter((entry) =>
      /cloud/i.test(entry.category)
    ).length;
    if (cloudAffinity >= 2) {
      return {
        title: "You're drawn to the cloud work",
        body: "Althil goes deepest there — Cloud Run, BigQuery, and Vertex AI.",
        href: "/projects/althil"
      };
    }

    if (nextUnviewed) {
      return {
        title: `You've explored ${listNames(names)}. See ${shortName(
          nextUnviewed.title
        )} next`,
        body: "Keep following the thread through the rest of the work.",
        href: `/projects/${nextUnviewed.slug}`
      };
    }

    return {
      title: "You've seen all six",
      body: "Tell me the role you're hiring for and I'll point to the strongest fit.",
      prompt:
        "I've looked through all of Abdulelah's projects — which one best fits the role I'm hiring for, and why?"
    };
  }

  if (page === "resume") {
    if (viewed.length) {
      const top = viewed[0];
      return {
        title: "The proof behind the CV",
        body: `${listNames(names)} show this in action — revisit ${top.name}.`,
        href: `/projects/${top.slug}`
      };
    }

    return {
      title: "Want the proof behind the CV?",
      body: "The projects show the same thinking applied to real problems.",
      href: "/projects"
    };
  }

  // about
  if (viewed.length) {
    return {
      title: "You've seen the work — now the person",
      body: "Ask how he thinks and where he's strongest.",
      prompt:
        "Give me the two-minute overview of how Abdulelah thinks and where he's strongest."
    };
  }

  return {
    title: "Ready to see it in the work?",
    body: "Start with ChatUB — his graduation project.",
    href: "/projects/chatub"
  };
}

export function ReadingPath({ page, slug }: { page: Page; slug?: string }) {
  const { projects: viewed, resumeViewed, ready } = useSession();

  if (!ready) return null;

  const suggestion = compute(page, slug, viewed, resumeViewed);
  if (!suggestion) return null;

  const inner = (
    <>
      <Monogram className="h-5 w-auto shrink-0 text-accent transition-colors group-hover:text-accent-soft" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-paper">{suggestion.title}</span>
        <span className="mt-0.5 block text-sm leading-6 text-paper-dim">
          {suggestion.body}
        </span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-accent-soft transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </>
  );

  const className =
    "focus-ring group flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-left transition hover:border-accent/30 hover:bg-accent/[0.04]";

  if ("href" in suggestion) {
    return (
      <Link href={suggestion.href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openCompanion({ prompt: suggestion.prompt, send: true })}
      className={className}
    >
      {inner}
    </button>
  );
}
