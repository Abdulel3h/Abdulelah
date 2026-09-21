"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Monogram } from "@/components/ui/Monogram";
import { openCompanion } from "@/lib/agent/companion";
import { useSession, type ViewedProject } from "@/lib/agent/session-memory";
import { format, joinNames } from "@/lib/i18n/format";

type Page = "projects" | "detail";

type ProjectRef = { slug: string; name: string; href: string; domain: string };

type Suggestion = { title: string; body: string } & ({ href: string } | { prompt: string });

/**
 * One session-aware next step per page — a quiet link (or a question for the
 * guide) based on what this visit has already opened. Visit memory lives in
 * sessionStorage only and is cleared with the guide's Clear button.
 */
export function ReadingPath({
  page,
  slug,
  projects
}: {
  page: Page;
  slug?: string;
  projects: ProjectRef[];
}) {
  const { t, locale } = useI18n();
  const copy = t.readingPath;
  const { projects: viewed, resumeViewed, ready } = useSession();

  if (!ready) return null;

  const byslug = new Map(projects.map((project) => [project.slug, project]));
  const chatub = byslug.get("chatub");
  const viewedSlugs = new Set(viewed.map((entry: ViewedProject) => entry.slug));
  let suggestion: Suggestion | null = null;

  if (page === "detail") {
    const current = slug ? byslug.get(slug) : undefined;
    const earlier = viewed.filter((entry) => entry.slug !== slug && byslug.has(entry.slug));

    if (earlier.length) {
      const other = byslug.get(earlier[earlier.length - 1].slug)!;

      suggestion = {
        title: `${copy.comparePrefix} ${current?.name ?? ""} ${copy.with} ${other.name}`,
        body: copy.compareBody,
        href: other.href
      };
    } else if (current) {
      suggestion = {
        title: format(copy.storyTitle, { name: current.name }),
        body: copy.storyBody,
        prompt: format(copy.storyPrompt, { name: current.name })
      };
    }
  } else {
    const nextUnviewed = projects.find((project) => !viewedSlugs.has(project.slug));

    if (!viewed.length && chatub) {
      suggestion = resumeViewed
        ? { title: copy.afterCvTitle, body: copy.afterCvBody, href: chatub.href }
        : { title: copy.startChatubTitle, body: copy.startChatubBody, href: chatub.href };
    } else if (nextUnviewed) {
      const names = viewed.map((entry) => byslug.get(entry.slug)?.name ?? entry.name);

      suggestion = {
        title: format(copy.nextTitle, {
          names: joinNames(names, locale, copy.andMore),
          next: nextUnviewed.name
        }),
        body: copy.nextBody,
        href: nextUnviewed.href
      };
    } else {
      suggestion = { title: copy.allSeenTitle, body: copy.allSeenBody, prompt: copy.allSeenPrompt };
    }
  }

  if (!suggestion) return null;

  const inner = (
    <>
      <Monogram className="h-5 w-auto shrink-0 text-accent transition-colors group-hover:text-accent-soft" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-paper">{suggestion.title}</span>
        <span className="mt-0.5 block text-sm leading-6 text-paper-dim">{suggestion.body}</span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-accent-soft transition rtl:-scale-x-100"
        aria-hidden="true"
      />
    </>
  );

  const className =
    "focus-ring group flex w-full min-h-11 items-center gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.02] px-5 py-4 text-start transition hover:border-accent/35 hover:bg-accent/[0.04]";

  if ("href" in suggestion) {
    return (
      <Link href={suggestion.href} className={className}>
        {inner}
      </Link>
    );
  }

  const prompt = suggestion.prompt;

  return (
    <button
      type="button"
      onClick={(event) => openCompanion({ prompt, send: true, returnFocusTo: event.currentTarget })}
      aria-haspopup="dialog"
      className={className}
    >
      {inner}
    </button>
  );
}
