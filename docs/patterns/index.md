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

| Pattern | Sub-type | Severity | Status | File |
|---|---|---|---|---|
| Inline Warning | Inline | Advisory (1) | 🟢 | [`patterns/warning/inline-warning.md`](../../patterns/warning/inline-warning.md) |
| Modal Warning | Modal | Caution–Blocking (2–3) | 🟢 | [`patterns/warning/modal-warning.md`](../../patterns/warning/modal-warning.md) |
| Ambient Warning | Ambient | Informational–Advisory (0–1) | 🟢 | [`patterns/warning/ambient-warning.md`](../../patterns/warning/ambient-warning.md) |
| Blocking Warning | Blocking | Blocking (3) | 🟢 | [`patterns/warning/blocking-warning.md`](../../patterns/warning/blocking-warning.md) |
| Progressive Warning | Progressive | Advisory→Blocking (1→3) | 🟢 | [`patterns/warning/progressive-warning.md`](../../patterns/warning/progressive-warning.md) |
| Policy Warning | Policy | Advisory–Blocking (1–3) | 🟢 | [`patterns/warning/policy-warning.md`](../../patterns/warning/policy-warning.md) |

**Phase 2A complete.** All six warning pattern specifications are stable. Two additional warning patterns (Data Quality Warning, Output Staleness Warning) are planned for a future phase as refinements within the inline and ambient sub-types.

| Data Quality Warning | Inline | Advisory (1) | 🔲 | `patterns/warning/data-quality-warning.md` |
| Output Staleness Warning | Inline / Ambient | Advisory (1) | 🔲 | `patterns/warning/staleness-warning.md` |

---

## Explanation Patterns

Explanation patterns communicate the AI's reasoning, sources, confidence, or decision logic to the user.

| Pattern | Sub-type | Severity | Status | File |
|---|---|---|---|---|
| Confidence Disclosure | Confidence disclosure | Informational–Advisory (0–1) | 🟢 | [`patterns/explanation/confidence-disclosure.md`](../../patterns/explanation/confidence-disclosure.md) |
| Source Citation | Source citation | Informational (0) | 🟢 | [`patterns/explanation/source-citation.md`](../../patterns/explanation/source-citation.md) |
| Reasoning Trace | Reasoning trace | Informational (0) | 🟢 | [`patterns/explanation/reasoning-trace.md`](../../patterns/explanation/reasoning-trace.md) |
| Decision Summary | Decision summary | Informational (0) | 🟢 | [`patterns/explanation/decision-summary.md`](../../patterns/explanation/decision-summary.md) |
| Limitation Disclosure | Limitation disclosure | Advisory (1) | 🟢 | [`patterns/explanation/limitation-disclosure.md`](../../patterns/explanation/limitation-disclosure.md) |
| Structured Uncertainty Disclosure | Confidence + limitation | Advisory–Caution (1–2) | 🟢 | [`patterns/explanation/structured-uncertainty-disclosure.md`](../../patterns/explanation/structured-uncertainty-disclosure.md) |

**Phase 2B complete.** All six explanation pattern specifications are stable.

---

## Permission Gates

Permission gates require explicit user authorization before the AI proceeds with a consequential or irreversible action.

| Pattern | Sub-type | Severity | Status | File |
|---|---|---|---|---|
| One-Time Permission | Soft gate | Caution (2) | 🟢 | [`patterns/permission/one-time-permission.md`](../../patterns/permission/one-time-permission.md) |
| Session Permission | Soft gate | Caution (2) | 🟢 | [`patterns/permission/session-permission.md`](../../patterns/permission/session-permission.md) |
| Persistent Permission | Hard gate (initial) | Blocking (3) initial | 🟢 | [`patterns/permission/persistent-permission.md`](../../patterns/permission/persistent-permission.md) |
| Scoped Permission | Hard gate | Blocking (3) | 🟢 | [`patterns/permission/scoped-permission.md`](../../patterns/permission/scoped-permission.md) |
| Delegated Permission | Delegated gate | Blocking–Critical (3–4) | 🟢 | [`patterns/permission/delegated-permission.md`](../../patterns/permission/delegated-permission.md) |
| Revocation | Revocation | Informational–Caution (0–2) | 🟢 | [`patterns/permission/revocation.md`](../../patterns/permission/revocation.md) |

**Phase 2C complete.** All six permission gate specifications are stable. These replace the earlier abstract soft/hard/audit-required/delegated/bulk/third-party gate groupings with a concrete, lifecycle-based permission model (one-time → session → persistent → scoped → delegated → revocation).

| Audit-Required Permission Gate | Audit-required gate | — | 🔲 | `patterns/permission/audit-required-gate.md` _(planned — additional compliance depth)_ |

---

## Uncertainty States

Uncertainty states describe the AI's internal operating state with respect to the reliability of its output for a given query. Each state determines which explanation patterns activate, which actions are permitted, and how user interaction is structured.

| Pattern | Sub-type | Severity | Status | File |
|---|---|---|---|---|
| High Confidence State | High confidence | Informational (0) | 🟢 | [`patterns/uncertainty/high-confidence-state.md`](../../patterns/uncertainty/high-confidence-state.md) |
| Moderate Confidence State | Moderate confidence | Advisory (1) | 🟢 | [`patterns/uncertainty/moderate-confidence-state.md`](../../patterns/uncertainty/moderate-confidence-state.md) |
| Low Confidence State | Low confidence | Caution (2) | 🟢 | [`patterns/uncertainty/low-confidence-state.md`](../../patterns/uncertainty/low-confidence-state.md) |
| Conflicting Evidence State | Conflicting sources | Caution (2) | 🟢 | [`patterns/uncertainty/conflicting-evidence-state.md`](../../patterns/uncertainty/conflicting-evidence-state.md) |
| Insufficient Information State | Information absence | Caution–Blocking (2–3) | 🟢 | [`patterns/uncertainty/insufficient-information-state.md`](../../patterns/uncertainty/insufficient-information-state.md) |
| Stale Context State | Stale data | Advisory–Caution (1–2) | 🟢 | [`patterns/uncertainty/stale-context-state.md`](../../patterns/uncertainty/stale-context-state.md) |
| Unresolvable State | Terminal uncertainty | Blocking–Critical (3–4) | 🟢 | [`patterns/uncertainty/unresolvable-state.md`](../../patterns/uncertainty/unresolvable-state.md) |

---

## Refusal States

Refusal states describe the AI's interaction strategy when it cannot fulfill a request as stated. Each variant defines what is refused, what can still be provided, and what the user's path forward is.

| Pattern | Sub-type | Severity | Status | File |
|---|---|---|---|---|
| Safe Refusal | Safety refusal | Blocking–Critical (3–4) | 🟢 | [`patterns/refusal/safe-refusal.md`](../../patterns/refusal/safe-refusal.md) |
| Partial Completion | Graceful degradation | Advisory–Caution (1–2) | 🟢 | [`patterns/refusal/partial-completion.md`](../../patterns/refusal/partial-completion.md) |
| Constrained Completion | Scope refusal (modified fulfillment) | Advisory–Caution (1–2) | 🟢 | [`patterns/refusal/constrained-completion.md`](../../patterns/refusal/constrained-completion.md) |
| Alternative Suggestion | Capability refusal (with redirection) | Advisory (1) | 🟢 | [`patterns/refusal/alternative-suggestion.md`](../../patterns/refusal/alternative-suggestion.md) |
| Clarification Request | Deferral pending user input | Informational–Advisory (0–1) | 🟢 | [`patterns/refusal/clarification-request.md`](../../patterns/refusal/clarification-request.md) |
| Human Handoff | Escalation refusal | Caution–Blocking (2–3) | 🟢 | [`patterns/refusal/human-handoff.md`](../../patterns/refusal/human-handoff.md) |
| Policy Refusal | Policy enforcement refusal | Blocking (3) | 🟢 | [`patterns/refusal/policy-refusal.md`](../../patterns/refusal/policy-refusal.md) |

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
