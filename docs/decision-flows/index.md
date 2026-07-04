# Decision Flows Index

Decision flows define the structured logic that determines when a guardrail pattern activates, which variant applies, and how patterns chain together. They are the operative logic layer of the design system — the rules that pattern implementations must follow.

---

## Purpose

Pattern specifications describe *what* each pattern is and *how* it communicates. Decision flows answer *when* and *which*:

- **When** does this pattern fire?
- **Which variant** of the pattern is appropriate?
- **How** does severity get determined?
- **What happens next** after the pattern completes?
- **How** do patterns combine when multiple conditions are true simultaneously?

---

## Phase 3 — Decision Engine Documents

The following six documents constitute the complete guardrail decision engine. They are intended to be read in the order listed — each document builds on the layer beneath it.

| Document | Status | Description |
|---|---|---|
| [`decision-primitives.md`](decision-primitives.md) | ✅ Stable | Ten foundational input variables: Risk, Confidence, Capability, Permission, Policy, User Intent, Business Impact, User Authority, Context Freshness, Source Reliability |
| [`pattern-selection-engine.md`](pattern-selection-engine.md) | ✅ Stable | Three-step selection process: category gating, within-category pattern selection, depth and severity calibration |
| [`pattern-precedence-engine.md`](pattern-precedence-engine.md) | ✅ Stable | Inter-category and intra-category precedence order; conflict resolution rules; suppression rules |
| [`state-transition-engine.md`](state-transition-engine.md) | ✅ Stable | State machines for Uncertainty States, Refusal States, Escalation Paths, and Recovery Flows; cross-machine transition matrix |
| [`pattern-composition-engine.md`](pattern-composition-engine.md) | ✅ Stable | Legal and illegal pattern combinations; composition sequence rules; standard composition templates |
| [`orchestration-engine.md`](orchestration-engine.md) | ✅ Stable | Complete end-to-end orchestration examples: Healthcare, Finance, Enterprise Assistant, Developer Copilot, Industrial AI |

---

## Decision Engine Architecture

```
Interaction input
       ↓
Decision Primitives (P1–P10)
  [Risk, Confidence, Capability, Permission, Policy,
   User Intent, Business Impact, User Authority,
   Context Freshness, Source Reliability]
       ↓
Pattern Selection Engine
  [Category gating → pattern selection → depth calibration]
       ↓
Pattern Precedence Engine
  [Inter-category order → conflict resolution → suppression]
       ↓
Pattern Composition Engine
  [Legal sequences → illegal combinations → cardinality limits]
       ↓
State Transition Engine
  [Uncertainty / Refusal / Escalation / Recovery state machines]
       ↓
Final interaction delivered to user
```

---

## Planned Decision Flow Documents (Phase 4+)

The following granular per-category flow documents remain planned for future phases. Phase 3 addresses the full decision engine at the system level; Phase 4 will produce per-category implementation flows that map directly to each of the 36 pattern specifications.

### Warning Pattern Flows

| Flow | Status | File |
|---|---|---|
| Warning trigger logic — severity determination | 🔲 Planned | `docs/decision-flows/warning/severity-determination.md` |
| Warning variant selection | 🔲 Planned | `docs/decision-flows/warning/variant-selection.md` |
| Warning escalation threshold | 🔲 Planned | `docs/decision-flows/warning/escalation-threshold.md` |

### Explanation Pattern Flows

| Flow | Status | File |
|---|---|---|
| Explanation depth selection | 🔲 Planned | `docs/decision-flows/explanation/depth-selection.md` |
| Confidence disclosure threshold | 🔲 Planned | `docs/decision-flows/explanation/confidence-threshold.md` |
| Source citation trigger logic | 🔲 Planned | `docs/decision-flows/explanation/source-citation-trigger.md` |

### Permission Gate Flows

| Flow | Status | File |
|---|---|---|
| Gate type selection | 🔲 Planned | `docs/decision-flows/permission/gate-type-selection.md` |
| Audit logging determination | 🔲 Planned | `docs/decision-flows/permission/audit-logging.md` |
| Delegation routing | 🔲 Planned | `docs/decision-flows/permission/delegation-routing.md` |

### Uncertainty State Flows

| Flow | Status | File |
|---|---|---|
| Confidence level classification | 🔲 Planned | `docs/decision-flows/uncertainty/confidence-classification.md` |
| Uncertainty-to-refusal escalation | 🔲 Planned | `docs/decision-flows/uncertainty/uncertainty-to-refusal.md` |

### Refusal State Flows

| Flow | Status | File |
|---|---|---|
| Refusal type selection | 🔲 Planned | `docs/decision-flows/refusal/refusal-type-selection.md` |
| Disclosure level determination | 🔲 Planned | `docs/decision-flows/refusal/disclosure-level.md` |
| Refusal-to-escalation routing | 🔲 Planned | `docs/decision-flows/refusal/refusal-to-escalation.md` |

### Escalation Path Flows

| Flow | Status | File |
|---|---|---|
| Escalation target selection | 🔲 Planned | `docs/decision-flows/escalation/target-selection.md` |
| Urgency classification | 🔲 Planned | `docs/decision-flows/escalation/urgency-classification.md` |
| Escalation communication requirements | 🔲 Planned | `docs/decision-flows/escalation/communication-requirements.md` |

### Recovery Flow Flows

| Flow | Status | File |
|---|---|---|
| Recovery type selection | 🔲 Planned | `docs/decision-flows/recovery/recovery-type-selection.md` |
| State preservation logic | 🔲 Planned | `docs/decision-flows/recovery/state-preservation.md` |

---

## Phase Status

- **Phase 1:** Index scaffold (this file)
- **Phase 3 (complete):** Full decision engine — six documents covering primitives, selection, precedence, state machines, composition, and orchestration
- **Phase 4 (planned):** Granular per-category decision flow documents for each of the 36 pattern specifications

_Total Phase 3 decision engine documents: 6 (stable)_
_Total planned granular flow documents: ~20 (Phase 4)_

---

## Relationship to Pattern Specifications

Every pattern specification in [`docs/patterns/`](../patterns/index.md) references the decision flows that govern it. Decision flows are the authoritative source for trigger logic. Pattern specifications describe what the pattern does; decision flows specify when it fires.

The Phase 3 decision engine is the operative specification for how the 36 pattern specifications interact as a system. Implementations of this design system should treat the decision engine documents as integration test specifications: if a system produces a different output for the same inputs, the implementation diverges from the specification.
