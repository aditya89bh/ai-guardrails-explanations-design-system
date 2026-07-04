# High Confidence State

**Category:** Uncertainty state
**Sub-type:** High confidence
**Severity:** Informational (Level 0)
**Status:** stable
**Phase:** 2D

---

## Definition

The high confidence state is the AI's default operating state for a given output or task segment when its confidence in the output meets or exceeds the configured threshold for the deployment context. In this state, the AI proceeds without requiring explicit uncertainty disclosure, though a passive confidence indicator may be surfaced at the interface layer for transparency. The state indicates that the AI's output is within its reliable operating domain for the current query.

This is an internal operating state. It determines which explanation patterns are activated, what actions the AI is permitted to take autonomously, and how the AI's output is presented to the user. It is not a guarantee of correctness — high confidence means the system's internal assessment places the output within its reliable range, not that the output is infallible.

---

## Entry Conditions

The AI enters the high confidence state when all of the following are true:

- Output confidence score meets or exceeds the deployment-configured high-confidence threshold for the current output type
- The query falls within the AI's verified knowledge domain and training scope
- The data sources used are current, accessible, and of sufficient quality for the output type
- No conflicting signals are detected across retrieved sources
- The task type is one the AI has been validated to perform for this deployment

---

## Exit Conditions

The AI exits the high confidence state when any of the following occur:

- A retrieved source conflicts with another retrieved source for the same claim (→ transitions to Conflicting Evidence State)
- Confidence score drops below the high-confidence threshold due to domain shift, data quality degradation, or query complexity (→ transitions to Moderate Confidence State)
- Required context or data is partially unavailable (→ transitions to Insufficient Information State or Stale Context State depending on cause)
- The user modifies the query in a way that takes the task outside the validated domain
- A policy engine flags the output for review

---

## Confidence Characteristics

- **Score range:** At or above the deployment-configured high-confidence threshold (typically ≥ 0.80 on a 0–1 normalized scale, but the threshold is configurable per output type)
- **Data coverage:** The relevant domain is well-represented in the AI's knowledge base or retrieval results
- **Source coherence:** Retrieved sources are consistent; no significant contradictions exist
- **Recency:** Data freshness is within the configured acceptable window for the output type
- **Task fit:** The request type matches the AI's validated task profile for this deployment

---

## Allowed Actions

In the high confidence state, the AI may:

- Generate and return output without requiring additional user confirmation
- Apply one-time permission gates before consequential actions (e.g., sending, publishing, modifying external state)
- Provide a passive confidence indicator (optional, configurable)
- Cite sources at summary or list depth
- Proceed to subsequent steps in a multi-step workflow without re-assessing confidence at each step (unless trigger conditions change)

---

## Forbidden Actions

In the high confidence state, the AI must not:

- Skip permission gates that are required regardless of confidence level (some actions always require authorization)
- Treat high confidence as authority to take irreversible actions without a permission gate
- Suppress all uncertainty disclosure — if even one output element is below the high-confidence threshold, that element must be disclosed separately (e.g., via inline warning or element-level confidence disclosure)
- Present a high confidence indicator on outputs that mix high-confidence and low-confidence elements without differentiating them

---

## User Interaction Strategy

In the high confidence state, the interaction is streamlined:

- Output is returned with minimal friction
- Passive confidence indicator surfaced if the deployment is configured to show it
- No uncertainty disclosure is shown unless an element-level exception is detected
- The user's default assumption is that the output is reliable; this assumption must be actively corrected if any element exits the high confidence state

**Do not** surface an explicit "I'm confident" message — this is noise. The absence of uncertainty disclosure is the signal. If confidence indicators are always shown, a stable "High confidence" badge communicates this passively.

---

## Required Explanation Pattern

- **Confidence disclosure** at surface depth — optional, configurable. A passive indicator is sufficient.
- **Source citation** at summary or list depth — required if the output draws from specific retrieved documents
- No reasoning trace is required unless the output type mandates it or the user requests it

---

## Required Permission Pattern

No uncertainty-driven permission gate is required in this state. Standard action-type permission gates apply (e.g., one-time permission before sending, posting, or modifying external state).

---

## Escalation Trigger

The high confidence state does not independently trigger escalation. Escalation may still be triggered by:

- A policy engine flag on the output content
- A permission gate that routes to delegated permission
- A user-initiated escalation request

---

## Recovery Trigger

Not applicable. The high confidence state is the baseline operating state and does not require recovery. If the AI exits this state and the user's task cannot be completed in a lower confidence state, the relevant recovery flow activates.

---

## Audit Requirements

**Audit logging:** Configurable. In most deployments, high confidence state outputs do not require individual audit events beyond standard activity logging. In regulated contexts where all AI outputs must be logged regardless of confidence, log:
- Output type and confidence level (high)
- Sources used (if retrieval-augmented)
- Timestamp and session identifier

---

## Valid Next States

| Next state | Transition condition |
|---|---|
| Moderate Confidence State | Confidence score drops below high threshold; domain shift detected |
| Conflicting Evidence State | Source contradiction detected mid-retrieval |
| Stale Context State | Data freshness constraint breached after initial assessment |
| Insufficient Information State | Required data becomes unavailable during a multi-step task |

---

## Invalid Transitions

| Invalid transition | Reason |
|---|---|
| High Confidence → Unresolvable State (direct) | Must pass through Moderate or Low Confidence first; direct jump indicates a classification error |
| High Confidence → Safe Refusal (based on confidence alone) | A high confidence state does not warrant refusal; refusal in this state must be driven by policy, scope, or safety signals, not confidence |

---

## Example Scenario

**Context:** An enterprise AI assistant is asked to summarize a company's standard software procurement policy. The policy document is in the AI's knowledge base, was last updated 8 days ago (within the freshness threshold), and the question falls squarely within the AI's validated domain for this deployment.

**State:** High Confidence

**Output behavior:** The AI returns a clean summary with sources cited at list depth (document name, section). A passive "Confident" badge appears in the output header if the deployment is configured to show confidence indicators. No uncertainty disclosure is shown. The user sees a reliable, well-sourced summary with no friction.

**State remains:** High Confidence — no transition triggers are met.
