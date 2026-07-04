# Alternative Suggestion

**Category:** Refusal state
**Sub-type:** Capability refusal (with redirection)
**Severity:** Advisory (Level 1)
**Status:** stable
**Phase:** 2E

---

## Definition

Alternative suggestion is a refusal pattern in which the AI declines the specific form of the request but immediately offers one or more alternative approaches that can serve the same underlying user goal. The refused form may be declined due to capability limits, policy boundaries, confidence constraints, or scope restrictions — but the user's underlying need is real and can be addressed differently.

This pattern is about preserving user goal completion even when the specific requested path is blocked. It is the most user-forward refusal pattern: the interaction should feel like a helpful redirection, not a wall.

---

## Trigger Conditions

Alternative suggestion is triggered when:

- The specific request form is not supportable (out of scope, too ambiguous, policy-constrained, capability-limited), but a related request is
- The user's underlying goal is clear and can be served by a different output type, format, or approach
- The AI can offer at least one alternative that is materially useful — not just a generic suggestion to "try rephrasing"
- The refusal is about the how (the specific form requested), not the what (the underlying goal)

Do not use alternative suggestion when:
- The underlying goal itself is prohibited (use safe refusal)
- No meaningful alternative exists (use partial completion, clarification request, or human handoff)
- The alternative is substantially inferior to the point of being misleading as a substitute

---

## Why Refusal Occurred

The refusal explanation must distinguish between:
- The specific form that was refused and why
- The underlying goal that is still addressable

This distinction is critical: if the user believes the refusal is of their underlying goal rather than the specific request form, they will disengage. The alternative suggestion must demonstrate that the AI understood what the user was trying to accomplish.

---

## User Messaging

**Structure:** `[Brief acknowledgment of the underlying goal] + [Why the specific request form cannot be fulfilled] + [Alternative(s) that can serve the same goal] + [Offer to proceed with the alternative]`

**Good examples:**
```
You want a competitive pricing comparison for your proposal.

I can't retrieve live pricing data from competitor websites in this deployment — that 
requires real-time web access that isn't configured here.

What I can do instead:
• Generate a pricing comparison template you can populate with figures from your 
  sales team's competitive intelligence
• Summarize publicly documented pricing positioning for these competitors based on 
  available market research in my knowledge base (data as of Q1 2026)
• Help you structure a pricing justification section for your proposal that doesn't 
  depend on specific competitor figures

Which of these would be useful?
```

**Tone:** Solution-oriented. The user should feel that the AI is on their side and actively looking for a path forward.

---

## What Can Still Be Completed

The alternative suggestion pattern is itself the answer to "what can still be completed" — the alternatives offered are what can be completed. Each alternative must be:
- Specific and actionable (not "try a different approach")
- Clearly related to the user's goal
- Achievable within the current session (not requiring the user to go elsewhere and return, unless that is the only option)

---

## Alternatives

Present alternatives in order of relevance to the user's goal. For each alternative:
- State what it produces
- State how it differs from the original request
- If relevant, note any limitations of the alternative that the user should know

Do not offer more than three to four alternatives — a long list of mediocre alternatives is worse than one strong one.

---

## Recovery Path

If the user selects an alternative, proceed with it immediately. If none of the alternatives are acceptable:
- Ask what the user needs that the alternatives don't address — this may reveal a more accurate formulation of their goal that the AI can serve
- Route to clarification request or human handoff if the gap cannot be bridged

---

## Related Uncertainty States

- **Insufficient Information State** → Alternative suggestion is often the right response when the AI lacks the specific information requested but has related information that could serve the goal
- **Stale Context State** → When the most current data is unavailable, offering an alternative based on available (older) data with appropriate disclosure is a form of alternative suggestion

---

## Related Permission Patterns

Alternative suggestion does not involve a permission gate unless the selected alternative itself requires one. If the alternative requires a permission gate (e.g., accessing a different data scope), the gate is applied when the user selects the alternative.

---

## Enterprise Audit Considerations

**Audit logging:** Configurable. When the refusal is policy-driven, log the refused request type and the alternative offered. In contexts where alternative suggestions are material to compliance (e.g., the user was redirected away from an unauthorized data retrieval), log the redirection event.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Irrelevant alternatives | The offered alternatives do not actually address the user's underlying goal | User feels dismissed; the pattern becomes a polite way to say no without helping |
| Vague alternatives | Alternatives are described so generally that the user cannot evaluate them | User cannot choose; the interaction stalls |
| Missing the goal | The AI refuses the specific request without understanding the underlying goal | The alternative suggestion misses the point; the user has to restate their need |
| Too many alternatives | Four or more alternatives presented without differentiation | Cognitive load; user cannot decide; they disengage |

---

## Example Scenario

**Context:** A business development manager asks an enterprise AI to "write a cold outreach email to the CEO of Acme Corp — make it feel personal, mention their recent acquisition of XYZ Inc." The AI's deployment policy prohibits generating personalized outreach for specific named individuals without a verified existing relationship record.

**Alternative suggestion response:**
```
I can help with the outreach, but I can't personalize it to a specific named individual 
in a way that's designed to feel like a pre-existing relationship if there isn't one on 
record — that crosses into unsolicited outreach personalization that's outside what I'm 
set up to do here.

What I can do:
• Write a strong, tailored cold outreach email framework for CEO-level contacts at 
  companies that have recently completed acquisitions — ready for you to personalize 
  with the specific relationship context you have
• Help you structure a compelling narrative around the Acme/XYZ acquisition that you 
  can use as the hook in your own outreach

The second option would give you a clear angle to reference without me needing to 
simulate a personal connection I don't have context for. Want to go with that?
```

The user's goal (a strong outreach tied to the acquisition news) is preserved through alternatives that don't require crossing the policy boundary.
