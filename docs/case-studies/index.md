# Case Studies Index

Case studies are end-to-end reference implementations showing how the Guardrail Decision Engine, Pattern Library, and Component Library operate together in realistic enterprise AI product scenarios. Each case study traces a complete interaction from user request (or system-initiated trigger) through primitive evaluation, engine execution, pattern activation, component rendering, user journey, audit trail, and final state.

Case studies are implementation-agnostic: they describe the pattern logic and UX decisions, not a specific stack or vendor.

---

## Purpose

Pattern specifications define what each guardrail pattern does. Decision flow documents define when patterns activate. Case studies validate the architecture by showing what happens when the entire system operates together in a realistic scenario:

- Which primitives are determinative for each industry context
- Which patterns activate together and in what sequence
- How pattern composition works in practice
- What the user experience looks like end-to-end
- What audit records are produced
- Where recovery flows and escalation paths connect

---

## Phase 5 Case Studies — Stable

| Case study | Industry | Risk | Primary patterns | File |
|---|---|---|---|---|
| Healthcare AI — Drug interaction check | Healthcare | 3 (High) | LC state, constrained-completion, limitation-disclosure, source-citation (claim-level), role-escalation | `healthcare-ai.md` |
| Banking — Real-time fraud block | Financial services | 4 (Critical) | policy-refusal, blocking-warning, emergency-escalation, redirect-recovery | `banking-fraud.md` |
| Insurance — Claims with missing documentation | Insurance | 2 (Moderate) | II state, partial-completion, clarification-request, async-review-escalation, repair-recovery | `insurance-claims.md` |
| Enterprise HR — PIP letter generation | Human resources | 3 (High) | SC state, ambient-warning, scoped-permission, delegated-permission, constrained-completion | `enterprise-hr.md` |
| Customer Support — Escalating complaint | Customer support | 1→2 (escalating) | progressive-warning, modal-warning, human-handoff (refusal), retry-recovery | `customer-support.md` |
| Developer Copilot — Conflicting CVE advisory | Developer tools | 3 (High) | CE state, source-citation, reasoning-trace, safe-refusal, alternative-suggestion, redirect-recovery | `developer-copilot.md` |
| Industrial AI — Unresolvable sensor conflict | Manufacturing | 4 (Critical) | CE→UR state, emergency-escalation, abandon-recovery | `industrial-ai.md` |
| Autonomous Procurement — Spend ceiling exceeded | Enterprise procurement | 3 (High) | blocking-warning, role-escalation, async-review-escalation, manual-override-recovery | `autonomous-procurement.md` |

---

## Cross-Industry Analysis

See `comparison-matrix.md` for a cross-industry view of risk, pattern coverage, escalation paths, recovery flows, audit requirements, and accessibility considerations.

---

## Case Study Structure

Every case study follows the canonical structure defined in `README.md`:

1. Problem
2. User request (or system-initiated event)
3. Decision primitive evaluation (all 10 primitives, P1–P10)
4. Decision engine execution (rules activated and skipped, with reasoning)
5. Pattern sequence
6. Component sequence
7. User journey (step-by-step)
8. Audit trail (tabular)
9. Recovery path
10. Final outcome
11. Lessons learned

---

## Phase Status

| Phase | Status | Files |
|---|---|---|
| Phase 1 | Scaffold complete | `index.md` (this file) |
| Phase 5 | Case studies complete | `README.md`, 8 case study files, `comparison-matrix.md` |
| Phase 7 (planned) | Extended case studies | Cross-session, multi-system, consumer product contexts |

_Total stable case studies: 8_
_Pattern specifications exercised: 33 of 36_
