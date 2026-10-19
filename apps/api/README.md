# API

REST API of Code Connect, built with [NestJS](https://nestjs.com/) and TypeScript. Tests run with Vitest and linting with Oxlint.

## Prerequisites

Before starting, make sure you've met the following requirements:

- You have installed version 22.12 or newer of `Node.js`.
- You have installed `pnpm` (<https://pnpm.io/installation>).

## Installing the Project

Below are the steps to install the API. Run them from the repository root.

1. Clone the repository

    ```bash
    git clone https://github.com/oscarlnetoo/code-connect.git
    cd code-connect
    ```

2. Install the dependencies

    ```bash
    pnpm install
    ```

3. (Optional) Set the port the API listens on. It defaults to `3000`.

    ```bash
    PORT=3000
    ```

## Using the Project

To use the API, follow these steps:

```bash
pnpm --filter api start:dev
```

The API is served at `http://localhost:3000`.

Other helpful commands (from the root, or without `--filter api` inside `apps/api`):

```bash
pnpm --filter api start        # Run without watch mode
pnpm --filter api build        # Build to dist/
pnpm --filter api start:prod   # Run the built app
pnpm --filter api test         # Unit tests
pnpm --filter api test:e2e     # End-to-end tests
pnpm --filter api test:cov     # Test coverage
pnpm --filter api lint         # Lint
pnpm --filter api format       # Format with Prettier
```
