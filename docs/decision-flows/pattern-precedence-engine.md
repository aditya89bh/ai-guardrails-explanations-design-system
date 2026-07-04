# Pattern Precedence Engine

**Document type:** Decision engine — precedence and conflict resolution layer
**Phase:** 3
**Status:** stable
**Depends on:** `decision-primitives.md`, `pattern-selection-engine.md`

---

## Purpose

The pattern precedence engine resolves conflicts when multiple patterns activate simultaneously. When the selection engine returns two or more patterns from the same or different categories, the precedence engine determines:

1. **Display order** — which pattern the user sees first
2. **Interaction sequencing** — which pattern must complete before another can begin
3. **Suppression** — which patterns are suppressed when a higher-precedence pattern is active
4. **Override authority** — which patterns can override or modify the behavior of lower-precedence patterns

Every precedence rule in this document is deterministic: given the same set of active patterns, the same precedence order is produced every time.

---

## Inter-Category Precedence

When patterns from multiple categories activate simultaneously, the following inter-category precedence order governs:

```
Policy Refusal
  ↓
Safe Refusal / Emergency Escalation   [tied; see tie-break rule below]
  ↓
Blocking Warning
  ↓
Role Escalation / Human Handoff (escalation)   [tied; see tie-break rule below]
  ↓
Permission Gate
  ↓
Uncertainty State (disclosure)
  ↓
Explanation Pattern
  ↓
Recovery Flow
  ↓
Warning (non-blocking)
```

**Reading the precedence order:** A higher-position pattern is presented first and, in most cases, must be resolved before lower-position patterns can activate. A lower-position pattern is never suppressed by a higher-position pattern — it is deferred, to be applied after the higher-priority interaction resolves.

**Exception:** Recovery flows are always deferred to after all other categories resolve in the current step. They activate only when the current step reaches a terminal state (completed, refused, or escalated).

---

## Tie-Break Rules

### Safe Refusal vs. Emergency Escalation (tied)

Both activate when Risk (P1) = 4 or a safety/harm condition is detected.

| Tie-break condition | Winner |
|---|---|
| The condition requires immediate multi-party notification | `emergency-escalation` wins |
| The condition requires a human specialist but not immediate multi-party response | `human-handoff` (escalation) wins |
| No human response path can address the condition | `safe-refusal` wins |
| The condition is a policy-defined emergency | `emergency-escalation` wins regardless of other conditions |

### Role Escalation vs. Human Handoff Escalation (tied)

Both activate when the AI's authority is insufficient.

| Tie-break condition | Winner |
|---|---|
| The authority gap is role-hierarchical (a higher organizational role can approve) | `role-escalation` wins |
| The authority gap requires specialist expertise (not just higher role) | `human-handoff` (escalation) wins |
| Both apply | `role-escalation` is initiated first; if it fails, it falls through to `human-handoff` |

---

## Intra-Category Precedence

Within a single category, multiple patterns may also conflict.

### Warning Intra-Category Precedence

```
blocking-warning > progressive-warning > modal-warning > policy-warning > ambient-warning > inline-warning
```

**Suppression rule:** When `blocking-warning` activates, all lower-severity warnings for the same risk signal are suppressed — they are not shown alongside the blocking warning. However, warnings for independent risk signals may still be shown (see the composition rules in `pattern-composition-engine.md`).

### Explanation Intra-Category Precedence

```
structured-uncertainty-disclosure > reasoning-trace > decision-summary > limitation-disclosure > confidence-disclosure > source-citation
```

`structured-uncertainty-disclosure` supersedes `confidence-disclosure` and `limitation-disclosure` when both confidence and source reliability conditions are met simultaneously. The individual patterns are not shown alongside it.

`reasoning-trace` and `decision-summary` are not mutually exclusive — they address different aspects (process vs. outcome) and may be shown together.

`source-citation` is always shown alongside any other explanation pattern when retrieval was used; it is never suppressed by higher-precedence explanations.

### Permission Intra-Category Precedence

```
revocation > delegated-permission > scoped-permission > persistent-permission > session-permission > one-time-permission
```

`revocation` is terminal — when a permission is revoked, no lower-precedence permission pattern can override the revocation within the current session.

`delegated-permission` requires a higher-authority decision before any other permission pattern can proceed for the same action.

### Refusal Intra-Category Precedence

```
safe-refusal > policy-refusal > human-handoff > partial-completion > constrained-completion > alternative-suggestion > clarification-request
```

**Critical rule:** `safe-refusal` and `policy-refusal` suppress all lower-precedence refusal patterns for the same request. If a request triggers `safe-refusal`, neither `partial-completion` nor `alternative-suggestion` may offer a path to the same prohibited outcome.

`partial-completion` and `constrained-completion` are complementary but the system must select one as primary: `constrained-completion` is selected when the full request can be delivered in modified form; `partial-completion` is selected when sections must be excluded.

### Escalation Intra-Category Precedence

```
emergency-escalation > human-handoff > role-escalation > system-escalation > async-review-escalation
```

`emergency-escalation` activates immediately and in interrupt mode — all other escalation paths are suspended until the emergency is handled.

`async-review-escalation` may run concurrently with lower-friction patterns (the user's workflow continues during the async review). All other escalation paths are blocking — the workflow halts until resolved.

### Recovery Intra-Category Precedence

```
retry-recovery > repair-recovery > redirect-recovery > manual-override-recovery > abandon-recovery
```

`retry-recovery` is attempted first when the blocking condition was transient.
`repair-recovery` is selected when the blocking condition was caused by a correctable error.
`redirect-recovery` is selected when neither retry nor repair can succeed.
`manual-override-recovery` is offered only when an authorized user explicitly requests an override — it is never the system's first recovery suggestion.
`abandon-recovery` activates when the user declines all other options or the goal is no longer achievable.

These are not mutually exclusive in sequence — the recovery engine may offer retry, then repair, then redirect as a cascade before presenting abandon as a final option.

---

## Cross-Category Conflict Resolution

### Policy Refusal + Any Other Pattern

Policy refusal takes absolute precedence within its matching scope. No other pattern overrides policy refusal for the same action. However:

- **Partial completion** may still proceed for portions of a multi-part request that are not policy-matched.
- **Redirect recovery** may be offered for a different formulation of the user's goal, if the alternative does not also trigger the policy match.
- **Explanation patterns** always apply alongside policy refusal — the user must understand why the refusal occurred.

### Blocking Warning + Permission Gate

These two patterns activate together when Risk ≥ 3 and Permission = unauthorized.

**Sequencing:** The blocking warning is displayed first. The permission gate is presented after the user has seen and acknowledged the blocking warning. The permission request is embedded within or immediately following the blocking warning interaction.

Rationale: The user must understand the risk before being asked to authorize the action. Presenting the permission gate before the risk disclosure inverts the decision quality.

### Uncertainty State + Refusal

When an uncertainty state activates simultaneously with a refusal trigger:

| Condition | Resolution |
|---|---|
| Uncertainty state = unresolvable AND refusal = safe-refusal | Safe refusal is the displayed pattern; the unresolvable state is the mechanism (internal) |
| Uncertainty state = low-confidence AND refusal = clarification-request | Clarification request is displayed; low-confidence state governs how the AI presents the clarification |
| Uncertainty state = insufficient-information AND refusal = clarification-request | Clarification request is displayed; the specific missing information is named (from insufficient-information state analysis) |

### Escalation + Recovery

These two categories have a temporal relationship: escalation occurs within the interaction; recovery occurs after the interaction concludes.

When an escalation resolves with approval: recovery activates via `retry-recovery` (the original action is re-attempted under the new authorization).

When an escalation resolves with denial: recovery activates via `redirect-recovery` (the goal is pursued through an alternative path).

When an escalation fails (no response, timeout): recovery activates via `abandon-recovery` or `redirect-recovery` depending on whether the user wants to continue.

---

## Suppression Rules Reference

| Suppressing pattern | Patterns suppressed |
|---|---|
| `safe-refusal` | All other refusal patterns for the same request; all recovery flows except `abandon-recovery` |
| `emergency-escalation` | All other escalation paths; all non-emergency interaction patterns |
| `blocking-warning` | Lower-severity warnings for the same risk signal |
| `revocation` | All permission patterns for the same action in the current session |
| `structured-uncertainty-disclosure` | Individual `confidence-disclosure` and `limitation-disclosure` for the same output |

**Suppression scope:** Suppression is always scoped to the same request, action, or output element. Independent signals (different risk sources, different output elements) are not suppressed by a suppressing pattern for a different signal.

---

## Priority Escalation Path

If the precedence engine cannot resolve a conflict — two patterns have the same priority, no tie-break rule applies, and both require immediate interaction — the following default escalation applies:

1. Display the more restrictive pattern (the one that blocks more user action)
2. Log the conflict and the resolution for the deployment operations team
3. Flag the conflict for policy review — a conflict without a defined tie-break indicates a gap in the deployment's precedence configuration

This path must not be a routine exit — if a deployment regularly hits unresolved conflicts, the precedence configuration is incomplete.
