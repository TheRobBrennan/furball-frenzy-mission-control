# Contributing

## Branches and PRs

- Branch from `main` as `YYYY.MM.DD/short-kebab-description`.
- Never commit directly to `main`, open a PR.
- PR titles follow [Conventional Commits](https://www.conventionalcommits.org/):
  `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`,
  `chore:`, `revert:`, with an optional `(scope)` and `!` for a breaking change.

## Commit signing

Commits are signed with a GPG key added to the GitHub account.

```bash
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```

## Before opening a PR

```bash
make test
```

A PR that changes what the game looks like shows the change in its description, before and
after screenshots from the running app (`make up`).
