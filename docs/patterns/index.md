# Pattern Library Index

The pattern library contains specifications for every guardrail pattern, explanation pattern, permission gate, uncertainty state, refusal state, escalation path, and recovery flow in this design system.

Each pattern specification defines: what the pattern is, when it activates, how the system decides which variant to use, what users see and hear, and what antipatterns to avoid.

---

## Status Key

| Symbol | Meaning |
|---|---|
| 🔲 | Planned — not yet written |
| 🟡 | Draft — in progress |
| 🟢 | Stable — reviewed and complete |

---

## Warning Patterns

Warning patterns surface concerns, risks, or important considerations before a user proceeds. The user retains full agency after seeing a warning.

| Pattern | Sub-type | Status | File |
|---|---|---|---|
| Inline Warning | Inline | 🔲 | `patterns/warning/inline-warning.md` |
| Modal Warning | Modal | 🔲 | `patterns/warning/modal-warning.md` |
| Ambient Warning | Ambient | 🔲 | `patterns/warning/ambient-warning.md` |
| Progressive Warning | Progressive | 🔲 | `patterns/warning/progressive-warning.md` |
| Data Quality Warning | Inline | 🔲 | `patterns/warning/data-quality-warning.md` |
| Output Staleness Warning | Inline / Ambient | 🔲 | `patterns/warning/staleness-warning.md` |

---

## Explanation Patterns

Explanation patterns communicate the AI's reasoning, sources, confidence, or decision logic to the user.

| Pattern | Sub-type | Status | File |
|---|---|---|---|
| Confidence Disclosure | Confidence disclosure | 🔲 | `patterns/explanation/confidence-disclosure.md` |
| Source Citation | Source citation | 🔲 | `patterns/explanation/source-citation.md` |
| Reasoning Trace | Reasoning trace | 🔲 | `patterns/explanation/reasoning-trace.md` |
| Decision Summary | Decision summary | 🔲 | `patterns/explanation/decision-summary.md` |
| Limitation Disclosure | Limitation disclosure | 🔲 | `patterns/explanation/limitation-disclosure.md` |
| Structured Uncertainty Disclosure | Confidence + limitation | 🔲 | `patterns/explanation/structured-uncertainty-disclosure.md` |

---

## Permission Gates

Permission gates require explicit user authorization before the AI proceeds with a consequential or irreversible action.

| Pattern | Sub-type | Status | File |
|---|---|---|---|
| Soft Permission Gate | Soft gate | 🔲 | `patterns/permission/soft-gate.md` |
| Hard Permission Gate | Hard gate | 🔲 | `patterns/permission/hard-gate.md` |
| Audit-Required Permission Gate | Audit-required gate | 🔲 | `patterns/permission/audit-required-gate.md` |
| Delegated Permission Gate | Delegated gate | 🔲 | `patterns/permission/delegated-gate.md` |
| Bulk Action Permission Gate | Hard gate | 🔲 | `patterns/permission/bulk-action-gate.md` |
| Third-Party Impact Gate | Hard gate + audit | 🔲 | `patterns/permission/third-party-impact-gate.md` |

---

## Uncertainty States

Uncertainty states express the AI's confidence level in its output and adjust user communication accordingly.

| Pattern | Sub-type | Status | File |
|---|---|---|---|
| High Confidence State | High confidence | 🔲 | `patterns/uncertainty/high-confidence-state.md` |
| Moderate Confidence State | Moderate confidence | 🔲 | `patterns/uncertainty/moderate-confidence-state.md` |
| Low Confidence State | Low confidence | 🔲 | `patterns/uncertainty/low-confidence-state.md` |
| Unresolvable Uncertainty State | Unresolvable | 🔲 | `patterns/uncertainty/unresolvable-uncertainty-state.md` |
| Conflicting Sources State | Low / moderate | 🔲 | `patterns/uncertainty/conflicting-sources-state.md` |

---

## Refusal States

Refusal states decline to fulfill a request, with appropriate communication about why and what the user can do next.

| Pattern | Sub-type | Status | File |
|---|---|---|---|
| Policy Refusal | Policy refusal | 🔲 | `patterns/refusal/policy-refusal.md` |
| Capability Refusal | Capability refusal | 🔲 | `patterns/refusal/capability-refusal.md` |
| Safety Refusal | Safety refusal | 🔲 | `patterns/refusal/safety-refusal.md` |
| Scope Refusal | Scope refusal | 🔲 | `patterns/refusal/scope-refusal.md` |
| Graceful Degradation | Partial fulfillment | 🔲 | `patterns/refusal/graceful-degradation.md` |
| Contextual Refusal | Context-dependent | 🔲 | `patterns/refusal/contextual-refusal.md` |

---

## Escalation Paths

Escalation paths route a request, decision, or situation to a higher authority when the AI's scope, confidence, or authorization is insufficient.

| Pattern | Sub-type | Status | File |
|---|---|---|---|
| Human Handoff | Human handoff | 🔲 | `patterns/escalation/human-handoff.md` |
| Role Escalation | Role escalation | 🔲 | `patterns/escalation/role-escalation.md` |
| System Escalation | System escalation | 🔲 | `patterns/escalation/system-escalation.md` |
| Emergency Escalation | Emergency | 🔲 | `patterns/escalation/emergency-escalation.md` |
| Asynchronous Review Escalation | Async review | 🔲 | `patterns/escalation/async-review-escalation.md` |

---

## Recovery Flows

Recovery flows return the user to productive work after a warning, refusal, error, or escalation.

| Pattern | Sub-type | Status | File |
|---|---|---|---|
| Retry Recovery | Retry | 🔲 | `patterns/recovery/retry-recovery.md` |
| Redirect Recovery | Redirect | 🔲 | `patterns/recovery/redirect-recovery.md` |
| Repair Recovery | Repair | 🔲 | `patterns/recovery/repair-recovery.md` |
| Manual Override Recovery | Manual override | 🔲 | `patterns/recovery/manual-override-recovery.md` |
| Abandon Recovery | Abandon | 🔲 | `patterns/recovery/abandon-recovery.md` |

---

## Pattern Authoring Status

- **Phase 1:** Index scaffold only (this file)
- **Phase 2:** Full specifications for all patterns above
- **Phase 3:** Decision flows added to each pattern specification

_Total planned pattern specifications: ~38_

---

## Cross-Pattern Relationships

Patterns frequently appear together. Common combinations:

| Trigger | Common chain |
|---|---|
| Low-confidence output | Uncertainty state → Explanation pattern → Recovery flow |
| Irreversible action | Permission gate → Warning pattern → Recovery flow |
| Policy-matching request | Refusal state → Explanation pattern → Recovery flow |
| Scope boundary hit | Refusal state → Escalation path → Recovery flow |
| Safety signal | Safety refusal → Emergency escalation |
| Authorization gap | Permission gate → Role escalation → Audit-required gate |

Decision logic for these chains is documented in [`docs/decision-flows/`](../decision-flows/index.md).
