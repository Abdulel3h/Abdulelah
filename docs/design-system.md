# The design system

English (`/...`) and Arabic (`/ar/...`) are one site in two languages. Both use the same compositions, components, tokens, shapes and motion. Copy, type values and reading direction are set per locale. The design was first made for Arabic and then carried over to English. It was not mirrored mechanically: Arabic comes first in the design, and English gets its own natural copy and type.

## Concept: «متن وحاشية» (text and gloss)

The idea comes from the Arabic manuscript page: a short main text (المتن) with brass margin notes (الحاشية) that carry the facts behind it. Here, every page opens with one short statement set large, and the facts sit beside it as glosses: role, status, code and evidence. Every claim sits next to its evidence.

- **No portrait.** The site carries no personal photo; the name, set large, is the opening, and the facts sit in the margin beside it.
- **Project worlds:** each project has a tint (`components/site/tints.ts`) for its halo and markers. Brass stays the interface accent; a tint never carries meaning on its own.
- **Projects first:** the home page opens on the name and one glossed sentence, with a strip of the four working projects. Then come those four projects as chapters, the three concepts, the milestones, one belief and a direct line.

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

## Rules worth keeping

- **Same density.** Where Arabic says one short line, English says one short line. English copy is natural English, not a translation.
- **Solid tones, never translucent text.** Connected Arabic letters overlap at their joins, so alpha colour leaves seams inside words. Use `.ds-tone-*`, not `text-paper/60`. English uses the same tones.
- **Mixed text goes through `mixed(text, locale)`** (`components/site/mixed.tsx`). On Arabic pages it isolates every Latin run as `lang="en" dir="ltr"`, and before a multi-word Latin name it adds a narrow no-break space after a prefixed «و». On English pages it isolates Arabic runs as `lang="ar" dir="rtl"`.
- **No logical margins on LTR isolates.** On a `dir="ltr"` element inside Arabic, `ms-*`/`me-*` resolve in its own direction. Space such elements with the parent's `gap`. Keep Latin names inline inside RTL blocks, so that wrapped lines align right.
- **Icons by meaning** (`directional(locale)` in `primitives.tsx`). Forward (open, next) points the way the page reads, back points the other way, and leaving the site is ↗ in English and ↖ in Arabic. Brand marks, play, search, mail and download never flip.
- **Numerals.** Western digits everywhere, in both languages.
- **Motion.** Text is never hidden on load. Plates wipe in once from the reading side, rules draw from the inline start, and arrows step forward on hover. All of it is off under `prefers-reduced-motion`.
- **Language switch.** It keeps the reader on the same page in the other language (`switchLocaleHref`). It is a full page load, because direction and typeface change.
