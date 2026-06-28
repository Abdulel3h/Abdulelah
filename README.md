# Abdulelah AI Portfolio

Premium AI Engineer portfolio for Abdulelah Alkhathami. The site positions the public website, project case studies, role-specific resumes, bilingual AI writing, and Agent Abdulelah as one unified portfolio system.

## Overview

This repository powers [abdulelah.de](https://www.abdulelah.de). It is built as a recruiter-facing AI portfolio, not a generic personal site. The content focuses on LLM applications, NLP, RAG-style assistants, AI automation concepts, applied AI projects, and cloud AI exposure.

## Documentation

- [Architecture](docs/architecture.md)

## Features

- AI Engineer homepage with proof-oriented project positioning
- Project case-study pages for ChatUB, Althil, Absher Insight AI, Qanouni, Medad, and Virtual Astronauts
- Role-specific resume downloads for AI Engineer and AI Specialist paths
- Agent Abdulelah, an embedded portfolio assistant with recruiter-mode responses
- Blog and Arabic blog content for AI agents, university AI, cloud AI, and responsible AI UX
- SEO metadata, JSON-LD structured data, sitemap, robots, and Open Graph assets
- Responsive dark interface with reduced-motion handling and mobile navigation
- Contact route with email delivery via Resend when configured

## Architecture

```text
Browser
  -> Next.js App Router pages
  -> Server route handlers for contact and agent APIs
  -> Portfolio data modules in /data
  -> Agent logic in /lib/agent
  -> Optional external services: DeepSeek API, Resend, Vercel Analytics
```

The site keeps most portfolio facts in typed data files so copy, project cards, project pages, SEO, and assistant responses can stay aligned.

## Tech Stack

- Next.js 16 App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI primitives
- lucide-react icons
- Vercel Analytics
- Resend for contact email
- DeepSeek-compatible chat completion API for optional assistant responses

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Usage

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Configure optional environment variables:

```bash
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-flash
RESEND_API_KEY=
CONTACT_TO_EMAIL=me@abdulelah.de
CONTACT_FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"
NEXT_PUBLIC_SITE_URL=https://www.abdulelah.de
```

## Screenshots

Screenshots are not committed yet. Add desktop and mobile captures from the homepage, projects page, resume page, and Agent Abdulelah panel before using this repository as a pinned GitHub project.

## System Design

- `data/site.ts` is the canonical source for identity, links, SEO keywords, contact addresses, and resume links.
- `data/projects.ts` is the canonical source for project descriptions, role, technologies, features, and impact copy.
- `lib/agent/*` maps recruiter and visitor questions into constrained portfolio responses.
- `app/api/agent/*` and `app/api/contact/*` expose server-only API behavior.
- `components/sections/*` and `components/projects/*` render the portfolio experience.

## Folder Structure

```text
app/                 App Router pages, API routes, sitemap, robots, errors
components/          Layout, sections, project UI, agent UI, shared controls
data/                Portfolio facts, projects, skills, achievements, blog data
lib/                 Metadata, structured data, contact, rate limit, agent logic
public/              Open Graph images, profile assets, fonts, resume PDFs
types/               Shared TypeScript types
```

## Challenges

- Keeping the website, GitHub profile, project READMEs, and assistant responses consistent.
- Avoiding overclaiming while still making the AI engineering direction clear.
- Balancing animation polish with mobile readability and recruiter scan speed.
- Maintaining Arabic and English content without breaking SEO or typography.

## Future Work

- Add real project screenshots and architecture diagrams for every project page.
- Add automated link checks for external project, GitHub, LinkedIn, and resume URLs.
- Add e2e tests for navigation, resume downloads, contact form validation, and assistant open/close behavior.
- Add a public portfolio changelog so recruiters can see active maintenance.
- Connect repository descriptions and topics on GitHub to match the website taxonomy.

## License

No license file is currently present. All rights are reserved by default unless a license is added.

## Author

Abdulelah Alkhathami

## Contact

- Website: [abdulelah.de](https://www.abdulelah.de)
- GitHub: [Abdulel3h](https://github.com/Abdulel3h)
- Email: [me@abdulelah.de](mailto:me@abdulelah.de)
