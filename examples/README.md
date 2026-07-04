# Annotated Examples

The `examples/` directory contains annotated implementation examples showing guardrail patterns applied in specific, concrete scenarios. Where case studies (in `docs/case-studies/`) cover end-to-end product walkthroughs, examples here are focused, minimal, and pattern-specific.

Each example shows one pattern — or a small combination of closely related patterns — in a specific context, with annotations explaining the decisions made.

---

## Purpose

Examples serve three audiences:

1. **Engineers** who need to understand the expected behavior of a pattern before implementing it
2. **Designers** who need to evaluate whether a proposed treatment correctly implements the pattern logic
3. **Reviewers** who need a concrete reference when assessing whether an implementation matches the specification

Examples are not boilerplate to copy. They are annotated references to reason from.

---

## Directory Structure

```
examples/
├── README.md                        # This file
├── warning/                         # Warning pattern examples
│   ├── inline-warning-data-quality.md
│   ├── modal-warning-irreversible-action.md
│   └── progressive-warning-escalation.md
├── explanation/                     # Explanation pattern examples
│   ├── confidence-disclosure-search-result.md
│   ├── source-citation-research-output.md
│   └── reasoning-trace-decision-output.md
├── permission/                      # Permission gate examples
│   ├── soft-gate-send-message.md
│   ├── hard-gate-delete-records.md
│   └── audit-gate-financial-action.md
├── uncertainty/                     # Uncertainty state examples
│   ├── moderate-confidence-advisory.md
│   └── unresolvable-uncertainty-escalation.md
├── refusal/                         # Refusal state examples
│   ├── policy-refusal-with-alternative.md
│   ├── capability-refusal-graceful.md
│   └── scope-refusal-redirect.md
├── escalation/                      # Escalation path examples
│   ├── human-handoff-support-context.md
│   └── emergency-escalation-safety-signal.md
├── recovery/                        # Recovery flow examples
│   ├── retry-after-low-confidence.md
│   └── redirect-after-scope-refusal.md
└── composition/                     # Multi-pattern composition examples
    ├── uncertainty-to-escalation.md
    └── refusal-to-recovery.md
```

---

## Example Format

Every example must follow this structure:

```markdown
# [Pattern Name] — [Specific Scenario]

**Pattern implemented:** [link to pattern specification]
**Scenario context:** [product type and brief context]
**Patterns involved:** [list if more than one]

## Scenario Description
What the user is doing and what system state triggers this example.

## Pattern Activation
Which trigger condition(s) fired and why this specific pattern was selected.

## Implementation Walkthrough

### Step 1: [Label]
What happens. What the user sees. Why this decision was made.

> **Annotation:** [Explanation of why this specific treatment was chosen, or what antipattern it avoids]

### Step 2: [Label]
...

## What This Example Demonstrates
The specific pattern behavior or decision this example is intended to illustrate.

## What to Avoid
The antipattern this example is contrasted against.

## Related Example
Link to a closely related example that shows a different branch of the same decision logic.
```

---

## Annotation Conventions

Annotations in examples use blockquotes with the `**Annotation:**` prefix:

```
> **Annotation:** This wording avoids the common mistake of phrasing the refusal as a capability
> limitation ("I can't do this") when the actual reason is a policy restriction ("This action
> is not permitted in this context"). Capability refusals and policy refusals are distinct
> pattern variants with different user expectations.
```

Annotations should explain *why* a decision was made — not just describe *what* was done. Descriptions of what is visible belong in the walkthrough steps themselves.

---

## Phase Status

- **Phase 1:** Directory structure and README only
- **Phase 7:** Full annotated examples for all pattern categories

_Total planned examples: ~20_
