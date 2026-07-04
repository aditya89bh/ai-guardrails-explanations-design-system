# Low Confidence State

**Category:** Uncertainty state
**Sub-type:** Low confidence
**Severity:** Caution (Level 2)
**Status:** stable
**Phase:** 2D

---

## Definition

The low confidence state is an active operating state in which the AI's output is of insufficient reliability to serve as a standalone basis for decision-making without independent verification. The AI may still generate output in this state — useful as a directional starting point, a hypothesis, or a prompt for human investigation — but must surface the limitation prominently, restrict certain actions, and adjust its user interaction strategy to actively discourage unsupported reliance.

This state is distinct from the unresolvable state: in the low confidence state, the AI can produce a partial or directional output; in the unresolvable state, it cannot produce anything reliable enough to show without misleading the user.

---

## Entry Conditions

The AI enters the low confidence state when any of the following are true:

- Output confidence score falls below the configured low-confidence floor for the current output type
- The query involves a domain where the AI has only marginal training or retrieval coverage
- Retrieved sources are of poor quality — highly dated, tangentially relevant, internally inconsistent, or sparse
- The output type has a mandatory low-confidence floor that the AI cannot rise above without additional information (e.g., certain rare disease queries in clinical AI, certain emerging regulatory domains)
- Multiple moderate-confidence steps in a workflow compound to a low-confidence conclusion
- The user has flagged that a prior output from this session was incorrect, and the AI is re-evaluating related outputs

---

## Exit Conditions

- **→ Moderate Confidence State:** User provides substantial additional context that meaningfully improves coverage; the AI re-evaluates and the score rises above the low-confidence floor
- **→ High Confidence State:** In rare cases where the user provides definitive additional information that brings the query fully within domain; score meets or exceeds the high-confidence threshold
- **→ Conflicting Evidence State:** Retrieval reveals direct, irreconcilable contradictions rather than simply poor coverage
- **→ Insufficient Information State:** The AI determines the low confidence is caused by absence of information, not poor-quality information
- **→ Unresolvable State:** The AI determines that even a directional output would be misleading in this context

---

## Confidence Characteristics

- **Score range:** At or below the configured low-confidence floor (typically ≤ 0.45 on a normalized scale, configurable per output type and domain)
- **Data coverage:** Poor — the relevant domain is marginally represented or the specific query has very limited source material
- **Source quality:** Sources are weak, dated beyond acceptable range, or internally inconsistent
- **Task fit:** The request stretches significantly beyond the AI's validated task profile, or the combination of query and available data produces an output the AI cannot reliably support

---

## Allowed Actions

In the low confidence state, the AI may:

- Generate a partial, directional, or hypothesis-level output with prominent caution-level disclosure
- Explicitly label the output as requiring independent verification before any reliance
- Ask the user for additional context that could improve confidence (if the deployment context permits clarification requests)
- Recommend specific alternative sources or verification methods
- Proceed to lower-impact steps in a workflow while flagging that a dependent high-impact step cannot proceed without confidence improvement

---

## Forbidden Actions

In the low confidence state, the AI must not:

- Generate output that presents itself as reliable without prominent disclosure of the low confidence state
- Proceed with consequential, irreversible, or third-party-affecting actions based on a low-confidence output without a hard permission gate
- Suppress the disclosure because the output is presented in a context where uncertainty signals "look bad" (e.g., a demo environment)
- Allow agentic task continuation that depends on this output for a high-stakes decision — the task must pause for user review at this state
- Treat low confidence as interchangeable with moderate confidence in the interest of simplifying the user experience

---

## User Interaction Strategy

The interaction in this state must break the user's default assumption of reliability:

1. Generate the directional output (if any can be produced without misleading the user)
2. Surface a caution-level disclosure — more prominent than advisory. The disclosure must be positioned before or alongside the output, not after it.
3. Explicitly state what the output can be used for (direction, hypothesis, starting point for investigation) and what it must not be used for (direct action, external reporting, clinical or financial decisions)
4. Provide a specific alternative path: what the user should do instead of relying on this output
5. For agentic contexts: halt the workflow at this state and require user confirmation before proceeding to any consequential next step

The user should leave this interaction knowing exactly what the output is worth and exactly what to do if they need something more reliable.

---

## Required Explanation Pattern

- **Confidence disclosure** at contextual or detailed depth — required. The label alone is insufficient; the user needs to understand what is causing the low confidence.
- **Limitation disclosure** — required. Low confidence in this state is typically driven by structural limitations (domain gap, data scarcity), not just output-level uncertainty.
- **Structured uncertainty disclosure** — required for any output that will be used in a consequential decision context; must include the reliable/uncertain elements split and specific recommended handling.
- **Source citation** — required if any sources were used, to allow the user to evaluate the quality themselves.

---

## Required Permission Pattern

- **Modal warning** — required before any consequential action taken on the basis of a low-confidence output. The user must acknowledge the confidence level before the action proceeds.
- **One-time permission gate** — required for any consequential action. The gate must explicitly reference the low confidence state in its explanation.
- For high-impact, irreversible actions: escalate to a **blocking warning** or **hard permission gate** — a soft gate is insufficient when confidence is low.

---

## Escalation Trigger

The low confidence state triggers escalation to a human when:

- The task requires a reliable output and the AI cannot improve confidence without information the user cannot provide
- The deployment policy mandates human review for all low-confidence outputs in this output category
- The user explicitly requests escalation
- An agentic task has reached a decision point that depends on the low-confidence output and cannot be deferred

---

## Recovery Trigger

- **Context enrichment:** User provides additional information → AI re-evaluates → may exit to moderate or high confidence
- **Alternative task framing:** User rephrases to a question within the AI's reliable range → confidence improves
- **Redirect recovery:** If confidence cannot improve, the user is redirected to a more appropriate resource

---

## Audit Requirements

**Audit logging:** Required. The low confidence state represents a significant reliability risk that must be traceable. Log:
- That the output was generated in the low confidence state
- The specific confidence driver
- The disclosure text shown to the user
- Whether the user acknowledged the disclosure and proceeded
- Whether an escalation was triggered
- Any action taken by the user based on this output (if observable)

---

## Valid Next States

| Next state | Transition condition |
|---|---|
| Moderate Confidence State | User context enrichment improves score above low-confidence floor |
| High Confidence State | Definitive user input resolves the domain gap entirely |
| Conflicting Evidence State | Retrieval reveals irreconcilable contradictions |
| Insufficient Information State | Low confidence confirmed to be caused by absence of data, not quality |
| Unresolvable State | Even a directional output cannot be produced without misleading the user |

---

## Invalid Transitions

| Invalid transition | Reason |
|---|---|
| Low Confidence → High Confidence (without intermediate state) | Requires explicit validation that the score meets the high threshold; a jump without intermediate evaluation is a classification error |
| Low Confidence → Agentic task continuation without user confirmation | Not a state transition error — this is a forbidden action in this state |

---

## Example Scenario

**Context:** A supply chain AI is asked to estimate lead times for a specific rare-earth mineral sourced from a particular supplier in a region that has recently experienced significant geopolitical disruption. The AI's training data on this supplier is 14 months old and the current geopolitical context is not reflected in its knowledge base.

**State:** Low Confidence

**Output behavior:**
```
⚠ Low confidence — Use as a directional starting point only

Pre-disruption lead time estimate: 45–60 days from this supplier.

This estimate is based on data from 14 months ago. Current geopolitical conditions in this 
region are not reflected in available data. Actual lead times may differ significantly — 
potentially by weeks or months — due to recent supply chain disruptions.

Do not use this figure in procurement commitments or financial planning without current 
supplier confirmation.

Recommended: Contact the supplier directly or consult a current supply chain intelligence 
service for up-to-date lead time estimates.
```

The AI provides what it can while actively directing the user away from unsupported reliance. No agentic procurement action can be taken on this output without a blocking permission gate.
