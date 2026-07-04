# Changelog

All notable changes to this project are documented here.

This project uses phase-based versioning aligned to the commit roadmap. Each phase represents a meaningful increment of the design system.

---

## [Unreleased]

Work in progress across active phases.

---

## Phase 2E — Refusal State Specifications

**Status:** Complete
**Commits:** 7
**Goal:** Deliver complete, stable specifications for all seven refusal state variants — treating refusals as interaction strategies with defined completion paths, not as generic rejection messages.

### Added

- `patterns/refusal/safe-refusal.md` — Complete, unconditional refusal for safety/harm risks. Defines when a refusal has no completion path, how to frame the refusal without accusation, and the requirement for false-positive reporting mechanisms. Enforces non-accusatory, specific messaging over vague blocking copy.
- `patterns/refusal/partial-completion.md` — Graceful degradation: complete fulfillable portions, explicitly decline unfulfillable ones. Requires visible completeness markers in the output, not just a note in the explanation. Defines silent exclusion as a critical failure mode.
- `patterns/refusal/constrained-completion.md` — Modified fulfillment: complete the request with disclosed constraints applied. Distinguishes from partial completion by delivering a whole output (modified) rather than a partial one (excluded sections). Silent constraint is the primary failure mode and is prohibited.
- `patterns/refusal/alternative-suggestion.md` — Capability refusal with redirection: decline the specific form, offer alternatives for the underlying goal. Defines the distinction between refusing a goal (safe refusal) and refusing a form (alternative suggestion). Limits alternatives to three or four to prevent decision paralysis.
- `patterns/refusal/clarification-request.md` — Deferral pending user input. Defines when to ask versus when to assume and proceed. Treats repeated clarification and over-clarification as failure modes. Requires targeted single-focus questions over open-ended requests for "more detail."
- `patterns/refusal/human-handoff.md` — Escalation refusal routing to a human agent with context transfer. Defines three handoff types: capability, policy, and quality. Requires context summary transfer — handoff without context is treated as abandonment. Covers distress and crisis escalation scenarios.
- `patterns/refusal/policy-refusal.md` — Rule-governed refusal: consistent enforcement of configured policies across all users and sessions. Distinguishes from safe refusal (judgment-governed) by its rule-governed, non-judgment nature. Requires specific policy citation, authorized path to resolution, and policy consistency audit requirements.

### Changed

- `docs/taxonomy/index.md` — Refusal state variants expanded from 5 generic sub-types to 7 lifecycle-based interaction strategies aligned to the new specifications. Added descriptions for each variant.
- `docs/patterns/index.md` — Refusal state table updated to reflect 7 stable specifications with severity columns and direct file links.
- `patterns/README.md` — Refusal directory entry updated with descriptions for each new specification. Phase 2E status added.

---

## Phase 2D — Uncertainty State Specifications

**Status:** Complete
**Commits:** 7
**Goal:** Deliver complete, stable specifications for all seven uncertainty states — treating them as internal AI operating states that determine permitted actions and user interaction strategy, not just as UI disclosures.

### Added

- `patterns/uncertainty/high-confidence-state.md` — Baseline operating state. Defines when passive confidence indicators are appropriate, what actions are permitted without additional friction, and forbidden actions (including treating high confidence as authorization for irreversible actions). Establishes that the absence of uncertainty disclosure is the signal.
- `patterns/uncertainty/moderate-confidence-state.md` — Advisory operating state. Defines two-directional exit (up to high confidence, down to low) and distinguishes advisory-level disclosure from caution-level. Specifies that moderate confidence does not lower permission gate bars for high-stakes actions — it may raise them.
- `patterns/uncertainty/low-confidence-state.md` — Caution operating state. Defines the distinction between low confidence (poor data quality) and insufficient information (data absence). Requires output to break the user's default assumption of reliability. Mandates modal warning before any consequential action.
- `patterns/uncertainty/conflicting-evidence-state.md` — Source contradiction state. Qualitatively different from confidence-based states: individual sources may be high quality, but they disagree. Requires both versions of a claim to be surfaced with attribution. Defines citation hallucination (silently selecting one source) as the primary forbidden action.
- `patterns/uncertainty/insufficient-information-state.md` — Information absence state. Distinguishes from low confidence (quality) by root cause: the data is not poor, it is absent. Primary resolution is clarification request. Defines fabrication to fill the gap as the highest-severity failure mode.
- `patterns/uncertainty/stale-context-state.md` — Temporal reliability state. Defines staleness as a domain-sensitive modifier on confidence: different output types have different freshness thresholds. Introduces the stable/dynamic element partition: stable elements can still be delivered; dynamic elements require external verification.
- `patterns/uncertainty/unresolvable-state.md` — Terminal state. The only uncertainty state that does not exit to a lower-confidence state — only to refusal, escalation, or task reframing. Defines three forbidden actions: silent failure, output with disclosure (explicitly insufficient in this state), and reversal without surfacing the reversal. Every unresolvable state response must include a specific forward path.

### Changed

- `docs/taxonomy/index.md` — Uncertainty state variants expanded from 4 minimal entries to 7 complete sub-types with definition rows. Added four new trigger condition vocabulary entries: source conflict, freshness threshold breach, information absence, and unresolvable uncertainty. Added contextual descriptions for both uncertainty and refusal variant tables.
- `docs/patterns/index.md` — Uncertainty state table updated to reflect 7 stable specifications with severity columns and direct file links.
- `patterns/README.md` — Uncertainty directory entry updated with descriptions for each new specification. Phase 2D status added.

---

## Phase 2B — Explanation Pattern Specifications

**Status:** Complete
**Commits:** 7 (including taxonomy fix)
**Goal:** Deliver complete, stable specifications for all six explanation pattern variants.

### Added

- `docs/taxonomy/index.md` — Taxonomy updated to formally add blocking warning and policy warning subtypes introduced in Phase 2A (cleanup commit)
- `patterns/explanation/confidence-disclosure.md` — Three-depth confidence disclosure (surface / contextual / detailed). Covers trigger conditions, graduated label guidance, accessibility (ARIA `role="note"`, no color-only), enterprise audit considerations, failure modes including percentage overload, and annotated legal AI example.
- `patterns/explanation/source-citation.md` — Four-depth source citation (summary / list / linked / claim-level). Critical failure mode: citation hallucination — the highest-severity failure mode, requiring verification that cited sources were actually retrieved. Covers claim-level attribution with inline footnote accessibility requirements, enterprise source version integrity, and HR policy example.
- `patterns/explanation/reasoning-trace.md` — Three-depth reasoning trace (summary / step-by-step / annotated). Covers immutability requirement for compliance audit records, post-hoc rationalization as a critical failure mode, annotated step structure with sources and confidence per step, and loan assessment example.
- `patterns/explanation/decision-summary.md` — Three-depth structured decision record (standard / extended / compliance). Covers user override capture, immutability and signature requirements, retention policy guidance, and vendor selection example with documented recommendation override.
- `patterns/explanation/limitation-disclosure.md` — Three-depth limitation boundary disclosure (label / contextual / detailed). Covers distinction from confidence disclosure (structural vs. output-level), placement requirement (before or alongside affected content, not after), and regulatory compliance example.
- `patterns/explanation/structured-uncertainty-disclosure.md` — Composite explanation pattern combining confidence + limitation for high-stakes outputs. Defines standard section structure (confidence, limitations, reliable elements, uncertain elements, recommended handling), compliance-depth immutability, and clinical pharmacology example.

### Changed

- `docs/taxonomy/index.md` — Blocking warning and policy warning formally added to warning pattern sub-types; explanation and permission sub-types significantly expanded with Phase 2B and 2C definitions

---

## Phase 2C — Permission Gate Specifications

**Status:** Complete
**Commits:** 7
**Goal:** Deliver complete, stable specifications for the permission gate lifecycle: one-time, session, persistent, scoped, delegated, and revocation.

### Added

- `patterns/permission/one-time-permission.md` — Single-instance permission for bounded, consequential actions. Covers passive-dismissal-as-decline requirement, labeled action buttons, audit logging, permission fatigue failure mode, and project status update example.
- `patterns/permission/session-permission.md` — Session-scoped authorization for repeated action types within a session. Covers session expiry enforcement, combined one-time + session offer pattern, scope definition requirements, revocation mid-session, and knowledge base posting example.
- `patterns/permission/persistent-permission.md` — Standing cross-session authorization with deliberate grant UX. Covers mandatory permission management interface requirement, policy-driven expiry (no indefinite-without-review permissions), admin visibility requirements, no-premature-offer constraint, and analytics database example.
- `patterns/permission/scoped-permission.md` — Resource-bounded authorization limiting AI access to minimum necessary scope. Covers least-privilege principle, scope enforcement requirement (not merely advisory), scope audit reports, ambiguous-scope failure mode, and vendor contract audit example.
- `patterns/permission/delegated-permission.md` — Multi-party authorization routing. Covers approver identification requirements, SLA and timeout enforcement, conditional approval mechanism, approval chain audit requirements, approver identity verification for high-compliance contexts, and data access delegation example.
- `patterns/permission/revocation.md` — Permission withdrawal covering user-initiated, admin-initiated, and system-initiated revocation. Covers immediate effect requirement, no-rollback-of-completed-actions rule, notification delivery audit, partial revocation failure mode, and mid-session CRM permission revocation example.

### Changed

- `docs/patterns/index.md` — Explanation pattern table updated to all 🟢 stable with severity column and direct file links; permission gate table replaced with lifecycle-based model (one-time → session → persistent → scoped → delegated → revocation) — all 🟢 stable
- `patterns/README.md` — Explanation and permission category directory structures annotated; Phase Status updated to reflect 2B and 2C complete
- `docs/taxonomy/index.md` — Permission gate sub-types expanded to full lifecycle model; explanation sub-types expanded with Phase 2B precision definitions

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
