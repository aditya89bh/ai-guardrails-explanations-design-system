# Unresolvable State

**Category:** Uncertainty state
**Sub-type:** Unresolvable uncertainty
**Severity:** Blocking (Level 3) to Critical (Level 4)
**Status:** stable
**Phase:** 2D

---

## Definition

The unresolvable state is the terminal uncertainty state — entered when the AI determines that no reliable or useful output can be produced for the current query or task segment without creating a material risk of misleading the user. This is not a state of low confidence or poor data quality — it is the state where generating any output, even with heavy disclosure, would do more harm than producing nothing.

The unresolvable state requires a refusal or escalation path. It cannot be resolved by disclosure alone. It is different from all other uncertainty states in that the resolution is not "output with caveats" but "no output, with an explanation of why, and a clear alternative path."

The unresolvable state is the last gate before a refusal pattern is applied. Entering this state does not automatically mean the user's need cannot be met — it means the AI cannot meet it with available information and capability.

---

## Entry Conditions

The AI enters the unresolvable state when any of the following are true:

- **Irreducible ambiguity:** Multiple interpretations of the query are plausible and the correct interpretation determines the answer; the AI cannot distinguish between them and neither path is a safe default
- **Fabrication risk:** The AI cannot answer without generating content it cannot verify — and the output type is one where fabricated content creates material harm (clinical, legal, financial, safety-critical)
- **Compounded uncertainty:** A chain of low-confidence or conflicting-evidence steps has produced an output whose cumulative uncertainty is too high for the output to be directionally useful
- **Hard knowledge boundary:** The query requires knowledge the AI definitively does not have and cannot obtain — not just sparse coverage but confirmed absence (e.g., a future event, an undisclosed internal document, real-time data the deployment has no feed for)
- **Task impossibility:** The requested action cannot be performed by the AI in its current deployment configuration and no reconfiguration path is available to the user
- **Conflict unresolvable in session:** The conflicting evidence state has persisted and the user cannot provide the context needed to resolve it within the session

---

## Exit Conditions

The unresolvable state does not exit to a lower uncertainty state — it resolves through one of three paths:

- **Refusal:** The AI applies the appropriate refusal pattern (safe refusal, scope refusal, or constrained completion if a partial output is possible) and the task ends
- **Escalation:** The AI routes to a human agent, specialist, or higher-authority system that can handle the task — the AI's session exits the unresolvable state when the handoff is confirmed
- **Task reframing:** The user reformulates the request as a materially different, in-scope question — the AI re-evaluates the new request as a new session context, not a continuation of the unresolvable task

---

## Confidence Characteristics

- **Score range:** Not applicable — the unresolvable state represents a qualitative determination that no confidence-scored output should be produced
- **Root cause:** Any of the entry conditions above — the unresolvable state is the result of a judgment that disclosure alone is not sufficient mitigation
- **Terminal nature:** This is the only uncertainty state that does not have a path back to a lower-confidence output state. Transitions are to refusal, escalation, or task reframing only.

---

## Allowed Actions

In the unresolvable state, the AI may:

- Explain clearly and specifically why the task cannot be completed
- Describe what would need to change for the task to become completable
- Route to a human agent or specialist via the appropriate escalation path
- Offer alternative, related tasks that are completable (if any exist)
- Preserve all user context and session state so the user does not have to restart if they return with a reformulated request

---

## Forbidden Actions

In the unresolvable state, the AI must not:

- Generate a speculative output with disclosure — in this state, the determination is that even a heavily disclosed speculative output would cause harm
- Force the user to accept a non-answer without explaining specifically why the task cannot proceed
- Re-enter the low confidence or moderate confidence states silently — if the AI determines that a task is unresolvable and then reverses that determination, it must surface the reversal explicitly
- Use the unresolvable state to avoid tasks that are actually completable at lower confidence with appropriate disclosure — this state is reserved for genuine impossibility, not convenience

---

## User Interaction Strategy

The interaction in this state must accomplish four things simultaneously:

1. **Acknowledge the user's need** — make clear that the AI understands what the user is trying to accomplish
2. **Explain specifically why the task cannot proceed** — not "I can't help with that" but "The task cannot proceed because [specific reason]"
3. **Describe what would enable completion** — what information, reconfiguration, or alternative framing would allow the AI to engage
4. **Provide a concrete next step** — escalation, alternative task, or referral to a resource that can help

Under no circumstances should the user leave this interaction with only a refusal. Every unresolvable state response must include a forward path.

---

## Required Explanation Pattern

- **Limitation disclosure** at detailed depth — required. The user deserves a full explanation of why the task cannot proceed.
- **Reasoning trace** at summary depth — required when the unresolvable determination is the result of a chain of reasoning steps.
- No confidence disclosure — confidence scoring is not applicable in this state.

---

## Required Permission Pattern

No permission gate applies in the unresolvable state. If escalation is selected as the forward path, the appropriate escalation permission and notification apply.

---

## Escalation Trigger

The unresolvable state itself is an escalation trigger when:
- A human agent or specialist has a reasonable chance of completing the task that the AI cannot
- The task is time-sensitive enough that human escalation is preferable to the user reformulating and returning

Escalation is the preferred exit path for consequential tasks (clinical, legal, financial, safety) where the user's need is urgent and the AI's limitation is genuine.

---

## Recovery Trigger

Recovery in the unresolvable state means exiting to a refusal, escalation, or task reframing — not to a lower confidence state. The user must take an active step to exit this state: reformulate, escalate, or accept the refusal and pursue an alternative.

---

## Audit Requirements

**Audit logging:** Required. The unresolvable state is a significant operational event. Log:
- The specific entry condition that triggered the state
- The explanation provided to the user
- The exit path taken (refusal / escalation / task reframing)
- Timestamp, session, and task identifiers

---

## Valid Next States

| Exit path | Condition |
|---|---|
| Refusal pattern applied | AI cannot proceed and no escalation path is suitable or available |
| Escalation path activated | Human agent or specialist is the appropriate resolution |
| Task reframing (new request context) | User reformulates the request as a materially different, in-scope question |

---

## Invalid Transitions

| Invalid transition | Reason |
|---|---|
| Unresolvable → Low Confidence (without new information) | The unresolvable determination cannot be reversed without a material change in input |
| Unresolvable → Output generation with heavy disclosure | Explicitly forbidden — this state exists precisely because disclosure alone is insufficient |
| Unresolvable → Silent failure (no explanation) | The user must always receive a specific explanation and a forward path |

---

## Example Scenario

**Context:** An enterprise AI is used in an insurance claims context. An adjuster asks the AI to assess the settlement value for a complex multi-party liability claim involving a product defect, a third-party contractor, and a recent court ruling from the prior week that changed the applicable precedent in this jurisdiction. The AI has no data on the new court ruling, and the claim involves jurisdiction-specific nuances that the AI's training data does not adequately cover for this combination of factors.

**State:** Unresolvable

**Output behavior:**
```
This claim cannot be assessed reliably with available information.

Why this task cannot proceed:
• A court ruling from last week changed the applicable liability precedent in this jurisdiction. 
  I do not have this ruling in my knowledge base.
• The combination of product defect liability, third-party contractor involvement, and the 
  updated precedent requires jurisdiction-specific legal analysis that exceeds my reliable 
  operating range for this claim type.

Generating a settlement estimate under these conditions would risk producing a figure that 
is materially wrong in a way that disclosure cannot adequately correct.

What would enable this assessment:
• The text of the recent court ruling, once I can retrieve or be provided it
• Review by a licensed attorney specializing in product liability in this jurisdiction

Forward path options:
[Route this claim to a senior adjuster] 
[I'll provide the court ruling — please re-evaluate]
[Proceed with a general estimate while I confirm the legal basis separately]
```

The AI refuses to generate a misleading settlement estimate. It explains specifically what is blocking the assessment, what would enable it, and offers three concrete forward paths — one of which allows the user to bridge the gap themselves.
