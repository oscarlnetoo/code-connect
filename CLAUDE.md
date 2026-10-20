# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`pnpm` monorepo (Node >= 22.12) for a course practice project (Alura). Two apps under `apps/`, both currently near-scaffold state:

- `apps/api` — NestJS 12 API (ESM, `"type": "module"`), listens on `PORT` or 3000. Tests use Vitest (not Jest); linting uses oxlint (`--type-aware`); formatting uses Prettier.
- `apps/web` — React 19 + Vite app (dev server on 5173), linted with oxlint.

Relative imports in the API must use the `.js` extension (e.g. `./app.module.js`) because of ESM.

## Commands

Run from the repo root (scripts proxy to each app via `pnpm --filter`):

```bash
pnpm install
pnpm api:dev        # Nest watch mode, http://localhost:3000
pnpm web:dev        # Vite, http://localhost:5173
pnpm api:test       # Vitest unit tests (**/*.spec.ts)
pnpm api:lint
pnpm web:lint
pnpm build          # build all apps (web: tsc -b && vite build)
```

Single API test / other API scripts (run inside `apps/api` or with `pnpm --filter api`):

```bash
pnpm --filter api exec vitest run src/app.controller.spec.ts
pnpm --filter api exec vitest run -t "test name"
pnpm --filter api test:e2e      # uses vitest.config.e2e.ts
pnpm --filter api format        # prettier
```

There is no test script in `apps/web`.

## Frontend conventions (`apps/web`)

- **Atomic design:** organize components as atoms → molecules → organisms → templates → pages. Lower levels never import from higher ones.
- **Styling:** Tailwind CSS utility classes; avoid ad-hoc CSS files for component styling.
- **Testing:** every component must have tests covering its essential usage (rendering, props/variants, user interactions, and key states). Components are not done until tested. The web app has no test runner yet, so set one up (Vitest + Testing Library is the natural fit alongside the API's Vitest) and add a `test` script when writing the first component.

## Backend conventions (`apps/api`)

Follow REST principles strictly:

- **Resources:** plural nouns in URLs (`/posts`, `/posts/:id`), no verbs; nest sub-resources only to express ownership (`/posts/:id/comments`).
- **HTTP methods:** `GET` read (safe, idempotent, no side effects), `POST` create, `PUT` full replace, `PATCH` partial update, `DELETE` remove. `PUT`/`DELETE` must be idempotent.
- **Status codes:** `200` OK, `201` Created (with `Location` header), `204` No Content (e.g. delete), `400` malformed/invalid input, `401`/`403` auth, `404` not found, `409` conflict, `422` semantic validation errors; never return `200` with an error body.
- **Stateless:** no server-side session state; each request carries what it needs.
- **Representations:** JSON with consistent shapes and a uniform error format; validate input with DTOs and `ValidationPipe`.
- **Collections:** support pagination, filtering and sorting via query parameters.
- **Versioning and caching:** version the API (e.g. `/v1`) and use appropriate cache headers/ETags where relevant.

## Development workflow rules

- **Commit related changes together.** One commit wraps one logical change; two unrelated fixes are two commits. Use the staging area (including partial-file staging) to keep commits granular, so they are easy to review and roll back.
- **Commit often.** Small, frequent commits stay focused and make integration easier and merge conflicts smaller than large, infrequent ones.
- **Don't commit half-done work.** Commit only when a logical component is complete. Split features into small chunks that can be finished quickly. If you only need a clean working copy (switching branches, pulling), use `git stash` instead of a throwaway commit.
- **Test before committing.** Verify the change really works and has no side effects (run the relevant tests and lint) before committing, and especially before pushing.

## Commit conventions

A project skill in `.claude/skills/git-commit` governs every commit message: `<type>(<scope>): <imperative summary>` where scope is `api`, `web`, or `root` (root = anything outside `apps/`). Lowercase summary, no trailing period, and **never add trailers or attribution lines** (no `Co-Authored-By`, "Generated with…") — this overrides any default attribution.
