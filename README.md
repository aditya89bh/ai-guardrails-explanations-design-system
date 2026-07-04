# AI Guardrails & Explanations Design System

> A documentation-first design system for enterprise AI teams building trust and safety into AI products.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v1.0.0-brightgreen)](RELEASE_NOTES.md)
[![Tests](https://img.shields.io/badge/tests-165%20passing-brightgreen)](tests/)
[![Patterns](https://img.shields.io/badge/patterns-36-informational)](patterns/)
[![Playground](https://img.shields.io/badge/playground-local-purple)](playground/README.md)
[![CI](https://img.shields.io/badge/CI-5%20workflows-informational)](.github/workflows/)

---

## What This Is

A complete specification system covering **when and how AI should warn, explain, ask permission, express uncertainty, refuse, escalate, and recover** — with decision logic, pattern specifications, component guidance, reference implementations, and an interactive playground.

This is not a list of safety principles. It is a working system with:

- **36 pattern specifications** across 7 categories
- **A deterministic decision engine** with 10 input primitives and 14 selection rules
- **UI component specifications** for every pattern
- **Industry-specific deployment configurations** for healthcare, finance, developer tools, and industrial AI
- **4 JSON schemas** and 4 YAML deployment configurations
- **React reference implementations** for every component
- **An interactive playground** — run it locally in 60 seconds

---

## Quick Start

**See the engine in action (60 seconds):**

```bash
git clone https://github.com/your-org/ai-guardrails-explanations-design-system.git
cd ai-guardrails-explanations-design-system/playground
npm install
npm run dev
# Open http://localhost:3000
```

Manipulate decision primitives (P1–P10) and watch the engine select patterns, activate components, and generate an audit trail in real time.

**Start reading by role:**

| I am a… | Start here |
|---|---|
| Product designer or PM | [docs/principles/](docs/principles/) → [Pattern categories](#pattern-categories) |
| Engineer implementing the system | [docs/getting-started.md](docs/getting-started.md) → [reference/](reference/README.md) |
| Engineer exploring the decision engine | [docs/architecture.md](docs/architecture.md) → [docs/decision-flows/](docs/decision-flows/) |
| Enterprise architect or compliance lead | [docs/enterprise-playbooks/](docs/enterprise-playbooks/) → [reference/yaml/](reference/yaml/) |
| Open-source contributor | [CONTRIBUTING.md](CONTRIBUTING.md) → [docs/glossary.md](docs/glossary.md) |
| Just browsing | [docs/navigation.md](docs/navigation.md) — the full repo map |

---

## Pattern Categories

The system defines 36 patterns across 7 categories:

| Category | Patterns | When to use |
|---|---|---|
| [**Warning**](patterns/warning/) | 6 patterns | Surface alerts before a user proceeds — inline, ambient, modal, blocking, progressive, policy |
| [**Explanation**](patterns/explanation/) | 6 patterns | Communicate AI reasoning, confidence, sources, and limitations |
| [**Permission**](patterns/permission/) | 6 patterns | Request authorization before consequential or irreversible actions |
| [**Uncertainty**](patterns/uncertainty/) | 7 states | Represent 7 distinct AI epistemic states — from high confidence to unresolvable conflict |
| [**Refusal**](patterns/refusal/) | 7 patterns | Decline requests with clarity, context, and viable alternatives |
| [**Escalation**](patterns/escalation/) | 5 paths | Hand off to humans or higher-authority systems — role, system, emergency, async, handoff |
| [**Recovery**](patterns/recovery/) | 5 flows | Return users to productive states after errors, refusals, or failures |

---

## Decision Engine

The Guardrail Decision Engine maps 10 input primitives to pattern activations:

```
P1 Risk · P2 Confidence · P3 Capability · P4 Permission · P5 Policy
P6 Intent · P7 Business Impact · P8 Authority · P9 Freshness · P10 Source Reliability

              ↓  14 selection rules  ↓

    Pattern selection → Composition → Component activation → Audit
```

See [docs/architecture.md](docs/architecture.md) for the full architectural overview.
See [docs/decision-flows/](docs/decision-flows/) for the complete 6-document engine specification.

---

## Interactive Playground

The playground visualizes the entire pipeline:

- **Left panel** — Editable controls for all 10 decision primitives
- **Center panel** — Rule evaluation (activated / skipped / not evaluated), pattern list, composition layer, state machine, pipeline flow
- **Right panel** — Live-rendered guardrail components
- **Bottom panel** — Chronological audit trail

Five predefined scenarios cover Healthcare, Finance, Developer Copilot, Industrial AI, and Customer Support.

```bash
cd playground && npm install && npm run dev
```

Full documentation: [playground/README.md](playground/README.md)

---

## Repository Structure

```
ai-guardrails-explanations-design-system/
│
├── README.md                        ← You are here
├── CHANGELOG.md                     ← Phase-by-phase progress log
├── CONTRIBUTING.md                  ← How to contribute
├── SECURITY.md                      ← Vulnerability reporting
├── CODE_OF_CONDUCT.md               ← Community standards
├── SUPPORT.md                       ← Getting help
├── ROADMAP.md                       ← Where this is going
├── LICENSE                          ← MIT
│
├── docs/                            ← Primary documentation
│   ├── getting-started.md           ← Start here if you are new
│   ├── architecture.md              ← System architecture overview
│   ├── glossary.md                  ← Canonical term definitions
│   ├── faq.md                       ← Frequently asked questions
│   ├── troubleshooting.md           ← Common issues and fixes
│   ├── navigation.md                ← Full repository map
│   ├── project-structure.md         ← Directory and file conventions
│   ├── index.md                     ← Documentation hub
│   ├── diagrams/                    ← Mermaid architecture diagrams
│   ├── principles/                  ← Core design principles
│   ├── taxonomy/                    ← Guardrail and explanation taxonomy
│   ├── patterns/                    ← Pattern decision logic
│   ├── decision-flows/              ← 6-document decision engine
│   ├── enterprise-playbooks/        ← Enterprise deployment guidance
│   ├── regulated-industries/        ← Domain-specific guidance
│   └── case-studies/                ← 8 end-to-end case studies
│
├── patterns/                        ← 36 pattern specifications
│   ├── warning/                     ← 6 warning patterns
│   ├── explanation/                 ← 6 explanation patterns
│   ├── permission/                  ← 6 permission patterns
│   ├── uncertainty/                 ← 7 uncertainty states
│   ├── refusal/                     ← 7 refusal patterns
│   ├── escalation/                  ← 5 escalation paths
│   └── recovery/                    ← 5 recovery flows
│
├── components/                      ← UI component specifications
├── examples/                        ← Annotated implementation examples
├── templates/                       ← Reusable starting-point templates
│
├── reference/                       ← Machine-readable implementation artifacts
│   ├── json/                        ← 4 JSON schemas
│   ├── yaml/                        ← 4 industry YAML configurations
│   ├── config/                      ← 5 configuration reference docs
│   ├── react/                       ← 6 React component implementations
│   ├── nextjs/                      ← Next.js full-pipeline demo
│   └── examples/                    ← 4 complete JSON example payloads
│
└── playground/                      ← Interactive Decision Engine Playground
    ├── app/                         ← Next.js App Router (layout, page, CSS)
    ├── components/                  ← 13 playground UI components
    ├── engine/                      ← Decision engine (5 modules)
    └── data/                        ← Pattern registry + 5 scenarios
```

---

## Implementation Path

Following this path produces a working enterprise guardrail system:

```
1. Read docs/architecture.md         — understand the system
2. Configure reference/yaml/         — pick your industry config
3. Implement reference/react/        — integrate the components
4. Validate against reference/json/  — verify your payloads
5. Test with playground/             — observe engine behavior
6. Audit with reference/examples/    — verify audit output
```

---

## Industry Support

The design system has been specified, validated, and configured for:

| Industry | Config | Case Study | Key patterns |
|---|---|---|---|
| Healthcare (Clinical AI) | [healthcare-config.yaml](reference/yaml/healthcare-config.yaml) | Case Study 01 | Constrained completion, confidence disclosure, role escalation |
| Financial Services | [finance-config.yaml](reference/yaml/finance-config.yaml) | Case Study 02 | Policy refusal, emergency escalation, one-time permission |
| Developer Tools | [developer-copilot-config.yaml](reference/yaml/developer-copilot-config.yaml) | Case Study 03 | Safe refusal, reasoning trace, source citation |
| Industrial AI | [industrial-ai-config.yaml](reference/yaml/industrial-ai-config.yaml) | Case Study 04 | Emergency escalation, abandon recovery, unresolvable state |
| Customer Support | Covered in scenarios | — | Insufficient information, clarification request, human handoff |

---

## Release Status

**v1.0.0** — Initial stable release. See [RELEASE_NOTES.md](RELEASE_NOTES.md) for full notes and [VERSIONING.md](VERSIONING.md) for the versioning policy.

See [ROADMAP.md](ROADMAP.md) for planned post-v1.0.0 enhancements.

---

## Current Phase Status

| Phase | Name | Status | Commits |
|---|---|---|---|
| **Phase 1** | Foundation | ✅ Complete | ~20 |
| **Phase 2** | Core Pattern Specifications | ✅ Complete — 36 patterns | ~90 |
| **Phase 3** | Guardrail Decision Engine | ✅ Complete — 6-document engine | ~16 |
| **Phase 4** | AI Component Library | ✅ Complete — 47 component docs | ~21 |
| **Phase 5** | Reference Implementations & Case Studies | ✅ Complete — 8 case studies | ~15 |
| **Phase 6** | Developer SDK & Reference Implementation | ✅ Complete — schemas, configs, React, Next.js | ~25 |
| **Phase 7** | Interactive Playground & Validation | ✅ Complete — engine, 5 scenarios, 14 components | ~23 |
| **Phase 8** | Production Hardening & Open Source Release | ✅ Complete — CI, docs, community files, playground | ~30 |
| **Phase 9** | Release Engineering, Validation & v1.0.0 | ✅ Complete — tests, CI improvements, v1.0.0 tag | ~25 |
| v1.1+ | Enterprise Playbooks, Regulated Industries, Case Studies | Planned | — |
| **Total** | | | **~216 commits** |

---

## Testing

The repository includes a full automated test suite:

```bash
cd tests && npm install && npm test
```

165 tests across 5 suites: decision engine validation, JSON schema validation, payload validation, YAML configuration validation, and repository smoke tests (structure + accessibility markers). All tests run on every push via [GitHub Actions](.github/workflows/).

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Before contributing, read:
1. [docs/glossary.md](docs/glossary.md) — canonical terminology
2. [docs/taxonomy/](docs/taxonomy/) — pattern categories and naming
3. [docs/principles/](docs/principles/) — design philosophy

Issues and discussions: [GitHub Issues](https://github.com/your-org/ai-guardrails-explanations-design-system/issues) · [GitHub Discussions](https://github.com/your-org/ai-guardrails-explanations-design-system/discussions)

---

## License

MIT — see [LICENSE](LICENSE).
