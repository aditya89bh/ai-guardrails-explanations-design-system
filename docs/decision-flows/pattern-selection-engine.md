# Pattern Selection Engine

**Document type:** Decision engine — pattern selection layer
**Phase:** 3
**Status:** stable
**Depends on:** `decision-primitives.md`

---

## Purpose

The pattern selection engine defines — for every combination of decision primitives — which pattern category activates, which specific pattern within that category is selected, and at what depth or severity level that pattern operates. Every rule in this document is deterministic: given the same primitive values, the same pattern is selected every time.

This engine reads the ten decision primitives (P1–P10) defined in `decision-primitives.md` and produces a list of activated patterns ordered by the precedence rules in `pattern-precedence-engine.md`.

---

## Selection Architecture

Pattern selection operates in three steps:

1. **Category gating** — determine which of the seven pattern categories activate for this interaction
2. **Within-category selection** — determine the specific pattern within each activated category
3. **Depth and severity calibration** — determine the operating level (severity, explanation depth, gate type) for each selected pattern

All three steps run for every interaction. Steps 2 and 3 are suppressed for categories that do not activate in step 1.

---

## Step 1 — Category Gating

The following table determines whether each pattern category activates. All conditions in the "Activate if" column are evaluated independently — multiple categories may activate simultaneously.

| Category | Activate if | Do not activate if |
|---|---|---|
| **Warning** | Risk (P1) ≥ 1, OR Business impact (P7) = High with any risk | Risk = 0 AND business impact ≤ Medium |
| **Explanation** | Confidence (P2) < high threshold, OR Source reliability (P10) ≤ 2, OR Context freshness (P9) = stale | Confidence = high AND source reliability = 3 AND freshness = fresh (passive indicator only) |
| **Permission** | Permission (P4) = unauthorized or revoked, OR Risk (P1) ≥ 2, OR Business impact (P7) ≥ Medium with user intent = action-execution | Permission = authorized AND risk ≤ 1 AND intent ≠ action-execution |
| **Uncertainty** | Confidence (P2) < high threshold, OR Source reliability (P10) ≤ 1, OR Conflicting sources detected, OR Information absence confirmed | Confidence = high AND all sources high reliability AND no conflicts |
| **Refusal** | Capability (P3) = incapable, OR Policy (P5) = match, OR Risk (P1) = 4, OR Confidence (P2) = unresolvable, OR User intent = action-execution AND permission = revoked | None of the above conditions hold |
| **Escalation** | User authority (P8) insufficient for required action, OR Policy rule requires human review, OR Uncertainty state = unresolvable AND task is time-sensitive, OR Emergency condition detected | AI has sufficient authority, task is within scope, and no emergency condition |
| **Recovery** | A prior interaction step activated a refusal, permission denial, escalation denial, or blocking condition, AND the user's goal remains achievable | No prior blocking event in this interaction, OR the user's goal is no longer achievable |

**Multi-category activation:** When multiple categories activate simultaneously, they are not all surfaced to the user at once. The precedence engine (see `pattern-precedence-engine.md`) determines display order and interaction sequence.

---

## Step 2 — Within-Category Pattern Selection

### Warning Category Selection

Warning selection is driven by Risk (P1), Business impact (P7), and User intent (P6).

| Condition | Selected warning pattern |
|---|---|
| Risk = 1 AND context is inline (user is mid-task) | `inline-warning` |
| Risk = 2 AND user is about to execute an action | `modal-warning` |
| Risk = 2 AND condition is ongoing/ambient (not action-specific) | `ambient-warning` |
| Risk = 3 AND action is consequential | `blocking-warning` |
| Risk = 3 AND multiple warning signals accumulate across a session | `progressive-warning` |
| Policy (P5) = match (tenant or deployment level) | `policy-warning` |
| Risk = 4 OR Platform-level policy match | No warning — goes directly to refusal or emergency escalation |

**Progressive warning escalation rule:** If an `inline-warning` was shown in the prior interaction step for the same risk signal and the user proceeded without modifying their approach, escalate to `modal-warning` on the next occurrence. If `modal-warning` was shown and the user still proceeds, escalate to `blocking-warning`. This progression is stateful — the engine tracks prior warnings within the session.

### Explanation Category Selection

Explanation selection is driven by Confidence (P2), Source reliability (P10), and Context freshness (P9).

| Condition | Selected explanation pattern |
|---|---|
| Confidence < high threshold | `confidence-disclosure` |
| Source reliability ≤ 2 OR retrieval-augmented output | `source-citation` |
| High-stakes or compliance-relevant output | `reasoning-trace` |
| Multi-step decision produced by AI, consequential | `decision-summary` |
| Structural capability or knowledge boundary is the cause | `limitation-disclosure` |
| Confidence < high threshold AND source reliability ≤ 2 | `structured-uncertainty-disclosure` (supersedes individual disclosures) |
| Context freshness = stale | `inline-warning` (stale signal) + `confidence-disclosure` or `limitation-disclosure` |

**Structured uncertainty disclosure override:** When both confidence is below threshold and source reliability is ≤ 2, `structured-uncertainty-disclosure` supersedes `confidence-disclosure` and `limitation-disclosure`. The two individual patterns are not shown separately — the composite pattern is shown instead.

**Explanation depth rules:**

| Confidence level | Required explanation depth |
|---|---|
| Moderate confidence | Surface or contextual depth |
| Low confidence | Contextual or detailed depth |
| Insufficient information | Limitation disclosure (contextual depth) |
| Conflicting evidence | Source citation (claim-level) + reasoning trace (summary depth) |
| Unresolvable | Limitation disclosure (detailed depth) |

### Permission Category Selection

Permission gate selection is driven by Risk (P1), Business impact (P7), and the specific action type.

| Condition | Selected permission pattern |
|---|---|
| Action is one-time and non-recurring | `one-time-permission` |
| Action will recur multiple times within this session | `session-permission` |
| Action recurs across sessions AND user has established pattern of authorization | `persistent-permission` |
| Action affects a specific bounded scope (dataset, system, time window) | `scoped-permission` |
| Action requires authorization from a third party | `delegated-permission` |
| A prior permission was granted and must be withdrawn | `revocation` |

**Gate type calibration by Risk × Business impact:**

| Risk | Business impact | Gate presentation |
|---|---|---|
| 1 | Low | Minimal gate — inline acknowledgment |
| 1–2 | Medium | One-time gate — standard dialog |
| 2 | High | Modal warning + gate |
| 3 | Low–Medium | Blocking warning + gate |
| 3 | High | Blocking warning + delegated gate |
| 4 | Any | No gate — safe refusal or emergency escalation overrides |

### Uncertainty Category Selection

Uncertainty state selection is driven primarily by Confidence (P2), Source reliability (P10), and the specific cause.

| Condition | Selected uncertainty state |
|---|---|
| Confidence ≥ high threshold, all sources reliable, freshness = fresh | `high-confidence-state` |
| Confidence between low floor and high threshold | `moderate-confidence-state` |
| Confidence ≤ low floor | `low-confidence-state` |
| Conflicting sources detected | `conflicting-evidence-state` |
| Required information is absent (retrieval returns nothing) | `insufficient-information-state` |
| Context freshness = stale for primary source | `stale-context-state` |
| None of the above can produce a reliable directional output | `unresolvable-state` |

**Uncertainty state priority** (when multiple conditions hold simultaneously):

```
unresolvable > conflicting-evidence > insufficient-information > low-confidence > stale-context > moderate-confidence > high-confidence
```

The highest-priority applicable state is the active state. Lower-priority states that also apply are noted in the explanation but do not independently activate their own patterns.

### Refusal Category Selection

Refusal pattern selection is driven by the specific reason the request cannot be fulfilled.

| Condition | Selected refusal pattern |
|---|---|
| Safety or harm risk that cannot be mitigated | `safe-refusal` |
| Policy (P5) = match (any level) | `policy-refusal` |
| Capability (P3) = incapable, but alternative approach exists | `alternative-suggestion` |
| Uncertainty = unresolvable, no output can be produced | `safe-refusal` OR `clarification-request` (if user input could resolve) |
| Request is underspecified, multiple interpretations are plausible | `clarification-request` |
| Multi-part request: some parts completable, some not | `partial-completion` |
| Request is completable with modifications to bring within bounds | `constrained-completion` |
| Task requires human expertise, authority, or licensed judgment | `human-handoff` (refusal category) |

**Refusal pattern mutual exclusion:** `safe-refusal` and `policy-refusal` are mutually exclusive as primary patterns — safe refusal is judgment-governed; policy refusal is rule-governed. If both apply (a request triggers both a safety signal and a policy rule), `policy-refusal` is the displayed pattern because it is more specific and traceable. The safety signal is recorded in the audit log.

### Escalation Category Selection

Escalation path selection is driven by User authority (P8), the nature of the authorization gap, and the urgency of the situation.

| Condition | Selected escalation path |
|---|---|
| Authorization ceiling exceeded; human approval needed | `human-handoff` (escalation category) |
| Current role insufficient; higher organizational role required | `role-escalation` |
| AI cannot proceed; a different system has the authority | `system-escalation` |
| Safety, security, or critical compliance emergency | `emergency-escalation` |
| Human review required but not immediately | `async-review-escalation` |

**Escalation priority** when multiple paths could apply:

```
emergency-escalation > human-handoff > role-escalation > system-escalation > async-review-escalation
```

### Recovery Category Selection

Recovery flow selection is driven by the nature of the prior blocking event and the current state of the user's goal.

| Prior blocking event | User's goal status | Selected recovery flow |
|---|---|---|
| Transient failure; same path can be re-attempted | Still achievable | `retry-recovery` |
| Structural block; original path is permanently closed; alternative exists | Still achievable | `redirect-recovery` |
| Error or inconsistency in data/state; correctable | Still achievable | `repair-recovery` |
| Guardrail blocked action; authorized user wants to bypass | Still achievable; user is authorized | `manual-override-recovery` |
| All recovery paths exhausted or declined | No longer achievable in this session | `abandon-recovery` |

---

## Step 3 — Depth and Severity Calibration

Once a specific pattern is selected, the operating depth or severity level is calibrated using the following rules:

**Warning severity calibration:**

| Risk (P1) | Selected severity level |
|---|---|
| 1 | Informational |
| 2 | Advisory |
| 2 with high business impact | Caution |
| 3 | Blocking |
| 4 | Critical (routes to refusal/escalation, not warning) |

**Explanation depth calibration:**

| Confidence state | Explanation depth |
|---|---|
| Moderate confidence | Surface |
| Low confidence | Contextual |
| Conflicting evidence | Claim-level (source citation) |
| Insufficient information | Contextual (limitation disclosure) |
| Unresolvable | Detailed |

**Permission gate friction calibration:**

| Risk × Business impact | Gate friction level |
|---|---|
| Low × Low | Minimal — background authorization check |
| Medium × Any | Standard dialog with explanation |
| High × Low | Modal warning + standard dialog |
| High × High | Blocking warning + explicit acknowledgment |

---

## Selection Fallback Rules

When no pattern in a category matches the specific conditions:

1. **Warning:** If no specific warning subtype matches, default to `inline-warning` at the appropriate severity level.
2. **Explanation:** If no specific explanation pattern matches, default to `confidence-disclosure` at contextual depth.
3. **Permission:** If no specific permission pattern matches, apply `one-time-permission` with an explanation of the authorization requirement.
4. **Uncertainty:** If no state condition matches, default to `moderate-confidence-state` — do not default to `high-confidence-state` without explicit high-confidence verification.
5. **Refusal:** If no specific refusal pattern matches but a refusal is required, apply `safe-refusal` — never allow an action that requires refusal to proceed because no pattern matched.
6. **Escalation:** If no escalation path is defined in the deployment configuration, apply `human-handoff` (escalation) to a general operations queue.
7. **Recovery:** If the prior blocking event type does not match any recovery trigger, apply `redirect-recovery` as the default recovery path.
