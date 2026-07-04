# Documentation Hub

Welcome to the AI Guardrails & Explanations Design System documentation.

This is the central navigation index. Use it to find documentation by topic, role, or task.

---

## Documentation Sections

### [Principles](principles/index.md)
The foundational design principles that govern all patterns in this system. Start here before contributing or evaluating patterns.

- Why trust and safety patterns require decision logic, not just UI treatment
- The relationship between explainability, controllability, and user agency
- When to err on the side of disclosure versus friction
- Design principles for high-stakes AI environments

### [Taxonomy](taxonomy/index.md)
The canonical classification system for all guardrail and explanation patterns. Defines terms, categories, severity levels, and the relationships between pattern types.

- Pattern categories and definitions
- Severity classification
- Trigger condition vocabulary
- Canonical terminology reference

### [Patterns](patterns/index.md)
Specifications for every guardrail pattern, explanation pattern, permission gate, uncertainty state, refusal state, escalation path, and recovery flow.

- Warning patterns
- Explanation patterns
- Permission gates
- Uncertainty states
- Refusal states
- Escalation paths
- Recovery flows

### [Decision Flows](decision-flows/index.md)
The guardrail decision engine: structured rules for selecting, ordering, combining, and transitioning between the 36 pattern specifications. The Phase 3 engine is the operative logic layer of the design system.

- Decision primitives — the ten input variables every rule depends on
- Pattern selection engine — how the system maps context to specific patterns
- Pattern precedence engine — conflict resolution and ordering rules
- State transition engine — state machines for uncertainty, refusal, escalation, and recovery
- Pattern composition engine — legal and illegal pattern combinations
- Orchestration engine — complete end-to-end examples (healthcare, finance, enterprise, developer, industrial)

### [Enterprise Playbooks](enterprise-playbooks/index.md)
Deployment guidance for enterprise teams implementing this design system at scale. Covers governance, policy configuration, audit requirements, and organizational rollout.

- Policy configuration for guardrail patterns
- Audit trail requirements
- Multi-tenant pattern management
- Localization and accessibility at scale

### [Regulated Industries](regulated-industries/index.md)
Domain-specific guidance for industries where AI pattern behavior is shaped by compliance requirements.

- Healthcare (clinical AI, patient communication)
- Financial services (advice disclaimers, risk disclosures)
- Legal (document AI, privilege and confidentiality)
- Government and public sector
- Critical infrastructure

### [Case Studies](case-studies/index.md)
Reference implementations across common enterprise AI product types. Annotated walkthroughs of how patterns are applied in real product contexts.

- Chat assistant products
- Autonomous agent systems
- Decision-support tools
- Content generation systems

---

## Quick Navigation by Role

### I am a product designer or PM
→ [Principles](principles/index.md) → [Taxonomy](taxonomy/index.md) → [Patterns](patterns/index.md)

### I am an engineer
→ [Decision Flows](decision-flows/index.md) → [Patterns](patterns/index.md) → [`/components`](../components/README.md) → [`/components/component-matrix.md`](../components/component-matrix.md) → [`/components/implementation-guidelines.md`](../components/implementation-guidelines.md)

### I am a compliance or trust & safety lead
→ [Enterprise Playbooks](enterprise-playbooks/index.md) → [Regulated Industries](regulated-industries/index.md)

### I want to contribute a new pattern
→ [Taxonomy](taxonomy/index.md) → [Patterns](patterns/index.md) → [`CONTRIBUTING.md`](../CONTRIBUTING.md)

---

## Documentation Status

| Section | Phase | Status |
|---|---|---|
| Principles | Phase 1 | Scaffold |
| Taxonomy | Phase 1 | Scaffold |
| Patterns | Phase 1–2 | ✅ Complete — 36 pattern specifications (stable) |
| Decision Flows | Phase 1, 3 | ✅ Complete — decision engine (6 documents, stable) |
| Component Library | Phase 4 | ✅ Complete — 47 documents across 7 categories (stable) |
| Enterprise Playbooks | Phase 1, 5 | Scaffold → Full guidance in Phase 5 |
| Regulated Industries | Phase 1, 6 | Scaffold → Domain specs in Phase 6 |
| Case Studies | Phase 1, 7 | Scaffold → Full studies in Phase 7 |
