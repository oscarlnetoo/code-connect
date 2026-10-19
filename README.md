# Code Connect

Code Connect is a `pnpm` monorepo made of a NestJS API (`apps/api`) and a React + Vite web app (`apps/web`).

This project is a practice exercise from the Alura course **Software engineering in the age of AI: how to use AI in the real development workflow** (*Engenharia de software na era da IA: como usar IA no fluxo real de desenvolvimento*). Course link: https://cursos.alura.com.br/course/engenharia-software-ia-no-fluxo-real-de-desenvolvimento

## Prerequisites

Before starting, make sure you've met the following requirements:

- You have installed version 22.12 or newer of `Node.js`.
- You have installed `pnpm` (<https://pnpm.io/installation>).
- You have installed `Git`.
- You have read the READMEs of each app: [`apps/api`](apps/api/README.md) and [`apps/web`](apps/web/README.md).

## Installing the Project

Below are the steps to install and set up the monorepo.

1. Clone the repository

    ```bash
    git clone https://github.com/oscarlnetoo/code-connect.git
    ```

2. Enter the project folder

    ```bash
    cd code-connect
    ```

3. Install the dependencies of all apps

    ```bash
    pnpm install
    ```

## Using the Project

To use Code Connect, follow these steps:

```bash
# Terminal 1: start the API (http://localhost:3000)
pnpm api:dev

# Terminal 2: start the web app (http://localhost:5173)
pnpm web:dev
```

Other helpful root scripts:

```bash
pnpm api:start     # Start the API without watch mode
pnpm api:build     # Build the API
pnpm api:test      # Run the API unit tests
pnpm api:lint      # Lint the API
pnpm web:build     # Type-check and build the web app
pnpm web:preview   # Preview the production build of the web app
pnpm web:lint      # Lint the web app
pnpm build         # Build every app
```
