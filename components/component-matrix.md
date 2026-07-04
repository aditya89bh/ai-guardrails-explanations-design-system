# Component Matrix

**Document type:** Component library — overview matrix
**Phase:** 4
**Status:** stable

---

## Purpose

The component matrix maps every guardrail pattern to its implementing component(s), defining the key attributes each component must satisfy. Use this matrix to:

- Identify which component to implement for a given pattern
- Understand the decision engine rules that drive each component
- Verify that all accessibility, motion, and responsive requirements are covered
- Cross-reference components across categories during integration planning

---

## Warning Components

| Pattern | Component | Input (key props) | Output (key callbacks) | States | A11y requirement | Motion | Responsive | Decision engine rule |
|---|---|---|---|---|---|---|---|---|
| `inline-warning` | `InlineWarning` | `severity`, `message`, `dismissible` | `onDismiss`, `onAction` | default, expanded, dismissed | `role="status"`, `aria-live="polite"` | Fade + 4px slide | Full-width on `xs` | Selection engine § Warning — inline trigger |
| `modal-warning` | `ModalWarning` | `severity`, `title`, `message`, `actions[]` | `onAction`, `onDismiss` | default, loading, resolved | `role="alertdialog"`, focus trap | Scale fade 400ms | Full-screen on `xs`/`sm` | Selection engine § Warning — modal trigger |
| `ambient-warning` | `WarningBanner` (ambient variant) | `severity`, `message` | none (persists) | active, resolved | `role="status"`, `aria-live="polite"` | Long fade 600ms | Always full-width | Selection engine § stale/ongoing condition |
| `blocking-warning` | `BlockingWarning` | `severity`, `title`, `message`, `actions[]` | `onAction` | active, resolved | `role="alertdialog"`, full focus trap | Overlay + card 400ms | Full-screen all viewport | Precedence engine § blocking > modal |
| `progressive-warning` | `WarningBanner` (progressive variant) | `severity`, `progressionLevel`, `message` | `onDismiss`, `onAction` | level 1–3 | `role="alert"` on escalation, `aria-live="assertive"` | Level-keyed styling | Full-width all viewport | Selection engine § progressive escalation rule |
| `policy-warning` | `PolicyWarning` | `policyId`, `policyLabel`, `severity` | `onDismiss`, `onAction` | active, acknowledged | `role="alertdialog"` | Modal entrance 400ms | Full-screen on `xs`/`sm` | Selection engine § Policy (P5) = match |

---

## Explanation Components

| Pattern | Component | Input (key props) | Output (key callbacks) | States | A11y requirement | Motion | Responsive | Decision engine rule |
|---|---|---|---|---|---|---|---|---|
| `confidence-disclosure` | `ConfidenceBadge` | `confidenceLevel`, `tooltipContent` | `onMount` | default, tooltip-open | `aria-label`, `role="tooltip"` | Fade 100ms | Inline; bottom sheet on `xs` | Selection engine § confidence < threshold |
| `source-citation` | `SourceList` | `sources[]` | `onSourceClick` | collapsed, expanded, loading, empty | `aria-expanded`, source list semantics | Expand 200ms | Single column `xs`/`sm` | Selection engine § P10 ≤ 2 |
| `reasoning-trace` | `ReasoningTrace` | `traceSteps[]` | `onExpand` | collapsed, expanded, loading | `aria-expanded`, ordered list | Expand 200ms | Collapsed default on `xs` | Selection engine § compliance/high-stakes |
| `decision-summary` | `DecisionSummary` | `decisionStatement`, `factors[]`, `sources[]` | `onExpand` | collapsed, expanded | `aria-label="Decision summary"` | Standard entrance 300ms | 2-col on `md`+ | Selection engine § multi-step AI decision |
| `limitation-disclosure` | `LimitationDisclosure` | `limitationMessage`, `limitationDepth` | `onMount` | default, expanded | `role="note"` | Standard entrance 300ms | Full-width all | Selection engine § structural capability boundary |
| `structured-uncertainty-disclosure` | `StructuredUncertaintyCard` | `confidenceLevel`, `sources[]`, `limitationMessage` | `onExpand`, `onSourceClick` | default, expanded | Composite ARIA | Standard entrance 300ms | Stacked sections `xs` | Precedence § supersedes confidence + limitation |

---

## Permission Components

| Pattern | Component | Input (key props) | Output (key callbacks) | States | A11y requirement | Motion | Responsive | Decision engine rule |
|---|---|---|---|---|---|---|---|---|
| `one-time-permission` | `PermissionGate` (one-time) | `gateId`, `actionLabel`, `rationale`, `auditId` | `onGrant`, `onDeny`, `onDismiss` | waiting, granted, denied, expired | `role="dialog"`, focus trap, deny-first tab | Deliberate entrance 400ms | Bottom sheet `xs`/`sm` | Selection engine § one-time gate trigger |
| `session-permission` | `PermissionGate` (session) | `gateId`, `actionLabel`, `duration="session"`, `auditId` | `onGrant`, `onDeny` | waiting, granted, denied | Same as one-time | Same | Same | Selection engine § recurring in-session |
| `persistent-permission` | `PermissionGate` (persistent) | `gateId`, `actionLabel`, `duration="persistent"`, `auditId` | `onGrant`, `onDeny` | waiting, granted, denied | Same | Same | Same | Selection engine § cross-session pattern |
| `scoped-permission` | `ScopedPermissionGate` | `gateId`, `actionLabel`, `scope`, `auditId` | `onGrant`, `onDeny` | waiting, granted, denied | `role="dialog"`, scope list semantics | Same | Bottom sheet + scope stagger | Selection engine § bounded resource scope |
| `delegated-permission` | `DelegatedPermissionRequest` | `gateId`, `delegateRole`, `delegateStatus`, `auditId` | `onCancel`, `onDelegateStatusChange` | pending, approved, denied, expired | `role="status"`, `aria-live="polite"` | Standard entrance 300ms | Full-width card | Selection engine § third-party authorization |
| `revocation` | `PermissionRevocationNotice` | `revocationReason`, `auditId` | `onDismiss` | active | `role="alert"`, `aria-live="assertive"` | Standard entrance + assertive | Full-width banner | Precedence § revocation is terminal |

---

## Uncertainty Components

| Pattern | Component | Input (key props) | Output (key callbacks) | States | A11y requirement | Motion | Responsive | Decision engine rule |
|---|---|---|---|---|---|---|---|---|
| `high-confidence-state` | None required (passive indicator optional) | `confidenceLevel="high"` | none | active | `aria-label` if shown | None | N/A | Selection engine § HC — no pattern required |
| `moderate-confidence-state` | `UncertaintyIndicator` | `state="moderate"`, `confidenceLevel` | `onMount` | active | `aria-label`, tooltip | Fade 100ms | Inline | Selection engine § MC trigger |
| `low-confidence-state` | `UncertaintyIndicator` | `state="low"`, `confidenceLevel` | `onMount` | active | `aria-label`, tooltip | Fade 100ms | Inline | Selection engine § LC ≤ low floor |
| `conflicting-evidence-state` | `ConflictingEvidenceCard` | `conflictingEvidence`, `nextOptions[]` | `onNextOptionSelect` | active, resolved | Section with headings, 2-col | Standard entrance 300ms | Single-col `xs`/`sm` | Selection engine § conflicting sources |
| `insufficient-information-state` | `UncertaintyIndicator` + `LimitationDisclosure` | `state="insufficient"` | `onMount` | active | `aria-label`, `role="note"` | Fade 100ms | Inline | Selection engine § retrieval returns nothing |
| `stale-context-state` | `StaleContextBadge` | `staleness`, `auditId` | `onRefresh` | active, refreshing, resolved | `role="img"`, `aria-label` | Fade 100ms | Inline; abbreviated on `xs` | P9 = stale |
| `unresolvable-state` | `UnresolvableStateCard` | `unresolvableReason`, `nextOptions[]` | `onNextOptionSelect` | active, escalated | `role="alert"`, `aria-live="assertive"` | Deliberate 400ms | Full-width; options stacked `xs` | State machine § UR terminal state |

---

## Refusal Components

| Pattern | Component | Input (key props) | Output (key callbacks) | States | A11y requirement | Motion | Responsive | Decision engine rule |
|---|---|---|---|---|---|---|---|---|
| `safe-refusal` | `RefusalCard` (safe) | `refusalId`, `refusalReason`, `auditId` | `onMount` | active | `role="alert"`, `aria-live="assertive"` | Standard 300ms | Full-width | Precedence § safe-refusal > others |
| `policy-refusal` | `RefusalCard` (policy) | `refusalId`, `policyId`, `policyLabel`, `auditId` | `onMount`, paths | active | `role="alert"` | Standard 300ms | Full-width | P5 = match |
| `partial-completion` | `PartialCompletionCard` | `completedOutput`, `excludedItems[]`, `auditId` | `onAlternativeSelect` | active | Section semantics | Staggered reveal | Single-col | Selection engine § multi-part mixed |
| `constrained-completion` | `ConstrainedCompletionCard` | `completedOutput`, `constraints[]`, `auditId` | `onMount` | active | `role="note"` on constraint notice | Standard 300ms | Full-width | Selection engine § completable with modification |
| `alternative-suggestion` | `AlternativeSuggestionCard` | `alternatives[]`, `auditId` | `onAlternativeSelect`, `onNoneSelect` | active, selected | `role` per item, none-option required | Stagger 100ms/item | 2-col `md`+ | Selection engine § incapable + alternatives exist |
| `clarification-request` | `ClarificationRequest` | `clarificationQuestion`, `auditId` | `onClarificationSubmit` | active, submitted | `role="dialog"` or inline section, focus to input | Moderate 200ms | Full-width; options stacked | Selection engine § underspecified |
| `human-handoff` (refusal) | `HumanHandoffCard` | `handoffReason`, `handlerRole`, `handoffStatus`, `auditId` | `onHandoffConfirm` | routing, connected, failed | `role="status"`, live updates | Standard 300ms | Full-width | Selection engine § human expertise required |

---

## Escalation Components

| Pattern | Component | Input (key props) | Output (key callbacks) | States | A11y requirement | Motion | Responsive | Decision engine rule |
|---|---|---|---|---|---|---|---|---|
| `human-handoff` (escalation) | `HumanHandoffPanel` | `escalationId`, `contextSummary`, `handlerRole`, `referenceId`, `auditId` | `onStateChange`, `onWithdraw` | routing → resolved | `role="status"`, `aria-live="polite"` | Standard 300ms | Full-width card | Precedence § escalation > refusal |
| `role-escalation` | `RoleEscalationCard` | `escalationId`, `approvalStatement`, `roleChain`, `auditId` | `onStateChange`, `onWithdraw` | pending → approved/denied | `role="status"`, `aria-live="polite"` | Standard 300ms | Role chain vertical `xs` | Selection engine § authority ceiling |
| `system-escalation` | `SystemEscalationNotice` | `escalationId`, `escalationReason`, `auditId` | `onStateChange` | pending → resolved | `role="status"` | Standard 300ms | Full-width banner | Selection engine § system authority gap |
| `emergency-escalation` | `EmergencyEscalationOverlay` | `escalationId`, `emergencyDetails`, `auditId` | `onAcknowledge` | NOTIFYING → ACKNOWLEDGED | `role="alertdialog"`, full keyboard capture | Aggressive 400ms | Full-screen all | Precedence § emergency > all |
| `async-review-escalation` | `AsyncReviewStatus` | `escalationId`, `reviewSummary`, `submittedAt`, `slaDeadline`, `auditId` | `onWithdraw`, `onStateChange` | IN_REVIEW → resolved | `role="status"`, `aria-live="polite"` | Fast 100ms | Bottom bar `xs`/`sm` | Selection engine § non-immediate review |

---

## Recovery Components

| Pattern | Component | Input (key props) | Output (key callbacks) | States | A11y requirement | Motion | Responsive | Decision engine rule |
|---|---|---|---|---|---|---|---|---|
| `retry-recovery` | `RetryPrompt` | `recoveryId`, `failureSummary`, `retryAttempt`, `retryLimit`, `auditId` | `onRetry` | offered, executing, succeeded, failed | `role="status"`, attempt counter in `aria-label` | Standard 300ms | Full-width; buttons stacked `xs` | State machine § TRIGGERED → retry |
| `redirect-recovery` | `RedirectSuggestion` | `recoveryId`, `alternatives[]`, `userGoal`, `auditId` | `onAlternativeSelect`, `onNoneSelect` | offered, selected | Section, none-option required | Stagger 100ms/item | 2-col `md`+ | State machine § redirect cascade |
| `repair-recovery` | `RepairCard` | `recoveryId`, `issueStatement`, `repairType`, `auditId` | `onRepairValidate` | offered, executing, succeeded, failed | `role="form"`, standard form semantics | Standard 300ms | Full-width; fields full-width | State machine § repair cascade |
| `manual-override-recovery` | `OverrideConfirmation` | `recoveryId`, `overrideStatement`, `overrideScope`, `auditId` | `onOverrideConfirm` | waiting, confirmed | `role="dialog"`, checkbox gate, focus trap | Deliberate 400ms | Bottom sheet `xs`/`sm` | Precedence § override only by authorized |
| `abandon-recovery` | `AbandonExit` | `recoveryId`, `savedItems[]`, `unsavedItems[]`, `reentryPath`, `auditId` | `onAbandon` | offered, abandoned | Section, saved/unsaved lists labeled | Moderate 200ms | Full-width; exit button full-width | State machine § ABANDONED terminal |
