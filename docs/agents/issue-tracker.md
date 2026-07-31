# Issue tracker: GitHub

## Where issues live

Issues live in the GitHub repository at `https://github.com/a634691481-arch/photo-gallery`.

Workflows (use the `gh` CLI):

- **Create an issue:** `gh issue create --title "..." --body "..."`
- **List open issues:** `gh issue list`
- **Read one issue:** `gh issue view <number>` (read the body and all comments before working on it; the body may contain a handoff brief written by a prior agent)
- **Edit / close:** `gh issue edit <number>`, `gh issue close <number>`
- **Set labels:** `gh issue edit <number> --add-label <label>` (see `triage-labels.md` for the label vocabulary)

## PRs as a request surface

Flag: **off**

When off, pull requests are not treated as a request surface: PRs are not routed through triage, and external PRs don't enter the triage queue. Flip this flag to **on** if you want PRs to be triageable like issues.
