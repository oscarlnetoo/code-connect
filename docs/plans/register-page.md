# Registration page (`/register`)

## Context
`LoginPage` already links to `/register` ("Crie seu cadastro!"), but no route exists. The Figma frame `155:3469` ("Cadastro") is the same layout as Login: banner on the left, form on the right. The form has Nome, Email and Senha fields, a "Lembrar-me" checkbox, a "Cadastrar →" button, the social-login block, and the footer "Já tem conta? Faça seu login!". Almost everything already exists, so the work is one new organism, one page and a route.

## Reuse (no changes)
- `templates/AuthLayout.tsx`: banner, title, subtitle, children and footer
- `organisms/SocialLogin.tsx`: the "ou entre com outras contas" block with Github and Gmail (same `/github.png` and `/gmail.png`)
- `molecules/FormField.tsx`, `atoms/Checkbox.tsx`, `atoms/Button.tsx` (with the `→` icon, as in LoginForm), `atoms/TextLink.tsx`

## New files
1. **Asset**: download the Figma banner (`imgRectangle1726` from `get_design_context`) with `curl -L` to `apps/web/public/banner-register.png`. The design crops it (`left:-89.74%; width:248.77%`), so `object-cover` should keep roughly the right part of the image in view. If the default center crop doesn't match the screenshot, add a `bannerPosition`/className option to AuthLayout.
2. **`organisms/RegisterForm.tsx`** (+ `RegisterForm.test.tsx`): built the same way as `LoginForm.tsx`.
   - `export type RegisterValues = { name: string; email: string; password: string; remember: boolean }`
   - Fields:
     - "Nome": placeholder "Nome completo", `autoComplete="name"`
     - "Email": `type="email"`, placeholder "Digite seu email", `autoComplete="email"`
     - "Senha": `type="password"`, placeholder "Digite sua senha", `autoComplete="new-password"`
   - Checkbox "Lembrar-me", then `<Button type="submit">Cadastrar</Button>` with the arrow icon.
   - Validation copies LoginForm: `Campo obrigatório` on empty fields, plus `Email inválido` for a malformed email (simple `/^\S+@\S+\.\S+$/`). Trim name and email before submitting.
   - Tests:
     - renders all fields, the checkbox and the button
     - empty submit shows 3 alerts and does not call `onSubmit`
     - an invalid email is flagged
     - a valid submit calls `onSubmit` with trimmed values and `remember`
3. **`pages/RegisterPage.tsx`** (+ `RegisterPage.test.tsx`): same layout as `LoginPage.tsx`.
   - banner `{ src: '/banner-register.png', alt: 'Banner do Code Connect' }`, title "Cadastro", subtitle "Olá! Preencha seus dados."
   - footer: `Já tem conta? <TextLink to="/login">Faça seu login!</TextLink>`
   - `RegisterForm` and `SocialLogin`, with `console.info` handlers like LoginPage.
   - Tests: heading, subtitle and providers; banner src; link to `/login`.
4. **`App.tsx`**: add `<Route path="/register" element={<RegisterPage />} />`.

## Not included (same as the current LoginPage)
These are left out to stay consistent with Login. They can be added to AuthLayout later so both pages get them:
- the faint background logo shapes
- the "code connect" logo drawn over the banner
- the Material `login` icon next to the footer link

## Commits (git-commit skill, no trailers)
1. `feat(web): add RegisterForm organism with client-side validation`
2. `feat(web): add RegisterPage` (includes the banner asset)
3. `feat(web): route /register to RegisterPage`

## Verification
- `pnpm --filter web test` and `pnpm web:lint` pass before each commit
- `pnpm web:dev`: open http://localhost:5173/register and compare it with the Figma screenshot (banner crop, texts, button, social block)
- Check that the Login and Register footer links go back and forth
