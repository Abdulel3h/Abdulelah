# The design system

English (`/...`) and Arabic (`/ar/...`) are one site in two languages. Both use the same compositions, components, tokens, shapes and motion. Copy, type values and reading direction are set per locale. The design was first made for Arabic and then carried over to English. It was not mirrored mechanically: Arabic comes first in the design, and English gets its own natural copy and type.

## Concept: «متن وحاشية» (text and gloss)

The idea comes from the Arabic manuscript page: a short main text (المتن) with brass margin notes (الحاشية) that carry the facts behind it. Here, every page opens with one short statement set large, and the facts sit beside it as glosses: role, status, code and evidence. Every claim sits next to its evidence.

- **No portrait.** The site carries no personal photo; the name, set large, is the opening, and the facts sit in the margin beside it.
- **Project worlds:** each project has a tint (`components/site/tints.ts`) for its halo and markers. Brass stays the interface accent; a tint never carries meaning on its own.
- **Projects first:** the home page opens on the name and one glossed sentence, with a strip of the working projects. Then come those projects as chapters, the three concepts, the milestones, one belief and a direct line.
- **Featured-project notice:** one quiet link above the name, made from the strip cards' material, points to the newest project (`Notice` in `Hero.tsx`, `.ds-notice`). It is not a popup, a banner or a toast, and it has nothing to dismiss. It settles in once with the hero. Its label reads "New project" for now. When the project is no longer new, change the label to "Featured project", or remove it, and the notice still works without a redesign.

## Layer: the Signature Terminal — «المتن والطرفية» (statement and shell)

Added in November 2026 on top of the concept above (`app/shell.css`, loaded after `site.css`). The gloss becomes live: the site speaks in two voices.

- **The human voice states:** Fraunces in English, Thmanyah Bold in Arabic — the name, titles, statements.
- **The system voice prints the evidence:** Geist Mono in English (`--font-mono`, the same mono as the GitHub profile's Signature Terminal), Thmanyah Medium in Arabic — kickers, labels, status badges, paths, commands and their output. Kickers can carry a path (`~/work`, `Kicker` in `primitives.tsx`); the path is decoration and hidden from screen readers.
- It is Raqmi's thesis made visible ("the model proposes, the system decides") and keeps every claim beside its evidence. Code, paths and commands are Latin isolates in both languages and never flip.

| Piece | What it does | Where |
| --- | --- | --- |
| Opening | `~ $ whoami` types itself; the name is painted in its final tone from the first frame (it stays the first and largest paint); a brass caret with a faint trail crosses it once in the reading direction, moved by `transform` alone on the compositor. Role line in the system voice. | `components/site/home/Hero.tsx` |
| Shell | A real command line beside the name (below it on smaller screens). Chips are plain links without JavaScript; with it they type their command. Every line it prints restates `data/*` or the locale copy. Commands stay Latin and also answer Arabic words. Keyboard: Enter, ↑/↓ history, Tab completes only when there is something to complete, Ctrl+L clears. Analytics records only the recognised command name. | `components/site/shell/Shell.tsx`, `lib/shell/*` |
| Stacked chapters | On wide screens (≥ 64rem) the five working projects are cards that stick and stack while the page scrolls normally (CSS `position: sticky`, no scroll-jacking); the card beneath recedes (scale ≤ 4.5% and a shade). Sticking points are measured so a card taller than the screen sticks by its end; focus entering a covered card scrolls it back on top. The stack arms in idle time once it nears the screen, and writes only `top`, `transform` and `opacity` (never custom properties, which would restyle each card's whole subtree). Phones and tablets: cards are taller than the screen, so they do not stack; each card's title bar sticks under the header instead (CSS only). No JavaScript, a short screen (< 560px) or reduced motion: a plain column, or no recede. | `components/site/work/StackedChapters.tsx`, `StackController.tsx` |
| Windows | Inner pages use the same surface for facts: `cat profile` (About), `cat …/facts` (case study), `mail` and `compose` (Contact), the CV files (Resume), the skill groups. | `.sh-window` |
| Skills | A level filter (native radios switched by `:has()`, no JavaScript) and a matrix of the technologies each working project lists in `data/projects.ts` — a dot means the project's own record names it. | `components/site/pages/Skills.tsx` |
| Recognition | Year by year: the year is pinned in the margin (CSS sticky) while its entries pass on one rail. | `components/site/pages/Achievements.tsx` |
| About | The four principles as one pipeline, handing on in the reading direction. | `components/site/pages/About.tsx` |

Motion added by the layer keeps the rules below: typing and the read-head run once on load, output lines rise without fading, the stack's recede follows the scroll position, and none of it runs under reduced motion. No new dependencies: CSS plus two small client components.

## Architecture

| Piece | Where |
| --- | --- |
| Compositions (home, projects, case study, about, contact, resume, skills, achievements, notes, privacy, 404, error, form results) | `components/site/**`, each taking a `locale` |
| Header, menu, footer | `components/site/layout/*`, used by `app/[locale]/layout.tsx` |
| Copy the compositions say, and the five-line project briefs | `lib/i18n/experience/{en,ar}.ts` (same shape, checked by a unit test) |
| Strings for shared components, metadata, 404 and error | `lib/i18n/dictionaries/{en,ar}.ts` (same shape) |
| Tokens, locale type, direction, layout primitives, type roles, motion (`.ds-*`) | `app/site.css` |
| Share images | `public/images/og/abdulelah-og-{en,ar}.png`, rendered by `scripts/generate-og.mjs` |

Each route renders the same composition for both languages, for example `<CaseStudy project={project} locale={locale} />`. Facts come from `data/*`; the briefs only restate them.

## Flagship case studies

A project can tell a longer story than the standard case study through optional `story` blocks in `data/projects.ts`: the problem as real requests, one principle, a grouped architecture, a captured moment, an evaluation with its failures, guardrails, checks and model paths. `components/site/work/Story.tsx` renders whichever blocks a project has, in both languages, between the standard sections. Raqmi is the first project to use them. Every figure in a block travels with its scope, as its source states it.

## What changes with the locale

`app/site.css` keeps one set of shared tokens (colour, spacing, radius, motion, container width, project tint) and sets type per language:

| Role | English | Arabic |
| --- | --- | --- |
| Display, headings, statement, quotes | Fraunces 400–500, tracked tight (−0.015 to −0.025em), line height 0.98–1.3 | Thmanyah 700, no tracking, line height 1.14–1.62 |
| Body, labels | Inter, line height 1.6–1.75 | Thmanyah, line height 1.8–2 |
| Kicker, label | Small tracked capitals | Brass, medium weight, untracked |
| Measure | 38rem | 36rem |

Direction-specific rules live in one place: forward arrows point and step in the reading direction, rules draw from the inline start, and plates wipe in from the reading side. Everything else uses logical properties.

## Motion

Motion explains, it does not decorate. Every movement has one job: show a state change, show cause and effect, keep the reader oriented, or tell a project's idea. If a movement has none of those jobs, it is removed.

- **Tokens.**
  - Easing is `--ds-ease` (enter) and `--ds-ease-in` (exit). `--ease-out` in `globals.css` is the same curve as `--ds-ease`.
  - Durations are `--ds-fast` (0.18s, colour and press feedback), `--ds-ui` (0.32s: arrows, hairlines, the page settling) and `--ds-slow` (0.9s).
  - The project signal runs on the beat grid: `--beat-start`, `--beat-gap` and `--beat-len` in `globals.css`.
- **Ladder: CSS, then Motion for React, then GSAP, then Rive.** Use the lowest rung that does the job.
  - Today everything is CSS, plus small client hooks: `Reveal` and `PipelineStage`, both using `IntersectionObserver`, `requestAnimationFrame` for scroll position, and the Signature Terminal's `Shell` and `StackController`.
  - Motion, GSAP, Rive and Lenis were all evaluated (October 2026). None was needed, so none is installed.
- **Text never fades.**
  - On load, on scroll and on navigation, text keeps opacity 1 and only moves: `.ds-settle`, `.ds-rise` and `.page-enter`. A fade would show text below its own contrast for a moment, and that is exactly how an axe test used to fail at random.
  - Only plates (`.ds-wipe`, decorative) and dialogs, which have their own surface, fade.
- **Direction.**
  - Forward motion follows the reading direction: `--ds-forward-shift`, `directional(locale)`, hairlines drawn from the inline start, and the RTL variants of the beat fills.
  - A flow drawn top to bottom needs no mirroring. Code, brand marks and media never flip.
  - Arabic text moves as whole words or blocks, never as split letters. For example, `Belief` lights words.
- **Signature interactions.** At most one per project, placed next to the project's own component. Every project drawing acts out its four-step flow with the travelling signal (`PipelineStage`, `data-beat` 1–4).
  - **Raqmi** goes further, with an authorization gate (`components/site/work/GateExplorer.tsx`). The reader picks a captured scenario: order 1024 is allowed and run, order 5521 is denied and not run. The signal carries the model's proposal to the gate and crosses only when the application allows it.
  - The choice uses native radios switched by CSS `:has()`, so it works without JavaScript. The decision is drawn in static styles; motion only carries the signal.
- **Reduced motion** turns every animation and transition into an instant change (`globals.css`). `Reveal` and `PipelineStage` never hide or play anything, and the gate switches instantly with its Replay button hidden. No information depends on motion.
- **Not used, on purpose:** custom cursors, scroll-jacking, pinned scenes that hold the page while an animation plays (the stacked chapters stick with CSS while the page keeps scrolling at its own pace), parallax, endless loops (the shell has no blinking cursor at rest), glow pulses and page wipes.
- **Testing.** Wait for motion with a real signal (`motionSettled()` in `tests/e2e/quality.spec.ts`, using the Web Animations API), never with a sleep.

## Rules worth keeping

- **Same density.** Where Arabic says one short line, English says one short line. English copy is natural English, not a translation.
- **Solid tones, never translucent text.** Connected Arabic letters overlap at their joins, so alpha colour leaves seams inside words. Use `.ds-tone-*`, not `text-paper/60`. English uses the same tones.
- **Mixed text goes through `mixed(text, locale)`** (`components/site/mixed.tsx`). On Arabic pages it isolates every Latin run as `lang="en" dir="ltr"`, and before a multi-word Latin name it adds a narrow no-break space after a prefixed «و». On English pages it isolates Arabic runs as `lang="ar" dir="rtl"`.
- **No logical margins on LTR isolates.** On a `dir="ltr"` element inside Arabic, `ms-*`/`me-*` resolve in its own direction. Space such elements with the parent's `gap`. Keep Latin names inline inside RTL blocks, so that wrapped lines align right.
- **Icons by meaning** (`directional(locale)` in `primitives.tsx`). Forward (open, next) points the way the page reads, back points the other way, and leaving the site is ↗ in English and ↖ in Arabic. Brand marks, play, search, mail and download never flip.
- **Numerals.** Western digits everywhere, in both languages.
- **Motion.** See the Motion section above: text never fades, motion follows the reading direction, and none of it runs under `prefers-reduced-motion`.
- **Language switch.** It keeps the reader on the same page in the other language (`switchLocaleHref`). It is a full page load, because direction and typeface change.
