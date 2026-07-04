# Clarification Request

**Category:** Refusal state
**Sub-type:** Deferral pending user input
**Severity:** Informational (Level 0) to Advisory (Level 1)
**Status:** stable
**Phase:** 2E

---

## Definition

A clarification request is a refusal pattern in which the AI defers output generation and requests specific additional information from the user because the current request is underspecified, ambiguous, or interpreted in multiple meaningfully different ways — and the correct interpretation determines the output significantly. The AI does not generate a response to an incorrect interpretation; instead, it asks a targeted question to resolve the uncertainty before proceeding.

A clarification request is a temporary hold, not a refusal of the underlying goal. The user's task can be completed once the AI has the answer to the specific question it is asking. This is what distinguishes it from other refusal patterns: the path to completion is immediate and the obstacle is defined precisely.

---

## Trigger Conditions

A clarification request is triggered when:

- The request has two or more plausible interpretations that would produce materially different outputs, and the AI cannot determine which the user intends
- A required parameter is absent from the request and the AI cannot infer it reliably from context
- The user's stated goal is ambiguous enough that proceeding on an assumption could waste significant effort or produce an unusable output
- The AI is operating in the insufficient information state and the missing information is something the user can readily provide

**Do not** use clarification request:
- As a reflexive response to any complexity — if the AI can make a reasonable default assumption, it should state the assumption and proceed, not ask
- When the AI could generate a reasonable output and note the assumption (use constrained completion with a noted assumption instead)
- When the ambiguity is not material to the output — minor uncertainties do not justify a clarification hold
- When the user has already provided clarification once — asking the same clarifying question again is a failure mode, not a feature

---

## Why Refusal Occurred

The clarification request must explain precisely why the AI is holding:
- What is underspecified or ambiguous
- How the different interpretations would affect the output
- What specific information would allow the AI to proceed

The user must understand that the hold is temporary, that it is caused by a specific and resolvable gap, and that the AI will proceed immediately once the gap is resolved.

---

## User Messaging

**Structure:** `[Acknowledgment of the request] + [Specific ambiguity or gap] + [How different answers would affect the output] + [Targeted question(s)]`

**Good examples:**
```
Before I generate the risk assessment, I need to confirm the jurisdiction:

The applicable regulatory requirements differ significantly between these two contexts:
• EU (GDPR + NIS2 framework)
• US Federal (NIST CSF + sector-specific requirements)

Which jurisdiction should this assessment cover?
```

```
I can analyze the contract, but the analysis differs depending on the role:

• Reviewing as the service provider: I'd focus on liability caps, IP ownership, 
  and termination provisions
• Reviewing as the client: I'd focus on deliverable definitions, acceptance criteria, 
  and payment triggers

Which perspective should I take?
```

**Tone:** Direct and practical. Do not over-explain the ambiguity — state it clearly and ask the question.

**Bad examples:**
- "Could you provide more detail about what you're looking for?" — too vague; the user cannot answer this usefully
- "I'm not sure I fully understand your request. Could you clarify?" — does not identify the specific gap
- Asking multiple questions in one interaction when only one is actually required — this is friction without purpose

---

## What Can Still Be Completed

The AI should assess whether any portion of the task can be completed while the clarification is pending:
- If yes, complete and deliver that portion while asking the targeted question about the remainder
- If the ambiguity is central enough that no portion can be completed usefully before it is resolved, proceed with the clarification request only

Offering partial progress while the clarification is pending reduces user friction and demonstrates that the AI is working on the task, not stalling.

---

## Alternatives

If the user does not know the answer to the clarifying question (it is information they need to look up), the AI should:
- State what default assumption it would make if the user prefers to proceed without answering
- Offer to proceed on the default, with the assumption explicitly labeled in the output
- Note that the user can return with the specific information and request a revised output

---

## Recovery Path

The clarification request resolves immediately when the user provides an answer. The AI proceeds directly to output generation from the clarification response — no re-confirmation, no re-introduction. The output should reference the clarification received: "Based on your confirmation that this is a US Federal assessment..."

---

## Related Uncertainty States

- **Insufficient Information State** → Clarification request is the primary exit path from the insufficient information state when the missing information is something the user can provide
- **Conflicting Evidence State** → When the conflict can be resolved by asking the user which source or version applies, clarification request is the appropriate pattern

---

## Related Permission Patterns

No permission gate is involved in a clarification request. The act of answering the question is the user's input — no additional authorization is required to proceed.

---

## Enterprise Audit Considerations

**Audit logging:** Configurable. In agentic contexts where a task is deferred pending clarification, log:
- That the task was held for clarification
- The specific question asked
- The user's response
- The timestamp of the hold and the timestamp of the resumption

**Clarification history:** In long-running agentic tasks, the clarifications requested and answered should be preserved in the task audit record so the task's evolution is traceable.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Clarification without diagnosis | Asking for clarification without identifying the specific gap | User cannot answer usefully; the request cycles |
| Repeated clarification | Asking for clarification the user already provided | Indicates context loss; user trust degrades |
| Over-clarifying | Asking for clarification on non-material ambiguities | Unnecessary friction; user feels interrogated |
| Clarification instead of default | Asking when a reasonable default assumption could allow the task to proceed | Wastes user time; the AI should be able to proceed with a stated assumption |

---

## Example Scenario

**Context:** An enterprise AI supporting a human resources team is asked to "draft the performance improvement plan." The AI has no additional context: no employee name, no performance issues described, no timeline, and no prior conversation in this session to draw from.

**Clarification request response:**
```
I can draft the performance improvement plan once I have a few specifics:

1. Performance gap: What specific performance issues need to be addressed? 
   (e.g., meeting deadlines, quality of work, communication, attendance)

2. Timeline: What duration is the PIP covering? (Standard is 30, 60, or 90 days)

3. Measurable objectives: Do you have specific targets in mind, or should I suggest 
   standard milestones for the issue type you describe?

If you'd like, share what you have and I'll structure the plan around it.
```

Three focused questions, all of which are required to produce a useful output. The AI does not ask about the employee's name or department unless those are needed for the specific content — it asks only what is materially necessary to proceed.
