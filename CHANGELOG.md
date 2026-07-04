# Changelog

All notable changes to this project are documented here.

This project uses phase-based versioning aligned to the commit roadmap. Each phase represents a meaningful increment of the design system.

---

## [Unreleased]

Work in progress across active phases.

---

## Phase 4 — AI Component Library

**Status:** Complete
**Commits:** 21
**Goal:** Transform the pattern specifications and decision engine into an implementable, framework-agnostic UI component library covering all 36 guardrail patterns across 7 categories.

### Added

**Shared library documents:**
- `components/design-tokens.md` — Complete design token specification: severity color tokens (surface, text, icon, border at 5 severity levels), priority z-index tokens (6 tiers from inline to escalation), elevation tokens (0–4), spacing tokens (xs–3xl with 44×44px touch target rule), icon semantic tokens (19 named icons), animation duration tokens (instant–600ms) with reduced-motion fallbacks, easing tokens (5 curves), border treatment tokens, focus indicator tokens (with WCAG 3:1 requirement), disabled state tokens, and audit indicator tokens. Defines the four token usage rules.
- `components/component-matrix.md` — Complete mapping of all 36 guardrail patterns to their implementing component(s). Each entry specifies: component name, key input props, key output callbacks, states, accessibility requirement, motion, responsive behavior, and decision engine rule reference. Organized by all 7 pattern categories (Warning, Explanation, Permission, Uncertainty, Refusal, Escalation, Recovery).
- `components/implementation-guidelines.md` — Framework implementation guidance for React (state management, focus management, audit callbacks, token consumption), Vue (defineProps/defineEmits, nextTick focus, v-model), Web Components (shadow DOM, custom events, aria labeling), iOS (SwiftUI/UIKit — color assets, UIAlertController, isReduceMotionEnabled), Android (Compose — Material Theme, Dialog, ANIMATOR_DURATION_SCALE), enterprise dashboards (compact density, data table integration, print/export), dark mode (dual-mode token system), i18n (string length considerations, flexible-width buttons, locale-aware date formatting), and RTL (CSS logical properties, directional rules, icon flip guidance).
- `components/accessibility-checklist.md` — WCAG 2.1 AA compliance checklist organized by success criterion (perceivability, operability, understandability, robustness) with component-specific items for warning, permission, emergency escalation, and override recovery. Includes automated testing tool guidance and manual testing requirements (NVDA, JAWS, VoiceOver).

**Per-category component documents (7 categories × 6 files = 42 documents):**

- `components/warning/` — InlineWarning, WarningBanner, ModalWarning, BlockingWarning, PolicyWarning. Specifies 6 variants, progressive warning escalation rules, severity-to-elevation independence rule. Interaction: auto-dismiss timer, pointer-event blocking for blocking overlay. Accessibility: `role="alertdialog"` for modal/blocking, `aria-live` politeness selection by severity. Motion: severity-matched entrance durations (100ms–600ms). Responsive: full-screen modal on xs/sm.

- `components/explanation/` — ConfidenceBadge, SourceList, ReasoningTrace, DecisionSummary, LimitationDisclosure, StructuredUncertaintyCard. All passive by default with optional interaction. Accessibility: tooltip as `role="tooltip"`, expand controls with `aria-expanded`. Motion: always subtle — never intrusive. Responsive: tooltip → bottom sheet on xs/sm.

- `components/permission/` — PermissionGate, ScopedPermissionGate, DelegatedPermissionRequest, PermissionRevocationNotice. Specifies passive dismissal = denial as security invariant. Deny-first tab order. Focus trap. Audit callbacks required. Motion: scope item stagger animation. Responsive: bottom sheet on xs/sm.

- `components/uncertainty/` — UncertaintyIndicator, ConflictingEvidenceCard, StaleContextBadge, UnresolvableStateCard. High-confidence state requires no component. State transitions reflected immediately. UnresolvableStateCard uses `role="alert"` with assertive live region. Motion: one-shot pulse permitted (not looping). Responsive: 2-col evidence → single col on xs.

- `components/refusal/` — RefusalCard, PartialCompletionCard, ConstrainedCompletionCard, AlternativeSuggestionCard, ClarificationRequest, HumanHandoffCard. "None of these" required on all alternative lists. Focus moves to first path-forward action on mount. Exclusion notice never collapsed by default. Motion: partial completion reveals staggered.

- `components/escalation/` — HumanHandoffPanel, RoleEscalationCard, SystemEscalationNotice, EmergencyEscalationOverlay, AsyncReviewStatus. EmergencyEscalationOverlay: full keyboard capture, Escape disabled, requires explicit acknowledgment, aggressive entrance motion. Non-emergency components non-blocking. Responsive: AsyncReviewStatus as bottom status bar on xs/sm.

- `components/recovery/` — RetryPrompt, RedirectSuggestion, RepairCard, OverrideConfirmation, AbandonExit. Focus moves to primary action immediately. Override: checkbox gates confirm button (aria-disabled). Abandon: saved/not-saved lists staggered. Cascade transition announces "Let me try something different." Responsive: OverrideConfirmation as bottom sheet on xs/sm.

### Changed

- `components/README.md` — Updated to reflect Phase 4 completion (existing scaffold preserved; Phase 4 status line added).
- `README.md` — Phase 4 added as complete; roadmap description updated.
- `docs/index.md` — Component Library section added to status table; engineer navigation updated.

### Design Decisions

- **Six-file structure per category (README + component-spec + interaction-model + accessibility + motion + responsive):** This structure separates concerns clearly — what a component is, how users interact with it, how it's accessible, how it moves, and how it adapts. Each file can be read independently by the relevant specialist (developer, a11y lead, motion designer, mobile engineer).
- **Component matrix as integration test input:** The component matrix is structured so each row can become an automated test case: given a pattern, verify the component has the correct ARIA role, state count, and decision engine rule reference.
- **Design tokens as the single truth:** All color, spacing, elevation, and animation values are defined as named tokens. No component hardcodes a value. This makes theme switching, dark mode, and deployment-level customization tractable.
- **Emergency escalation keyboard capture is non-configurable:** The full Tab-capture behavior of EmergencyEscalationOverlay is specified as invariant. Enterprise deployments may customize visual styling but not the acknowledgment requirement — this is a safety behavior.
- **Deny-first tab order in permission gates:** The tab order in all permission gates places the deny control before the grant control. This is a deliberate security UX choice — keyboard users who Tab without reading encounter the denial path first.

### Known Gaps

- Per-category `README.md` files are intentionally brief overviews (5–15 lines). They do not duplicate the content of `component-spec.md`.
- `components/README.md` (root) was not fully rewritten — it retains the Phase 1 scaffold. A full rewrite is planned alongside the component matrix in a Phase 4 cleanup pass.
- Example implementation code (React, Vue, Web Component) is not included in Phase 4 — `examples/` is targeted for Phase 7.

---

## Phase 3 — Guardrail Decision Engine

**Status:** Complete
**Commits:** 16
**Goal:** Transform the repository from a collection of 36 pattern specifications into a complete, deterministic decision engine that governs how patterns are selected, combined, ordered, and orchestrated.

### Added

- `docs/decision-flows/decision-primitives.md` — Ten foundational input variables that every decision rule reads from: Risk (P1), Confidence (P2), Capability (P3), Permission (P4), Policy (P5), User Intent (P6), Business Impact (P7), User Authority (P8), Context Freshness (P9), and Source Reliability (P10). Each primitive defines its meaning, type, allowed values, computation method, influence on pattern selection, and related patterns. Defines the canonical primitive evaluation order (Policy evaluated first; User Intent used throughout to narrow selection space).

- `docs/decision-flows/pattern-selection-engine.md` — Three-step selection process: (1) category gating determines which of the seven pattern categories activate, (2) within-category selection determines the specific pattern, (3) depth and severity calibration determines the operating level. Includes decision tables for each category, progressive warning escalation rules, the structured uncertainty disclosure override rule, the refusal pattern mutual exclusion rule, and selection fallback rules for every category.

- `docs/decision-flows/pattern-precedence-engine.md` — Defines inter-category precedence order (Policy Refusal → Safe Refusal/Emergency Escalation → Blocking Warning → Escalation → Permission → Uncertainty → Explanation → Recovery → Warning), intra-category precedence within each of the seven categories, tie-break rules for tied patterns, cross-category conflict resolution rules (blocking warning + permission gate sequencing; uncertainty + refusal; escalation + recovery temporal relationship), suppression rules reference table, and the priority escalation path for unresolvable conflicts.

- `docs/decision-flows/state-transition-engine.md` — State machines for all four stateful pattern categories: (1) Uncertainty State Machine — seven states (HC, MC, LC, CE, II, SC, UR), entry conditions, all valid transitions with triggers, invalid transitions with rationale, and recovery transitions; (2) Refusal State Machine — seven refusal states with entry conditions and sequencing rules including invalid sequences; (3) Escalation State Machine — nine flow states (PENDING through FAILED), valid and invalid transitions, emergency escalation interrupt-mode machine; (4) Recovery State Machine — eight flow states (TRIGGERED through ABANDONED), valid transitions, cascade sequence, invalid transitions; (5) Cross-Machine Transition Matrix — terminal state to entry state mappings across all four machines, including prohibited cross-machine transitions.

- `docs/decision-flows/pattern-composition-engine.md` — Five composition principles (minimum necessary disclosure, sequential integrity, non-duplication, compositional closure). Legal composition sequences — twelve named sequences covering standard warning+permission flow, uncertainty+explanation flow, refusal+recovery flow, escalation+recovery flow, complex multi-step compositions. Illegal combinations — simultaneous illegal pairs (e.g., safe-refusal + any other refusal), sequential violations (permission before explanation), category conflicts (unresolvable + high-confidence). Composition cardinality limits (max 2 simultaneous warnings, 1 gate at a time, 3 recovery options). Five standard composition templates (A–E) for the most common interaction patterns.

- `docs/decision-flows/orchestration-engine.md` — Five complete end-to-end orchestration examples, each including input, full primitive evaluation table, pattern selection reasoning, precedence resolution, composition sequence, and final interaction specification:
  - **Healthcare — Clinical Decision Support:** Pharmacist vancomycin dosage query. Demonstrates constrained-completion as the correct pattern when Risk=4 applies to action-execution but not to decision-support intent; source citation (claim-level) and limitation disclosure required alongside.
  - **Finance — Trade Pre-Approval:** Concentrated options trade request. Demonstrates policy-refusal as primary when tenant-level policy matches; partial-completion for suitability review preparation; role-escalation and redirect-recovery as alternatives.
  - **Enterprise Assistant — Cross-Tenant Data Query:** Customer data sharing request. Demonstrates deployment-level policy match; partial-completion (internal summary) proceeding while external distribution is blocked; async-review-escalation path.
  - **Developer Copilot — Secrets and Credentials:** Credential hardcoding request. Demonstrates platform-level (unconditional) policy-refusal with no override path; alternative-suggestion with three concrete secure alternatives; redirect-recovery via environment variable pattern.
  - **Industrial AI — Autonomous Equipment Decision:** AI-initiated monitoring event, no user query. Demonstrates emergency-escalation in interrupt mode; constrained-completion within authorized bounds (load reduction) simultaneous with escalation; decision-summary to operator; limitation-disclosure that shutdown requires human authorization.

### Changed

- `docs/decision-flows/index.md` — Replaced Phase 1 scaffold with full Phase 3 engine index. Added decision engine architecture diagram, table of all six stable engine documents, retained planned granular flow documents (Phase 4+). Updated phase status. Added integration test specification note.
- `docs/index.md` — Updated Decision Flows section to describe the Phase 3 decision engine. Added decision engine to engineer role navigation. Updated documentation status table to mark Decision Flows as complete.
- `README.md` — Updated engineer usage guidance to include decision-flows as the starting point. Updated phase status table to mark Phases 1, 2, and 3 as complete with commit counts. Updated Phase 3 roadmap description with full engine scope.

### Design Decisions

- **Six-document engine architecture:** The decision engine is structured as six layers — primitives, selection, precedence, state machines, composition, orchestration — corresponding to the order in which a production system evaluates an interaction. This layered architecture allows individual components to be updated independently when deployment requirements change.
- **Deterministic rules throughout:** Every rule in the engine produces the same output for the same inputs. Probabilistic or judgment-based selections are not present in the engine — those belong in the AI's inference layer, not the guardrail layer.
- **Orchestration examples as integration test specifications:** The five orchestration examples are not illustrative scenarios; they are specifications. A conforming implementation must produce the same pattern activations for the same primitive values. This makes the examples the primary integration test cases for teams implementing the design system.
- **Cross-machine transition matrix:** Adding a formal matrix connecting the four stateful machines (uncertainty → refusal → escalation → recovery) makes the full interaction lifecycle traceable. Prohibited cross-machine transitions are explicitly named to prevent common implementation errors.
- **Composition cardinality limits:** Explicit limits on simultaneous warnings, gates, and recovery options prevent over-disclosure — a known failure mode where excessive guardrail activation undermines user trust by appearing excessive or inconsistent.

### Known Gaps

- Granular per-category decision flow documents (Phase 4) remain planned. Phase 3 addresses the full system level; individual pattern-level selection tables are not yet authored as standalone documents.
- Customer support domain example was de-scoped in favor of the industrial AI example, which demonstrates the more architecturally distinct case (AI-initiated event, no user query, interrupt-mode escalation). Customer support orchestration is planned for Phase 7 case studies.

---

## Phase 2G — Recovery Flow Specifications

**Status:** Complete
**Commits:** 11
**Goal:** Complete Phase 2 by delivering all five recovery flow specifications — closing the interaction lifecycle for all seven guardrail pattern categories.

### Added

- `patterns/recovery/retry-recovery.md` — Re-attempts the same action after a transient blocking condition. Defines three distinct modes: automatic (AI-initiated, invisible to user), assisted (AI-initiated, user confirms), and manual (user-initiated). Mandates idempotency keys, exponential backoff, and retry limits. Defines zero-delay retry loops and retry of deterministic failures as named failure modes. Distinguishes retry (same path re-executed) from repair (path corrected before resuming).
- `patterns/recovery/redirect-recovery.md` — Routes the user to an alternative path that achieves the same underlying goal after the original path is permanently closed. Defines goal preservation (identifying the underlying goal, not just the blocked request form) as the core obligation. Requires genuine alternatives — fabricated paths are a failure mode. Defines prohibited redirect (using redirect to circumvent a safe refusal) as a compliance failure.
- `patterns/recovery/repair-recovery.md` — Corrects an error, data inconsistency, or invalid state within the current workflow and resumes from the corrected position. Defines three repair types: data repair, state repair, configuration repair. Requires pre-repair diagnosis, post-repair validation, and explicit rollback conditions before repair begins. Mandates data lineage preservation in regulated environments. Distinguishes repair (something changes before resuming) from retry (same action re-executed unchanged).
- `patterns/recovery/manual-override-recovery.md` — Allows an authorized user to bypass a specific guardrail for a specific, scoped action, after role verification, risk acknowledgment, and immutable audit logging. Defines override scope (action, data, time, session), mandatory expiration, and automatic guardrail re-activation. Explicitly prohibits override of safe refusals. Defines routine override as a policy calibration signal, not a feature.
- `patterns/recovery/abandon-recovery.md` — Provides a clean, structured exit from a workflow that will not be completed in the current session. Mandates draft preservation, re-entry path definition, and proper session state closure. Distinguishes abandonment (user decision) from failure (system failure) in the session record. Requires disclosure of what was saved vs. not saved before the session closes. Defines closing a session with unsaved user work without explicit acknowledgment as an absolute failure mode.

### Changed

- `docs/taxonomy/index.md` — Recovery flow variants expanded from 5 minimal rows to 5 complete sub-type definitions with descriptions that distinguish each flow's objective.
- `docs/patterns/index.md` — Recovery flows table updated to 🟢 stable with severity columns and direct file links. Section description updated.
- `patterns/README.md` — Recovery directory entry updated with inline descriptions. Phase 2G status block added. Phase 2 completion status declared (36 specifications stable).

### Cleanup

- Removed stale `.gitkeep` files from `patterns/recovery/` and `patterns/escalation/` — both directories now contain real pattern specifications.

---

## Phase 2F — Escalation Path Specifications

**Status:** Complete
**Commits:** 12 (including 2 cleanup/distinction commits)
**Goal:** Deliver complete, stable specifications for all five escalation path variants and resolve consistency gaps from Phase 2D+E.

### Added

- `patterns/escalation/human-handoff.md` — Escalation-category human handoff: authority and scope routing to a human agent with ownership, SLA enforcement, and fallback behavior. Explicitly distinct from the refusal-category human handoff; the distinction is defined in the spec, the pattern index, the patterns README, and the taxonomy. Covers routing target resolution, context transfer requirements, authorization chain, timeout escalation hierarchy, and mandatory audit logging.
- `patterns/escalation/role-escalation.md` — Organizational authority routing: from the requesting user's role to the minimum eligible higher-authority role. Defines over-escalation and under-escalation as named failure modes. Covers dual-authority (four-eyes) requirements, delegation logging, denial handling, and SLA timeout promotion. Includes routing criteria mapped to action types.
- `patterns/escalation/system-escalation.md` — System-to-system authority routing: from the current AI to a higher-authority or specialized automated system. Defines idempotency key requirement, schema contract enforcement, transparent vs. opaque escalation communication, observability requirements (metrics, alerts, dashboards), and fallback behavior when the target system is unavailable.
- `patterns/escalation/emergency-escalation.md` — Interrupt-mode critical risk escalation. Self-authorizing (no pre-approval required). Routes simultaneously to all required parties. Defines acknowledgment windows (not SLA windows), automatic hierarchy promotion on non-acknowledgment, immutable audit log requirements (evidentiary standard), and the requirement that the emergency escalation path itself be resilience-tested. Covers safety, security, compliance, and operational emergency types.
- `patterns/escalation/async-review-escalation.md` — Non-immediate review queue escalation. The user's workflow may continue while the review proceeds. Defines review queue behavior (priority order, duplicate prevention, assignment workflows), five-state status tracking model, approval/denial/return-for-revision result handling, and SLA breach alerting. Distinguishes from emergency and role escalation by non-blocking nature and queue-based routing model.

### Changed

- `docs/taxonomy/index.md` — Escalation path variants expanded from 4 minimal entries to 5 complete sub-type definitions with contextual descriptions. Added explicit human handoff distinction note in the escalation section.
- `docs/patterns/index.md` — Escalation paths table updated to 🟢 stable with severity columns and direct file links. Added human handoff distinction callout box distinguishing refusal and escalation variants. Fixed table column header (added Severity column).
- `patterns/README.md` — Escalation directory entry updated with descriptions for all 5 new specifications. Added Phase 2F status block. Added Human Handoff Pattern Distinction reference table comparing refusal and escalation variants.

### Cleanup

- Removed stale `.gitkeep` files from `patterns/warning/`, `patterns/explanation/`, `patterns/permission/`, `patterns/uncertainty/`, and `patterns/refusal/` — all five directories now contain real pattern specifications.
- Corrected Phase 2 target commit count from `~60` to `~90` in this changelog.

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

## Phase 2 — Core Pattern Specifications _(In Progress)_

**Target commits:** ~90
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
