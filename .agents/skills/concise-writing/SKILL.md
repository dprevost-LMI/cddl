---
name: concise-writing
description: Keep everything written in this repo — commit messages, PR titles/descriptions, and code comments — clear and terse. Use whenever creating a git commit, opening or updating a pull request, or writing/reviewing a code comment; also covers /commit and requests like "commit this", "open a PR", or "write a comment explaining this".
---

Everything written *about* the code in this repo — commit messages, PR descriptions, code comments — should say the minimum needed to be understood, and no more. The reader (a maintainer, a reviewer, a future agent) can already read the diff; don't narrate it back to them. Say what isn't obvious from the code itself: the *why*, not the *what*.

This applies across three surfaces. Jump to the one you need:

## Commit messages

Gather context first — run together, since none depends on the others:
- `git status` — what's changed and what's untracked
- `git diff` (unstaged) and `git diff --staged` — the actual content
- `git log --oneline -15` — refresh on this repo's message style

This repo's history is consistently `type: terse imperative summary`, e.g.:
```
fix: isFloatRange misclassified symbolic range bounds as float
docs: explain the RFC 8610 BAD-range rationale in isFloatRange's JSDoc
ci: scope package releases to changed/modified packages, fix cross-package changelog bump
fix: generators emit wrong numeric type for floating-point ranges (#78)
```
- One line, imperative mood, `type: summary`, no trailing period.
- Lead with *why*, not a mechanical restatement of the diff (bad: "update index.ts"; good: "isFloatRange misclassified symbolic range bounds as float").
- Only add a body if the one-liner genuinely can't carry the reasoning — this repo's history mostly skips it, but a fix that isn't self-explanatory from the summary alone (e.g. it traces back to an RFC section, a specific bug repro, or a non-obvious root cause) earns one. Keep it to what a reader actually needs, not a walkthrough of the diff.
- Pick the type by what changed: `fix`, `feat`, `perf`, `test`, `ci`, `docs`, `chore`, `build`, `refactor`, `style`, `revert`, `ops` — the exact set `.release-it.base.ts` maps to changelog sections.

**Staging**: stage specific files by name (`git add path/to/file`), never a blanket `git add -A` or `git add .` — this repo's `.github/workflows/` files touch tokens and publish credentials, and a blind add risks scooping up something that doesn't belong. Check `git status` first for anything unexpected or secret-looking (`.env`, `credentials.json`, `*.pem`, `*token*`) and flag it instead of silently staging it.

**Committing**: pass the message via a heredoc so formatting survives:
```bash
git commit -m "$(cat <<'EOF'
type: terse summary here
EOF
)"
```
Append whatever attribution footer this session's own instructions specify — don't hardcode one here, since it can change independently of this skill.

Never amend an existing commit unless explicitly asked — a fresh commit is the default, and never amend one that's already been pushed. Never pass `--no-verify` or otherwise skip hooks unless explicitly told to; if a pre-commit hook fails, fix the underlying issue and commit again. After committing, run `git status` to confirm it landed, and report back in one line what was committed — don't dump the full diff back at the user.

## PR titles and descriptions

- Title under ~70 characters, same "why, not what" rule as commit summaries, same `type: summary` convention ([Conventional Commits](https://www.conventionalcommits.org/)) as the individual commits, e.g. `fix: ...`, `feat: ...`, `ci: ...`.
- The PR title becomes part of the auto-generated release notes for whichever package(s) it touches (`.release-it.base.ts` scopes each package's changelog via conventional commits) — a `chore:` title on a PR that actually fixes something means that fix never shows up in anyone's changelog.
- Body: a short `## Summary` (1-3 bullets, what changed and why it was needed — not a file-by-file listing the diff already shows) plus a `## Test plan` checklist of what was actually run. Skip sections that would just restate the diff.
- Don't repeat the same information across every commit in the PR *and* the PR description *and* a summary comment — pick the level (usually the PR description) and let the rest stay terse.
- When reviewing someone else's PR description for terseness, flag sentences that only restate a line from the diff without adding reasoning, and padding like "This PR also includes minor cleanup" with nothing concrete after it.

## Code comments

Default to no comment. Well-named functions and variables already say *what* the code does. Only add a comment when it carries information the code can't:
- a non-obvious constraint or invariant (e.g. why `isFloatRange` treats a range as float if *either* bound is float — that's explained in its own JSDoc because RFC 8610 leaves the mixed case undefined, not because the code alone would tell you)
- the reason for a workaround, ideally with a link to the issue/RFC section that explains it
- behavior that would genuinely surprise a reader

One line is almost always enough. If removing a comment wouldn't leave a future reader confused, remove it.
