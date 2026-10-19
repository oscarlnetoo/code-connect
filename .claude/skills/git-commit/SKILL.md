---
name: git-commit
description: Enforces this project's Conventional Commits format for every git commit message. Use whenever the user asks to commit, write or suggest a commit message, amend or reword a commit, squash, or review commit messages, and whenever you are about to run `git commit` yourself
---

# Conventional Commit

Every commit in this repo follows one format, so history stays scannable and changelogs can be generated from it.

```
<type>(<scope>): <imperative summary>
```

## Scope

`<scope>` is where the change lives, and is one of:

- `api` — changes under `apps/api`
- `web` — changes under `apps/web`
- `root` — changes in the repository root, outside `apps/` (workspace config, `package.json`, lockfile, `.gitignore`, CI)

Pick the scope from the files in the diff (`git diff --cached --name-only`). If a change touches more than one scope, prefer splitting it into separate commits, one per scope.

## Type

Use exactly one of: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`.

| Type | Use for |
|------|---------|
| feat | New user-visible capability |
| fix | Bug fix |
| refactor | Code restructuring with no behavior change |
| perf | Performance improvement |
| docs | Documentation only |
| test | Adding or fixing tests |
| chore | Maintenance that fits nowhere else |
| build | Build system or dependency changes |
| ci | CI configuration |
| style | Formatting only (whitespace, semicolons), no logic change |
| revert | Reverting an earlier commit |

When two types seem to fit, choose the one describing the *intent* of the change (a refactor that happens to fix a bug is `fix` only if fixing the bug was the point).

## Summary

- Imperative mood, as if completing "this commit will…": `add`, `fix`, `remove`, not `added` or `adds`.
- Lowercase first letter, no trailing period.
- Describe what changed and why it matters, not how. Keep the whole subject line at or under about 72 characters.

## Body (only if needed)

- Skip entirely when subject is self-explanatory
- Add body only for: non-obvious why, breaking changes, migration notes, linked issues

## Constraints

 - Never add trailers or attribution lines to a commit message: no `Co-Authored-By`, `Signed-off-by`, "Generated with…" and the like.


## Examples

```
feat(web): add dark mode toggle to header
fix(api): return 404 when project id does not exist
refactor(api): extract token validation into middleware
perf(web): lazy-load the code editor component
test(api): cover pagination edge cases
revert(web): revert "feat(web): add dark mode toggle to header"
```

With a body, only when warranted:

```
fix(api): retry webhook delivery on 5xx responses

The upstream provider returns transient 503s during deploys; without a
retry we silently dropped events.
```

Avoid: `Fixed bug`, `feat: add login` (missing scope), `feat(frontend): ...` (scope must be `api`, `web` or `root`), `feat(api): Added login.` (past tense, capitalized, period).

## Workflow

1. Inspect the staged diff to determine scope and type.
2. Write the message in the format above and commit with it, with no trailers.
3. If asked to review existing messages, point out each deviation and give the corrected message.
