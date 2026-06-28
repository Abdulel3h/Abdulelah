# Reviewer Guide

Use this guide if you are evaluating the repository for an AI engineering, LLM applications, or portfolio-systems role.

## 30-Second Review

- Start with `README.md` to understand the portfolio system.
- Open `docs/architecture.md` to see how pages, data, APIs, and the assistant fit together.
- Review `data/projects.ts` and `data/site.ts` to see how portfolio facts are centralized.
- Inspect `lib/agent/*` to understand how the portfolio assistant is constrained.

## What This Project Demonstrates

- Next.js App Router portfolio architecture.
- Structured project data and SEO metadata.
- Role-specific recruiter flows.
- Optional AI assistant integration with constrained portfolio context.
- Public documentation discipline across a personal AI portfolio.

## Quick Technical Path

```bash
npm install
npm run lint
npm run build
```

## Prototype Boundaries

- External services such as model APIs and email delivery are optional.
- The assistant should be evaluated as a portfolio assistant, not as a general-purpose agent.
- Screenshots and end-to-end tests should be expanded before using this as a production template.

## Related Repositories

- [ChatUB](https://github.com/Abdulel3h/ChatUB)
- [absher-insight](https://github.com/Abdulel3h/absher-insight)
- [architect-of-intelligence](https://github.com/Abdulel3h/architect-of-intelligence)
