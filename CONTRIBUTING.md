# Contributing to the AI Guardrails & Explanations Design System

This document defines the contribution standards for this repository. All contributors — whether adding new patterns, refining existing specifications, or expanding documentation — should follow these guidelines.

---

## Before You Contribute

1. **Read the taxonomy first.** All contributions must use consistent terminology. Review [`docs/taxonomy/index.md`](docs/taxonomy/index.md) before naming or categorizing anything.
2. **Read the principles.** Contributions that conflict with the design principles in [`docs/principles/index.md`](docs/principles/index.md) will require revision.
3. **Check for existing patterns.** Avoid duplicating work. Review [`docs/patterns/index.md`](docs/patterns/index.md) to see what already exists.

---

## Contribution Types

| Type | Description |
|---|---|
| **Pattern specification** | Defining or refining a guardrail pattern, explanation pattern, permission gate, uncertainty state, refusal state, escalation path, or recovery flow |
| **Decision flow** | Adding or revising a logic tree or flowchart in `docs/decision-flows/` |
| **Component specification** | Adding or refining a UI component spec in `components/` |
| **Example** | Adding an annotated implementation in `examples/` |
| **Playbook** | Adding enterprise or regulated-industry guidance |
| **Documentation** | Improving existing docs, fixing broken links, improving clarity |
| **Tooling** | Scripts, linters, or templates that support the design system |

---

## Commit Standards

Every commit must follow these rules:

- **One task per commit.** Do not bundle unrelated changes.
- **Use the correct prefix:**
  - `docs:` — documentation additions or changes
  - `pattern:` — pattern specification additions or changes
  - `component:` — component specification additions or changes
  - `example:` — example additions or changes
  - `template:` — template additions or changes
  - `chore:` — tooling, config, or maintenance
  - `fix:` — corrections to existing content
  - `refactor:` — restructuring without changing meaning
- **Write a clear commit message** describing exactly what was completed, not just what file was changed.

**Good commit messages:**
```
docs: add uncertainty state decision flow for confidence thresholds
pattern: add specification for soft permission gate
fix: correct broken link to escalation path index
```

**Bad commit messages:**
```
update docs
add stuff
fix
```

---

## Pattern Specification Format

When adding a new pattern specification, use the following structure:

```markdown
# [Pattern Name]

**Category:** [warning | explanation | permission gate | uncertainty state | refusal state | escalation path | recovery flow]
**Severity:** [informational | advisory | blocking | critical]
**Status:** [draft | review | stable]

## Definition
What this pattern is and when it applies.

## Trigger Conditions
The specific conditions that cause this pattern to activate.

## Decision Logic
How the system determines which variant of this pattern to use.

## User Communication Guidelines
What the user sees and how it is worded.

## Variants
Named sub-patterns within this category.

## Antipatterns
Common mistakes to avoid when implementing this pattern.

## Related Patterns
Cross-references to other patterns that are commonly used together.
```

---

## Terminology Requirements

Always use the canonical terms defined in [`docs/taxonomy/index.md`](docs/taxonomy/index.md). Key terms:

| Canonical term | Do not use |
|---|---|
| guardrail pattern | safety guardrail, AI safety pattern |
| explanation pattern | explainability feature, transparency layer |
| permission gate | consent prompt, approval gate, confirmation dialog |
| uncertainty state | confidence level UI, error state, ambiguity |
| refusal state | rejection, block, denial |
| escalation path | handoff, human takeover, escalation flow |
| recovery flow | error recovery, retry loop, fallback |

---

## Review Criteria

Contributions are reviewed against the following criteria:

1. **Terminology consistency** — uses canonical terms from the taxonomy
2. **Decision logic clarity** — trigger conditions are unambiguous and implementable
3. **Enterprise readiness** — guidance is practical for regulated or high-scale environments
4. **Antipattern coverage** — known failure modes are documented
5. **Cross-reference accuracy** — related patterns are correctly linked
6. **No unsupported claims** — if citing research, mark unverified references as `TODO: verify`

---

## What to Avoid

- **Vague safety language.** "Be careful with AI" is not a pattern specification.
- **UI-only thinking.** Patterns must define decision logic, not just visual treatment.
- **Invented citations.** If you are not certain a reference is real and accurate, mark it `TODO: verify citation`.
- **Bundled changes.** Keep each commit focused on one task.
- **Breaking existing links.** If you move or rename a file, update all references to it.

---

## Getting Help

- Open an issue to discuss a new pattern before writing a full specification.
- Use the `docs/case-studies/` section to propose a reference implementation for review.
- See the [`templates/`](templates/) directory for starting-point templates.
