# Pattern Composition Engine

**Document type:** Decision engine — composition and combination rules
**Phase:** 3
**Status:** stable
**Depends on:** `decision-primitives.md`, `pattern-selection-engine.md`, `pattern-precedence-engine.md`

---

## Purpose

The pattern composition engine defines which patterns may be combined within a single interaction, in what sequence, and under what conditions. It identifies legal combinations — patterns that work together to serve the user's need — and illegal combinations — patterns that contradict each other, create ambiguous interaction states, or undermine the guardrail system's trust model.

Composition is not additive. Showing a user five patterns simultaneously creates confusion, not safety. The composition engine constrains the number and sequence of patterns to the minimum required for the interaction to be trustworthy.

---

## Composition Principles

**Principle 1: Minimum necessary disclosure.** Activate only the patterns required by the current primitive values. Do not show additional warnings, explanations, or gates because they might also be relevant — each activated pattern must be triggered by a specific condition.

**Principle 2: Sequential integrity.** Patterns that depend on each other must appear in the defined sequence. Do not present a permission gate before the user has seen the explanation of what they are authorizing. Do not present a recovery flow before the blocking event has been communicated.

**Principle 3: Non-duplication.** When `structured-uncertainty-disclosure` is activated, do not also show standalone `confidence-disclosure` or `limitation-disclosure` for the same element. When `blocking-warning` is active, do not also show `inline-warning` or `modal-warning` for the same risk signal.

**Principle 4: Compositional closure.** Every active combination must have a defined terminal state for the user. The combination of patterns must not leave the user in an ambiguous state with no clear next action.

---

## Legal Composition Sequences

The following sequences are explicitly defined as legal. The arrow (→) indicates temporal sequence within a single interaction.

### Standard Warning + Permission Flow

```
inline-warning → one-time-permission
```
**When:** Risk = 1, permission = unauthorized, business impact = low, user intent = action-execution.
**Terminal state:** User grants permission → action proceeds; or user declines → action cancelled.

```
modal-warning → one-time-permission → action
```
**When:** Risk = 2, permission = unauthorized, intent = action-execution.
**Sequence rule:** Warning must be displayed and user must dismiss it before the permission gate is shown.

```
blocking-warning → explanation (limitation-disclosure OR confidence-disclosure) → delegated-permission
```
**When:** Risk = 3, permission = unauthorized, business impact = high.
**Sequence rule:** Warning first, then explanation of why the block exists, then permission request. All three must complete before the action can proceed.

### Uncertainty + Explanation Flow

```
moderate-confidence-state → confidence-disclosure (contextual depth)
```
**When:** Confidence is moderate, no conflicting sources, no policy issues.
**Terminal state:** User proceeds with awareness of confidence level.

```
low-confidence-state → structured-uncertainty-disclosure → modal-warning → one-time-permission
```
**When:** Confidence is low AND action is consequential (intent = action-execution, risk ≥ 2).
**Sequence rule:** Disclosure first, then warning, then permission. Never permission before disclosure.

```
conflicting-evidence-state → source-citation (claim-level) → reasoning-trace (summary depth) → clarification-request
```
**When:** Sources conflict and user input can resolve the conflict.
**Terminal state:** User provides clarification → uncertainty re-evaluated; or user cannot provide → redirect-recovery or abandon.

### Refusal + Recovery Flow

```
policy-refusal → limitation-disclosure → redirect-recovery (alternative options)
```
**When:** Policy match for the specific form; alternative approaches are available that do not trigger the policy match.
**Sequence rule:** Refusal and explanation must appear before recovery options.

```
safe-refusal → limitation-disclosure (detailed) → abandon-recovery
```
**When:** Safety refusal with no alternative path.
**Sequence rule:** Detailed explanation of why no alternative exists must precede the abandon option.

```
partial-completion → decision-summary → redirect-recovery (for excluded portions)
```
**When:** Multi-part request with some parts completable; user needs path to complete excluded parts.
**Sequence rule:** Deliver completed portions, show summary, then offer redirect for excluded portions.

```
clarification-request → [user provides answer] → retry-recovery (re-evaluate original request)
```
**When:** Request was underspecified; user answers the clarification.
**Terminal state:** Re-evaluation may produce any pattern combination based on new primitives.

### Escalation + Recovery Flow

```
role-escalation (PENDING) → [user waits] → RESOLVED_APPROVED → retry-recovery
```
**When:** User authority insufficient; role escalation routed; approval received.
**Sequence rule:** The AI may continue with non-blocked portions of a multi-step task while escalation is pending; the blocked step retries on approval.

```
human-handoff (escalation) → RESOLVED_DENIED → redirect-recovery
```
**When:** Human handoff denied; alternative path to goal is available.
**Terminal state:** User selects redirect option or abandons.

```
async-review-escalation → [review in progress] → [user continues other work] → RESOLVED_APPROVED → action proceeds
```
**When:** Async review required; user's workflow is not fully blocked.
**Sequence rule:** The AI completes non-gated work; the gated action waits for review resolution.

### Complex Multi-Step Composition

```
stale-context-state → ambient-warning (session level) → confidence-disclosure (per output) → one-time-permission (for consequential action)
```
**When:** Session-level staleness is active; each output in the session carries a per-output disclosure; consequential actions require a gate.
**Composition note:** The ambient warning is a session-level background pattern; per-output disclosures are in addition to it, not instead of it.

```
low-confidence-state → limitation-disclosure → clarification-request → [user answers] → moderate-confidence-state → confidence-disclosure (contextual) → action
```
**When:** Confidence is low but may improve with user input; clarification partially resolves it.
**Sequence rule:** The clarification request exits the low-confidence state; the resulting state determines what patterns apply next.

---

## Illegal Combinations

The following combinations are explicitly prohibited. The system must not produce these simultaneously.

### Simultaneous Patterns (same element, same moment)

| Illegal combination | Why |
|---|---|
| `safe-refusal` + any other refusal pattern (same request) | Safe refusal is terminal; other refusal strategies imply a completion path exists |
| `blocking-warning` + `inline-warning` (same risk signal) | Two warnings for the same signal create conflicting severity signals |
| `structured-uncertainty-disclosure` + `confidence-disclosure` (same element) | The composite supersedes the individual; showing both is redundant |
| `structured-uncertainty-disclosure` + `limitation-disclosure` (same element) | Same reason as above |
| `policy-refusal` + `constrained-completion` (same policy-matched request) | Constrained completion cannot bypass a policy match by modifying the request |

### Sequential Violations

| Illegal sequence | Why |
|---|---|
| Permission gate → explanation (reverse order) | User must understand what they are authorizing before being asked to authorize |
| Recovery → blocking warning (without new blocking event) | Recovery follows a prior block; a new blocking warning requires a new event |
| `clarification-request` → `safe-refusal` (without evaluating the answer) | If user provides clarification, the AI must evaluate it before refusing |
| `safe-refusal` → any alternative that achieves the same prohibited outcome | Redirect after safe refusal must not achieve the refusal grounds through another path |
| `async-review-escalation` → `emergency-escalation` (same event) | Emergency escalation cannot be used to expedite an async review already in progress |

### Category Conflicts

| Illegal combination | Why |
|---|---|
| `human-handoff` (refusal) + `human-handoff` (escalation) for the same request | The same routing event cannot be both a refusal and an escalation simultaneously |
| `revocation` + any other permission grant (same action, same session) | A revoked permission cannot be re-granted in the same session without a new authorization cycle |
| `unresolvable-state` + `high-confidence-state` (same element) | Logically contradictory; indicates a classification error |
| `abandon-recovery` + `retry-recovery` simultaneously | Abandon is a terminal exit; retry is a continuation — they are mutually exclusive |

---

## Composition Cardinality Limits

No single user interaction should require the user to resolve more than:

- **2 warnings** simultaneously (for different risk signals)
- **1 permission gate** at a time (gates are sequential, not simultaneous)
- **3 recovery options** in a single recovery presentation (fewer is better)
- **1 escalation path** at a time (escalation paths are not shown in parallel to the user)

Exceeding these limits indicates the AI is presenting too much friction simultaneously. When multiple patterns would exceed these limits, the precedence engine must suppress lower-priority patterns until higher-priority ones resolve.

---

## Standard Composition Templates

The following templates describe the most common complete interaction sequences. Each template is a validated legal composition.

### Template A: Informational retrieval with moderate confidence

```
Input evaluation → MC state activated
↓
confidence-disclosure (contextual depth)
↓
source-citation (list depth, if retrieval-augmented)
↓
Output delivered
↓
[No permission gate required]
[No recovery activation]
```

### Template B: Action execution with risk and permission gap

```
Input evaluation → Risk = 2, Permission = unauthorized
↓
modal-warning (Advisory severity)
↓
explanation (limitation-disclosure or confidence-disclosure as applicable)
↓
one-time-permission gate
↓
[User grants → action executes]
[User declines → action cancelled → abandon-recovery or redirect-recovery offered]
```

### Template C: Low-confidence refusal with redirect

```
Input evaluation → LC state → UR state reached
↓
limitation-disclosure (detailed depth)
↓
safe-refusal (or policy-refusal if policy match)
↓
redirect-recovery (alternatives for underlying goal)
↓
[User selects alternative → new request evaluation]
[User declines all → abandon-recovery]
```

### Template D: Multi-step workflow with escalation gate

```
Input evaluation → Action requires authority beyond user's role
↓
decision-summary (of completed non-gated steps)
↓
blocking-warning (authority ceiling reached)
↓
role-escalation (PENDING)
↓
[Workflow continues for non-gated steps during escalation]
[Escalation RESOLVED_APPROVED → retry-recovery → gated step executes]
[Escalation RESOLVED_DENIED → redirect-recovery → alternative path]
[Escalation TIMEOUT → abandon-recovery or redirect]
```

### Template E: Policy refusal with exception path

```
Input evaluation → Policy match (tenant-level)
↓
policy-warning (if deterministic match; blocking severity)
↓
policy-refusal
↓
limitation-disclosure (why this policy exists)
↓
[Role escalation offered for exception → administrator may grant exception]
[Alternative formulation offered via redirect-recovery]
[User accepts → abandon-recovery]
```
