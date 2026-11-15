/**
 * The opening shell's command language — pure, so it is unit-tested and the
 * client component only renders what it returns.
 *
 * Every line a command prints restates data the page already carries
 * (data/projects.ts, data/skills.ts, data/achievements.ts, data/site.ts and
 * the locale copy): the shell is another way in, never a new claim. Output is
 * structured data rendered as React text, never HTML.
 */

export type ShellTone = "dim" | "accent" | "ok" | "concept" | "error";

export type ShellLine =
  | { kind: "text"; text: string; tone?: ShellTone; latin?: boolean }
  | { kind: "pair"; label: string; value: string }
  | { kind: "link"; label: string; href: string; meta?: string; external?: boolean; download?: boolean }
  | {
      kind: "project";
      slug: string;
      name: string;
      status: string;
      concept: boolean;
      line: string;
      year: string;
      href: string;
    }
  | { kind: "command"; name: string; description: string }
  | { kind: "copy"; value: string };

export type ShellEffect =
  | { type: "navigate"; href: string }
  | { type: "scroll"; target: string }
  | { type: "ask"; prompt: string }
  | { type: "clear" }
  | { type: "locale"; href: string };

export type ShellResult = { lines: ShellLine[]; effect?: ShellEffect };

/** Everything the shell may print, prepared on the server in one locale. */
export type ShellData = {
  locale: "en" | "ar";
  name: string;
  role: string;
  otherLocaleHref: string;
  copy: {
    helpTitle: string;
    help: Record<CommandName, string>;
    notFound: string;
    openUsage: string;
    openNotFound: string;
    opening: string;
    jumping: string;
    projectsSummary: string;
    projectsHint: string;
    skillsCore: string;
    skillsPractical: string;
    cvLine: string;
    contactLine: string;
    asking: string;
    askUsage: string;
    sudo: string;
    switching: string;
    more: string;
    aliases: Record<string, string>;
  };
  projects: {
    slug: string;
    name: string;
    status: string;
    concept: boolean;
    line: string;
    year: string;
    href: string;
  }[];
  counts: { total: number; working: number; concepts: number };
  about: { lede: string; facts: { label: string; value: string }[]; think: string[]; href: string };
  skills: { core: string[]; practical: string[]; href: string };
  recognition: { year: string; title: string; outcome: string }[];
  recognitionHref: string;
  cv: { label: string; href: string; meta: string }[];
  resumeHref: string;
  contact: { email: string; links: { label: string; href: string }[]; href: string };
};

export const COMMANDS = [
  "whoami",
  "projects",
  "open",
  "work",
  "about",
  "skills",
  "recognition",
  "cv",
  "contact",
  "ask",
  "lang",
  "clear"
] as const;

export type CommandName = (typeof COMMANDS)[number];

/** Words a visitor might reasonably try, mapped to the command they mean. */
const SYNONYMS: Record<string, CommandName | "help" | "sudo"> = {
  help: "help",
  "?": "help",
  man: "help",
  ls: "projects",
  projects: "projects",
  project: "projects",
  open: "open",
  cd: "open",
  cat: "open",
  work: "work",
  about: "about",
  skills: "skills",
  stack: "skills",
  recognition: "recognition",
  achievements: "recognition",
  milestones: "recognition",
  cv: "cv",
  resume: "cv",
  contact: "contact",
  mail: "contact",
  email: "contact",
  ask: "ask",
  guide: "ask",
  lang: "lang",
  ar: "lang",
  en: "lang",
  arabic: "lang",
  english: "lang",
  clear: "clear",
  cls: "clear",
  whoami: "whoami",
  sudo: "sudo",
  hire: "sudo"
};

/** Paths `cd` and `open` understand besides project names. */
const PLACES: Record<string, CommandName> = {
  "~/work": "work",
  work: "work",
  "~": "whoami",
  about: "about",
  skills: "skills",
  recognition: "recognition",
  achievements: "recognition",
  resume: "cv",
  cv: "cv",
  contact: "contact"
};

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/^["'«“]+|["'»”?!.]+$/g, "");
}

/** Finds a project by slug, a slug prefix (3+ letters) or its shown name. */
export function findProject(data: ShellData, query: string) {
  const wanted = normalize(query).replace(/^~\/(projects\/)?/, "").replace(/\/$/, "");

  if (!wanted) return undefined;

  return (
    data.projects.find((project) => project.slug === wanted || normalize(project.name) === wanted) ??
    (wanted.length >= 3 ? data.projects.find((project) => project.slug.startsWith(wanted)) : undefined)
  );
}

/** Splits a line into the command it names and the rest, honouring Arabic aliases. */
export function parse(data: ShellData, input: string) {
  const line = input.trim().replace(/^[$%>#]\s*/, "");
  const [head = "", ...rest] = line.split(/\s+/);
  const word = head.toLowerCase();
  const alias = data.copy.aliases[head] ?? data.copy.aliases[word];
  const command = SYNONYMS[alias ?? word];

  return { line, head, command, args: rest.join(" ").trim() };
}

/** Completes the command or project name being typed; returns the input unchanged when ambiguous. */
export function complete(data: ShellData, input: string) {
  const match = /^(\s*)(\S*)(\s+)?(.*)$/.exec(input);

  if (!match) return input;

  const [, lead, head, gap, tail] = match;

  if (!gap) {
    const options = [...COMMANDS, "help"].filter((name) => name.startsWith(head.toLowerCase()));

    return head && options.length === 1 ? `${lead}${options[0]} ` : input;
  }

  if (["open", "cd", "cat"].includes(head.toLowerCase()) || data.copy.aliases[head] === "open") {
    const options = data.projects.map((project) => project.slug).filter((slug) => slug.startsWith(tail.toLowerCase()));

    return tail && options.length === 1 ? `${lead}${head} ${options[0]}` : input;
  }

  return input;
}

function projectLines(data: ShellData): ShellLine[] {
  return [
    { kind: "text", text: fill(data.copy.projectsSummary, data.counts), tone: "accent" },
    ...data.projects.map((project) => ({ kind: "project" as const, ...project })),
    { kind: "text", text: data.copy.projectsHint, tone: "dim" }
  ];
}

function help(data: ShellData): ShellLine[] {
  return [
    { kind: "text", text: data.copy.helpTitle, tone: "accent" },
    ...COMMANDS.map((name) => ({ kind: "command" as const, name, description: data.copy.help[name] }))
  ];
}

function open(data: ShellData, target: string): ShellResult {
  if (!target) return { lines: [{ kind: "text", text: data.copy.openUsage, tone: "dim" }] };

  const place = PLACES[normalize(target)];

  if (place) return run(data, place);

  const project = findProject(data, target);

  if (!project) {
    return { lines: [{ kind: "text", text: fill(data.copy.openNotFound, { name: target }), tone: "error" }] };
  }

  return {
    lines: [{ kind: "text", text: fill(data.copy.opening, { path: `~/projects/${project.slug}` }), tone: "dim" }],
    effect: { type: "navigate", href: project.href }
  };
}

/** Runs one line of input. Unknown words get a helpful error, never a crash. */
export function run(data: ShellData, input: string): ShellResult {
  const { line, head, command, args } = parse(data, input);

  if (!line) return { lines: [] };

  switch (command) {
    case "help":
      return { lines: help(data) };
    case "whoami":
      return {
        lines: [
          { kind: "text", text: data.name },
          { kind: "text", text: data.role, tone: "accent" }
        ]
      };
    case "projects":
      return { lines: projectLines(data) };
    case "open":
      return open(data, args);
    case "work":
      return { lines: [{ kind: "text", text: data.copy.jumping, tone: "dim" }], effect: { type: "scroll", target: "work" } };
    case "about":
      return {
        lines: [
          { kind: "text", text: data.about.lede },
          ...data.about.facts.map((fact) => ({ kind: "pair" as const, label: fact.label, value: fact.value })),
          ...data.about.think.map((principle, index) => ({ kind: "text" as const, text: `${index + 1}. ${principle}`, tone: "dim" as const })),
          { kind: "link", label: data.copy.more, href: data.about.href }
        ]
      };
    case "skills":
      return {
        lines: [
          { kind: "pair", label: data.copy.skillsCore, value: data.skills.core.join(" · ") },
          { kind: "pair", label: data.copy.skillsPractical, value: data.skills.practical.join(" · ") },
          { kind: "link", label: data.copy.more, href: data.skills.href }
        ]
      };
    case "recognition":
      return {
        lines: [
          ...data.recognition.map((item) => ({ kind: "pair" as const, label: item.year, value: `${item.title} — ${item.outcome}` })),
          { kind: "link", label: data.copy.more, href: data.recognitionHref }
        ]
      };
    case "cv":
      return {
        lines: [
          { kind: "text", text: data.copy.cvLine, tone: "dim" },
          ...data.cv.map((file) => ({ kind: "link" as const, label: file.label, href: file.href, meta: file.meta, download: true })),
          { kind: "link", label: data.copy.more, href: data.resumeHref }
        ]
      };
    case "contact":
      return {
        lines: [
          { kind: "copy", value: data.contact.email },
          ...data.contact.links.map((link) => ({ kind: "link" as const, label: link.label, href: link.href, external: true })),
          { kind: "text", text: data.copy.contactLine, tone: "dim" },
          { kind: "link", label: data.copy.more, href: data.contact.href }
        ]
      };
    case "ask":
      // With a question the guide asks it at once; without one it simply opens.
      return {
        lines: [{ kind: "text", text: args ? data.copy.asking : data.copy.askUsage, tone: "dim" }],
        effect: { type: "ask", prompt: args }
      };
    case "lang":
      return {
        lines: [{ kind: "text", text: data.copy.switching, tone: "dim" }],
        effect: { type: "locale", href: data.otherLocaleHref }
      };
    case "clear":
      return { lines: [], effect: { type: "clear" } };
    case "sudo":
      return {
        lines: [
          { kind: "text", text: data.copy.sudo, tone: "accent" },
          { kind: "copy", value: data.contact.email }
        ]
      };
    default: {
      // A bare project name opens it: `raqmi`, `chatub`, «رقمي».
      const project = findProject(data, line);

      if (project) return open(data, project.slug);

      return { lines: [{ kind: "text", text: fill(data.copy.notFound, { cmd: head }), tone: "error" }] };
    }
  }
}
