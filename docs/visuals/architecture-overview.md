# Repository Architecture — Visual Overview

Text-art architecture diagrams for the AI Guardrails & Explanations Design System.

For Mermaid diagrams, see [docs/diagrams/architecture.md](../diagrams/architecture.md).

---

## System Layer Stack

```
╔══════════════════════════════════════════════════════════════════════╗
║  LAYER 6 — AUDIT & COMPLIANCE                                        ║
║  Immutable event log  ·  Policy attribution  ·  auditId propagation  ║
╠══════════════════════════════════════════════════════════════════════╣
║  LAYER 5 — COMPONENT LIBRARY                                         ║
║  WarningBanner  PermissionGate  ConfidenceBadge                      ║
║  RefusalCard  EscalationCard  RecoveryPrompt  EmergencyEscalation    ║
╠══════════════════════════════════════════════════════════════════════╣
║  LAYER 4 — PATTERN LIBRARY  (36 patterns, 7 categories)              ║
║  Warning×6  Explanation×6  Permission×6  Uncertainty×7               ║
║  Refusal×7  Escalation×5  Recovery×5                                 ║
╠══════════════════════════════════════════════════════════════════════╣
║  LAYER 3 — DECISION ENGINE                                           ║
║  ┌────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ ║
║  │ 3a Selection   │ │ 3b Precedence│ │ 3c Composition│ │ 3d State │ ║
║  │ 14+ rules      │ │ conflict res │ │ mutual excl   │ │ machine  │ ║
║  └────────────────┘ └──────────────┘ └──────────────┘ └──────────┘ ║
╠══════════════════════════════════════════════════════════════════════╣
║  LAYER 2 — TAXONOMY                                                  ║
║  7 categories  ·  36 pattern names  ·  5 severity levels             ║
╠══════════════════════════════════════════════════════════════════════╣
║  LAYER 1 — DECISION PRIMITIVES (P1–P10)                              ║
║  Risk  Confidence  Capability  Permission  Policy                    ║
║  Intent  BusinessImpact  Authority  Freshness  SourceReliability     ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Decision Engine Pipeline

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────┐
│          │    │  SELECTION   │    │  PRECEDENCE  │    │ COMPOSITION  │    │  AUDIT  │
│ P1–P10   │───▶│  14+ rules   │───▶│  conflict    │───▶│  mutual      │───▶│  record │
│ primitives│    │  priority    │    │  resolution  │    │  exclusion   │    │  +      │
│          │    │  ordered     │    │              │    │  constraints │    │ auditId │
└──────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └─────────┘
                      │                                        │
                      ▼                                        ▼
              ┌──────────────┐                     ┌──────────────────┐
              │ Early term.  │                     │ Resolved pattern │
              │ R01: policy  │                     │ list → component │
              │ R02: UR+crit │                     │ sequence         │
              └──────────────┘                     └──────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│  YOUR AI PRODUCT                                         │
│                                                          │
│  ┌─────────────┐     ┌──────────────────────────────┐   │
│  │  AI Model / │     │  GUARDRAIL LAYER             │   │
│  │  Agent      │────▶│                              │   │
│  └─────────────┘     │  Policy config (YAML)        │   │
│                       │      ↓                       │   │
│                       │  Decision engine             │   │
│                       │      ↓                       │   │
│                       │  Component rendering (React) │   │
│                       │      ↓                       │   │
│  ┌─────────────┐     │  Audit log                   │   │
│  │  User       │◀────│                              │   │
│  └─────────────┘     └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Repository Map (Top Level)

```
ai-guardrails-explanations-design-system/
│
├── README.md  CHANGELOG.md  CONTRIBUTING.md  LICENSE
├── SECURITY.md  SUPPORT.md  CODE_OF_CONDUCT.md  ROADMAP.md
├── RELEASE.md  VERSIONING.md  RELEASE_CHECKLIST.md
│
├── docs/           ← Primary documentation (151+ files)
│   ├── getting-started.md  architecture.md  glossary.md
│   ├── faq.md  troubleshooting.md  navigation.md
│   ├── diagrams/          ← 4 files, 16 Mermaid diagrams
│   ├── decision-flows/    ← 6-document engine spec
│   ├── patterns/          ← Pattern decision logic
│   ├── case-studies/      ← 8 end-to-end case studies
│   └── visuals/           ← Architecture diagrams + screenshot placeholders
│
├── patterns/       ← 36 pattern specifications
├── components/     ← 47 component specifications
├── examples/       ← Annotated implementation examples
├── templates/      ← Reusable starting-point templates
│
├── reference/      ← Machine-readable artifacts
│   ├── json/       ← 4 JSON schemas
│   ├── yaml/       ← 4 industry YAML configs
│   ├── react/      ← 6 React implementations
│   └── examples/   ← 4 JSON example payloads
│
├── playground/     ← Interactive Decision Engine Playground
│   ├── engine/     ← 5 engine modules (16+ rules)
│   ├── components/ ← 14 UI components + guardrail renderers
│   └── data/       ← Pattern registry + 5 scenarios
│
├── tests/          ← Automated test suite (165 tests)
│   ├── engine/     ← Decision engine validation (34 tests)
│   ├── schemas/    ← JSON schema validation (21 tests)
│   ├── payloads/   ← Payload validation (16 tests)
│   ├── yaml/       ← YAML config validation (20 tests)
│   └── smoke/      ← Repository structure + a11y (74 tests)
│
└── .github/        ← GitHub configuration
    ├── ISSUE_TEMPLATE/    ← Bug report + feature request
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/         ← 5 CI workflows
```
