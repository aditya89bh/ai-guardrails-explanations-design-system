# Moderate Confidence State

**Category:** Uncertainty state
**Sub-type:** Moderate confidence
**Severity:** Advisory (Level 1)
**Status:** stable
**Phase:** 2D

---

## Definition

The moderate confidence state is an active operating state in which the AI can produce a useful output, but the output carries limitations that the user should be aware of before acting on it. The AI's confidence falls below the high-confidence threshold but above the low-confidence floor. In this state, the AI proceeds with output generation but activates advisory-level uncertainty disclosure and adjusts its user interaction strategy to encourage verification for high-stakes uses.

Unlike the high confidence state, the moderate confidence state is visible to the user — it produces an observable disclosure. Unlike the low confidence state, the AI does not restrict actions or require heightened authorization; it informs the user and trusts them to calibrate appropriately.

---

## Entry Conditions

The AI enters the moderate confidence state when any of the following are true:

- Output confidence score falls between the low-confidence floor and the high-confidence threshold for the current output type
- The query is adjacent to but not fully within the AI's primary validated domain (e.g., a domain the AI handles with some training but not deep specialization)
- The retrieved sources are relevant but have quality limitations — partial coverage, moderate age, or limited corroboration across sources
- One output element is below the high-confidence threshold, while the overall output remains above the low-confidence floor
- The output type has a mandatory moderate-confidence floor regardless of computed score (certain regulated output types default to at least moderate disclosure)

---

## Exit Conditions

- **→ High Confidence State:** User provides additional context that brings the query fully within the AI's validated domain; a re-evaluation yields a score at or above the high-confidence threshold
- **→ Low Confidence State:** Additional retrieval steps reveal further limitations; score drops below the low-confidence floor
- **→ Conflicting Evidence State:** New retrieval reveals direct contradiction between sources
- **→ Insufficient Information State:** Key information required for a reliable output is confirmed to be unavailable
- **→ Stale Context State:** The primary source is confirmed to be outdated beyond the acceptable freshness threshold

---

## Confidence Characteristics

- **Score range:** Between the low-confidence floor (exclusive) and the high-confidence threshold (exclusive) — the exact values are configurable per deployment and output type
- **Data coverage:** Relevant domain is represented, but coverage is incomplete or imperfectly matched to the query
- **Source quality:** Sources are present but not optimal — may be partially dated, partially corroborated, or secondarily relevant
- **Task fit:** The request is within the AI's general capability but at the edge of its specialization for this deployment

---

## Allowed Actions

In the moderate confidence state, the AI may:

- Generate and return output with active advisory-level disclosure
- Proceed through multi-step workflows, with disclosure surfaced at each output that is in this state
- Cite sources at list or contextual depth
- Offer a confidence disclosure at contextual depth
- Recommend verification steps to the user
- Accept user acknowledgment and continue if the user confirms they understand the limitation

---

## Forbidden Actions

In the moderate confidence state, the AI must not:

- Generate output without surfacing the moderate confidence disclosure — silent generation at moderate confidence misrepresents reliability
- Present the output as equivalent in reliability to a high-confidence output
- Proceed with irreversible or high-impact actions without applying an appropriate permission gate (moderate confidence does not lower the bar for permission gates; it may raise it for high-stakes action types)
- Use moderate confidence state to justify refusing a request — this state still allows output generation

---

## User Interaction Strategy

The user must be clearly informed that this output is usable but should be verified before high-stakes use. The interaction strategy:

1. Generate the output
2. Surface an advisory-level confidence disclosure (contextual depth): label + one-line explanation of what drives the limitation
3. Include a recommended verification step (specific: what to verify and against what)
4. Optionally include a "Learn more" expand path for users who need fuller context
5. Do not block the user from using the output; trust them to calibrate

For agentic workflows: the AI should surface the moderate confidence state before executing consequential steps, not after. If a step's output enters this state mid-workflow, pause and disclose before proceeding to the next step.

---

## Required Explanation Pattern

- **Confidence disclosure** at contextual depth — required. Must include the label and a one-line explanation of the confidence driver.
- **Limitation disclosure** — required if the moderate confidence is driven by a structural capability gap, not just data quality
- **Source citation** at list depth — required if the output is retrieval-augmented
- **Structured uncertainty disclosure** — required if both confidence and limitation signals are present simultaneously

---

## Required Permission Pattern

No additional permission pattern is required solely due to moderate confidence. However:

- For actions that are consequential regardless of confidence level, the appropriate permission gate (one-time, session, or scoped) applies
- For high-stakes action types specifically, the deployment may be configured to require an additional acknowledgment (a soft gate or modal warning) when the confidence is in the moderate range — this is configurable at the tenant level

---

## Escalation Trigger

The moderate confidence state triggers escalation when:

- The user is attempting a high-stakes, irreversible action based on a moderate-confidence output and the deployment policy requires escalation in this scenario
- The AI has been in the moderate confidence state for multiple consecutive steps in a workflow, suggesting the task is systematically outside its reliable range
- The user explicitly requests escalation after seeing the disclosure

---

## Recovery Trigger

The moderate confidence state supports recovery in two directions:

- **Upward (to high confidence):** The user provides additional context that resolves the confidence gap — the AI re-evaluates and may exit to high confidence
- **Downward (to low confidence or refusal):** If follow-up retrieval confirms the limitations are more severe than initially assessed, the AI transitions accordingly

---

## Audit Requirements

**Audit logging:** Required in regulated contexts. Log:
- That the output was generated in the moderate confidence state
- The confidence driver (data quality, domain gap, source limitations)
- The disclosure shown to the user
- Whether the user proceeded or requested additional context

---

## Valid Next States

| Next state | Transition condition |
|---|---|
| High Confidence State | Additional context resolves the confidence gap |
| Low Confidence State | Score drops below the low-confidence floor |
| Conflicting Evidence State | Source contradiction detected on further retrieval |
| Insufficient Information State | Required information confirmed unavailable |
| Stale Context State | Primary source confirmed outdated beyond threshold |

---

## Invalid Transitions

| Invalid transition | Reason |
|---|---|
| Moderate Confidence → Unresolvable State (direct) | Must pass through Low Confidence; skipping indicates a classification error |
| Moderate Confidence → Safe Refusal (confidence-driven) | Moderate confidence does not warrant refusal; the AI must generate output with disclosure |

---

## Example Scenario

**Context:** A market intelligence AI is asked to estimate total addressable market (TAM) for a niche industrial software category. The AI has general market data but the specific niche has sparse coverage in the knowledge base — relevant but not comprehensive.

**State:** Moderate Confidence

**Output behavior:**
```
Estimated TAM for industrial workflow automation software (mid-market segment):
$2.1B–$3.4B globally (2025 estimate)

◐ Moderate confidence — This niche has limited dedicated market research coverage in available data. 
  The estimate is extrapolated from adjacent category data and general market sizing models.
  Verify against a specialized market research source before including in investment materials.
```

The user can use this figure for internal planning but is explicitly directed to verify for external or investor-facing use. The AI does not block use; it calibrates the user's reliance.
