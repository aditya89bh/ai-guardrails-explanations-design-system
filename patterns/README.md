# Pattern Definitions

The `patterns/` directory contains machine-readable and human-readable pattern specification files. Each file defines one guardrail pattern, explanation pattern, permission gate, uncertainty state, refusal state, escalation path, or recovery flow.

These are the authoritative specifications for pattern behavior. They are the source of truth that component implementations, decision flows, and enterprise playbooks reference.

---

## Directory Structure

```
patterns/
├── README.md                        # This file
├── warning/                         # Warning pattern specifications
│   ├── inline-warning.md
│   ├── modal-warning.md
│   ├── ambient-warning.md
│   ├── progressive-warning.md
│   ├── data-quality-warning.md
│   └── staleness-warning.md
├── explanation/                     # Explanation pattern specifications
│   ├── confidence-disclosure.md
│   ├── source-citation.md
│   ├── reasoning-trace.md
│   ├── decision-summary.md
│   ├── limitation-disclosure.md
│   └── structured-uncertainty-disclosure.md
├── permission/                      # Permission gate specifications
│   ├── soft-gate.md
│   ├── hard-gate.md
│   ├── audit-required-gate.md
│   ├── delegated-gate.md
│   ├── bulk-action-gate.md
│   └── third-party-impact-gate.md
├── uncertainty/                     # Uncertainty state specifications
│   ├── high-confidence-state.md
│   ├── moderate-confidence-state.md
│   ├── low-confidence-state.md
│   ├── unresolvable-uncertainty-state.md
│   └── conflicting-sources-state.md
├── refusal/                         # Refusal state specifications
│   ├── policy-refusal.md
│   ├── capability-refusal.md
│   ├── safety-refusal.md
│   ├── scope-refusal.md
│   ├── graceful-degradation.md
│   └── contextual-refusal.md
├── escalation/                      # Escalation path specifications
│   ├── human-handoff.md
│   ├── role-escalation.md
│   ├── system-escalation.md
│   ├── emergency-escalation.md
│   └── async-review-escalation.md
└── recovery/                        # Recovery flow specifications
    ├── retry-recovery.md
    ├── redirect-recovery.md
    ├── repair-recovery.md
    ├── manual-override-recovery.md
    └── abandon-recovery.md
```

---

## Pattern Specification Format

Every pattern specification file must follow this structure. Incomplete specifications will not be merged.

```markdown
# [Pattern Name]

**Category:** [warning | explanation | permission gate | uncertainty state | refusal state | escalation path | recovery flow]
**Sub-type:** [canonical sub-type from taxonomy]
**Severity:** [informational | advisory | caution | blocking | critical]
**Status:** [draft | review | stable]
**Phase:** [phase number when specification was authored]

## Definition
What this pattern is and when it applies. One to three sentences.

## Trigger Conditions
The specific conditions that cause this pattern to activate.
Use canonical trigger condition vocabulary from docs/taxonomy/index.md.

- Condition 1
- Condition 2
- Condition N

## Decision Logic
How the system determines which variant or severity of this pattern to use.
Reference the corresponding decision flow in docs/decision-flows/.

## User Communication Guidelines
What the user sees and how it is worded.
- What information must be present
- What information must not be present (if applicable)
- Tone and language requirements
- Character or length constraints (if applicable)

## Variants
Named sub-patterns within this category. Each variant listed with its distinguishing trigger or treatment.

## Antipatterns
Common mistakes to avoid when implementing this pattern.

| Antipattern | Why it fails | Correct approach |
|---|---|---|

## Enterprise Considerations
Specific constraints or additions required for enterprise deployments.
- Audit logging requirements
- Policy configurability requirements
- Multi-tenant considerations

## Regulated Industry Notes
If this pattern has domain-specific variants, list them and link to the regulated industries section.

## Related Patterns
Cross-references to other patterns that are commonly used with this one.

## Examples
Links to case studies or examples that demonstrate this pattern in context.
```

---

## Status Tracking

| Status | Definition |
|---|---|
| `draft` | Specification is incomplete or under initial development |
| `review` | Specification is complete and awaiting review |
| `stable` | Specification has been reviewed and is authoritative |
| `deprecated` | Pattern has been superseded or removed |

---

## Adding a New Pattern

1. Confirm the pattern does not already exist. Check [`docs/patterns/index.md`](../docs/patterns/index.md).
2. Confirm the pattern fits an existing category. If not, propose a taxonomy change first.
3. Create a new file in the appropriate subdirectory using the naming convention `[pattern-name].md`.
4. Use the specification format defined above. Do not publish an incomplete specification — mark it `draft` if it is still in progress.
5. Add the pattern to the index in [`docs/patterns/index.md`](../docs/patterns/index.md).
6. Commit as a single focused commit with the prefix `pattern:`.

---

## Phase Status

- **Phase 1:** Directory structure, README, and format specification only
- **Phase 2:** Full specifications for all ~38 patterns across all seven categories
