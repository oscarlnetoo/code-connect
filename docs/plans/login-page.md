# Login page (apps/web)

## Context
`apps/web` is still the Vite scaffold (no Tailwind, router or test runner). We need the Code Connect login page using `public/banner-login.png`, `public/gmail.png`, `public/github.png`. The registration page will come later with the **same layout but a different banner and form**, so the layout must be a reusable template that receives the banner and the form as props/children. Decisions: Portuguese copy, react-router, client-side validation + `onSubmit` prop (no API call).

## Setup
- Deps: `react-router`; dev: `tailwindcss`, `@tailwindcss/vite`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.
- [vite.config.ts](../../apps/web/vite.config.ts): add `tailwindcss()` plugin and a `test` block (`environment: 'jsdom'`, `setupFiles: './src/test/setup.ts'`, `globals: false`) — use `/// <reference types="vitest/config" />`.
- `src/test/setup.ts`: import `@testing-library/jest-dom/vitest`, `afterEach(cleanup)`.
- [package.json](../../apps/web/package.json): add `"test": "vitest run"`; root `package.json`: add `web:test` proxy like the existing `web:*` scripts.
- [index.css](../../apps/web/src/index.css): replace scaffold styles with `@import "tailwindcss";` + `@theme` tokens from the Code Connect design (dark bg `#00090E`, surface `#171D1F`, accent green `#81FE88`, offwhite `#E1E1E1`, gray `#888888`/`#BCBCBC`, font `Prompt`). Load Prompt via Google Fonts in [index.html](../../apps/web/index.html); set `lang="pt-BR"`, title "Code Connect".
- Delete `App.css`, `src/assets/{hero.png,react.svg,vite.svg}` (scaffold only).

## Components (atomic design, `src/components/...`, each with a co-located `*.test.tsx`)
**atoms**
- `Button` — primary green button, `type`, `children`, optional trailing icon (→ arrow), passes rest props.
- `Input` — styled `<input>` forwarding props (`aria-invalid` styling).
- `Checkbox` — styled checkbox + label.
- `TextLink` — wraps react-router `Link` with design styling.
- `Divider` — horizontal line with centered text ("ou entre com outras contas").

**molecules**
- `FormField` — label + `Input` + error message (`id`/`htmlFor`, `aria-describedby`).
- `SocialLoginButton` — button rendering provider logo (`src`, `alt`; the PNGs already contain the "Gmail"/"Github" label).

**organisms**
- `LoginForm` — fields "Email ou usuário" and "Senha"; row with "Lembrar-me" checkbox + "Esqueci a senha" link; "Login" button. Controlled state; on submit validates required fields, shows errors, otherwise calls `onSubmit({ identifier, password, remember })`.
- `SocialLogin` — `Divider` + list of `SocialLoginButton` from a `providers` prop (`[{ name, logo }]`), `onSelect(name)` callback. Reusable on registration.

**templates**
- `AuthLayout` — the shared shell: full-screen dark bg, centered card with `banner: { src, alt }` on the left (hidden on small screens) and a content column on the right containing `title`, `subtitle`, `children` (the form), and an optional `footer` slot. Registration will reuse it by passing a different banner/form/footer.

**pages**
- `LoginPage` — composes `AuthLayout` (banner `/banner-login.png`, title "Login", subtitle "Boas-vindas! Faça seu login.") + `LoginForm` + `SocialLogin` (Github, Gmail) + footer "Ainda não tem conta? **Crie seu cadastro!**" → `/register`. Submit handler `console.info` for now.

## Routing
- [main.tsx](../../apps/web/src/main.tsx): wrap in `BrowserRouter`.
- [App.tsx](../../apps/web/src/App.tsx): `Routes` — `/` → `Navigate` to `/login`, `/login` → `LoginPage`. No `/register` route yet (link exists, page comes later).

## Tests (essential usage per component)
- Atoms: render, variants/props forwarded, click/change events.
- `FormField`: label association, error shown + `aria-invalid`.
- `LoginForm`: empty submit shows errors and does not call `onSubmit`; filled submit calls it with values incl. `remember`.
- `SocialLogin`: renders each provider, `onSelect` called with name.
- `AuthLayout`: renders banner alt, title, subtitle, children, footer.
- `LoginPage`: renders inside `MemoryRouter`, register link points to `/register`.

## Verification
- `pnpm --filter web test`, `pnpm web:lint`, `pnpm build`.
- `pnpm web:dev` → open http://localhost:5173 (redirects to `/login`), check layout on desktop and mobile width, submit empty/filled form.
