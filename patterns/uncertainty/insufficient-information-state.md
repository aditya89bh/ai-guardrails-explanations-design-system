# Insufficient Information State

**Category:** Uncertainty state
**Sub-type:** Insufficient information
**Severity:** Caution (Level 2) to Blocking (Level 3)
**Status:** stable
**Phase:** 2D

---

## Definition

The insufficient information state is an active operating state in which the AI cannot produce a reliable output because the information required to answer the query — or to perform the requested action — is absent from its available knowledge base, retrieval results, or the context provided by the user. Unlike the low confidence state, where the AI has poor-quality information, the insufficient information state represents the absence of information: the AI cannot form a basis for output rather than forming an unreliable one.

This state is actionable in a specific way: the missing information is often something the user can provide, or a source the AI can be directed to. The primary resolution path is clarification request or context provision, not escalation to a human.

---

## Entry Conditions

The AI enters the insufficient information state when any of the following are true:

- The knowledge base or retrieval results contain no relevant documents or data for the query
- A required input field or parameter is missing from the user's request, and the AI cannot infer it from context with sufficient reliability
- A multi-step task reaches a step that requires data from a previous step that did not produce output (or produced a low-confidence output that cannot be relied on for this step)
- The user's query is underspecified to the point that multiple meaningfully different answers are possible and the correct one depends on context the user has not provided
- Access to the required data source is restricted in the current deployment configuration, and no alternative source covers the gap

---

## Exit Conditions

- **→ High Confidence State:** User provides the missing information and the AI re-evaluates with sufficient coverage to meet the high-confidence threshold
- **→ Moderate Confidence State:** User provides partial information that improves coverage but does not fully resolve the gap
- **→ Conflicting Evidence State:** When additional information provided by the user conflicts with existing retrieved data
- **→ Unresolvable State:** The missing information cannot be provided by the user (it is unavailable to everyone, or requires access the AI cannot obtain), and the task cannot proceed without it

---

## Confidence Characteristics

- **Score range:** Not scored in the standard confidence model — this state represents absence, not poor quality. The output confidence score is undefined or meaningless because there is no basis on which to compute it.
- **Retrieval result:** Empty or near-empty retrieval; no relevant sources found
- **Task dependency:** A required upstream input is missing; the downstream output cannot be computed

---

## Allowed Actions

In the insufficient information state, the AI may:

- Identify specifically what information is missing and why it is required
- Ask the user for the missing information (clarification-request refusal pattern)
- Describe what a complete answer would look like if the information were provided
- Provide a framework or structure the user can populate with the missing information
- Recommend where the user can find the missing information

---

## Forbidden Actions

In the insufficient information state, the AI must not:

- Generate a fabricated or hallucinated output to fill the gap — this is the highest-severity failure mode for this state
- Assume a value for the missing information without disclosing the assumption explicitly
- Proceed with an agentic action that depends on the missing information
- Present the query as unanswerable without first attempting to identify whether the information could be obtained through clarification or alternative sourcing

---

## User Interaction Strategy

The interaction in this state is problem-solving, not just disclosure:

1. Identify precisely what is missing — not "I don't have enough information" but "I don't have [specific data point or context] which is required to answer [specific part of your query]"
2. Determine whether the user can provide it: if yes, ask specifically
3. Determine whether an alternative source could provide it: if yes, recommend it
4. If neither is possible, explain that the task cannot proceed in its current form and propose a reframing

The tone is collaborative, not apologetic. The insufficient information state is not a failure — it is a checkpoint that preserves quality by refusing to fabricate.

---

## Required Explanation Pattern

- **Limitation disclosure** at contextual depth — required. The specific gap must be named.
- **Clarification request** — should be deployed as the primary interaction response when the user can supply the missing information.
- Source citation is not applicable — there are no sources to cite.

---

## Required Permission Pattern

None required by this state. If the user provides the missing information and the AI re-evaluates into a state that requires permission gates, those gates apply at that point.

---

## Escalation Trigger

Escalation is triggered when:

- The missing information is held by a party other than the user (a different system, team, or external source) and requires a formal request to obtain
- The gap is a data access restriction that requires an administrator or data owner to resolve
- The task is time-critical and the information cannot be obtained quickly enough through normal channels

---

## Recovery Trigger

The primary recovery path is user-provided context. Secondary paths:
- **Alternative task framing:** The user reframes the query around what the AI does have access to
- **Redirect recovery:** If the information is available elsewhere, the user is redirected to the source
- **Deferral:** The task is deferred until the missing information becomes available

---

## Audit Requirements

**Audit logging:** Configurable. In agentic contexts, log that a task was halted due to insufficient information, including which step was reached, what information was missing, and whether the task was resumed or abandoned.

---

## Valid Next States

| Next state | Transition condition |
|---|---|
| High Confidence State | Missing information provided; coverage meets high-confidence threshold |
| Moderate Confidence State | Partial information provided; coverage improves but gap remains |
| Conflicting Evidence State | Provided information conflicts with retrieved data |
| Unresolvable State | Information is confirmed to be unavailable to all parties |

---

## Invalid Transitions

| Invalid transition | Reason |
|---|---|
| Insufficient Information → Output generation without disclosure | Generating output when information is absent constitutes fabrication |
| Insufficient Information → Low Confidence (without re-evaluation) | Different root cause; absence of data is not the same as poor-quality data |

---

## Example Scenario

**Context:** An enterprise AI is assisting a finance analyst in building a cost-benefit analysis for a proposed office relocation. The analyst asks the AI to include the estimated lease cost for the proposed new location. The AI has no data for that specific building's lease rate in its knowledge base, and the user has not provided it.

**State:** Insufficient Information

**Output behavior:**
```
I can complete most of the cost-benefit analysis, but I don't have the lease cost data 
for 123 Meridian Street, Suite 400.

Missing: Proposed annual lease cost (or cost per square foot) for the new location

Without this figure, I cannot calculate:
- Net occupancy cost change
- Break-even timeline for the relocation
- ROI of the move

Options:
• Provide the lease cost: I'll complete the analysis immediately.
• Use a placeholder: I'll build the full model with a [LEASE COST TBC] field you can fill in.
• I can estimate a market-rate range for this location type if you'd like a rough scenario 
  — though it would not reflect the actual negotiated rate.

Which would you prefer?
```

The AI identifies the gap precisely, explains its impact, and offers three concrete resolution paths — none of which involves fabricating the missing figure.
