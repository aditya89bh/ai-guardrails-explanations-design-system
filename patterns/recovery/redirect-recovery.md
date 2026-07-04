# Redirect Recovery

**Category:** Recovery flow
**Sub-type:** Redirect
**Severity:** Informational (Level 0) to Advisory (Level 1)
**Status:** stable
**Phase:** 2G

---

## Definition

Redirect recovery is the recovery flow that routes the user toward an alternative path that achieves the same underlying goal after the original path has been closed — by a refusal, an escalation denial, a capability limit, or a structural blocking condition that cannot be resolved by retrying. The user's goal is preserved; the approach is changed.

Redirect recovery is not a failure message. It is an active transition: the AI carries the user's goal and context into the alternative path, reducing the work required to continue.

Redirect recovery is distinct from retry recovery — retry re-attempts the same path; redirect changes the path. Redirect recovery is distinct from repair recovery — repair corrects something within the original path; redirect replaces the path entirely.

---

## Problem Solved

When an original path is permanently blocked, the user's goal does not disappear. Without redirect recovery, the user must independently identify an alternative, rebuild context, and restart. Redirect recovery shoulders this transition cost — it identifies the alternative, carries the context, and presents the new path as a continuation rather than a restart.

---

## When to Use

- A refusal pattern has closed the original request form — the underlying goal can still be addressed through an alternative approach
- An escalation denied the original action — a different action achieves the same outcome within the user's existing authority
- A capability limit prevents the AI from directly fulfilling a request, but a different formulation of the request is within scope
- A partial completion was delivered and the user needs to complete the excluded portions through an alternative resource or method
- A role escalation failed and there is an alternative path that does not require the elevated authority

---

## When NOT to Use

- The original path failed due to a transient condition — use retry recovery
- The original path requires data correction or state repair before it can continue — use repair recovery
- The underlying goal itself is prohibited, not just the path — redirect recovery must not be used to circumvent a safe refusal or policy refusal by offering an alternative that achieves the same prohibited outcome
- No meaningful alternative exists — do not fabricate alternative paths that are not genuinely available

---

## Entry Conditions

Redirect recovery activates when:

- The original path has reached a terminal blocking condition that is structural (not transient)
- The user's underlying goal remains achievable through at least one alternative path
- The blocking condition has been fully surfaced to the user (refusal, escalation denial, or limitation disclosure already delivered)

---

## Exit Conditions

Redirect recovery exits successfully when:

- The user selects an alternative path and the alternative path produces a result
- The user's goal is substantially achieved through the alternative

Redirect recovery exits without success when:

- The user reviews all alternatives and declines all of them — exits to abandon recovery
- All alternatives are also blocked when explored — exits to escalation or abandon recovery

---

## Recovery Objective

Preserve the user's goal and transfer the maximum possible context into an alternative workflow, minimizing the friction cost of switching paths. The user should experience redirect as a continuation, not a failure.

**Success criteria:** The user achieves their underlying goal through the alternative path. The redirect does not require the user to re-explain their intent from scratch.

**Completion conditions:** The alternative path produces a usable result for the user's original goal, and the user confirms it serves their need.

---

## Recovery Owner

| Component | Owner |
|---|---|
| Identifying alternatives | AI |
| Presenting alternatives with context | AI |
| Selecting an alternative | User |
| Executing the selected alternative | AI (or the target capability, if handoff) |

The user must make the selection — redirect recovery must not automatically commit to an alternative without user choice, because the alternatives may have different costs, implications, or requirements the user needs to evaluate.

---

## Recovery Actions

1. **Assess the user's underlying goal** — strip away the specific form of the blocked request and identify what the user was actually trying to accomplish. The alternative must address this goal, not just find a path that is unblocked.

2. **Identify viable alternatives** — for each alternative:
   - Confirm it is genuinely available in the current deployment
   - Confirm it achieves the same or substantially equivalent goal
   - Identify any differences in output format, authority required, or side effects
   - Confirm it is not also blocked by the same underlying condition

3. **Carry context into the alternative** — prepare whatever the user has already provided (inputs, constraints, context) for re-use in the alternative path. Do not require the user to re-specify information they have already given.

4. **Present alternatives with honest framing** — describe what each alternative produces, how it differs from the original, and what limitations it carries. Do not present an inferior alternative as equivalent to the original.

5. **Transition to the selected alternative** — once the user selects, execute immediately. Do not re-confirm, do not re-introduce.

---

## Goal Preservation

Goal preservation is the defining requirement of redirect recovery. At the moment of redirect, the AI must articulate the user's goal in their terms — not in the AI's terms or the system's terms. The alternative paths must all be assessed against this statement of goal, not against the literal form of the blocked request.

If the AI cannot identify the user's goal clearly enough to assess alternatives, it must ask a single clarifying question before presenting alternatives — not guess.

---

## Context Preservation

Context preservation determines whether the redirect feels like a continuation or a restart:

- User-supplied data, constraints, and preferences that were part of the original request must be carried into the alternative
- Prior AI outputs that remain valid and useful for the alternative path must be surfaced and offered for re-use
- Session history must be available to the alternative capability if a cross-capability handoff occurs

Context preservation is especially important when redirect involves a handoff to a different capability or system — the receiving capability must not require the user to re-specify what has already been established.

---

## User Choice Requirements

Redirect recovery must present alternatives as choices, not as a single predetermined path:

- Present up to three genuinely different alternatives (more creates decision paralysis)
- Each alternative must be described with enough specificity that the user can evaluate it
- The user must be able to decline all alternatives (which exits to abandon recovery)
- The default selection (if the user does not choose) is no selection — the AI must not auto-select an alternative

---

## Required Explanation Patterns

- **Limitation disclosure** — the reason the original path is closed must be clearly communicated before presenting alternatives. The user must understand why they are being redirected.
- **Alternative suggestion** — redirect recovery uses the alternative suggestion pattern to frame and present the available alternatives.
- **Decision summary** — for consequential workflows, include a summary of what the original path produced (if any partial output exists) alongside the alternative options.

---

## Required Permission Patterns

- If the selected alternative requires a permission gate that the original path did not, the appropriate gate applies when the user selects that alternative
- **Scoped permission** — if the alternative path requires access to a different scope of data or capability, a scoped permission grant may be required before the alternative can execute

---

## Related Uncertainty States

- **Unresolvable state** → redirect recovery is the primary path out of the unresolvable state when the task can be reformulated as a different, in-scope request
- **Insufficient information state** → if the missing information cannot be obtained for the original path but an alternative formulation does not require it, redirect recovery applies

---

## Related Refusal Patterns

- **Safe refusal** → redirect recovery may follow a safe refusal only if the alternative does not achieve the same prohibited outcome. Redirecting to a path that circumvents the refusal's grounds is prohibited.
- **Partial completion** → redirect recovery presents the path to complete what was excluded — the excluded portions become the redirected goal
- **Alternative suggestion** → redirect recovery implements the alternative suggestion pattern as its primary user interaction mechanism

---

## Related Escalation Paths

- **Role escalation** → if a role escalation denial closes the original path, redirect recovery may present an alternative that achieves the goal within the user's existing authority
- **Human handoff (escalation)** → if no automated alternative exists, redirect recovery may exit to human handoff as the alternative path

---

## User Communication

**At entry into redirect recovery:**
```
[What the original path achieved (if anything)] + [Why the original path is closed] + 
[Alternatives that achieve the same goal] + [What each alternative requires or produces]
```

**Tone:** Forward-looking. The user should feel that the AI is actively working to help them reach their goal, not reporting a failure.

**Structure:**
```
You wanted to [goal statement].

The original approach isn't available because [specific reason — already disclosed].

Here are alternatives that can get you there:

1. [Alternative A] — [what it produces] [how it differs]
2. [Alternative B] — [what it produces] [how it differs]

[Select A] [Select B] [Neither works for me]
```

---

## Audit Requirements

Configurable. In compliance contexts, log:
- The original path that was closed and the reason
- The alternatives presented
- The alternative the user selected
- Whether the selected alternative produced a successful outcome
- If the user declined all alternatives, the exit path taken

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Goal misidentification | AI identifies alternatives for the blocked request form rather than the underlying goal | Alternatives are technically available but do not serve the user's actual need |
| Insufficient alternatives | AI presents only one option (or none) when more exist | User has no meaningful choice; the redirect feels like a dead end |
| Prohibited redirect | AI presents an alternative that achieves the outcome the original safe refusal was designed to prevent | Active policy violation; the refusal's purpose is undermined |
| Context loss at handoff | User is redirected to a different capability but their context is not transferred | User must restart entirely; the redirect adds friction rather than reducing it |
| Auto-selection | AI selects the alternative without user choice | User may be committed to an alternative they did not evaluate |

---

## Fallback Behavior

If no viable alternative exists:
- Be direct: state clearly that no alternative path is available for this goal in this deployment
- Do not fabricate alternatives that are not genuinely available
- Transition to abandon recovery — allow the user to exit cleanly with their context preserved

If an alternative is selected but also fails:
- Apply the appropriate recovery flow for the new failure (retry, repair, or abandon)
- Do not recurse back into redirect recovery indefinitely — if a second redirect would be needed, escalate to human handoff

---

## Accessibility Considerations

- Alternative options must be presented as distinct interactive elements (buttons or links), not as undifferentiated text
- The user's attention must be drawn to the redirect prompt — position it prominently; do not bury it after a long explanation
- Screen reader users must receive the redirect options after the context — not interleaved with the explanation
- Keyboard users must be able to navigate between alternatives and select one without a mouse

---

## Enterprise Considerations

- **Cross-capability handoffs:** When redirect sends the user to a different AI capability, integration, or external system, the context transfer protocol must be defined in deployment configuration — not ad hoc
- **Redirect analytics:** Track which original paths most frequently require redirect. High redirect rates for a specific path indicate a design problem with that path's availability or scope definition.
- **Prohibited redirect enforcement:** Deployment policy must include redirect prohibition rules for paths that were closed by a safe refusal — the policy engine should validate that the alternative is not a circumvention path

---

## Example Scenario

**Context:** A sales analyst is using an enterprise AI to pull customer revenue data for a specific segment for a board presentation. The AI's data access scope in this deployment does not include revenue figures above $10M (covered by a data classification policy). The analyst's request is blocked by a scoped access policy.

**Original path closed:** Data access refusal — revenue data above $10M threshold is outside the analyst's current scope.

**Redirect recovery:**
```
You wanted the revenue breakdown for the enterprise segment for the board presentation.

I can't retrieve the full enterprise revenue data directly — figures above $10M 
are covered by a data classification policy for this deployment.

Here's what I can do instead:

1. Revenue trend analysis — I can show you year-over-year growth rates and 
   segment mix percentages without the absolute revenue figures, which may 
   serve the board presentation narrative without requiring the raw data.

2. Aggregated summary — I can request a pre-approved aggregated revenue summary 
   from the Finance team's reporting system, which is available to your role 
   and covers the enterprise segment.

3. Request scope expansion — I can initiate a scoped data access request to 
   your data steward, which typically completes in 1–2 business days. If the 
   board presentation isn't until next week, this is the cleanest path.

[Option 1 — Trend analysis] [Option 2 — Aggregated summary] [Option 3 — Request access]
```

The analyst selects Option 2. The AI immediately initiates the request to the Finance reporting system, carrying the analyst's original context (segment, time period, board presentation purpose) into the new path.
