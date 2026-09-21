<picture>
  <source media="(max-width: 600px)" srcset="assets/branding/hero-mobile.svg">
  <img src="assets/branding/hero.svg" width="100%" alt="Abdulelah.de — a portfolio you can ask. Next.js, typed project facts and a server-side AI assistant.">
</picture>

# Abdulelah.de · Bilingual AI Portfolio

A bilingual portfolio where the pages and the embedded assistant answer from the same typed source of facts, so what a visitor reads and what the assistant says cannot drift apart.

**Status: deployed product.** Live at [abdulelah.de](https://www.abdulelah.de).

## Problem

A portfolio and a chatbot bolted onto it usually disagree. The site says one thing, the assistant improvises another, and the visitor cannot tell which to trust. Meanwhile a recruiter has a narrow question — what did he actually build, and can I see it — and needs an answer in under a minute.

## Solution

Every portfolio fact lives in typed data modules. Pages, project cards, SEO metadata, structured data and the assistant all read from those same modules, so the assistant is constrained by the content rather than free to invent around it. Server route handlers keep model and email integrations off the client.

## How it works

1. **One source of facts.** `data/site.ts` holds identity, links and resume files; `data/projects.ts` holds every project in English and Arabic with its verified status, evidence, role, constraints, decisions, outcome and limitations.
2. **Pages render from it.** App Router pages and components compose those typed facts into the site.
3. **The assistant is constrained by it.** `lib/agent/*` maps recruiter and visitor questions into portfolio responses drawn from the same data.
4. **Integrations stay server-side.** `app/api/agent/*` and `app/api/contact/*` expose server-only behaviour; keys never reach the browser.
5. **Discoverability is generated, not hand-kept.** Sitemap (with hreflang alternates), robots, JSON-LD and Open Graph metadata derive from the same content.
6. **Two languages, one set of routes.** Pages live in `app/[locale]`; English keeps its unprefixed URLs (`/about`) and Arabic lives under `/ar` (`/ar/about`). `proxy.ts` rewrites, redirects `/en/...` to the canonical URL, and answers unknown URLs with a server-rendered 404.

## Architecture

```text
Browser
  -> Next.js App Router pages
  -> Server route handlers for contact and agent APIs
  -> Portfolio data modules in /data
  -> Agent logic in /lib/agent
  -> Optional external services: DeepSeek API, Resend, Vercel Analytics
```

## Verified capabilities

- Full English and Arabic versions of every public page (`lang`/`dir`, localized metadata, canonical + hreflang, bilingual sitemap)
- Seven case studies — ChatUB, Absher Insight AI, Stadium, Althil, Qanouni, Virtual Astronauts, Medad — each with a standard evidence panel: status, evidence, what is not claimed, limitations and next steps
- Evidence-based statuses: four working prototypes (three with public repositories) and three concepts; nothing is presented as shipped or in production
- Two role-specific CV downloads (AI Engineer, AI Specialist) on the Resume page
- Abdulelah's guide: a modal, bilingual portfolio assistant grounded in the same data, loaded on demand
- Site search (Ctrl/⌘ K), a "More" disclosure menu and a mobile menu with correct focus management
- Contact form with a real POST path (JSON, or a same-origin native form post without JavaScript), shared server/client validation and email delivery via Resend
- Privacy-conscious analytics: cookieless Vercel Web Analytics page views, anonymous journey events and real-user LCP/INP/CLS
- WCAG 2.2 AA-oriented UI: skip link, visible focus, contrast-checked tokens, reduced-motion support, no hover-only interactions

## Screenshot

![Portfolio homepage](assets/screenshots/portfolio-home.png)

Captured from the live portfolio homepage.

## Tech stack

Next.js 16 App Router (React 19 runtime) · TypeScript · Tailwind CSS · Radix UI Dialog · cmdk · lucide-react · Vercel Web Analytics · Resend · DeepSeek-compatible chat completion API · Vitest · Playwright + axe-core

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Other scripts:

```bash
npm run lint        # ESLint (Next core-web-vitals + TypeScript rules)
npm run typecheck   # tsc --noEmit
npm test            # Vitest unit tests (routing, content evidence, contact validation, SEO)
npm run build
npm run test:e2e    # Playwright + axe against the production build (uses the installed Chrome)
```

Optional environment variables:

```bash
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-flash
RESEND_API_KEY=
CONTACT_TO_EMAIL=me@abdulelah.de
CONTACT_FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"
NEXT_PUBLIC_SITE_URL=https://www.abdulelah.de
```

The assistant and contact delivery are optional: without keys the site runs, and those routes degrade rather than break.

## Limitations

- **Project visuals are concept sketches.** The code-drawn previews on the site are labelled "Concept visualization"; real screenshots live in the public project repositories and are linked from each evidence panel.
- **Althil, Qanouni, Medad and Virtual Astronauts have no public code.** Their case studies say so and link only to program records.
- **Lab LCP.** The hero now paints its text immediately (observed LCP equals FCP), but Lighthouse's simulated mobile LCP still charges the framework JavaScript that loads before first paint.
- **No formatter.** Style is enforced by ESLint; there is no Prettier configuration.

## Repository structure

```text
app/                 App Router pages, API routes, sitemap, robots, errors
components/          Layout, sections, project UI, agent UI, shared controls
data/                Portfolio facts, projects, skills, achievements, blog data
lib/                 Metadata, structured data, contact, rate limit, agent logic
public/              Open Graph images, profile assets, fonts, resume PDFs
types/               Shared TypeScript types
tests/unit           Vitest unit tests
tests/e2e            Playwright browser, keyboard, accessibility and link tests
```

## Documentation

[Content guidelines](docs/content-guidelines.md) · [Architecture](docs/architecture.md) · [Case study](docs/case-study.md) · [Engineering principles](docs/engineering-principles.md) · [Technical decisions](docs/technical-decisions.md) · [Reviewer guide](docs/reviewer-guide.md) · [Branding assets](assets/branding/README.md)

## License

No license file is currently present. All rights are reserved by default unless a license is added.

## Contact

**Abdulelah Alkhathami** · [Portfolio](https://abdulelah.de) · [GitHub](https://github.com/Abdulel3h) · [Email](mailto:me@abdulelah.de)
