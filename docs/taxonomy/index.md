# Guardrail and Explanation Taxonomy

This document defines the canonical classification system for all patterns in this design system. All contributions must use these terms consistently. Where synonyms exist, they are listed and marked as non-canonical.

---

## Pattern Categories

The seven top-level categories organize every pattern in this system. Each category represents a distinct type of AI-to-user communication with a distinct purpose, trigger logic, and design constraints.

| Category | Canonical term | Definition |
|---|---|---|
| 1 | **Warning pattern** | A pattern that surfaces a concern, risk, or important consideration before a user proceeds with an action or accepts an output. The user retains agency. |
| 2 | **Explanation pattern** | A pattern that communicates the AI's reasoning, sources, confidence, or decision logic to the user. |
| 3 | **Permission gate** | A pattern that requires explicit user authorization before the AI proceeds with a consequential or irreversible action. |
| 4 | **Uncertainty state** | A pattern that expresses the AI's confidence level in its output, and adjusts user communication accordingly. |
| 5 | **Refusal state** | A pattern that declines to fulfill a request, with appropriate communication about why and what the user can do next. |
| 6 | **Escalation path** | A pattern that routes a request, decision, or situation to a higher authority — human or system — when the AI's scope, confidence, or authorization is insufficient. |
| 7 | **Recovery flow** | A pattern that returns the user to productive work after a warning, refusal, error, or escalation. |

---

## Severity Levels

Every pattern has an associated severity level that determines the friction it imposes and the visual prominence it receives.

| Level | Label | Definition | Example |
|---|---|---|---|
| 0 | **Informational** | Passive disclosure. No action required. User can ignore. | Confidence badge on an output |
| 1 | **Advisory** | Soft alert. User is informed but not blocked. | Inline warning: "This output contains estimated data" |
| 2 | **Caution** | Moderate alert. User should acknowledge before proceeding. | Banner: "This action will affect external users" |
| 3 | **Blocking** | Hard stop. User must take an action to proceed. | Permission gate: "Confirm to continue" |
| 4 | **Critical** | System cannot proceed. Escalation required. | Escalation path: "This requires manager approval" |

---

## Pattern Sub-types

### Warning Pattern Variants

| Sub-type | Definition |
|---|---|
| **Inline warning** | Warning appears within the flow of content, adjacent to the element it concerns |
| **Modal warning** | Warning interrupts the current flow with a blocking overlay requiring acknowledgment |
| **Ambient warning** | Persistent, non-blocking warning in a secondary UI zone |
| **Blocking warning** | Hard stop that requires a specific resolution action before forward progress is permitted; the user cannot dismiss or click past it |
| **Progressive warning** | Warning that escalates in severity across defined stages as the user moves toward a risky action |
| **Policy warning** | Warning triggered by a match between a user action and a defined organizational or regulatory policy rule; severity is determined by the policy rule configuration |

### Explanation Pattern Variants

| Sub-type | Definition |
|---|---|
| **Confidence disclosure** | Communicates the AI's degree of certainty in an output via user-meaningful labels — not raw model probabilities. Operates at surface, contextual, or detailed depth. |
| **Source citation** | Discloses the specific documents, datasets, or knowledge sources the AI used. Operates at summary, list, linked, or claim-level depth. Must reference only verified, retrieved sources — never fabricated. |
| **Reasoning trace** | Provides a structured, user-readable account of the logical steps the AI took from input to output. Operates at summary, step-by-step, or annotated depth. Must not post-hoc rationalize — the trace must reflect actual reasoning. |
| **Decision summary** | A structured record of a significant AI-assisted decision: inputs, AI recommendation, user decision, and any override rationale. Standard, extended, or compliance depth. Immutable after user confirmation. |
| **Limitation disclosure** | Communicates a specific, functional boundary of the AI's capability relevant to the current request — training cutoff, domain gap, access restriction, or task type boundary. Directs users to appropriate alternatives. |
| **Structured uncertainty disclosure** | A composite artifact combining confidence disclosure and limitation disclosure for high-stakes outputs. Answers three questions in one place: how confident, what constrains that confidence, and what the user should do given this uncertainty. |

### Permission Gate Variants

| Sub-type | Definition |
|---|---|
| **One-time permission** | Authorization for a single, specific AI action instance. Does not persist. Each subsequent execution requires a new request. |
| **Session permission** | Authorization for a defined action category for the duration of the current session. Expires at session end. |
| **Persistent permission** | Standing authorization for a defined action category across all future sessions, until explicitly revoked. Must be explicitly scoped; unbounded persistent permissions are not permitted. |
| **Scoped permission** | Authorization bounded to a specific resource, data set, or target — not an action category in the abstract. May combine with one-time, session, or persistent duration. |
| **Delegated permission** | Authorization request routed to a third party (a different user or role) who has the authority to grant or deny on behalf of the requester. Action is held pending until the approver responds. |
| **Revocation** | The withdrawal of a previously granted permission. Always available for all permission types. Takes effect immediately. Does not roll back actions already completed under the permission. |
| **Audit-required gate** | A permission gate that mandates logging of the authorization event and, in some configurations, secondary sign-off. Layered over other permission sub-types in high-compliance contexts. |

### Uncertainty State Variants

Uncertainty states describe the AI's internal operating state with respect to the reliability of its output. Each state determines which explanation patterns activate, which actions are permitted, and how user interaction is structured.

| Sub-type | Definition |
|---|---|
| **High confidence** | AI output meets or exceeds the configured confidence threshold for the domain and output type. Disclosed passively (optional indicator). No friction applied. |
| **Moderate confidence** | AI output is usable but falls below the high-confidence threshold. Disclosed with an advisory label and a verification recommendation. Moderate-friction interaction. |
| **Low confidence** | AI output is below the low-confidence floor. May still produce directional output, but must actively discourage unsupported reliance. Requires explicit disclosure and restricts consequential actions. |
| **Conflicting evidence** | Two or more retrieved sources make materially contradictory claims relevant to the query. The conflict cannot be resolved without user input or additional context. Both versions of the claim must be surfaced with attribution. |
| **Insufficient information** | Required information is absent — not low quality, but absent. The AI cannot form a basis for output. Primary resolution path is clarification request or user-provided context. |
| **Stale context** | Primary information source is older than the configured freshness threshold for the output type and deployment context. Time-sensitive elements require external verification. Stable elements may still be delivered. |
| **Unresolvable** | Terminal state. The AI cannot produce any reliable or useful output. Even a heavily disclosed output would mislead the user. Resolution is refusal, escalation, or task reframing only. |

### Refusal State Variants

Refusal states describe the AI's interaction strategy when it cannot fulfill a request as stated. Each variant defines a distinct approach: what is refused, what can still be provided, and what the user's path forward is.

| Sub-type | Definition |
|---|---|
| **Safe refusal** | Complete, unconditional refusal of a request that creates a material safety, harm, or ethical risk. No completion path exists. |
| **Partial completion** | AI fulfills the completable portions of a multi-part request and explicitly declines the portions it cannot — with clear labeling of what was excluded and why. |
| **Constrained completion** | AI fulfills the request with modifications applied to bring it within policy, capability, or confidence bounds. The output is complete and coherent; the modifications are disclosed. |
| **Alternative suggestion** | AI declines the specific request form but offers alternative approaches that serve the same underlying user goal. |
| **Clarification request** | AI defers output generation and asks a targeted question because the request is underspecified or ambiguous in a way that materially affects the output. |
| **Human handoff** | AI routes the user to an appropriate human agent because the task requires licensed expertise, organizational authority, or human judgment the AI cannot provide. |
| **Policy refusal** | Complete refusal of a request because a configured organizational or regulatory policy prohibits this request type for this deployment, user role, or context. Rule-governed, not judgment-governed. |

### Escalation Path Variants

Escalation paths route a request, decision, incident, or exception to a higher authority — human or system — when the AI's authorization level, policy scope, or confidence ceiling is insufficient. Escalation paths focus on routing mechanics, context transfer, ownership, SLA enforcement, and fallback behavior.

> **Human handoff — two distinct patterns:** The refusal-category human handoff (`patterns/refusal/human-handoff.md`) is triggered by inability and focuses on what the user receives. The escalation-category human handoff (`patterns/escalation/human-handoff.md`) is triggered by authorization or scope constraints and focuses on routing, ownership, and fallback.

| Sub-type | Definition |
|---|---|
| **Human handoff (escalation)** | Routes a request, decision, incident, or exception to a human agent because the AI's authorization level, policy scope, or confidence ceiling is insufficient. Distinct from the refusal-category human handoff: trigger is scope/authority, not inability. |
| **Role escalation** | Routes from the current user's role to a role with higher organizational authority. Triggered when the current role's authority ceiling is exceeded for the requested action. Governed by the organizational role hierarchy. |
| **System escalation** | Routes from the current AI system to a higher-authority or more capable automated system. Triggered when the AI cannot proceed autonomously and the solution requires a different system's authority. Requires well-defined API contracts, retry logic, and observability. |
| **Emergency escalation** | Immediate, interrupt-mode routing for safety, security, compliance, or operational emergencies. Bypasses normal queues and SLA windows. Self-authorizing. Routes simultaneously to all required parties. |
| **Async review escalation** | Non-immediate routing to a review queue for human evaluation that is time-separated from the originating interaction. The user's workflow may continue while the review proceeds. Governed by SLA windows and queue management. |

### Recovery Flow Variants

| Sub-type | Definition |
|---|---|
| **Retry** | User can re-attempt the same or modified action |
| **Redirect** | User is offered an alternative path to their goal |
| **Repair** | AI or user corrects an error and continues |
| **Manual override** | User with appropriate authority bypasses the guardrail |
| **Abandon** | User exits the flow cleanly, with state preserved where possible |

---

## Trigger Condition Vocabulary

Trigger conditions describe the events or system states that activate a pattern. Use these canonical terms when writing pattern specifications.

| Term | Definition |
|---|---|
| **Confidence threshold breach** | Output confidence falls below a defined minimum for the context |
| **Policy match** | Request content or intent matches a defined policy rule |
| **Irreversibility detection** | Proposed action cannot be undone or has significant downstream effects |
| **Third-party impact** | Action would affect users or systems outside the requester's scope |
| **Authorization gap** | Requested action exceeds the current user's permission level |
| **Scope boundary** | Request is outside the AI's defined operational domain |
| **Safety signal** | Content or context triggers a defined safety classification |
| **Data sensitivity signal** | Request involves data classified above the current trust level |
| **Uncertainty ceiling** | Multiple plausible interpretations exist with no clear winner |
| **Source conflict** | Two or more retrieved sources make materially contradictory claims about the same fact or assertion |
| **Freshness threshold breach** | Primary information source is older than the configured acceptable freshness window for this output type |
| **Information absence** | Required input or data is absent from the knowledge base and cannot be inferred; the AI has no basis for output |
| **Unresolvable uncertainty** | No reliable or useful output can be produced; even disclosure cannot adequately mitigate the risk of misleading the user |
| **Manual review flag** | A human or policy has flagged this interaction for review |

---

## Canonical Terminology Reference

The following table maps common synonyms to their canonical terms. Contributors must use the canonical term in all documentation, code comments, and specifications.

| Canonical term | Non-canonical synonyms |
|---|---|
| guardrail pattern | safety guardrail, AI guardrail, safety rail, alignment control |
| explanation pattern | explainability feature, transparency layer, AI transparency |
| permission gate | consent prompt, approval gate, confirmation dialog, auth check |
| uncertainty state | confidence level UI, ambiguity state, unknown state |
| refusal state | rejection, block, denial, content block |
| escalation path | handoff, human takeover, escalation flow, human-in-the-loop |
| recovery flow | error recovery, retry loop, fallback, graceful recovery |

---

## Taxonomy Versioning

This taxonomy evolves as the design system matures. When terms are added, revised, or deprecated:
- New terms are added with a `[NEW]` tag for one full phase
- Revised terms note the previous term in parentheses
- Deprecated terms are listed in a separate section with migration guidance

_Current taxonomy version: 1.0.0 (Phase 1)_
