# Roadmap

This document describes the planned direction for the AI Guardrails & Explanations Design System beyond the current release.

---

## Current State (Phase 8 Complete)

The system is feature-complete for its core specification:

- **36 pattern specifications** across 7 categories
- **6-document decision engine** with 14 selection rules
- **47 component specifications** across 7 categories
- **8 end-to-end case studies** across 8 industries
- **4 JSON schemas** + 4 YAML deployment configurations
- **6 React component implementations** + Next.js full-pipeline demo
- **Interactive playground** with 5 scenarios and real-time engine visualization
- **Complete documentation** with getting-started guide, architecture, glossary, FAQ, troubleshooting, and visual diagrams
- **CI/CD** with markdown lint, link checking, playground build, and schema validation

---

## Planned Phases

### Phase 9 — Enterprise Playbooks (~40 commits)

Deployment guidance for enterprise AI teams operating at scale.

Planned content:
- Multi-tenant policy configuration guide
- Audit trail architecture and retention patterns
- Organizational rollout playbook (pilot → production)
- Localization and internationalization guidance for guardrail copy
- High-availability considerations for the decision engine
- Monitoring and observability patterns for guardrail events

---

### Phase 10 — Regulated Industries (~40 commits)

Domain-specific pattern variants and compliance guidance.

Planned industries:
- Healthcare (HIPAA, FDA 21 CFR Part 11, clinical decision support)
- Financial services (SOX, PCI-DSS, MiFID II, BSA/AML)
- Legal and professional services
- Government and public sector (FedRAMP, CJIS)
- Critical infrastructure (IEC 61511, NERC CIP)

For each industry: compliance mapping (which patterns satisfy which regulatory requirements), risk threshold calibration, escalation SLA standards, and audit record format guidance.

---

### Phase 11 — Extended Case Studies & Templates (~30 commits)

Reusable templates and additional case studies.

Planned content:
- Pattern selection templates for common AI product types
- Decision flow templates for teams customizing the engine
- Additional case studies covering emerging AI use cases
- Cross-industry comparison updates

---

### Phase 12 — Review, Polish, and Release (~20 commits)

Final quality pass before a tagged stable release.

Planned activities:
- Full cross-reference audit
- Broken link final scan
- Terminology consistency final review
- Version tag (v1.0.0)
- Release notes
- Migration guide (for teams who implemented against earlier specifications)

---

## Not Planned

The following are explicitly out of scope for future phases:

- **New guardrail concepts** — the 7 categories and 36 patterns are complete. New patterns require a taxonomy amendment with cross-reference impact assessment.
- **Framework-specific implementations** beyond React/Next.js — contributions welcome but not planned.
- **Hosted deployment** of the playground — the playground is a local development tool.
- **AI model integrations** — the system is model-agnostic by design.
- **Visual design language** — the system intentionally defers to each team's existing design system.

---

## Contributing to the Roadmap

If you have a use case not addressed by the current specification, open a [GitHub Discussion](https://github.com/your-org/ai-guardrails-explanations-design-system/discussions) to propose it. Roadmap items are added based on evidence from real deployment needs.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to any planned phase.
