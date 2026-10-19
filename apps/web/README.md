# Web

Web front end of Code Connect, built with [React](https://react.dev/), TypeScript and [Vite](https://vite.dev/). Linting runs with Oxlint.

## Prerequisites

Before starting, make sure you've met the following requirements:

- You have installed version 22.12 or newer of `Node.js`.
- You have installed `pnpm` (<https://pnpm.io/installation>).

## Installing the Project

Below are the steps to install the web app. Run them from the repository root.

1. Clone the repository

    ```bash
    git clone https://github.com/oscarlnetoo/code-connect.git
    cd code-connect
    ```

2. Install the dependencies

    ```bash
    pnpm install
    ```

## Using the Project

To use the web app, follow these steps:

```bash
pnpm --filter web dev
```

The app is served at `http://localhost:5173`.

Other helpful commands (from the root, or without `--filter web` inside `apps/web`):

```bash
pnpm --filter web build     # Type-check and build to dist/
pnpm --filter web preview   # Preview the production build
pnpm --filter web lint      # Lint
```
