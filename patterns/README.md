# Pattern Definitions

The `patterns/` directory contains machine-readable and human-readable pattern specification files. Each file defines one guardrail pattern, explanation pattern, permission gate, uncertainty state, refusal state, escalation path, or recovery flow.

These are the authoritative specifications for pattern behavior. They are the source of truth that component implementations, decision flows, and enterprise playbooks reference.

---

## Directory Structure

```
patterns/
├── README.md                        # This file
├── warning/                         # Warning pattern specifications  [Phase 2A — 6 specs stable]
│   ├── inline-warning.md            # Advisory inline warning
│   ├── modal-warning.md             # Caution–Blocking modal warning
│   ├── ambient-warning.md           # Informational–Advisory ambient warning
│   ├── blocking-warning.md          # Blocking warning (hard stop, requires resolution)
│   ├── progressive-warning.md       # Escalating multi-stage warning
│   ├── policy-warning.md            # Policy-rule-triggered warning
│   ├── data-quality-warning.md      # [Planned — future phase]
│   └── staleness-warning.md         # [Planned — future phase]
├── explanation/                     # Explanation pattern specifications  [Phase 2B — 6 specs stable]
│   ├── confidence-disclosure.md     # Output confidence levels and disclosure
│   ├── source-citation.md           # Source traceability and attribution
│   ├── reasoning-trace.md           # AI reasoning logic exposed to users
│   ├── decision-summary.md          # Structured decision records for audit
│   ├── limitation-disclosure.md     # Capability and knowledge boundary disclosure
│   └── structured-uncertainty-disclosure.md  # Combined confidence + limitation for high-stakes outputs
├── permission/                      # Permission gate specifications  [Phase 2C — 6 specs stable]
│   ├── one-time-permission.md       # Single-instance authorization
│   ├── session-permission.md        # Session-scoped authorization
│   ├── persistent-permission.md     # Standing cross-session authorization
│   ├── scoped-permission.md         # Resource-bounded authorization
│   ├── delegated-permission.md      # Multi-party authorization routing
│   ├── revocation.md                # Permission withdrawal and expiry
│   └── audit-required-gate.md       # [Planned — compliance depth extension]
├── uncertainty/                     # Uncertainty state specifications
│   ├── high-confidence-state.md     # Default operating state; disclosed passively
│   ├── moderate-confidence-state.md # Usable output with advisory disclosure
│   ├── low-confidence-state.md      # Directional output only; active restriction
│   ├── conflicting-evidence-state.md # Source contradiction; both versions surfaced
│   ├── insufficient-information-state.md # Information absent; clarification required
│   ├── stale-context-state.md       # Data beyond freshness threshold
│   └── unresolvable-state.md        # Terminal state; refusal or escalation required
├── refusal/                         # Refusal state specifications
│   ├── safe-refusal.md              # Complete refusal on safety/harm grounds
│   ├── partial-completion.md        # Complete the fulfillable portions; exclude the rest
│   ├── constrained-completion.md    # Complete with disclosed modifications applied
│   ├── alternative-suggestion.md    # Refuse the form; offer alternatives for the goal
│   ├── clarification-request.md     # Defer pending targeted user input
│   ├── human-handoff.md             # Refusal: AI cannot complete; routes to human as refusal strategy
│   └── policy-refusal.md            # Rule-governed refusal; specific policy cited
├── escalation/                      # Escalation path specifications
│   │                                # Note: escalation/human-handoff.md is distinct from
│   │                                # refusal/human-handoff.md — see distinction note below
│   ├── human-handoff.md             # Authority/scope routing to a human; focus on ownership, SLA, fallback
│   ├── role-escalation.md           # Current role → higher-authority role; governed by org role hierarchy
│   ├── system-escalation.md         # Current AI → higher-authority system; API contract, retry, observability
│   ├── emergency-escalation.md      # Critical risk; interrupt mode; simultaneous multi-party routing
│   └── async-review-escalation.md  # Non-immediate review queue; SLA-governed; user workflow continues
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

## Human Handoff — Pattern Distinction

Two `human-handoff.md` files exist in this repository. They are related but serve different purposes:

| | Refusal Human Handoff | Escalation Human Handoff |
|---|---|---|
| **File** | `patterns/refusal/human-handoff.md` | `patterns/escalation/human-handoff.md` |
| **Trigger** | AI cannot complete the request | AI lacks authority, policy scope, or authorization |
| **Focus** | User communication; adjacent task offer; context passing to agent | Routing mechanics; ownership assignment; SLA; fallback behavior |
| **Category** | Refusal state | Escalation path |
| **Primary concern** | What the user receives; what the AI can still do | Who owns the escalation; what happens if no one accepts |

Do not merge these specifications. Both serve distinct functions in the pattern system.

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
- **Phase 2A:** Warning pattern category — 6 specifications stable ✅
- **Phase 2B:** Explanation pattern category — 6 specifications stable ✅
  - `confidence-disclosure.md` ✅
  - `source-citation.md` ✅
  - `reasoning-trace.md` ✅
  - `decision-summary.md` ✅
  - `limitation-disclosure.md` ✅
  - `structured-uncertainty-disclosure.md` ✅
- **Phase 2C:** Permission gate category — 6 specifications stable ✅
  - `one-time-permission.md` ✅
  - `session-permission.md` ✅
  - `persistent-permission.md` ✅
  - `scoped-permission.md` ✅
  - `delegated-permission.md` ✅
  - `revocation.md` ✅
- **Phase 2D:** Uncertainty state category — 7 specifications stable ✅
  - `high-confidence-state.md` ✅
  - `moderate-confidence-state.md` ✅
  - `low-confidence-state.md` ✅
  - `conflicting-evidence-state.md` ✅
  - `insufficient-information-state.md` ✅
  - `stale-context-state.md` ✅
  - `unresolvable-state.md` ✅
- **Phase 2E:** Refusal state category — 7 specifications stable ✅
  - `safe-refusal.md` ✅
  - `partial-completion.md` ✅
  - `constrained-completion.md` ✅
  - `alternative-suggestion.md` ✅
  - `clarification-request.md` ✅
  - `human-handoff.md` ✅
  - `policy-refusal.md` ✅
- **Phase 2F:** Escalation path category — 5 specifications stable ✅
  - `patterns/escalation/human-handoff.md` ✅
  - `patterns/escalation/role-escalation.md` ✅
  - `patterns/escalation/system-escalation.md` ✅
  - `patterns/escalation/emergency-escalation.md` ✅
  - `patterns/escalation/async-review-escalation.md` ✅
- **Phase 2G:** Recovery flows — planned
- **Phase 2 target:** Full specifications for all ~38 patterns across all seven categories
