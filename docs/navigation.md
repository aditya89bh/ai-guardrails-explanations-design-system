# Repository Navigation Guide

A complete map of every directory and key file in this repository. Use this as your reference when you know what you are looking for but not where it is.

---

## Root Files

| File | Purpose |
|---|---|
| `README.md` | Project overview, Quick Start, role-based navigation |
| `CHANGELOG.md` | Phase-by-phase progress log |
| `CONTRIBUTING.md` | How to contribute |
| `SECURITY.md` | Reporting security vulnerabilities |
| `CODE_OF_CONDUCT.md` | Community standards |
| `SUPPORT.md` | Getting help |
| `ROADMAP.md` | Future direction and planned phases |
| `LICENSE` | MIT license |

---

## docs/ — Primary Documentation

### Entry points

| File | Purpose |
|---|---|
| `docs/getting-started.md` | Role-based quickstart for new readers |
| `docs/architecture.md` | System overview: 6-layer stack, data flow, constraints |
| `docs/glossary.md` | Canonical definitions for all terms |
| `docs/faq.md` | Answers to common questions |
| `docs/troubleshooting.md` | Common issues and fixes |
| `docs/navigation.md` | This file — full repository map |
| `docs/project-structure.md` | Directory and file conventions |
| `docs/index.md` | Documentation hub with navigation links |

### docs/diagrams/ — Visual Documentation

| File | Content |
|---|---|
| `docs/diagrams/architecture.md` | Overall system architecture (Mermaid) |
| `docs/diagrams/decision-engine.md` | Decision engine flow and rule evaluation |
| `docs/diagrams/pattern-lifecycle.md` | Pattern activation → component → audit lifecycle |
| `docs/diagrams/state-transitions.md` | P2 confidence state machine |
| `docs/diagrams/component-relationships.md` | Component hierarchy and pattern mappings |

### docs/principles/ — Design Philosophy

| File | Content |
|---|---|
| `docs/principles/index.md` | Core design principles overview |
| `docs/principles/trust-by-default.md` | The trust-by-default principle |
| `docs/principles/progressive-disclosure.md` | Layered information disclosure |
| `docs/principles/auditability.md` | Immutable audit trail requirements |

### docs/taxonomy/ — Canonical Vocabulary

| File | Content |
|---|---|
| `docs/taxonomy/index.md` | Master taxonomy with all categories, patterns, severity levels |

### docs/decision-flows/ — Decision Engine Specification

| File | Content |
|---|---|
| `docs/decision-flows/decision-primitives.md` | All 10 primitives (P1–P10): definitions, types, values |
| `docs/decision-flows/pattern-selection-engine.md` | 14 selection rules; priority order; trigger conditions |
| `docs/decision-flows/pattern-precedence-engine.md` | Conflict resolution when multiple patterns activate |
| `docs/decision-flows/pattern-composition-engine.md` | Mutual exclusion rules; legal and illegal combinations |
| `docs/decision-flows/state-transition-engine.md` | P2 state machine; valid transitions; prohibitions |
| `docs/decision-flows/orchestration-engine.md` | End-to-end orchestration across all layers |

### docs/enterprise-playbooks/ — Deployment Guidance

| File | Content |
|---|---|
| `docs/enterprise-playbooks/` | Policy configuration, audit requirements, multi-tenant guidance |

### docs/regulated-industries/ — Domain-Specific Guidance

| File | Content |
|---|---|
| `docs/regulated-industries/` | Healthcare, finance, legal, government, critical infrastructure |

### docs/case-studies/ — Reference Implementations

| File | Content |
|---|---|
| `docs/case-studies/` | 8 end-to-end case studies with full pattern sequences and audit trails |

---

## patterns/ — Pattern Specifications (36 patterns)

### patterns/warning/

| File | Pattern | Severity |
|---|---|---|
| `inline-warning.md` | Inline Warning | Advisory |
| `ambient-warning.md` | Ambient Warning | Informational |
| `modal-warning.md` | Modal Warning | Caution |
| `blocking-warning.md` | Blocking Warning | Blocking |
| `progressive-warning.md` | Progressive Warning | Advisory → escalating |
| `policy-warning.md` | Policy Warning | Blocking |

### patterns/explanation/

| File | Pattern | Severity |
|---|---|---|
| `confidence-disclosure.md` | Confidence Disclosure | Advisory |
| `source-citation.md` | Source Citation | Informational |
| `reasoning-trace.md` | Reasoning Trace | Informational |
| `decision-summary.md` | Decision Summary | Informational |
| `limitation-disclosure.md` | Limitation Disclosure | Advisory |
| `structured-uncertainty-disclosure.md` | Structured Uncertainty Disclosure | Advisory |

### patterns/permission/

| File | Pattern | Severity |
|---|---|---|
| `one-time-permission.md` | One-Time Permission | Blocking |
| `session-permission.md` | Session Permission | Blocking |
| `persistent-permission.md` | Persistent Permission | Blocking |
| `scoped-permission.md` | Scoped Permission | Blocking |
| `delegated-permission.md` | Delegated Permission | Blocking |
| `revocation.md` | Revocation | Advisory |

### patterns/uncertainty/

| File | Pattern | Severity |
|---|---|---|
| `high-confidence-state.md` | High Confidence State | Informational |
| `moderate-confidence-state.md` | Moderate Confidence State | Informational |
| `low-confidence-state.md` | Low Confidence State | Advisory |
| `conflicting-evidence-state.md` | Conflicting Evidence State | Caution |
| `insufficient-information-state.md` | Insufficient Information State | Caution |
| `stale-context-state.md` | Stale Context State | Advisory |
| `unresolvable-state.md` | Unresolvable State | Critical |

### patterns/refusal/

| File | Pattern | Severity |
|---|---|---|
| `safe-refusal.md` | Safe Refusal | Caution |
| `partial-completion.md` | Partial Completion | Advisory |
| `constrained-completion.md` | Constrained Completion | Advisory |
| `alternative-suggestion.md` | Alternative Suggestion | Advisory |
| `clarification-request.md` | Clarification Request | Advisory |
| `human-handoff.md` | Human Handoff | Caution |
| `policy-refusal.md` | Policy Refusal | Blocking |

### patterns/escalation/

| File | Pattern | Severity |
|---|---|---|
| `human-handoff.md` | Human Handoff (Escalation) | Caution |
| `role-escalation.md` | Role Escalation | Caution |
| `system-escalation.md` | System Escalation | Caution |
| `emergency-escalation.md` | Emergency Escalation | Critical |
| `async-review-escalation.md` | Async Review Escalation | Advisory |

### patterns/recovery/

| File | Pattern | Severity |
|---|---|---|
| `retry-recovery.md` | Retry Recovery | Advisory |
| `redirect-recovery.md` | Redirect Recovery | Advisory |
| `repair-recovery.md` | Repair Recovery | Advisory |
| `manual-override-recovery.md` | Manual Override Recovery | Blocking |
| `abandon-recovery.md` | Abandon Recovery | Advisory |

---

## components/ — UI Component Specifications

| Directory | Contents |
|---|---|
| `components/warning/` | Warning component specs (anatomy, props, ARIA, motion) |
| `components/explanation/` | Explanation component specs |
| `components/permission/` | Permission gate component specs |
| `components/uncertainty/` | Uncertainty state component specs |
| `components/refusal/` | Refusal component specs |
| `components/escalation/` | Escalation component specs |
| `components/recovery/` | Recovery component specs |
| `components/design-tokens.md` | All CSS custom property definitions |
| `components/implementation-guidelines.md` | Framework guidance (React, Vue, native) |
| `components/accessibility-checklist.md` | WCAG 2.1 AA compliance checklist |
| `components/component-matrix.md` | Pattern → component mapping table |

---

## reference/ — Machine-Readable Artifacts

### reference/json/ — JSON Schemas

| File | Validates |
|---|---|
| `patterns.schema.json` | Pattern configuration objects |
| `decision-engine.schema.json` | Engine configuration and audit records |
| `component.schema.json` | Component configuration objects |
| `guardrail-policy.schema.json` | Deployment policy documents |

### reference/yaml/ — Industry Configurations

| File | Industry |
|---|---|
| `healthcare-config.yaml` | Clinical AI (HIPAA, FDA 21 CFR Part 11) |
| `finance-config.yaml` | Financial services (SOX, PCI-DSS, BSA/AML) |
| `developer-copilot-config.yaml` | Developer tooling (security-aware) |
| `industrial-ai-config.yaml` | Industrial AI (IEC 61511, ISO 13849) |

### reference/config/ — Configuration Reference

| File | Content |
|---|---|
| `default-policy.md` | Default values for all configurable settings |
| `severity-mapping.md` | Severity levels → design tokens + ARIA |
| `risk-thresholds.md` | Risk level definitions + industry calibration |
| `confidence-mapping.md` | All 7 P2 states: thresholds, components, transitions |
| `permission-mapping.md` | P4 states, P8 authority tiers, permission lifecycle |

### reference/react/ — React Implementations

| File | Component |
|---|---|
| `WarningBanner.jsx` | Warning patterns (inline, ambient, blocking, policy) |
| `PermissionGate.jsx` | Permission gate (all 6 pattern types) |
| `ConfidenceBadge.jsx` | Confidence disclosure + explanation patterns |
| `RefusalCard.jsx` | Refusal patterns (all 7 types) |
| `RecoveryPrompt.jsx` | Recovery flows (all 5 types) |
| `EmergencyEscalationOverlay.jsx` | Emergency escalation (full-screen, focus trap) |

### reference/nextjs/

| File | Content |
|---|---|
| `GuardrailDemo.jsx` | Full-pipeline Next.js demo page |

### reference/examples/

| File | Content |
|---|---|
| `healthcare-payload.json` | Complete healthcare scenario audit record |
| `finance-payload.json` | Complete finance scenario audit record |
| `developer-copilot-payload.json` | Complete developer copilot audit record |
| `industrial-ai-payload.json` | Complete industrial AI audit record |

---

## playground/ — Interactive Playground

| Path | Content |
|---|---|
| `playground/app/layout.jsx` | Root layout with skip-link |
| `playground/app/page.jsx` | Main page — state management, 4-panel layout |
| `playground/app/globals.css` | Design tokens + layout CSS |
| `playground/engine/primitives.js` | P1–P10 definitions |
| `playground/engine/rules.js` | 14 selection rules |
| `playground/engine/evaluator.js` | Main evaluate() function |
| `playground/engine/schema-bridge.js` | Maps JSON schema contracts to runtime types |
| `playground/engine/config-bridge.js` | Maps YAML configs to runtime objects |
| `playground/data/patterns.js` | 36-pattern registry |
| `playground/data/scenarios.js` | 5 example scenarios |
| `playground/components/PrimitiveControls.jsx` | P1–P10 control panel |
| `playground/components/EnginePanel.jsx` | 5-tab engine visualization |
| `playground/components/ResultPanel.jsx` | Component rendering panel |
| `playground/components/AuditPanel.jsx` | Audit event list |
| `playground/components/PipelineFlow.jsx` | 5-step pipeline visualization |
| `playground/components/StateTransitionViz.jsx` | P2 state machine diagram |
| `playground/components/CompositionViz.jsx` | Composition layer visualization |
| `playground/components/guardrail/` | 6 playground-adapted guardrail components |
| `playground/README.md` | Playground documentation |

---

## .github/ — GitHub-Specific Files

| Path | Content |
|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.md` | Bug report template |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Feature request template |
| `.github/PULL_REQUEST_TEMPLATE.md` | Pull request checklist |
| `.github/workflows/markdown-lint.yml` | CI: markdown linting |
| `.github/workflows/link-check.yml` | CI: broken link detection |
| `.github/workflows/playground-build.yml` | CI: playground build verification |
| `.github/workflows/schema-validation.yml` | CI: JSON schema validation |

---

## Quick Lookup

**I want to know what a term means** → [docs/glossary.md](glossary.md)

**I want to understand a specific pattern** → `patterns/<category>/<pattern-name>.md`

**I want the component spec for a pattern** → `components/<category>/component-spec.md`

**I want to implement a component** → `reference/react/<ComponentName>.jsx`

**I want a deployment config for my industry** → `reference/yaml/<industry>-config.yaml`

**I want to validate my payload** → `reference/json/<schema>.schema.json`

**I want to see a complete example** → `reference/examples/<industry>-payload.json`

**I want to understand a rule** → `docs/decision-flows/pattern-selection-engine.md`

**I want to interact with the engine** → [playground/README.md](../playground/README.md)

**I want to contribute** → [CONTRIBUTING.md](../CONTRIBUTING.md)
