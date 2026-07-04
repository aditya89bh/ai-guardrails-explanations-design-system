# Changelog

All notable changes to this project are documented here.

This project uses phase-based versioning aligned to the commit roadmap. Each phase represents a meaningful increment of the design system.

---

## [Unreleased]

Work in progress across active phases.

---

## Phase 9 — Release Engineering, Validation & v1.0.0

**Status:** Complete
**Commits:** 25
**Goal:** Finalize the repository for its v1.0.0 release. Focus exclusively on production readiness, validation, release engineering, automated testing, CI improvements, playground polish, and visual documentation. No new guardrail concepts, no taxonomy changes, no decision engine changes.

### Added

**Release Engineering**
- `RELEASE.md` — Release process guide: 3 release types (patch/minor/major), cadence policy, 7-step release process, hotfix process, v1.0.0 scope definition with included/excluded content.
- `VERSIONING.md` — SemVer policy with documentation-specific interpretations: breaking changes taxonomy, taxonomy lock guarantee, schema stability contract, pre-release identifiers, version history table.
- `RELEASE_CHECKLIST.md` — 40-point pre-release checklist: tests, CI, playground verification (all 5 scenarios), documentation, schema integrity, pattern/component coverage, repository hygiene, GitHub configuration, tagging, post-release steps.
- `RELEASE_NOTES.md` — Complete v1.0.0 release notes with scope summary, component inventory, known limitations, upgrade path (first release — no upgrade needed), and known post-v1.0.0 opportunities.

**Support Lifecycle**
- `SUPPORT.md` — Added support lifecycle table (v1.0.x active support, pre-release unsupported), active support definition, deprecation policy (one major version minimum notice), explicit v1.0.0 deprecation-free guarantee.

**Automated Test Suite (`tests/`)**
- `tests/package.json` — Node.js 18+ test runner configuration, 5 test scripts.
- `tests/README.md` — Test suite documentation with run instructions and suite table.
- `tests/engine/engine.test.js` — 34 tests: default state, R01 (policy block), R02 (UR+Critical), R07 (LC+decision-support), R08 (LC+action-execution), R05 (CE+high-risk), composition constraints, all 5 scenarios, result structure integrity.
- `tests/schemas/schema.test.js` — 21 tests: all 4 schemas valid JSON, $schema/title/structure fields, shared conventions.
- `tests/payloads/payload.test.js` — 16 tests: all 4 payloads valid JSON, non-empty, content records present, file size sanity.
- `tests/yaml/yaml.test.js` — 20 tests: all 4 configs parse, required keys, industry-specific content, key count sanity.
- `tests/smoke/smoke.test.js` — 74 tests: 11 root health files, 11 Phase 8 docs, 14 reference artifacts, 5 engine files, 2 data files, 14 components, 4 CI workflows, 3 GitHub templates, 6 accessibility marker tests (skip-link, aria-live, role=tablist/tab, aria-selected, aria-modal), 3 attribution scan tests.

**Total tests: 165, 0 failures.**

**Visual Documentation (`docs/visuals/`)**
- `docs/visuals/README.md` — Directory index with file listing.
- `docs/visuals/architecture-overview.md` — Text-art diagrams: 6-layer system stack, decision engine pipeline, deployment architecture, complete repository map.
- `docs/visuals/playground-walkthrough.md` — Annotated screen layout (ASCII), 5-panel descriptions, keyboard shortcuts table, screenshot capture guide (3 detailed guides for recommended screenshots).
- `docs/visuals/screenshot-placeholders.md` — Specifications for 7 screenshots + 1 animated GIF (deferred until stable deployment URL).

### Improved

**CI Workflows**
- `playground-build.yml` — Added component file verification (11 files), ErrorBoundary presence check, smoke test runner step.
- `markdown-lint.yml` — Upgraded to `markdownlint-cli2`, added `markdownlint.json` config reference, file count reporting.
- `schema-validation.yml` — Added YAML validation step (pyyaml), full test suite integration (schemas + payloads + YAML).
- `link-check.yml` — Added 301/302 alive codes, quiet mode, total file count reporting, improved config.
- `smoke-tests.yml` — New workflow running all 5 test suites on every push to main.

**Playground**
- `layout.jsx` — Improved metadata (keywords, description), `viewport` export, removed redundant skip-link from layout (now in page.jsx), `data-theme="dark"` default on `<html>`.
- `page.jsx` — Welcome state on first load showing all 5 scenarios as quick-launch buttons. Welcome dismissal on primitive change, scenario load, or reset. Reset restores Welcome state.
- `globals.css` — Welcome state styles (pg-welcome, pg-welcome-scenarios, pg-welcome-scenario-btn, pg-welcome-scenario-key, pg-welcome-hint). Mobile improvements: `100svh`, `-webkit-overflow-scrolling: touch`, pointer:coarse touch targets (44px min-height), hidden header stat on mobile, tab overflow scroll, 480px breakpoint improvements.

**Bug Fix**
- `playground/components/guardrail/PermissionGate.jsx` — Added `aria-modal="true"` to the `role="alertdialog"` container (required for AT to correctly scope the dialog).

**README**
- Added v1.0.0 version badge, tests badge (165 passing), CI badge (5 workflows).
- Added Release Status section with links to RELEASE_NOTES.md and VERSIONING.md.
- Added Testing section with npm test command.
- Updated phase status table to include Phase 9 as complete.
- Added GitHub Issues/Discussions links.

### Design Decisions (Phase 9)

**Welcome state vs. empty state**
The welcome state (shown on first load and after Reset) provides immediate orientation and quick access to all 5 scenarios without the user needing to find the scenario bar. It is dismissed on any interaction, so it never interrupts the workflow.

**Tests use Node.js built-in test runner**
No external test framework (Jest, Vitest, Mocha) is required. Node.js 18+ includes `node --test` with full `describe`/`it`/`assert` support. This keeps the test suite dependency-free except for `ajv` and `js-yaml`, which are already used in validation scripts.

**Screenshot capture is deferred**
Capturing screenshots from a local development server would produce OS-specific artifacts. The placeholder specifications are detailed enough for any contributor to produce consistent screenshots once the playground is deployed to a stable URL.

**165 tests as validation backbone**
The test suite validates the decision engine behavior, schema integrity, YAML config correctness, and repository structure. This provides a reliable regression check for future contributions and is a required pass condition in `RELEASE_CHECKLIST.md`.

### Validation Results (Phase 9)

- **Test suite:** 165 tests, 0 failures, 5 suites
- **Terminology scan:** CLEAN
- **Attribution scan:** CLEAN
- **Citation scan:** CLEAN
- **JSON schema validation:** CLEAN (4/4)
- **Example payload validation:** CLEAN (4/4)
- **YAML config validation:** CLEAN (4/4)
- **Playground build:** CLEAN (npm run build)
- **CI workflows:** 5 workflows present and syntactically valid
- **Markdown files:** 155+ files

---

## Phase 8 — Production Hardening & Open Source Release

**Status:** Complete
**Commits:** 30
**Goal:** Prepare the repository for production-quality open-source release. Improve usability, discoverability, documentation quality, developer experience, CI, accessibility, and release readiness. No new guardrail concepts introduced. No changes to the decision engine logic. No expansion of the pattern library.

### Added

**New Documentation (`docs/`)**
- `docs/getting-started.md` — Role-based quickstart for 5 reader types: implement, understand, adopt, validate, contribute. Includes playground 60-second setup, 3 foundational concepts, 7 key files to bookmark, and 4 common mistakes with fixes.
- `docs/architecture.md` — System overview with 6-layer stack diagram (ASCII), 4 decision engine sublayers, complete data flow, deployment architecture, machine-readable artifacts reference table, and 7 non-negotiable design constraints.
- `docs/glossary.md` — ~80 canonical definitions across: 10 decision primitives, 7 confidence states, 7 pattern categories, 5 severity levels, 36 patterns (alphabetical), engine terms, and implementation terms.
- `docs/faq.md` — 25+ questions and answers across: general, decision engine, patterns, components, implementation, and contributing sections.
- `docs/troubleshooting.md` — 15 common issues with cause and fix: engine issues (safe-refusal vs constrained-completion, policy-refusal, empty output, multiple warnings, emergency escalation), component issues (passive dismissal, ARIA, focus management, auto-grant, reasoning-trace), playground issues (startup, empty state, scenario loading), schema validation, and audit issues.
- `docs/navigation.md` — Complete file-level map of all 80+ files across every directory. Includes quick-lookup table for common tasks.
- `docs/project-structure.md` — Naming conventions, directory principles, layering rules, 6 "what goes where" entries, and checklist for adding new files.

**Architecture Diagrams (`docs/diagrams/`)**
- `docs/diagrams/architecture.md` — 4 Mermaid diagrams: system layers, deployment architecture, reference implementation architecture, and single-request sequence diagram.
- `docs/diagrams/decision-engine.md` — 4 Mermaid diagrams: engine overview with 14 rules, key selection rule conditions (R01/R04/R07/R08), default precedence order, and composition constraint visualization.
- `docs/diagrams/pattern-lifecycle.md` — 4 Mermaid diagrams: overall lifecycle, warning pattern lifecycle, refusal selection tree, and audit record structure.
- `docs/diagrams/state-transitions.md` — 4 Mermaid stateDiagram-v2 diagrams: P2 confidence state machine, pattern selection by P2×Risk, permission gate state machine, and escalation state machine.

**Project Health Files**
- `SECURITY.md` — In-scope/out-of-scope definitions, vulnerability reporting via GitHub Security Advisories, security considerations for implementers (passive dismissal, audit immutability, auto-grant prohibition, tenantId isolation, dependency security), 48-hour acknowledgment SLA.
- `SUPPORT.md` — Documentation quick links, GitHub Issues, GitHub Discussions, response expectation table, out-of-scope list.
- `CODE_OF_CONDUCT.md` — Expected/unacceptable behavior, enforcement mechanism, Contributor Covenant attribution.
- `ROADMAP.md` — Current state summary, 4 planned phases (Enterprise Playbooks, Regulated Industries, Extended Templates, Review/Release), explicit out-of-scope list, contribution pathway.

**GitHub Files (`.github/`)**
- `.github/ISSUE_TEMPLATE/bug_report.md` — Bug report template with 8-category location selector, reproduction steps, environment fields.
- `.github/ISSUE_TEMPLATE/feature_request.md` — Feature request template with 8-type selector, use-case description, contributing guide acknowledgment.
- `.github/PULL_REQUEST_TEMPLATE.md` — 7-type change selector, 4-section checklist (all contributions + pattern/component/playground/schema-specific), canonical terminology reminder.

**CI Workflows (`.github/workflows/`)**
- `markdown-lint.yml` — markdownlint-cli on all `.md` files. Relaxed rules: MD013 (line length), MD033 (inline HTML), MD041 (first heading). Triggers on push/PR to main when `.md` files change.
- `link-check.yml` — markdown-link-check on all `.md` files. Ignores `your-org` placeholder URLs and `localhost`. Weekly schedule (Monday 09:00 UTC). Retry-on-429 enabled.
- `playground-build.yml` — `npm ci` + `npm run build` in `playground/`. Verifies `.next` build output exists. Verifies all 5 engine module files and 2 data files are present. Triggers on push/PR to `playground/**`.
- `schema-validation.yml` — JSON syntax validation for all 4 schemas and all 4 example payloads using Python `json.tool`. Reports schema/payload counts. Triggers on push/PR to `reference/json/**` and `reference/examples/**`.

**Playground Components**
- `playground/components/ErrorBoundary.jsx` — React class component with `getDerivedStateFromError`, per-panel isolation (wraps PrimitiveControls, EnginePanel, ResultPanel), retry button, dev-only console.error, and engine-level null check with reload fallback.

### Improved

**README.md**
- Added shields.io badges (License, Phase, Patterns, Playground).
- Rewrote intro as a concise "what this is" with 5 bullets.
- Added 60-second Quick Start section with bash commands.
- Added role-based navigation table (designer/PM, engineer, architect, compliance, contributor, browser).
- Updated pattern categories table with per-category count and when-to-use.
- Added decision engine overview with ASCII pipeline diagram.
- Added interactive playground overview with 5-panel descriptions.
- Updated repository structure with all new Phase 8 files.
- Added implementation path (6-step sequence).
- Added industry support table with config and case study links.
- Updated phase status table to mark Phase 8 complete.

**CONTRIBUTING.md**
- Added quick links header (glossary, getting-started, SUPPORT, CODE_OF_CONDUCT).
- Added playground contribution rules (no new concepts, build verification, scenario stability).
- Added schema contribution rules (no field removal, documentation requirements, payload validation).
- Added first contribution suggestions (broken links, antipatterns, glossary entries, typos).

**Playground (`playground/`)**
- `page.jsx` — Keyboard shortcuts: 1–5 load scenarios, [ and ] cycle engine tabs, D toggles theme, R resets, ? shows keyboard help. Keyboard shortcut overlay (dialog with kbd elements, Escape to close). Loading state overlay (animated bar, main panel dim). Dark/light mode toggle button in header with aria-label. Scenario key number indicators. Named `ENGINE_TABS` constant for DRY tab management. ErrorBoundary wrapping for all 3 panels. Engine-level null check. Header stat as live region. Tabpanel with `tabIndex=0` for keyboard reachability. Improved aria-labels on all interactive elements.
- `globals.css` — Light mode token set (`[data-theme="light"]`). Dark mode default (`[data-theme="dark"]`). Keyboard overlay styles (`.pg-kbd-overlay`, `.pg-kbd-panel`, `kbd`). Loading bar animation. Scenario key indicator. Tab count badge. Audit clear button. Error boundary styles (`.pg-error-boundary`, retry button). Icon button (`.pg-icon-btn`). Tabpanel focus visible style. Loading dim animation on `[data-loading="true"] .pg-main`. High contrast mode additions.

### Validation Results (Phase 8)

- **Terminology scan:** CLEAN — no non-canonical terms detected in any markdown file
- **Attribution scan:** CLEAN — no co-author lines, no AI attribution
- **Citation scan:** CLEAN — no unverified external references
- **JSON schema validation:** CLEAN — 4/4 schemas valid JSON
- **Example payload validation:** CLEAN — 4/4 payloads valid JSON
- **Playground file check:** CLEAN — 5 engine modules, 2 data files, 14 components all present
- **Markdown file count:** 151 files across all directories
- **Pattern specification count:** 43 files in `patterns/`
- **Root health files:** 7 present (README, CHANGELOG, CONTRIBUTING, SECURITY, SUPPORT, CODE_OF_CONDUCT, ROADMAP)

### Design Decisions (Phase 8)

**Keyboard shortcuts use non-modifier keys**
The shortcuts (1–5, [, ], D, R, ?) are intercepted only when focus is not in an input, select, or textarea. This avoids conflicting with form field use while keeping the shortcuts accessible to keyboard users browsing the panels.

**Dark mode uses `data-theme` attribute on `<html>`**
Setting `data-theme` on the root element allows CSS selectors anywhere in the component tree to respond to theme changes without passing theme state through props. This is the correct pattern for application-wide theming in React without a context provider.

**Error boundaries are per-panel, not per-application**
Wrapping each panel individually means one panel's error does not affect the others. A user can continue viewing the audit trail and result panel if the primitive controls fail, and retry the failing panel independently.

**CI workflows use `--prefer-offline` / `npm ci`**
`npm ci` ensures reproducible installs from the lockfile. `--prefer-offline` reduces build time in environments where the cache is warm.

**Mermaid diagrams live in `docs/diagrams/`**
Diagrams are kept separate from narrative documentation so they can be updated independently. GitHub renders Mermaid fences natively in markdown files, making them zero-dependency.

---

## Phase 7 — Interactive Playground & Validation

**Status:** Complete
**Commits:** 23
**Goal:** Validate the entire repository by creating an interactive application that demonstrates the Guardrail Decision Engine. Users manipulate decision primitives (P1–P10) and observe in real time how the engine selects patterns, activates components, and generates an audit trail. No new guardrail concepts are introduced — the playground consumes existing taxonomy, pattern library, decision engine, component library, and reference configurations.

### Added

**Decision Engine (`playground/engine/`) — 5 modules:**
- `primitives.js` — Runtime definitions for all ten decision primitives (P1–P10): type (integer or enum), allowed values, level/state labels, color codes, descriptions, and documentation references. Sourced from `docs/decision-flows/decision-primitives.md`.
- `rules.js` — 14 selection rules (R01–R14) implementing the pattern selection engine. Each rule specifies: conditions, priority, terminatesEvaluation flag, onActivate() function (activated patterns, suppressed patterns, reason), and onSkip() function (skip reason). Rules implement the documented logic without duplicating pattern specifications.
- `evaluator.js` — Main `evaluate(primitives)` function. Evaluates all 14 rules in priority order; applies composition constraints; resolves primary selections (warning/refusal/recovery/escalation); builds component sequence; enriches primitive values with labels and colors; returns a complete engine result object.
- `schema-bridge.js` — Maps `reference/json/*.schema.json` contracts to runtime types. Primitive type contracts, pattern schema field mapping, component schema field mapping, policy schema field mapping, runtime `validatePrimitives()` function, schema source registry. Adds no logic of its own.
- `config-bridge.js` — Exposes `reference/yaml/*.yaml` configurations as JS runtime objects. Includes healthcare, finance, developer copilot, and industrial AI configs with risk thresholds, policy rules, escalation SLAs, and audit requirements. `getConfig(industry)` selector. `getSeverityForRisk(level, config)` helper.

**Pattern Registry (`playground/data/patterns.js`) — 36 patterns:**
All 36 pattern specifications (warning × 6, explanation × 6, permission × 6, uncertainty × 7, refusal × 7, escalation × 5, recovery × 5) registered as structured objects with: id, name, category, severity, specRef, and description. Severity color map and category color map for visualization.

**Scenarios (`playground/data/scenarios.js`) — 5 scenarios:**
- `healthcare` — Drug interaction query: P1=4, P2=low, P6=decision-support → constrained-completion + full LC disclosure stack. From `reference/yaml/healthcare-config.yaml` + case study 01.
- `finance` — AML wire transfer block: P1=4, P5=tenant → policy-refusal + emergency-escalation (terminates evaluation). From `reference/yaml/finance-config.yaml` + case study 02.
- `developer-copilot` — Conflicting security evidence: P2=conflicting, P1=3 → safe-refusal + reasoning-trace + source-citation. From `reference/yaml/developer-copilot-config.yaml` + case study 03.
- `industrial-ai` — Unresolvable sensor conflict: P2=unresolvable, P1=4 → emergency-escalation + abandon-recovery. From `reference/yaml/industrial-ai-config.yaml` + case study 04.
- `customer-support` — Insufficient information billing dispute: P2=insufficient → clarification-request → human-handoff.

**UI Components (`playground/components/`) — 13 components:**
- `PrimitiveControls.jsx` — Renders all 10 primitive controls. Range sliders with pip visualizations for P1/P8/P10 (integer). Select dropdowns for P2–P7/P9 (enum). Color-coded value badges. Real-time update on every change.
- `EnginePanel.jsx` — Five-tab engine visualization:
  - Rules tab: each rule card shows status (ACTIVATED/SKIPPED/NOT_EVALUATED), reasoning, activated patterns (green chips), suppressed patterns (struck-through chips), doc reference. Expandable. Activated rules shown first.
  - Patterns tab: activated patterns grouped by category, primary selections table, component sequence.
  - Composition tab: applied constraints, violations, global invariants list.
  - States tab: delegates to StateTransitionViz.
  - Flow tab: delegates to PipelineFlow + CompositionViz.
- `ResultPanel.jsx` — Renders all activated guardrail components in activation order with component/variant header and severity label. Falls back to empty-state message for zero-pattern scenarios.
- `AuditPanel.jsx` — Chronological audit event list with time, event type, pattern reference, component reference, and severity badge.
- `PipelineFlow.jsx` — Horizontal 5-step pipeline visualization: Primitives → Rule Evaluation → Pattern Selection → Composition → Components. Active steps highlighted.
- `StateTransitionViz.jsx` — P2 confidence state machine diagram: all 7 states, current state highlighted, valid outgoing and incoming transitions with labels, state prohibitions (e.g., "CE: constrained-completion is forbidden").
- `CompositionViz.jsx` — Pattern composition layer: raw selection → composition constraints → resolved patterns. Applied constraints detail, precedence order from `reference/config/default-policy.md`.

**Guardrail component renderers (`playground/components/guardrail/`) — 6 components:**
Playground-adapted versions of the reference implementations in `reference/react/`:
- `WarningBanner.jsx` — Severity-based ARIA roles (role=status, alert, alertdialog), color tokens, variant messages.
- `ConfidenceBadge.jsx` — Four variants: detailed confidence disclosure, limitation disclosure, source citation (with stale indicators), reasoning trace (with step list).
- `RefusalCard.jsx` — Seven variants: policy, safe, constrained, partial, clarification, alternative, handoff.
- `RecoveryPrompt.jsx` — Four variants: redirect, retry, repair, abandon. Interactive action buttons emit audit events.
- `PermissionGate.jsx` — deny-first tab order (autoFocus on Deny), scoped and one-time variants, interactive buttons emit audit events.
- `EscalationCard.jsx` — Three variants: emergency (critical severity, contained), role, async. Self-authorizing label for emergency variant.

**Application (`playground/app/`) — 3 files:**
- `layout.jsx` — Root Next.js layout with skip-link for keyboard accessibility.
- `page.jsx` — Main page. Manages primitive state (10 primitives), active scenario, audit log (capped at 100 events). Engine runs via `useMemo` on every primitive change. Scenario loader populates primitives and resets audit. 5-tab engine panel.
- `globals.css` — Full design token set (severity surfaces, spacing, typography, radius, elevation, z-index). Dark theme playground tokens. 4-panel CSS Grid layout. Responsive breakpoints (1280/1024/768/480px). Focus styles (WCAG 2.1 AA). Skip-link. `sr-only` utility. `prefers-reduced-motion` fallback. `forced-colors` high-contrast support.

**Documentation:**
- `playground/README.md` — Layout guide, engine architecture, scenario table, file structure, accessibility compliance, design decisions, local setup instructions.

### Design decisions

**No new guardrail concepts.** Every rule ID, pattern name, and category in the playground maps to an existing specification. The playground is a runtime consumer, not a new specification layer.

**Deny-first tab order demonstrated.** `PermissionGate.jsx` receives `autoFocus` on the Deny button and lists it first in tab order. Documented in `components/permission/component-spec.md`.

**Early termination is transparent.** When a `terminatesEvaluation` rule activates (R01 Policy Block, R02 Emergency Unresolvable), subsequent rules show `NOT_EVALUATED` status in the Rules tab with a clear label explaining why.

**CE ≠ LC enforced in rules.** R05 (Conflicting Evidence at Risk≥3) activates safe-refusal. R07 (Low Confidence + decision-support) activates constrained-completion. These are distinct rules that cannot be confused.

**Static examples are acceptable.** The playground runs entirely client-side with no authentication or backend. All decision engine logic is deterministic pure JavaScript.

### Known gaps

- The playground does not validate against the JSON schemas at runtime (schema-bridge.js provides the contracts but does not import the actual `.schema.json` files, which would require bundler configuration for JSON imports).
- The `reference/yaml/*.yaml` files are not parsed at runtime — config-bridge.js provides equivalent JS objects. A production implementation would use `js-yaml` or a similar parser.
- No persistence between sessions (audit log resets on page reload).

---

## Phase 6 — Developer SDK & Reference Implementation

**Status:** Complete
**Commits:** 25
**Goal:** Turn the design system into something developers can immediately implement. This phase created machine-readable schemas, deployment configurations, reference component implementations, and complete example payloads. It introduced no new guardrail concepts — all artifacts consume the existing Pattern Library, Decision Engine, and Component Library.

### Added

**JSON schemas (`reference/json/`) — 4 schemas:**
- `patterns.schema.json` — Validates guardrail pattern configuration objects. Fields: id (kebab-case), category (7 canonical categories), triggers (primitive-based activation conditions), severity (5 levels), component (maps to component names in `components/`), auditRequired, auditFields, mutuallyExclusive, compositionPrecedence, relatedPatterns. Includes two complete examples.
- `decision-engine.schema.json` — Validates decision engine configuration. Defines structures for all ten decision primitives (P1–P10) as `$defs`, selection rules, precedence order, composition constraints, state transition maps, and audit configuration.
- `component.schema.json` — Validates component configuration objects. Fields: id (PascalCase, matching `components/*/component-spec.md`), patternId, variants, props, states (12 canonical states), accessibilityRole (ARIA roles), ariaLive, focusBehavior (trap, initialFocus, returnFocus), designTokens (CSS custom property references), motion, responsive, auditIndicator, callbacks. BlockingWarning complete example included.
- `guardrail-policy.schema.json` — Validates deployment policy documents. Fields: policyId, version, level (tenant/deployment), industry (11 classifications), riskThresholds, confidenceThresholds, permissionConfig, rules (ordered policy rule array), escalationConfig, auditRequirements (retentionDays, soxCompliance, hipaaCompliance, requiredPatternAuditFields), accessibilityRequirements. Finance fraud policy example included.

**YAML configurations (`reference/yaml/`) — 4 configs:**
- `healthcare-config.yaml` — Clinical AI deployment policy. Tighter confidence thresholds (HC=0.93, unresolvableWindow=120s, staleThreshold=7d). Constrained-completion preferred over safe-refusal for decision-support intent. Mandatory claim-level source citation at Risk≥2. Role escalation offered (not forced). HIPAA compliance. 7-year retention.
- `finance-config.yaml` — Tenant-level fraud prevention. Three concurrent policy rules for international wire fraud. Emergency escalation concurrent with customer block. Redirect-only recovery (retry suppressed for blocked transactions). Customer-facing limitation disclosure to preserve trust. 7-year retention.
- `developer-copilot-config.yaml` — CE state forces safe-refusal (not constrained-completion) for security library queries. Reasoning trace required for all CE-state refusals. Claim-level source citation with staleness indication per claim. Internal security advisory weighted as higher authority than vendor docs. Redirect to internal security process (not role escalation).
- `industrial-ai-config.yaml` — Tenant-level safety policy. Very tight thresholds (HC=0.95, unresolvableWindow=30s, staleThreshold=0 days — real-time only). Conservative threshold policy: treat any above-threshold reading as real during UR state. Mandatory abandon-recovery after UR state. Explicit operator reset required before AI resume. Audible alert required. 10-year retention.

**Configuration reference (`reference/config/`) — 5 documents:**
- `default-policy.md` — Default values for all configurable settings (risk thresholds, confidence thresholds, permission, escalation SLAs, audit, accessibility). Override process. Precedence order. Composition rules. Values that cannot be overridden.
- `severity-mapping.md` — Complete mapping of 5 severity levels to design tokens, ARIA roles, aria-live, focus trap, entrance duration, z-index, audit level, and behavioral rules. Severity-to-pattern mapping table (36 patterns). Progressive warning escalation table.
- `risk-thresholds.md` — P1 risk level definitions (0–4). Pattern activation per risk level. Industry-specific risk calibration table (Healthcare, Financial, Industrial, Developer). Risk × Confidence compound outcome table.
- `confidence-mapping.md` — All 7 P2 confidence states: definitions, thresholds, components, disclosure depth, state transition rules. CE vs LC distinction (critical for refusal type selection). State transition diagram. Industry-specific threshold recommendations.
- `permission-mapping.md` — P4 permission states. Authority tier definitions (P8). All 6 permission pattern types with scope, expiry, and audit requirements. 6 invariant rules (cannot be overridden). Permission lifecycle state machine.

**React reference implementations (`reference/react/`) — 6 components:**
- `WarningBanner.jsx` — severity variants (informational/advisory/caution/blocking/critical), ARIA role selection, aria-live politeness, focus management on modal variants, auto-dismiss, audit callbacks on mount/acknowledge/dismiss. Three usage examples from case studies.
- `PermissionGate.jsx` — Focus trap, deny-first Tab order (invariant), Escape=passive-dismissal=denial (invariant), overlay backdrop click=denial, delegated variant, audit callbacks for GRANTED/DENIED/PASSIVE_DISMISSAL. Focus returns to trigger element on close.
- `ConfidenceBadge.jsx` — Seven P2 confidence states, three disclosure depths (surface/standard/detailed), stale compound indicator, source list with per-claim staleness markers, expand/collapse control with aria-expanded. Two usage examples (LC+stale healthcare, CE developer copilot).
- `RefusalCard.jsx` — Seven refusal variants, first path-forward action receives focus on mount, "None of these" always present on alternative lists, exclusion notice never collapsed, clarification form with structured fields, human handoff button, audit callbacks. Safe-refusal CE example included.
- `RecoveryPrompt.jsx` — Five recovery variants, override requires explicit acknowledgment checkbox (confirm button disabled until checked), redirect option list, repair form, abandon exit, audit callbacks for all state transitions. Override example from procurement case study.
- `EmergencyEscalationOverlay.jsx` — Full keyboard capture (capture phase), Escape suppressed (no dismiss without acknowledgment), assertive aria-live, audit event fired on mount (not just on acknowledge), aggressive entrance animation with prefers-reduced-motion fallback. Industrial AI example included.

**Next.js reference page (`reference/nextjs/`) — 1 file:**
- `GuardrailDemo.jsx` — Full-pipeline demonstration: primitive input form (P1–P7) → `evaluatePrimitives()` selection engine → activated pattern list → component rendering → audit log. Preset scenario buttons for 5 case studies (healthcare, banking, insurance, developer copilot, industrial). Self-contained `evaluatePrimitives()` function documents all selection rules inline with references to `docs/decision-flows/pattern-selection-engine.md`.

**Example JSON payloads (`reference/examples/`) — 4 files:**
- `healthcare-payload.json` — Drug interaction query: LC+stale→constrained-completion+role-escalation. Complete request, primitive evaluation, engine execution (activated + skipped rules), pattern list, component sequence, output, audit record.
- `finance-payload.json` — Fraud block: policy-refusal + concurrent emergency escalation. Three matched policy rules, customer-facing vs. internal component separation, redirect-only recovery, complete audit with transaction details.
- `developer-copilot-payload.json` — CE state safe-refusal: conflict details per source, reasoning trace, claim-level attribution, alternatives. Skipped rules explained (CE≠LC for refusal type).
- `industrial-ai-payload.json` — UR state emergency: state transition timeline (CE at T+0, UR at T+30s, escalation at T+252s), full sensor context, resolution record (supervisor arrived, false positive confirmed, sensor B faulted), 10-year retention.

**Reference README (`reference/README.md`):**
- Directory layout, usage instructions per artifact type, source of truth table mapping each artifact to its authoritative design system document.

### Changed

- `docs/index.md` — Added "I want to implement the system in code" navigation path. Reference implementations added to Documentation Status table.
- `README.md` — Phase 6 marked complete. Implementation navigation path added for engineers. Roadmap updated (Phases 7+ renumbered). Phase 6 roadmap description added.
- `CHANGELOG.md` — This entry.

### Key design decisions

1. **Schemas validate, not duplicate.** The JSON schemas validate configuration objects against the existing taxonomy and specification names. They do not contain specification content — they reference it via `specRef` and use enumerated values derived from the canonical taxonomy.
2. **YAML configurations override defaults, not replace them.** Each industry config only specifies values that differ from the default policy. This makes the delta between industry contexts legible and the default-policy.md a stable reference.
3. **React examples are reference implementations, not production components.** They demonstrate props, states, accessibility, tokens, and design decisions. They are not optimized for performance, bundle size, or TypeScript. Teams should adapt them to their framework conventions.
4. **The Next.js demo page implements the selection engine in code.** `evaluatePrimitives()` is a simplified but functionally complete implementation of `docs/decision-flows/pattern-selection-engine.md`. It is not a stub — it produces different component sets for different primitive combinations. It can serve as a starting point for an internal guardrail testing tool.
5. **Example payloads include resolution records.** The industrial-ai-payload.json includes the full resolution: supervisor arrived at T+7m34s, thermocouple lead found loose, false positive confirmed. This demonstrates the audit trail continues after the AI's involvement ends.

### Known gaps

- Schemas are JSON Schema draft 2020-12 — validation tooling compatibility should be verified for your environment.
- React examples use plain JSX without TypeScript. TypeScript type definitions are not included.
- The `evaluatePrimitives()` selection engine in GuardrailDemo.jsx is simplified. It implements the primary selection rules but not all composition and precedence engine nuances.
- No test files or schema validation test suite included — planned for Phase 9.

---

## Phase 5 — Reference Implementations & Case Studies

**Status:** Complete
**Commits:** 15
**Goal:** Validate the Guardrail Decision Engine, Pattern Library, and Component Library through complete end-to-end reference implementations in realistic enterprise AI product contexts. This phase introduced no new guardrail concepts — it exercised the existing 36 pattern specifications and 6-document decision engine.

### Added

**Case study framework:**
- `docs/case-studies/README.md` — Canonical case study framework: purpose, scope boundaries (not new patterns, not wireframes), standard 11-section structure, case study index, coverage notes. All eight case studies listed with primary patterns and files.

**Eight industry case studies (all stable):**
- `docs/case-studies/healthcare-ai.md` — Drug interaction query in a clinical decision support system. Demonstrates: LC + stale-context state compounding, constrained-completion (not safe-refusal) for decision-support intent, claim-level source citation, role escalation offered (not forced). Key design decision: intent = decision-support allows partial output when intent = action-execution would not.
- `docs/case-studies/banking-fraud.md` — Real-time fraud block for an international wire transfer. Demonstrates: policy-refusal (three simultaneous tenant-level rule matches), concurrent emergency escalation to fraud ops and policy warning to customer, redirect recovery (human-gated). Key design decision: customer-facing severity decoupled from internal escalation severity.
- `docs/case-studies/insurance-claims.md` — Claims processing with two required documents absent. Demonstrates: insufficient-information-state (not LC), partial-completion, clarification-request with policy-anchored documentation list, async-review-escalation with defined SLA, repair recovery with document quality validation on re-entry. Key design decision: II state forces clarification-request, not constrained-completion.
- `docs/case-studies/enterprise-hr.md` — PIP letter generation with scope boundary violation and stale data. Demonstrates: simultaneous scoped-permission (scope boundary) and stale-context signals, precedence engine resolving permission gate before stale disclosure, delegated-permission lifecycle with scope+expiry+purpose, constrained-completion with explicit placeholders. Key design decision: two guardrail conditions resolved in priority order, not simultaneously.
- `docs/case-studies/customer-support.md` — Billing dispute across three turns with escalating sentiment. Demonstrates: progressive-warning escalation across session turns, modal-warning as session-level escalation confirmation, human-handoff (refusal) with full context transfer, retry-recovery as the optional alternative to handoff. Key design decision: "hasn't been able to locate" vs. "no record" preserves trust when data access may be incomplete.
- `docs/case-studies/developer-copilot.md` — Security library selection with directly contradictory CVE evidence. Demonstrates: conflicting-evidence-state (not LC), safe-refusal (no recommendation), reasoning-trace explaining what would resolve the conflict, claim-level source citation for contradictory claims, alternative-suggestion, redirect-recovery. Key design decision: CE produces safe-refusal; LC produces constrained-completion — the distinction is the presence of irreconcilable sources, not the quantity of evidence.
- `docs/case-studies/industrial-ai.md` — Chemical reactor sensor conflict sustained for 4+ minutes. Demonstrates: CE → UR state transition, system-initiated trigger (no user request), emergency escalation in interrupt mode (concurrent with operator panel), abandon-recovery mandatory in UR state at Risk=4, explicit operator reset required before AI resumes. Key design decision: false positive emergency response is the correct outcome for UR state in safety-critical contexts.
- `docs/case-studies/autonomous-procurement.md` — AI agent purchase exceeds $25,000 spend ceiling due to spot pricing. Demonstrates: blocking-warning as authorization gate for autonomous agent, role-escalation with full context (business urgency, pricing anomaly), async-review-escalation triggered by SLA expiry, manual-override-recovery with transaction-scoped authorization, SOX audit flag. Key design decision: override authorization is per-transaction; the agent's authorization ceiling does not change after an approved exception.

**Cross-industry analysis:**
- `docs/case-studies/comparison-matrix.md` — Cross-industry comparison across 8 dimensions: primary trigger, confidence state, primary refusal pattern, escalation path, recovery flow, audit level, deployment notes. Full 36-pattern coverage matrix (33 of 36 patterns exercised). Escalation comparison table. Recovery comparison table. Audit level comparison. Accessibility notes per case study. Coverage gap documentation for the 3 unexpercised patterns.

**Updated index:**
- `docs/case-studies/index.md` — Replaced Phase 1 scaffold with Phase 5 stable index: case study table with industry, risk, primary patterns, and file. Phase status table. Canonical structure summary.

### Changed

- `docs/index.md` — Updated Case Studies section description with full list of case studies and primary patterns. Added "I want to validate an implementation" navigation path. Updated Documentation Status table: Case Studies = ✅ Complete.
- `README.md` — Phase 5 marked complete in phase status table. Added case studies navigation path for enterprise architects and validating engineers. Updated roadmap section with Phase 5 description and Phase 6+ renumbering.
- `CHANGELOG.md` — This entry.

### Key design decisions

1. **Each case study exercises different parts of the system.** No two case studies share the same primary confidence state, primary escalation path, or primary recovery flow. The case study set is designed to provide distinct reference points, not redundant examples.
2. **System-initiated triggers are given explicit treatment.** Two case studies (Industrial AI, Procurement) use system-initiated triggers rather than user requests. The primitive evaluation and user journey sections are adapted to reflect the autonomous agent context.
3. **Lessons learned focus on non-obvious interactions.** Each case study's lessons learned section identifies design decisions that are not derivable by reading the pattern specifications alone — compound primitive signals, unexpected precedence interactions, and deployment configuration requirements.
4. **Pattern coverage gaps are documented honestly.** The comparison matrix names the 3 unexpercised patterns (decision-summary, structured-uncertainty-disclosure, one-time/session/persistent-permission, revocation, human-handoff escalation, system-escalation) and explains why they are not covered in this phase.

### Known gaps

- 8 of 36 pattern specifications are not exercised in Phase 5 case studies (see comparison matrix coverage gap documentation).
- Case studies are implementation-agnostic — no code examples, no specific stack bindings.
- Consumer product contexts (individual users, non-enterprise deployments) are not covered in Phase 5.
- Cross-session and multi-system orchestration scenarios are deferred to Phase 8.

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
