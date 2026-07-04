# Changelog

All notable changes to this project are documented here.

This project uses phase-based versioning aligned to the commit roadmap. Each phase represents a meaningful increment of the design system.

---

## [Unreleased]

Work in progress across active phases.

---

## Phase 2A — Warning Pattern Specifications

**Status:** Complete
**Commits:** 9
**Goal:** Deliver complete, stable specifications for all six warning pattern variants.

### Added

- `patterns/warning/inline-warning.md` — Advisory inline warning. Covers trigger conditions (confidence threshold breach, data staleness, partial scope boundary), copywriting guidance, accessibility requirements including ARIA role (`role="note"`), enterprise audit considerations, failure modes, and example scenario.
- `patterns/warning/modal-warning.md` — Caution to Blocking modal warning. Covers severity distinction between Caution (dismissible) and Blocking (explicit confirm required), focus management, focus trap requirements, ARIA `role="dialog"`, habituation failure mode, and example scenario.
- `patterns/warning/ambient-warning.md` — Informational to Advisory ambient warning. Covers session-level and context-level trigger conditions, persistent disclosure design, ARIA `role="status"`, `aria-live="polite"` for dynamic content, failure modes including ambient zone noise, and example scenario.
- `patterns/warning/blocking-warning.md` — Blocking warning (hard stop). Covers resolution action types (correct input, provide missing information, explicit declaration, choose alternative path), ARIA `role="alertdialog"`, no-passive-dismissal requirement, enterprise audit logging requirements, and example scenario.
- `patterns/warning/progressive-warning.md` — Escalating multi-stage warning. Defines three-stage progression (Advisory → Caution → Blocking), proximity-based trigger conditions for each stage, stage-specific explanation and copywriting requirements, ARIA live region escalation behavior, and example scenario with typed confirmation at Stage 3.
- `patterns/warning/policy-warning.md` — Policy-rule-triggered warning. Covers policy match trigger conditions (soft and hard), severity determined by policy rule configuration, mandatory audit logging for all policy warning events, policy rule versioning requirement, stacked policy warning handling, and example scenario with compliance workflow integration.

### Changed

- `docs/patterns/index.md` — Warning pattern table updated: all six patterns marked 🟢 stable, severity levels added as a column, files linked directly, Phase 2A completion noted
- `patterns/README.md` — Warning category directory structure updated with per-file annotations, Phase Status section updated to reflect Phase 2A complete

---

## Phase 1 — Foundation

**Status:** Complete
**Commits:** 20
**Goal:** Establish the documentation-first foundation, define repo structure, taxonomy, and contribution standards.

### Added
- Repository initialized with `.gitignore` and full subdirectory scaffold
- MIT license
- `README.md` — full project overview, pattern categories, repo structure, usage guide, phase status, and roadmap to ~350 commits
- `CHANGELOG.md` — phase-based versioning log
- `CONTRIBUTING.md` — contribution standards, commit format, pattern specification format, and canonical terminology requirements
- `docs/index.md` — documentation hub with navigation and role-based quick access
- `docs/principles/index.md` — 10 core design principles with enterprise standards and implementation checklist
- `docs/taxonomy/index.md` — full guardrail taxonomy: 7 pattern categories, 5 severity levels, sub-types for all categories, trigger condition vocabulary, and canonical terminology reference
- `docs/patterns/index.md` — complete pattern library index with 38 planned specifications across all 7 categories
- `docs/decision-flows/index.md` — decision flow index with ~20 planned flows including cross-pattern composition flows
- `docs/enterprise-playbooks/index.md` — playbook index covering policy, audit, multi-tenant, rollout, and localization
- `docs/regulated-industries/index.md` — regulated industries index covering healthcare, financial services, legal, government, and critical infrastructure
- `docs/case-studies/index.md` — case study index with 15 planned studies across 4 product types, plus case study format template
- `patterns/README.md` — pattern library guide with directory structure and specification format
- `components/README.md` — component specifications guide with directory structure, format, and accessibility baseline
- `examples/README.md` — annotated examples guide with format and annotation conventions
- `templates/README.md` — templates guide with 7 available templates
- `templates/pattern-specification.md` — pattern specification starter template
- `templates/decision-flow.md` — decision flow starter template
- `templates/case-study.md` — case study starter template
- `templates/enterprise-playbook.md` — enterprise playbook starter template
- `templates/regulated-industry-document.md` — regulated industry document starter template
- `templates/example.md` — annotated example starter template
- `templates/component-specification.md` — component specification starter template
- Full subdirectory scaffold with `.gitkeep` files across all `patterns/`, `components/`, `examples/`, and `docs/` subdirectories

---

## Phase 2 — Core Pattern Specifications _(Planned)_

**Target commits:** ~60
**Goal:** Full specification for each of the seven guardrail pattern categories.

Planned additions:
- Warning pattern specifications (inline, modal, ambient, progressive)
- Explanation pattern specifications (confidence disclosure, source citation, reasoning trace, decision summary)
- Permission gate specifications (soft gate, hard gate, audit-required gate)
- Uncertainty state specifications (confidence levels, hedging language, fallback behavior)
- Refusal state specifications (policy refusal, capability refusal, safety refusal, graceful degradation)
- Escalation path specifications (human handoff, tier escalation, emergency escalation)
- Recovery flow specifications (retry, redirect, repair, manual override)

---

## Phase 3 — Decision Flows and Logic Trees _(Planned)_

**Target commits:** ~50
**Goal:** Structured decision logic for when and how each pattern triggers.

---

## Phase 4 — UI Component Specifications _(Planned)_

**Target commits:** ~50
**Goal:** Visual and behavioral specifications for pattern-implementing UI components.

---

## Phase 5 — Enterprise Playbooks _(Planned)_

**Target commits:** ~40
**Goal:** Governance-ready deployment guidance for enterprise AI teams.

---

## Phase 6 — Regulated Industries _(Planned)_

**Target commits:** ~40
**Goal:** Domain-specific pattern variants for healthcare, finance, legal, government, and infrastructure.

---

## Phase 7 — Case Studies and Examples _(Planned)_

**Target commits:** ~40
**Goal:** Reference implementations across common enterprise AI product types.

---

## Phase 8 — Templates and Tooling _(Planned)_

**Target commits:** ~30
**Goal:** Reusable pattern and decision-flow templates.

---

## Phase 9 — Review, Polish, and Release _(Planned)_

**Target commits:** ~20
**Goal:** Cross-reference audit, consistency review, and formal release.

---

_Entries are added as work is completed. Phases are committed and pushed incrementally._
