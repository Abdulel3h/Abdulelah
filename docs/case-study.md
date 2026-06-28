# Case Study

## Context

This repository is the portfolio system behind [abdulelah.de](https://www.abdulelah.de). It connects project case studies, resumes, blog content, contact flows, SEO metadata, and an optional portfolio assistant into one recruiter-facing product.

## Problem

A generic personal website does not explain AI engineering maturity quickly enough. The portfolio needed to present truthful project evidence, make role-specific review paths easy, and keep website copy, GitHub READMEs, and assistant responses aligned.

## Constraints

- Claims must remain factual and conservative.
- Project data needs to be reusable across pages and assistant responses.
- Optional services such as model APIs and email delivery cannot be required for local review.
- The site must remain fast and readable on mobile.

## Solution

The app uses Next.js App Router with structured data modules for identity, projects, skills, achievements, and metadata. Server routes handle contact and assistant behavior, while the UI renders a dark, responsive portfolio with project pages and role-specific resume paths.

## Architecture

See [Architecture](architecture.md). The important design choice is that portfolio facts live in typed data files, then flow into pages, metadata, project cards, and assistant context.

## Key Engineering Decisions

- Use typed project data as the source of truth.
- Keep external AI and email integrations optional.
- Constrain assistant responses to portfolio context.
- Use explicit privacy and contact pages to avoid unclear data handling.

## Trade-Offs

- Structured content takes more maintenance than ad hoc page copy.
- Optional integrations make local setup easier but require clear environment documentation.
- A polished portfolio UI can drift into marketing unless claims are kept evidence-based.

## What I Learned

- Recruiter-facing AI products need the same discipline as user-facing apps: clear flows, fallback behavior, metadata, and truthful evidence.
- Centralized content reduces contradictions across the website, GitHub, and assistant responses.

## Current Limitations

- End-to-end tests should cover navigation, contact, resume downloads, and assistant flows.
- More screenshots are needed for project pages and recruiter paths.
- License and contribution posture still need owner-level decisions.

## Future Improvements

- Add automated link checks.
- Add Playwright coverage for critical routes.
- Add a portfolio changelog.
- Add deeper public notes for assistant prompt and retrieval boundaries.

## Reviewer Evaluation

Review `data/projects.ts`, `data/site.ts`, `lib/agent/*`, API routes, metadata helpers, and the production build output. The project should be evaluated as a portfolio product and AI presentation layer, not as a general-purpose agent platform.
