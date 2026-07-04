# Case Study Framework

**Document type:** Reference implementation framework
**Phase:** 5
**Status:** stable

---

## Purpose

Case studies are end-to-end reference implementations of the guardrail decision engine operating in realistic enterprise AI product scenarios. They demonstrate exactly how the ten decision primitives are evaluated, which patterns activate, which components render, what the user sees at each step, and what the audit trail records.

Case studies are not hypothetical illustrations. They are specification-level examples: if an implementation produces a different result for the same primitive values, the implementation diverges from the specification.

---

## What Case Studies Are Not

- They are not new pattern specifications. All guardrail logic is defined in `docs/decision-flows/` and `patterns/`.
- They are not UI wireframes. Component behavior is specified in `components/`.
- They are not marketing copy. Every claim must be traceable to an existing specification.

---

## Standard Case Study Structure

Every case study follows this structure. Section headings and field names are canonical — do not abbreviate or merge them.

### 1. Problem
One paragraph describing the deployment context, the AI system, the user population, and the specific risk scenario this case study addresses.

### 2. User Request
The verbatim or near-verbatim input that triggers the guardrail flow.

### 3. Decision Primitive Evaluation
A table evaluating all ten primitives (P1–P10) against the current interaction. Each row: primitive name, computed value, reasoning.

### 4. Decision Engine Execution
Which rules in the selection engine, precedence engine, and state machine activated. Which rules were evaluated but did not activate. Why each skipped rule did not fire.

### 5. Pattern Sequence
The ordered list of patterns that activate, with arrows showing sequencing. Example:
```
low-confidence-state → confidence-disclosure → clarification-request → [user answers] → retry-recovery
```

### 6. Component Sequence
Which UI components render, in which order, and why each was selected over alternatives.

### 7. User Journey
A numbered step-by-step description of what the user sees and does, from request submission to final state.

### 8. Audit Trail
A table of audit events recorded during this interaction. Columns: event, actor, timestamp-relative, pattern, component, result.

### 9. Recovery Path
Which recovery flow activates (if any), how it is triggered, and what the exit condition is.

### 10. Final Outcome
The state of the system and user at the end of the interaction: completed, redirected, escalated, abandoned.

### 11. Lessons Learned
Two to four design observations from this case study that are not obvious from reading the pattern specs in isolation. Focus on: non-intuitive interactions between primitives, deployment configuration decisions that matter, and patterns that almost applied but didn't.

---

## Case Studies in This Directory

| Case study | Industry | Primary patterns | File |
|---|---|---|---|
| Healthcare AI — Drug interaction check | Healthcare | LC state, constrained-completion, limitation-disclosure, role-escalation | `healthcare-ai.md` |
| Banking — Real-time fraud block | Financial services | Risk=4, policy-refusal, emergency-escalation, redirect-recovery | `banking-fraud.md` |
| Insurance — Claims with missing documentation | Insurance | II state, clarification-request, async-review-escalation, repair-recovery | `insurance-claims.md` |
| Enterprise HR — PIP letter generation | Human resources | SC state, ambient-warning, scoped-permission, delegated-permission | `enterprise-hr.md` |
| Customer Support — Escalating complaint | Customer support | progressive-warning, modal-warning, human-handoff (refusal), retry-recovery | `customer-support.md` |
| Developer Copilot — Conflicting CVE advisory | Developer tools | CE state, source-citation, safe-refusal, alternative-suggestion, redirect-recovery | `developer-copilot.md` |
| Industrial AI — Unresolvable sensor conflict | Manufacturing | CE→UR state, emergency-escalation, abandon-recovery | `industrial-ai.md` |
| Autonomous Procurement — Spend ceiling exceeded | Enterprise procurement | blocking-warning, role-escalation, async-review-escalation, manual-override | `autonomous-procurement.md` |

---

## Cross-Industry Analysis

See `comparison-matrix.md` for a cross-industry view of risk levels, pattern coverage, escalation paths, recovery flows, audit requirements, and accessibility considerations.

---

## Coverage Notes

These eight case studies collectively exercise:
- All ten decision primitives
- All seven pattern categories
- Six of seven uncertainty states (HC state intentionally omitted — it requires no guardrail component)
- All five recovery flows
- All five escalation paths
- Both policy match levels (tenant and deployment)
- System-initiated and user-initiated trigger events
- Emergency interrupt mode and async background mode escalation
- Progressive warning escalation across session interactions
