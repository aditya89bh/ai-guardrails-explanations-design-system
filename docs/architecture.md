# System Architecture

This document describes the architecture of the AI Guardrails & Explanations Design System — how its layers relate, how data flows through the decision engine, and how the system is structured for production deployment.

See [docs/diagrams/](diagrams/) for Mermaid diagrams of each layer.

---

## Overview

The system has six layers. Each layer builds on the one below it.

```
┌─────────────────────────────────────────────────────────────┐
│  6. Audit & Compliance                                       │
│     Immutable event log · Policy attribution · Retention    │
├─────────────────────────────────────────────────────────────┤
│  5. Component Library                                        │
│     UI components · ARIA · Motion · Design tokens           │
├─────────────────────────────────────────────────────────────┤
│  4. Pattern Library                                          │
│     36 named patterns across 7 categories                   │
├─────────────────────────────────────────────────────────────┤
│  3. Decision Engine                                          │
│     Selection · Precedence · Composition · State Transitions │
├─────────────────────────────────────────────────────────────┤
│  2. Taxonomy                                                 │
│     Canonical names · Categories · Severity levels          │
├─────────────────────────────────────────────────────────────┤
│  1. Decision Primitives (P1–P10)                             │
│     Risk · Confidence · Capability · Permission · …         │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1 — Decision Primitives

**Source:** `docs/decision-flows/decision-primitives.md`

Ten inputs that describe the current interaction context:

| ID | Primitive | Type | Range |
|---|---|---|---|
| P1 | Risk | Integer | 0–4 (None → Critical) |
| P2 | Confidence | Enum | 7 states (High → Unresolvable) |
| P3 | Capability | Enum | capable / partial / incapable |
| P4 | Permission | Enum | authorized / partial / unauthorized |
| P5 | Policy | Enum | none / deployment / tenant |
| P6 | Intent | Enum | decision-support / action-execution / content-generation / workflow-automation |
| P7 | Business Impact | Enum | low / medium / high |
| P8 | Authority | Integer | 1–3 (Standard → Admin) |
| P9 | Context Freshness | Enum | fresh / stale |
| P10 | Source Reliability | Integer | 0–3 (None → High) |

These primitives are evaluated by the AI system at request time and passed to the decision engine.

---

## Layer 2 — Taxonomy

**Source:** `docs/taxonomy/`

The canonical vocabulary for all patterns, categories, and severity levels. No term outside the taxonomy should appear in pattern specifications, component names, configuration files, or audit records.

**7 pattern categories:** warning · explanation · permission · uncertainty · refusal · escalation · recovery

**5 severity levels:** informational · advisory · caution · blocking · critical

The taxonomy is immutable within a release. Changes require a taxonomy amendment with cross-reference impact assessment.

---

## Layer 3 — Decision Engine

**Source:** `docs/decision-flows/`

The engine has four sublayers evaluated in order:

### 3a — Pattern Selection

14 selection rules evaluate the primitive values and activate patterns. Rules are tested in priority order. Some rules terminate evaluation early (R01 Policy Block, R02 Unresolvable + Critical).

```
Primitives → Rule R01 (terminates?) → R02 → R03 → … → R14 → Raw pattern set
```

**Source:** `docs/decision-flows/pattern-selection-engine.md`

### 3b — Precedence Engine

When multiple patterns of the same type activate, the precedence engine resolves conflicts:

```
blocking-warning supersedes inline-warning and ambient-warning
policy-refusal supersedes safe-refusal
emergency-escalation supersedes all other escalation patterns
```

**Source:** `docs/decision-flows/pattern-precedence-engine.md`

### 3c — Composition Engine

Enforces mutual exclusion rules and combination constraints:

```
Only one warning pattern may render simultaneously
Only one refusal pattern may render simultaneously
Only one recovery pattern may render simultaneously
```

**Source:** `docs/decision-flows/pattern-composition-engine.md`

### 3d — State Transition Engine

Tracks P2 Confidence state across turns and enforces valid transitions:

```
High → Moderate → Low → (Conflicting | Insufficient) → Unresolvable
              ↑                    ↑
           (stale)            (stale)
```

**Source:** `docs/decision-flows/state-transition-engine.md`

---

## Layer 4 — Pattern Library

**Source:** `patterns/`

36 pattern specifications across 7 categories. Each specification defines:

- **Definition** — what the pattern is and when it applies
- **Trigger conditions** — primitive values that activate the pattern
- **Selection logic** — which primitives at which values cause selection
- **User communication guidelines** — what the AI must say, may say, must not say
- **Antipatterns** — common misapplications to avoid
- **Composition rules** — what it combines with and what it conflicts with

---

## Layer 5 — Component Library

**Source:** `components/`

UI component specifications for every pattern. Each component specification covers:

- **Anatomy** — visual structure and sub-elements
- **Props and variants** — configurable properties
- **States** — idle, active, loading, error, disabled, and more
- **Interaction model** — pointer, keyboard, touch behavior
- **Accessibility specification** — ARIA roles, aria-live, focus management
- **Motion specification** — entrance, exit, reduced-motion fallbacks
- **Responsive specification** — breakpoints and mobile behavior
- **Design tokens** — CSS custom property references

---

## Layer 6 — Audit & Compliance

Every guardrail interaction generates a structured audit record containing:

- `auditId` — unique identifier propagated across layers
- `timestamp` — ISO 8601 with timezone
- `eventType` — canonical event type from the taxonomy
- `primitiveSnapshot` — P1–P10 values at evaluation time
- `activatedPatterns` — patterns selected by the engine
- `componentRendered` — component that was displayed
- `userAction` — what the user did (granted, denied, dismissed, escalated)
- `policyRef` — policy rule that applied (if any)
- `severity` — severity level of the event

**Schema:** `reference/json/decision-engine.schema.json § auditRecord`

---

## Data Flow

A complete request through the system:

```
1. User makes a request
2. AI system evaluates P1–P10 primitive values
3. Decision engine runs: selection → precedence → composition
4. Engine returns: pattern list · component sequence · audit seed
5. Application renders components in activation order
6. User interacts with components (grant, deny, acknowledge, escalate)
7. Audit record is written to immutable log
8. Recovery flow activates (if applicable)
```

---

## Deployment Architecture

The system is designed to be deployed as a policy-configured layer on top of any AI product:

```
┌──────────────────────────────────────────────────────────────┐
│  AI Product (any framework)                                   │
│  ┌─────────────────┐    ┌──────────────────────────────────┐ │
│  │  AI Model /     │    │  Guardrail Layer                  │ │
│  │  Agent System   │───→│  Decision engine + policy config  │ │
│  └─────────────────┘    │  ↓                               │ │
│                          │  Component rendering              │ │
│                          │  ↓                               │ │
│                          │  Audit log                        │ │
│                          └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

The policy layer is configured via `guardrail-policy.schema.json` — see `reference/json/guardrail-policy.schema.json`.

Industry-specific configurations: `reference/yaml/`

---

## Machine-Readable Artifacts

| Artifact | Location | Purpose |
|---|---|---|
| Pattern schema | `reference/json/patterns.schema.json` | Validates pattern configuration objects |
| Engine schema | `reference/json/decision-engine.schema.json` | Validates engine configuration and audit records |
| Component schema | `reference/json/component.schema.json` | Validates component configuration objects |
| Policy schema | `reference/json/guardrail-policy.schema.json` | Validates deployment policy documents |
| Healthcare config | `reference/yaml/healthcare-config.yaml` | Clinical AI deployment policy |
| Finance config | `reference/yaml/finance-config.yaml` | Financial services AML policy |
| Developer config | `reference/yaml/developer-copilot-config.yaml` | Security-aware developer tooling policy |
| Industrial config | `reference/yaml/industrial-ai-config.yaml` | Safety-critical process control policy |

---

## Reference Implementation

The `reference/` directory contains a working implementation of every layer:

- **React components** — `reference/react/` — 6 production-ready components
- **Next.js demo** — `reference/nextjs/GuardrailDemo.jsx` — full pipeline demo
- **Example payloads** — `reference/examples/` — 4 complete JSON audit records
- **Interactive playground** — `playground/` — live engine with 5 scenarios

---

## Design Constraints

These constraints are non-negotiable in any deployment:

1. **Passive dismissal = denial.** Closing a permission gate without granting is always a denial.
2. **Deny-first tab order.** The Deny button is always first in keyboard tab order on permission gates.
3. **Auto-grant is never permitted.** All grants require explicit, intentional user action.
4. **CE ≠ LC.** Conflicting Evidence is a structural conflict, not a score degradation. These states require different patterns.
5. **Composition exclusivity.** Only one pattern per category may render simultaneously (warning, refusal, recovery).
6. **Audit is mandatory.** All blocking and critical events must generate an immutable audit record.
7. **Policy authority is absolute.** Tenant-level policy rules terminate all other rule evaluation.

---

## Further Reading

- [docs/decision-flows/](decision-flows/) — complete 6-document engine specification
- [docs/diagrams/](diagrams/) — Mermaid architecture and flow diagrams
- [docs/faq.md](faq.md) — common questions
- [playground/README.md](../playground/README.md) — interactive engine documentation
