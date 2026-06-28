# Testing and CI

This repository uses GitHub Actions as the public quality gate for the portfolio website.

## Local Validation

Run these commands before opening a pull request:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev --audit-level=high
```

## CI Workflow

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`.

The workflow validates:

- dependency installation with `npm ci`
- ESLint
- TypeScript with `tsc --noEmit`
- production build with `next build`
- high-severity production dependency audit

## Current Coverage

The current gate is focused on static validation and production build confidence. It does not yet include browser or API integration tests.

## Recommended Next Tests

- Add Playwright checks for homepage, project pages, resume downloads, contact validation, and Agent Abdulelah open/close behavior.
- Add API tests for contact routing and assistant fallback behavior.
- Add a link checker for external portfolio, GitHub, LinkedIn, and resume URLs.
