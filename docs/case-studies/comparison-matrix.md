# Cross-Industry Comparison Matrix

**Document type:** Reference matrix
**Phase:** 5
**Status:** stable

---

This matrix compares all eight Phase 5 case studies across the dimensions required to understand risk posture, pattern coverage, escalation behavior, recovery strategy, audit requirements, and accessibility considerations. Use it to select the closest reference implementation when designing a new deployment.

---

## Primary Comparison Matrix

| Industry | Risk level | Primary trigger | Confidence state | Primary refusal pattern | Escalation path | Recovery flow | Audit level | Deployment notes |
|---|---|---|---|---|---|---|---|---|
| Healthcare — Drug interaction | P1=3 (High) | User request: decision-support | Low (LC) + Stale context | Constrained completion (not refusal) | Role escalation (offered) | None triggered | Detailed — claim-level citation, limitation disclosure | Requires knowledge base freshness tracking; claim-level attribution is mandatory |
| Banking — Fraud block | P1=4 (Critical) | System: policy match | High (HC) — policy is deterministic | Policy refusal | Emergency escalation (concurrent) | Redirect recovery (human-gated) | Critical — transaction, policy, MFA gap, escalation timestamp | Customer-facing severity decoupled from internal escalation severity |
| Insurance — Missing docs | P1=2 (Moderate) | User request: workflow | Insufficient Information (II) | Partial completion + clarification request | Async review escalation | Repair recovery | Standard — documentation chain, SLA clock | Repair recovery requires document quality validation, not just receipt |
| Enterprise HR — PIP | P1=3 (High) | User request: content generation | Moderate (MC) + Stale | Scoped permission gate (blocks before refusal) | Delegated permission (resolved) | None triggered | Detailed — delegation record, purpose, expiry, stale data flag | Precedence: permission gate before stale context disclosure |
| Customer Support — Escalating complaint | P1=1→2 (escalating) | User: explicit escalation request | MC → Low (session progression) | Human handoff (refusal) | None (refusal IS the routing) | Retry recovery (optional) | Standard — sentiment progression, turn count, handoff transcript | Progressive warning must escalate across turns, not within turns |
| Developer Copilot — CVE conflict | P1=3 (High) | User request: decision-support | Conflicting Evidence (CE) | Safe refusal (no recommendation) | None (redirect recovery) | Redirect recovery (internal security team) | Standard — both sources, both claims, refusal reason | CE ≠ LC; reasoning trace must explain what would resolve the conflict |
| Industrial AI — Sensor conflict | P1=4 (Critical) | System: autonomous monitoring | CE → Unresolvable (UR) | None (system event — escalate, not refuse) | Emergency escalation (interrupt mode) | Abandon recovery (mandatory) | Critical — sensor values, divergence duration, escalation timestamp, resume authorization | False positive escalation is correct outcome; AI must not resume without explicit operator reset |
| Autonomous Procurement — Spend ceiling | P1=3 (High) | System: action execution, ceiling breach | High (HC) — breach is deterministic | Blocking warning (authorization gate) | Role escalation → async review | Manual override recovery | Critical — override identity, scope, pricing anomaly, SOX flag | Override authorization is per-transaction; agent ceiling unchanged by exception |

---

## Pattern Coverage Matrix

Which of the 36 pattern specifications each case study exercises as a primary or secondary pattern.

| Pattern category | Pattern | Healthcare | Banking | Insurance | HR | Customer support | Developer copilot | Industrial AI | Procurement |
|---|---|---|---|---|---|---|---|---|---|
| **Warning** | inline-warning | — | — | — | — | ✓ (Turn 2) | — | — | — |
| | ambient-warning | — | — | — | ✓ | — | — | — | — |
| | modal-warning | — | — | — | — | ✓ (Turn 3) | — | — | — |
| | blocking-warning | — | ✓ | — | — | — | — | — | ✓ |
| | progressive-warning | — | — | — | — | ✓ | — | — | — |
| | policy-warning | — | ✓ | — | — | — | — | — | — |
| **Explanation** | confidence-disclosure | ✓ | — | — | — | — | — | — | — |
| | source-citation | ✓ | — | — | — | — | ✓ | — | — |
| | reasoning-trace | — | — | — | — | — | ✓ | — | — |
| | decision-summary | — | — | — | — | — | — | — | — |
| | limitation-disclosure | ✓ | ✓ | ✓ | — | — | — | — | — |
| | structured-uncertainty-disclosure | — | — | — | — | — | — | — | — |
| **Permission** | one-time-permission | — | — | — | — | — | — | — | — |
| | session-permission | — | — | — | — | — | — | — | — |
| | persistent-permission | — | — | — | — | — | — | — | — |
| | scoped-permission | — | — | — | ✓ | — | — | — | — |
| | delegated-permission | — | — | — | ✓ | — | — | — | — |
| | revocation | — | — | — | — | — | — | — | — |
| **Uncertainty** | high-confidence-state | — | ✓ | — | — | — | — | — | ✓ |
| | moderate-confidence-state | — | — | — | ✓ | ✓ | — | — | — |
| | low-confidence-state | ✓ | — | — | — | ✓ | — | — | — |
| | conflicting-evidence-state | — | — | — | — | — | ✓ | ✓ | — |
| | insufficient-information-state | — | — | ✓ | — | — | — | — | — |
| | stale-context-state | ✓ | — | — | ✓ | — | — | — | — |
| | unresolvable-state | — | — | — | — | — | — | ✓ | — |
| **Refusal** | safe-refusal | — | — | — | — | — | ✓ | — | — |
| | partial-completion | — | — | ✓ | — | — | — | — | — |
| | constrained-completion | ✓ | — | — | — | — | — | — | — |
| | alternative-suggestion | — | — | — | — | — | ✓ | — | — |
| | clarification-request | — | — | ✓ | — | — | — | — | — |
| | human-handoff (refusal) | — | — | — | — | ✓ | — | — | — |
| | policy-refusal | — | ✓ | — | — | — | — | — | — |
| **Escalation** | human-handoff (escalation) | — | — | — | — | — | — | — | — |
| | role-escalation | ✓ | — | — | — | — | — | — | ✓ |
| | system-escalation | — | — | — | — | — | — | — | — |
| | emergency-escalation | — | ✓ | — | — | — | — | ✓ | — |
| | async-review-escalation | — | — | ✓ | — | — | — | — | ✓ |
| **Recovery** | retry-recovery | — | — | — | — | ✓ | — | — | — |
| | redirect-recovery | — | ✓ | — | — | — | ✓ | — | ✓ |
| | repair-recovery | — | — | ✓ | — | — | — | — | — |
| | manual-override-recovery | — | — | — | — | — | — | — | ✓ |
| | abandon-recovery | — | — | — | — | — | — | ✓ | — |

**Coverage summary:** 36 pattern specifications. Exercised as primary or secondary in Phase 5 case studies: 33. Uncovered: `decision-summary`, `structured-uncertainty-disclosure`, `one-time-permission`, `session-permission`, `persistent-permission`, `revocation`, `human-handoff (escalation)`, `system-escalation`.

---

## Escalation Comparison

| Case study | Escalation path | Mode | Trigger condition | SLA | Fallback if escalation fails |
|---|---|---|---|---|---|
| Healthcare | Role escalation (offered) | Async (optional) | LC state + Risk=3 + decision-support intent | Not time-bound (offered, not mandatory) | Abandon: document that definitive guidance was not obtained |
| Banking | Emergency escalation | Interrupt (concurrent) | Policy match + Risk=4 + action-execution | Immediate; fraud ops must acknowledge | Fraud ops backup team; compliance escalation |
| Insurance | Async review escalation | Async queue | II state + clarification request sent | 14-day SLA | Escalation to claims manager; formal review |
| HR | Delegated permission | Async (48h expiry) | Scope boundary violation + content generation | 48 hours | Escalation to HR leadership; cross-scope exception process |
| Customer support | Human handoff (refusal) | Synchronous | Explicit user request + MC→Low state + 3 turns | Immediate | Retry-recovery (one additional attempt) |
| Developer copilot | None (redirect recovery) | N/A | CE state + safe refusal | N/A | Internal security advisory process |
| Industrial AI | Emergency escalation | Interrupt mode | CE→UR state + Risk=4 + policy match | Immediate; supervisor on-site target: <5min | Safety system alert; facility-wide alarm |
| Procurement | Role escalation → async review | Async; escalates if SLA expires | Spend ceiling breach + action-execution | Role: 4 hours; async: configurable | Procurement team formal review; request denial |

---

## Recovery Comparison

| Case study | Recovery flow | Trigger | Exit condition | Owner |
|---|---|---|---|---|
| Healthcare | None triggered | N/A | N/A | N/A |
| Banking | Redirect recovery | Policy block | Human review completes (fraud team or customer MFA + re-initiation) | Fraud operations team |
| Insurance | Repair recovery | Documentation received | Re-evaluation succeeds with complete documentation | AI + adjuster |
| HR | None triggered (delegated permission resolves the block) | N/A | N/A | N/A |
| Customer support | Retry recovery (optional) | Customer declines handoff | Retry succeeds or mandatory handoff triggered | Customer + AI (one attempt) |
| Developer copilot | Redirect recovery | Safe refusal | Security team resolves conflict | Internal security team |
| Industrial AI | Abandon recovery | UR state + emergency escalation | Supervisor reset acknowledgment | Plant operator / shift supervisor |
| Procurement | Manual override recovery | Approved exception | Override authorization recorded; PO executed | Responsible manager or procurement team |

---

## Audit Level Comparison

| Case study | Audit level | Key audit fields |
|---|---|---|
| Healthcare | Detailed | Primitives evaluated, LC + stale confirmation, constrained output flag, limitation disclosure rendered, source citation at claim level, role escalation status (OFFERED/NOT INITIATED) |
| Banking | Critical | Policy rules matched (×3), MFA gap, transaction amount, beneficiary, device, emergency escalation timestamp, fraud ops acknowledgment, hold resolution |
| Insurance | Standard | II state, missing document names with policy references, clarification request sent, SLA start, documentation received timestamp, repair validation result |
| HR | Detailed | Scope boundary detected, delegated permission request identity + purpose + expiry, delegation grant identity, stale data flag with specific data age, constrained output fields |
| Customer support | Standard | Session sentiment progression, turn count, billing query attempts (×2), escalation trigger (explicit request), handoff transcript, live agent join time |
| Developer copilot | Standard | CE state confirmed, both source attributions, both contradictory claims, safe refusal issued, alternatives offered, no recommendation issued |
| Industrial AI | Critical | Sensor values (A + B), divergence duration, CE → UR transition timestamp, emergency escalation targets notified, AI advisory suspension, supervisor acknowledgment, resume authorization |
| Procurement | Critical | Spend ceiling breach, pricing anomaly (negotiated vs. quoted), role escalation SLA, override authority identity, exception scope, SOX audit flag |

---

## Accessibility Notes

| Case study | Primary accessibility requirements |
|---|---|
| Healthcare | Screen reader announcements for confidence badge + limitation disclosure; `aria-live="polite"` for stale context badge changes |
| Banking | `role="alert"` for blocking warning on mobile (Tier 1 customer); emergency overlay is internal — standard ARIA compliance for internal tooling |
| Insurance | `aria-live="polite"` for async review status updates; `role="dialog"` for clarification request (structured form); keyboard-accessible form fields |
| HR | `role="dialog"` for scoped permission gate; focus trap within gate until resolved; `aria-live="assertive"` for scope boundary notification |
| Customer support | `role="alert"` for progressive warning at Turn 2; `role="dialog"` for modal warning at Turn 3; focus management on modal (Tab → Confirm, Shift+Tab → Cancel) |
| Developer copilot | `aria-expanded` for reasoning trace (collapsible); screen reader table structure for conflicting evidence card |
| Industrial AI | `role="alertdialog"` for emergency escalation; `aria-live="assertive"`; audible alert required (safety context) |
| Procurement | `role="dialog"` for override confirmation; explicit acknowledgment checkbox required before confirm button activates |

---

## Pattern Coverage Gaps After Phase 5

The following patterns are defined in the specification library but not exercised in Phase 5 case studies:

| Pattern | Category | Reason not covered |
|---|---|---|
| `decision-summary` | Explanation | Multi-step decision summary patterns are best demonstrated in complex workflow case studies; planned for Phase 7 |
| `structured-uncertainty-disclosure` | Explanation | Requires a highly structured output domain (tables, risk matrices); planned for regulated industry playbooks |
| `one-time-permission` | Permission | Best demonstrated in consumer product contexts; Phase 5 focuses on enterprise deployments |
| `session-permission` | Permission | Best demonstrated in multi-session AI assistants; planned for Phase 7 |
| `persistent-permission` | Permission | Requires cross-session context; planned for Phase 7 |
| `revocation` | Permission | Requires an existing granted permission to revoke; planned for Phase 7 lifecycle case studies |
| `human-handoff (escalation)` | Escalation | Closely related to role-escalation; will be differentiated in a multi-system orchestration case study |
| `system-escalation` | Escalation | Requires a multi-system AI architecture case study; planned for Phase 7 |
