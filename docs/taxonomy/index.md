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
| **Confidence disclosure** | Communicates the AI's confidence level for a specific output |
| **Source citation** | References the data, documents, or knowledge the AI used |
| **Reasoning trace** | Exposes the steps or logic the AI used to reach a conclusion |
| **Decision summary** | Summarizes why the AI took an action or produced an output |
| **Limitation disclosure** | Communicates the boundaries of what the AI can reliably do |

### Permission Gate Variants

| Sub-type | Definition |
|---|---|
| **Soft gate** | User acknowledgment required, but low friction. One-click confirm. |
| **Hard gate** | Explicit confirmation with consequences displayed. Requires deliberate action. |
| **Audit-required gate** | Permission must be logged; may require secondary authorization |
| **Delegated gate** | Authorization must come from a different user role or system |

### Uncertainty State Variants

| Sub-type | Definition |
|---|---|
| **High confidence** | AI output meets the confidence threshold for the domain; disclosed passively |
| **Moderate confidence** | AI output is usable but should be verified; disclosed with advisory label |
| **Low confidence** | AI output is uncertain; user must not rely on it without verification |
| **Unresolvable uncertainty** | AI cannot produce a reliable output; refusal or escalation required |

### Refusal State Variants

| Sub-type | Definition |
|---|---|
| **Policy refusal** | The request violates a defined policy. Cannot proceed. |
| **Capability refusal** | The AI cannot fulfill this request due to capability limits. |
| **Safety refusal** | The request poses a safety risk. Cannot proceed. |
| **Scope refusal** | The request is outside the AI's authorized scope for this context. |
| **Graceful degradation** | The AI cannot fully fulfill the request but provides partial output with disclosure |

### Escalation Path Variants

| Sub-type | Definition |
|---|---|
| **Human handoff** | Routes the interaction to a human agent |
| **Role escalation** | Routes to a user with higher authorization level |
| **System escalation** | Routes to a higher-authority system or approval workflow |
| **Emergency escalation** | Immediate escalation for safety-critical situations |

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
