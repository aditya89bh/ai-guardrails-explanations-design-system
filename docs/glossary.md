# Glossary

Canonical definitions for all terms used in this design system. When writing documentation, specifications, configuration files, or audit records, use only these terms. Do not introduce synonyms.

Terms are listed alphabetically within sections.

---

## Decision Primitives

**Authority (P8)**
The user's authorization tier for consequential decisions. Integer 1–3. Tier 1: standard user. Tier 2: supervisor or licensed professional. Tier 3: admin or executive. Distinct from P4 Permission — Authority describes the user's organizational role, not their authorization status for a specific action.

**Business Impact (P7)**
Organizational consequence of the AI action if incorrect. Enum: `low` / `medium` / `high`. Distinct from P1 Risk — Risk describes harm to the end user or third parties; Business Impact describes organizational consequence.

**Capability (P3)**
Whether the AI system can complete the requested action. Enum: `capable` / `partial` / `incapable`. Incapable represents a hard capability boundary — not a confidence issue.

**Confidence (P2)**
The AI's epistemic state about the accuracy and completeness of its output. Enum with 7 states: `high` / `moderate` / `low` / `conflicting` / `insufficient` / `stale` / `unresolvable`. This is not a simple score — some states (CE, II) represent structural issues, not score degradation.

**Context Freshness (P9)**
Whether the AI's knowledge and data are current for this query. Enum: `fresh` / `stale`. Staleness compounds with P2 confidence state.

**Intent (P6)**
The category of action the user is requesting. Enum: `decision-support` / `action-execution` / `content-generation` / `workflow-automation`. Critical for LC state pattern selection: decision-support allows constrained-completion; action-execution requires safe-refusal.

**Permission (P4)**
Whether the requesting user is authorized for the requested action. Enum: `authorized` / `partial` / `unauthorized`. Distinct from P8 Authority — Permission is action-specific; Authority is role-based.

**Policy (P5)**
Whether a configured policy rule matches the current interaction. Enum: `none` / `deployment` / `tenant`. Tenant-level policy match terminates all other rule evaluation.

**Risk (P1)**
Consequence severity if the AI output is incorrect or the action fails. Integer 0–4. 0=None, 1=Low, 2=Moderate, 3=High, 4=Critical. The most influential primitive — it amplifies the effect of most other primitives.

**Source Reliability (P10)**
Assessed credibility of the AI's information sources. Integer 0–3. 0=None, 1=Low, 2=Medium, 3=High. Low reliability at Risk≥2 activates source-citation.

---

## Confidence States

**Conflicting Evidence (CE)**
P2 state in which two or more sources with comparable authority make incompatible claims. CE is a structural conflict, not a score. CE ≠ LC. At Risk≥3, CE requires safe-refusal — a constrained recommendation based on one source while another contradicts it is forbidden.

**High Confidence (HC)**
P2 state with score ≥ 0.90 (configurable). No epistemic disclosure required. Showing an uncertainty indicator in HC state is a forbidden antipattern.

**Insufficient Information (II)**
P2 state in which required inputs are absent. II ≠ LC — the issue is missing inputs, not sparse evidence. II activates clarification-request, not constrained-completion.

**Low Confidence (LC)**
P2 state with score 0.50–0.69 (configurable). Significant uncertainty. Required: detailed confidence disclosure. LC × decision-support → constrained-completion. LC × action-execution → safe-refusal.

**Moderate Confidence (MC)**
P2 state with score 0.70–0.89 (configurable). Some limitations. Disclosure optional at Risk<3, required at Risk≥3.

**Stale Context**
P2 state (or P9 state) indicating data age exceeds the configured freshness threshold. Staleness must be disclosed on each affected claim individually. Compounds with other confidence states.

**Unresolvable (UR)**
P2 state reached when CE has persisted beyond the resolution window (default: 30 minutes). No output is possible in UR state. At Risk=4: emergency-escalation + abandon-recovery. Below Risk 4: safe-refusal + redirect-recovery.

---

## Pattern Categories

**Escalation paths**
Patterns for routing to humans or higher-authority systems when the AI cannot safely proceed. Five patterns: human-handoff, role-escalation, system-escalation, emergency-escalation, async-review-escalation.

**Explanation patterns**
Patterns for communicating AI reasoning, confidence, sources, and limitations. Six patterns: confidence-disclosure, source-citation, reasoning-trace, decision-summary, limitation-disclosure, structured-uncertainty-disclosure.

**Permission gates**
Patterns for requesting user authorization before consequential or irreversible actions. Six patterns: one-time-permission, session-permission, persistent-permission, scoped-permission, delegated-permission, revocation.

**Recovery flows**
Patterns for returning users to productive states after errors, refusals, or failures. Five patterns: retry-recovery, redirect-recovery, repair-recovery, manual-override-recovery, abandon-recovery.

**Refusal states**
Patterns for declining requests with clarity, context, and alternatives. Seven patterns: safe-refusal, partial-completion, constrained-completion, alternative-suggestion, clarification-request, human-handoff, policy-refusal.

**Uncertainty states**
Patterns for representing the AI's epistemic state. Seven states: high-confidence-state, moderate-confidence-state, low-confidence-state, conflicting-evidence-state, insufficient-information-state, stale-context-state, unresolvable-state.

**Warning patterns**
Patterns for surfacing alerts before a user proceeds. Six patterns: inline-warning, ambient-warning, modal-warning, blocking-warning, progressive-warning, policy-warning.

---

## Severity Levels

**Advisory**
The least severe warning-category level that requires user attention. Rendered inline. ARIA: `role=status`, `aria-live=polite`.

**Blocking**
The highest warning level short of critical. Blocks all interaction until explicitly acknowledged. ARIA: `role=alertdialog`, `aria-live=assertive`.

**Caution**
Intermediate severity. User attention required before proceeding. ARIA: `role=alert`, `aria-live=polite`.

**Critical**
Emergency-level severity. Requires immediate intervention. Used only with emergency-escalation and unresolvable-state. ARIA: `role=alertdialog`, `aria-live=assertive`.

**Informational**
No meaningful risk. Passive disclosure. ARIA: `role=status`, `aria-live=off`.

---

## Patterns (Alphabetical)

**abandon-recovery**
Clean exit with session state preserved. Re-entry is supported. Used after unresolvable-state or exhausted retry/redirect cycles.

**alternative-suggestion**
Offers the user alternate paths that achieve the same goal via a different approach. Always includes a "none of these" option.

**ambient-warning**
Passive background indicator of an ongoing condition. Non-blocking. Persistently visible while the condition holds.

**blocking-warning**
Blocks all interaction until explicitly acknowledged. Passive dismissal (e.g., pressing Escape) does not constitute acknowledgment.

**clarification-request**
Requests specific missing information before proceeding. Distinct from constrained-completion — the required inputs are absent, not just sparse.

**confidence-disclosure**
Discloses the AI's confidence level and supporting evidence. Depth varies by risk level.

**constrained-completion**
Delivers output within explicit scope limits. Appropriate for LC state with decision-support intent. Forbidden in CE state.

**delegated-permission**
A higher-authority user grants access outside the requesting user's normal scope.

**emergency-escalation**
Interrupt-mode critical routing. Self-authorizing at Risk=4. Bypasses standard escalation SLA.

**human-handoff**
Routes the user to a human operator with context transfer. Used as both a refusal pattern and an escalation pattern.

**inline-warning**
Contextual warning rendered at the point of relevance. Non-blocking. Advisory severity.

**limitation-disclosure**
Names specific capability, knowledge, or scope limitations. Distinct from confidence-disclosure — it names what the AI cannot do, not how confident it is.

**modal-warning**
Dialog requiring acknowledgment before proceeding. Blocks interaction within the dialog scope.

**one-time-permission**
Single-action authorization consumed on use. Cannot be reused.

**partial-completion**
Completes what is possible and explicitly excludes what it cannot. Distinct from constrained-completion — partial applies when some requested information is available and some is not.

**persistent-permission**
Standing authorization valid across sessions, with an expiry date.

**policy-refusal**
Policy-attributed block with rule reference. Supersedes all other refusal and warning patterns.

**policy-warning**
Warning attributed to a specific policy rule. Distinct from blocking-warning — it names the policy.

**progressive-warning**
Escalates severity across consecutive session turns. Starts at advisory and increments.

**reasoning-trace**
Exposes the AI's step-by-step reasoning. Required in CE state for any refusal.

**redirect-recovery**
Guides the user to an alternative path that achieves the goal. Does not retry the failed action.

**repair-recovery**
Corrects data or state then resumes the workflow. Used when the blocking condition is fixable.

**retry-recovery**
Attempts the same action again. Three modes: automatic, assisted, or manual.

**revocation**
Withdraws a previously granted permission immediately. Takes effect on next interaction.

**role-escalation**
Routes to a higher-authority role within the organization. Includes SLA and assignee.

**safe-refusal**
Complete decline with full explanation and alternatives. Required for: CE at Risk≥3, LC + action-execution, UR at Risk<4, capability=incapable.

**scoped-permission**
Authorization limited to a defined scope or resource set.

**session-permission**
Authorization valid for the current session only. Expires on session end.

**source-citation**
Attributes claims to specific sources with reliability context. Required at P10<2 and Risk≥2.

**structured-uncertainty-disclosure**
Presents uncertainty in a structured, quantified format.

**system-escalation**
Routes to another automated system or orchestrator.

---

## Engine Terms

**Audit record**
A structured event generated by the engine for every interaction above the configured audit threshold. Contains: auditId, timestamp, primitiveSnapshot, activatedPatterns, componentRendered, userAction, policyRef, severity.

**Composition constraint**
A rule enforcing mutual exclusion or combination limits across activated patterns. Applied after selection and precedence.

**Decision primitive**
One of the ten inputs (P1–P10) the engine evaluates to determine pattern activation.

**Early termination**
When a rule with `terminatesEvaluation=true` activates, all subsequent rules are skipped. Only R01 (Policy Block) and R02 (Unresolvable + Critical) terminate evaluation.

**Pattern activation**
The selection of a specific pattern by the engine as a result of rule evaluation.

**Precedence resolution**
The engine's mechanism for resolving conflicts when multiple patterns of the same type activate.

**Selection rule**
One of the 14 rules that test primitive values and activate patterns. Rules are evaluated in priority order.

---

## Implementation Terms

**auditId**
A unique identifier propagated across all layers — from the engine evaluation through component rendering to the audit log. Enables tracing any audit record back to its source evaluation.

**deny-first tab order**
The requirement that the Deny button on a permission gate always receives initial keyboard focus and appears first in tab order.

**passive dismissal**
Closing or dismissing a permission gate without explicitly granting. Passive dismissal always equals denial. There is no "dismissed but undecided" state.

**policy configuration**
A deployment-time document (conforming to `guardrail-policy.schema.json`) that overrides default primitive thresholds, activates policy rules, and sets audit requirements.

**tenantId**
A unique identifier for the organizational tenant in a multi-tenant deployment. Scopes policy rules and audit records.
