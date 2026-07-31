# Domain docs: single-context

Layout: one context.

- `CONTEXT.md` — the shared domain glossary and active decisions, at repo root.
- `docs/adr/` — Architecture Decision Records. One file per ADR, named `NNNN-short-title.md`, numbered sequentially.

## Consumer rules

- Read `CONTEXT.md` before starting work that touches domain concepts.
- When a term is ambiguous or overloaded, propose a clarification to the glossary (or record an ADR) rather than guessing.
- Hard-to-reverse decisions belong in an ADR; record them as they're made.
- `CONTEXT.md` stays a clean glossary — drift goes to ADRs, not into the glossary.
