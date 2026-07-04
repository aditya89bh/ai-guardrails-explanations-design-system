# Project Structure

This document explains the directory structure conventions, naming standards, and file organization principles used in this repository.

---

## Structural Principles

**Documentation-first.** Every design decision lives in a document before it appears in code. The canonical source of truth is always a markdown file in `docs/`, `patterns/`, or `components/`.

**Taxonomy-driven naming.** Every file name, directory name, and heading uses canonical terms from [docs/taxonomy/](taxonomy/). No synonyms.

**Layered organization.** The repository mirrors the 6-layer architecture. Layers do not have circular dependencies — component specs reference pattern specs; pattern specs reference taxonomy; taxonomy does not reference components.

**One file per concept.** Each pattern has one specification file. Each component category has one specification file. No duplicating content across files.

---

## Naming Conventions

### Files

| Convention | Examples | Notes |
|---|---|---|
| Lowercase kebab-case | `blocking-warning.md`, `safe-refusal.md` | All markdown and config files |
| PascalCase | `WarningBanner.jsx`, `PermissionGate.jsx` | React components only |
| All lowercase with hyphens | `healthcare-config.yaml` | YAML configuration files |
| Descriptive suffix | `.schema.json`, `-config.yaml`, `-payload.json` | Makes file type clear from name |

### Directories

| Convention | Examples | Notes |
|---|---|---|
| Lowercase kebab-case | `decision-flows/`, `case-studies/` | All directories |
| Singular for categories | `warning/`, `refusal/` | Pattern and component categories |
| Plural for collections | `examples/`, `templates/` | Top-level collection directories |

### Pattern IDs

Pattern IDs use lowercase kebab-case matching the filename without extension:
- `inline-warning` → `patterns/warning/inline-warning.md`
- `safe-refusal` → `patterns/refusal/safe-refusal.md`
- `emergency-escalation` → `patterns/escalation/emergency-escalation.md`

### Component IDs

Component IDs use PascalCase:
- `WarningBanner` → renders `inline-warning`, `ambient-warning`, `blocking-warning`, `policy-warning`
- `RefusalCard` → renders `safe-refusal`, `constrained-completion`, `policy-refusal`, etc.

---

## Directory Reference

### Root

```
/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── SUPPORT.md
├── ROADMAP.md
└── LICENSE
```

Root level contains only repository-level files. No pattern specs, no component specs, no code.

### docs/

Primary documentation. Human-readable. Markdown only.

```
docs/
├── getting-started.md       ← New reader entry point
├── architecture.md          ← System architecture
├── glossary.md              ← Canonical term definitions
├── faq.md                   ← Common questions
├── troubleshooting.md       ← Issue resolution
├── navigation.md            ← Repository map
├── project-structure.md     ← This file
├── index.md                 ← Documentation hub
├── diagrams/                ← Mermaid diagrams
├── principles/              ← Design philosophy
├── taxonomy/                ← Canonical vocabulary
├── patterns/                ← Pattern decision logic (narrative)
├── decision-flows/          ← Decision engine specification
├── enterprise-playbooks/    ← Enterprise deployment guidance
├── regulated-industries/    ← Domain-specific guidance
└── case-studies/            ← End-to-end reference implementations
```

### patterns/

Machine-readable pattern specifications. One file per pattern.

```
patterns/
├── warning/
│   ├── inline-warning.md
│   ├── ambient-warning.md
│   ├── modal-warning.md
│   ├── blocking-warning.md
│   ├── progressive-warning.md
│   └── policy-warning.md
├── explanation/
│   └── … (6 files)
├── permission/
│   └── … (6 files)
├── uncertainty/
│   └── … (7 files)
├── refusal/
│   └── … (7 files)
├── escalation/
│   └── … (5 files)
└── recovery/
    └── … (5 files)
```

**Pattern file structure** (all 36 patterns follow this template):

```markdown
# [Pattern Name]

## Definition
## Category and Severity
## Trigger Conditions
## Selection Logic
## User Communication Guidelines
## Component Reference
## Composition Rules
## Antipatterns
## Spec Reference
```

### components/

UI component specifications. Organized by pattern category.

```
components/
├── warning/
│   └── component-spec.md    ← Warning component specification
├── explanation/
│   └── component-spec.md
├── permission/
│   └── component-spec.md
├── uncertainty/
│   └── component-spec.md
├── refusal/
│   └── component-spec.md
├── escalation/
│   └── component-spec.md
├── recovery/
│   └── component-spec.md
├── design-tokens.md          ← All --guardrail-* CSS custom properties
├── implementation-guidelines.md
├── accessibility-checklist.md
└── component-matrix.md       ← Pattern → component mapping
```

### reference/

Machine-readable implementation artifacts. No narrative documentation — only schemas, configs, code, and data.

```
reference/
├── README.md                 ← Directory navigation
├── json/                     ← JSON schemas (4 files)
├── yaml/                     ← YAML configurations (4 files)
├── config/                   ← Configuration reference docs (5 files)
├── react/                    ← React implementations (6 files)
├── nextjs/                   ← Next.js demo (1 file)
└── examples/                 ← JSON example payloads (4 files)
```

### playground/

Interactive Next.js application. Self-contained — has its own `package.json`.

```
playground/
├── package.json
├── next.config.js
├── README.md
├── app/                      ← Next.js App Router
├── components/               ← 13 UI components
│   └── guardrail/            ← 6 guardrail component renderers
├── engine/                   ← 5 engine modules
└── data/                     ← Pattern registry + scenarios
```

### .github/

GitHub-specific files. Not part of the design system documentation.

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
├── PULL_REQUEST_TEMPLATE.md
└── workflows/
    ├── markdown-lint.yml
    ├── link-check.yml
    ├── playground-build.yml
    └── schema-validation.yml
```

---

## What Goes Where

| Artifact type | Location | Example |
|---|---|---|
| Canonical pattern definition | `patterns/<category>/<name>.md` | `patterns/refusal/safe-refusal.md` |
| Component visual/behavior spec | `components/<category>/component-spec.md` | `components/refusal/component-spec.md` |
| Decision engine rule | `docs/decision-flows/pattern-selection-engine.md` | — |
| JSON schema | `reference/json/<name>.schema.json` | `reference/json/patterns.schema.json` |
| Deployment configuration | `reference/yaml/<industry>-config.yaml` | `reference/yaml/finance-config.yaml` |
| React implementation | `reference/react/<Component>.jsx` | `reference/react/WarningBanner.jsx` |
| Example payload | `reference/examples/<industry>-payload.json` | `reference/examples/healthcare-payload.json` |
| Case study | `docs/case-studies/<name>.md` | — |
| Enterprise guidance | `docs/enterprise-playbooks/<topic>.md` | — |
| Architecture diagram | `docs/diagrams/<topic>.md` | `docs/diagrams/decision-engine.md` |
| Playground component | `playground/components/<Name>.jsx` | `playground/components/EnginePanel.jsx` |
| Playground engine module | `playground/engine/<module>.js` | `playground/engine/evaluator.js` |

---

## What Belongs in Each Layer

**docs/** — Narrative. Explains why and how. Human readers.

**patterns/** — Specification. Defines what a pattern is, when it activates, what it must do. Machine-readable friendly but written for human engineers.

**components/** — Visual/behavioral specification. Defines how a pattern looks and behaves in a UI. Targets front-end engineers and designers.

**reference/** — Code and data. Runnable, importable, or directly copy-paste-able. No narrative explanation — just working artifacts.

**playground/** — Executable demonstration. A complete running application that consumes all other layers.

---

## Adding New Files

Before adding a new file, check:

1. Is this the right directory for this content type? (See table above.)
2. Does the filename follow the kebab-case convention?
3. Does the content use only canonical terms from the taxonomy?
4. If adding a pattern, does it use the standard 8-section template?
5. If adding a component spec, does it reference the correct pattern file?
6. If adding a reference artifact, does it validate against the appropriate JSON schema?
