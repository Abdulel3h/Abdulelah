import { getAchievementsByYear } from "@/data/achievements";
import { getProjects, projectCounts } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { getSkillGroups } from "@/data/skills";
import { localizeHref, otherLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { projectBriefs, siteCopy } from "@/lib/i18n/experience";
import type { ShellData } from "@/lib/shell/commands";

/**
 * Arabic words the shell also understands. Commands themselves stay Latin in
 * both languages (code never changes script); these let an Arabic reader type
 * what they mean. English needs none: its words are the commands.
 */
const aliases: Record<Locale, Record<string, string>> = {
  en: {},
  ar: {
    مساعدة: "help",
    "من-أنا": "whoami",
    منأنا: "whoami",
    مشاريع: "projects",
    المشاريع: "projects",
    افتح: "open",
    أعمال: "work",
    نبذة: "about",
    مهارات: "skills",
    المهارات: "skills",
    إنجازات: "recognition",
    محطات: "recognition",
    سيرة: "cv",
    السيرة: "cv",
    تواصل: "contact",
    اسأل: "ask",
    مسح: "clear",
    إنجليزي: "lang"
  }
};

/**
 * What the opening's shell may print, in one locale. Built on the server from
 * the same data the pages render, and passed to the client as plain JSON.
 */
export function buildShellData(locale: Locale): ShellData {
  const dict = getDictionary(locale);
  const site = siteCopy(locale);
  const briefs = projectBriefs(locale);
  const technical = getSkillGroups(locale).slice(0, -1).flatMap((group) => group.skills);
  // Working projects first (as the page orders them), then the concepts.
  const projects = [...getProjects(locale)].sort((a, b) => Number(b.featured) - Number(a.featured));

  return {
    locale,
    name: dict.common.name,
    role: site.shell.role,
    otherLocaleHref: localizeHref("/", otherLocale(locale)),
    copy: {
      helpTitle: site.shell.helpTitle,
      help: site.shell.help,
      notFound: site.shell.notFound,
      openUsage: site.shell.openUsage,
      openNotFound: site.shell.openNotFound,
      opening: site.shell.opening,
      jumping: site.shell.jumping,
      projectsSummary: site.shell.projectsSummary,
      projectsHint: site.shell.projectsHint,
      skillsCore: site.shell.skillsCore,
      skillsPractical: site.shell.skillsPractical,
      cvLine: site.shell.cvLine,
      contactLine: site.shell.contactLine,
      asking: site.shell.asking,
      askUsage: site.shell.askUsage,
      sudo: site.shell.sudo,
      switching: site.shell.switching,
      more: site.shell.more,
      aliases: aliases[locale]
    },
    projects: projects.map((project) => ({
      slug: project.slug,
      name: project.name,
      status: dict.status[project.status],
      concept: project.status === "concept",
      line: briefs[project.slug]?.line ?? project.summary,
      year: project.year,
      href: localizeHref(`/projects/${project.slug}`, locale)
    })),
    counts: {
      total: projectCounts.total,
      working: projectCounts.prototypes,
      concepts: projectCounts.concepts
    },
    about: {
      lede: site.about.lede,
      facts: site.about.facts,
      think: site.about.think.map((item) => item.title),
      href: localizeHref("/about", locale)
    },
    skills: {
      core: technical.filter((skill) => skill.level === "Strong").map((skill) => skill.name),
      practical: technical.filter((skill) => skill.level === "Practical Experience").map((skill) => skill.name),
      href: localizeHref("/skills", locale)
    },
    recognition: getAchievementsByYear(locale).map((item) => ({ year: item.year, title: item.title, outcome: item.outcome })),
    recognitionHref: localizeHref("/achievements", locale),
    cv: dict.resume.versions.map((version) => ({
      label: version.title,
      href: version.key === "engineer" ? siteConfig.resumes.engineer : siteConfig.resumes.specialist,
      meta: dict.resume.fileMeta
    })),
    resumeHref: localizeHref("/resume", locale),
    contact: {
      email: siteConfig.email,
      links: [
        { label: "LinkedIn", href: siteConfig.social.linkedin },
        { label: "GitHub", href: siteConfig.social.github }
      ],
      href: localizeHref("/contact", locale)
    }
  };
}
