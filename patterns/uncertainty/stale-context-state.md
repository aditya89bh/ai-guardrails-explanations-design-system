# Stale Context State

**Category:** Uncertainty state
**Sub-type:** Stale context
**Severity:** Advisory (Level 1) to Caution (Level 2) — determined by staleness degree and output stakes
**Status:** stable
**Phase:** 2D

---

## Definition

The stale context state is an active operating state triggered when the AI's primary information source — whether its training data, a retrieved document, or a connected data feed — is older than the configured acceptable freshness threshold for the current output type and deployment context. The AI may still have valid information, but that information has a temporal dimension that limits its reliability in the present moment. The stale context state is specifically about time — not data quality in the general sense, not absence of data, not conflicting sources — but information that was accurate when created and may no longer be accurate now.

---

## Entry Conditions

The AI enters the stale context state when any of the following are true:

- A retrieved document's last-modified date is beyond the configured freshness threshold for this output type (e.g., a compliance policy document older than 90 days in a regulatory context)
- The AI's training cutoff predates a significant event relevant to the query (regulatory change, market event, organizational restructuring, product version change)
- A connected data feed has not updated within the expected interval for the deployment (e.g., a pricing feed that updates daily has not updated in 3 days)
- The user's query is explicitly about current state ("What is the current...") and the AI's most recent data is beyond the freshness threshold
- A session-level ambient warning about data freshness is active and a new output is generated in that session (the ambient context carries into per-output staleness assessment)

---

## Exit Conditions

- **→ High Confidence State:** A fresher source is retrieved or provided by the user that falls within the freshness threshold and replaces the stale data
- **→ Moderate Confidence State:** A somewhat fresher source is retrieved that is closer to but still outside the optimal threshold; confidence improves but does not fully resolve
- **→ Insufficient Information State:** The user requires current data that the AI has no access to, and the stale data cannot serve even as a directional proxy
- **→ Unresolvable State:** The information is so time-sensitive and the data so outdated that any output would actively mislead the user

---

## Confidence Characteristics

- **Score range:** Variable — staleness is a modifier on the standard confidence score, not a separate dimension. An otherwise high-confidence output drops to moderate or low when its data is stale.
- **Temporal dimension:** The key metric is the delta between the data's effective date and the current date, measured against the configured threshold
- **Domain sensitivity:** Different domains have different staleness thresholds. A general business glossary may tolerate 12-month-old data. A regulatory compliance document may tolerate only 30 days. A market price feed may tolerate only minutes.

---

## Allowed Actions

In the stale context state, the AI may:

- Generate an output based on the stale data with an explicit staleness disclosure (the date of the data and the threshold exceeded)
- Distinguish between elements of the output where the staleness is likely to matter (dynamic elements: prices, regulations, procedures) and where it is unlikely to matter (structural elements: general frameworks, stable concepts)
- Recommend that the user verify the time-sensitive elements specifically
- Offer to use a fresher source if the user can provide one

---

## Forbidden Actions

In the stale context state, the AI must not:

- Generate output based on stale data without any disclosure, presenting it as if current
- Claim that the data is "approximately current" or "probably still valid" without evidence — the staleness threshold exists precisely because the AI cannot make this determination reliably
- Proceed with time-sensitive agentic actions (e.g., trade execution, regulatory filing, clinical dosing) based on stale data
- Suppress the staleness signal because the output appears internally consistent

---

## User Interaction Strategy

The interaction in this state distinguishes between what is likely to be stable (and therefore reliable despite age) and what is likely to have changed (and therefore requires verification):

1. Surface the staleness disclosure prominently — the data age and the threshold exceeded
2. Partition the output where possible: stable elements (safe to rely on) vs. dynamic elements (verify before use)
3. Name the specific elements that are most time-sensitive in this domain
4. Provide the date of the source so the user can evaluate for themselves
5. For agentic contexts: pause before any step that depends on a time-sensitive value from the stale source

The ambient warning pattern is a natural complement to this state: when a session involves a data environment with a freshness constraint, the ambient warning sets context and individual output-level staleness disclosures reinforce it for specific outputs.

---

## Required Explanation Pattern

- **Confidence disclosure** at contextual depth — required. The disclosure must name the data age and the staleness threshold.
- **Limitation disclosure** — required when the staleness is a deployment-level constraint (the AI's training cutoff) rather than a per-document issue.
- **Inline warning** — required for specific elements identified as highly time-sensitive within an otherwise valid output.
- **Ambient warning** — should already be active at the session level if this is a known, systematic freshness constraint.

---

## Required Permission Pattern

For consequential, time-sensitive agentic actions based on stale data:
- **Blocking warning** — required before any irreversible action. The user must explicitly acknowledge the staleness before the action proceeds.
- **One-time permission gate** — required, with the staleness disclosure included in the gate's explanation.

---

## Escalation Trigger

The stale context state triggers escalation when:

- The output involves a regulatory or compliance determination that has changed since the data was last updated, and the change has material consequences
- The data is so stale that the AI cannot determine whether the stale answer is directionally correct or outright wrong
- A safety-relevant value (clinical guideline, equipment limit, hazardous threshold) is involved and the data age is significant

---

## Recovery Trigger

- **Fresh source provided:** User supplies a current document or data point → AI re-evaluates
- **Redirect to live source:** User is directed to the canonical source for current data
- **Task deferral:** For time-critical tasks, the AI defers the dependent step until current data is available

---

## Audit Requirements

**Audit logging:** Required when staleness affects compliance, regulatory, clinical, or financial outputs. Log:
- The data source used, its effective date, and the configured freshness threshold
- The disclosure shown to the user
- Whether the user proceeded based on the stale data or sought a fresher source
- Any action taken based on the stale data

---

## Valid Next States

| Next state | Transition condition |
|---|---|
| High Confidence State | Fresh source retrieved or provided; freshness threshold met |
| Moderate Confidence State | Fresher source found but still slightly outside threshold |
| Insufficient Information State | Current data is unavailable; stale data cannot serve as proxy |
| Unresolvable State | Data is so old that even a directional output would actively mislead |

---

## Invalid Transitions

| Invalid transition | Reason |
|---|---|
| Stale Context → High Confidence (without fresh source) | Cannot upgrade confidence without a fresher data source |
| Stale Context → Silent output generation | Forbidden — staleness disclosure is mandatory |

---

## Example Scenario

**Context:** A legal AI assistant is helping an in-house counsel review whether a specific data transfer mechanism is compliant with the applicable cross-border data transfer requirements. The AI's most recent source on this topic is 8 months old, and the freshness threshold for regulatory compliance outputs is 60 days. The regulatory landscape in this area is known to change frequently.

**State:** Stale Context

**Output behavior:**
```
⚠ Source data is 8 months old — regulatory threshold is 60 days

Based on guidance from [Source: Data Transfer Compliance Guide, v2.1, November 2025]:

The transfer mechanism you are using was compliant as of November 2025. [Stable element: 
general framework description and conditions]

Time-sensitive — verify before relying:
• Adequacy decisions and their current status change frequently
• Standard contractual clause requirements have been subject to ongoing regulatory updates
• Supervisory authority guidance in the relevant jurisdiction may have been issued since November 2025

Recommended: Verify the current status of this transfer mechanism against the relevant 
supervisory authority's website before proceeding to contract execution.
```

The stable framework description is provided. The specific regulatory determinations are flagged as requiring verification. The user can use the output for orientation but is clearly directed to verify the time-sensitive elements.
