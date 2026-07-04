# Safe Refusal

**Category:** Refusal state
**Sub-type:** Safety refusal
**Severity:** Blocking (Level 3) to Critical (Level 4)
**Status:** stable
**Phase:** 2E

---

## Definition

A safe refusal is a complete, unconditional refusal of a request on the grounds that fulfilling it would create a material safety, harm, or ethical risk that cannot be mitigated by partial completion, constraints, or alternative framing. Unlike other refusal patterns, the safe refusal does not offer a path to completion — the request itself is the problem, not the user's framing or the AI's capability.

Safe refusal is the highest-friction refusal pattern. It must not be applied as a convenience or as a substitute for a more nuanced refusal strategy (such as constrained completion or alternative suggestion). Overuse of safe refusal trains users to perceive the AI as broadly restrictive rather than precisely calibrated.

---

## Trigger Conditions

A safe refusal is triggered when:

- The request, if fulfilled, would produce content or take an action that creates a direct and material risk of physical, psychological, financial, or legal harm to identifiable individuals
- The request matches a policy or regulatory prohibition that has no override mechanism
- The safety signal is unambiguous — a more nuanced reading of the request does not yield an innocent interpretation
- The AI has been specifically configured to refuse this request category without exception for this deployment
- Completing the request would require the AI to generate content it cannot verify, and the verification gap creates a safety or liability risk that disclosure cannot adequately address

---

## Why Refusal Occurred

A safe refusal must explain the reason for refusal at whatever level of specificity the deployment's disclosure policy permits. The user must understand:
- That the refusal is unconditional — not a capability limitation and not a policy that can be appealed in this session
- The general category of the reason (safety, harm prevention, policy prohibition)
- What the AI cannot do, but not necessarily the specific internal rule or classifier score that triggered the refusal

The explanation must not:
- Use accusatory language implying the user had harmful intent (the request may have been made in good faith)
- Reveal specific detection thresholds or classifier details that would help bad actors evade detection
- Be deliberately vague to the point of being useless ("I can't help with that")

---

## User Messaging

**Structure:** `[What is being refused] + [Why, at the appropriate disclosure level] + [What the AI can still do, if anything] + [Alternative path, if any]`

**Good examples:**
- "I can't generate content that provides instructions for causing physical harm to a person. If you're working on a safety training scenario, I can help you develop safety-awareness materials that don't include operational harm instructions."
- "This request cannot be completed — providing detailed information on bypassing security controls in production systems is outside what I'm permitted to do in this deployment, regardless of context. If you're conducting authorized security testing, contact your security team for the appropriate tooling."
- "I won't generate this content. It involves creating material that could be used to impersonate a specific individual in a way that could cause financial or reputational harm. If you're working on a fraud-awareness training scenario, I can help with clearly labeled illustrative examples that don't involve real people."

**Bad examples:**
- "I can't help with that." — too vague; gives the user no information
- "That's dangerous and I won't do it." — accusatory; assumes bad intent
- "As an AI, I have limits on what I can discuss." — deflects to capability framing rather than honest policy framing

---

## What Can Still Be Completed

A safe refusal is complete — the refused request cannot be completed in any form. However, the AI must assess whether any related need can be addressed:
- If the user's underlying legitimate need can be met through a different approach, surface it
- If a clearly adjacent task is completable and clearly distinct from the refused task, offer it explicitly
- If nothing adjacent exists, say so directly and do not invent alternative paths that do not exist

---

## Alternatives

The alternatives section of a safe refusal must be honest: if there is no alternative path, say so. If there is, name it specifically. Do not offer generic "reach out to us for help" placeholders.

In regulated or enterprise deployments, alternatives may include:
- Routing to a compliance officer or legal team for guidance
- Providing documentation on the applicable policy that explains the prohibition
- Suggesting a separately authorized process for contexts where the request might be legitimate (e.g., security researchers, content moderation teams)

---

## Recovery Path

A safe refusal has no in-session recovery path — the refused request cannot be completed in this session, in this form. The user's path forward is:
- Use the stated alternative if one exists
- Seek the task through an appropriately authorized channel outside this AI deployment
- Contact the system administrator or compliance team if they believe the refusal is incorrect

If the refusal was triggered in error (false positive), the recovery path is a reporting mechanism — a way for the user to flag the refusal so it can be reviewed. The refusal itself is not reversed in-session.

---

## Related Uncertainty States

- **Unresolvable State** → The unresolvable state often exits through safe refusal when the task cannot be completed and safety signals are present
- **Low Confidence State** → Safe refusal is never appropriate solely because confidence is low; low confidence triggers disclosure and restriction, not safety refusal

---

## Related Permission Patterns

No permission gate can override a safe refusal. An elevated user role, a delegated permission, or a session permission cannot unlock a request that has been flagged for safe refusal. If the deployment requires an exception mechanism for specific authorized users (e.g., content moderation teams), that exception must be built into the deployment configuration — not granted by user-level permissions in-session.

---

## Enterprise Audit Considerations

**Audit logging:** Required. Log:
- The refused request (or a representative summary if the full content is sensitive)
- The refusal trigger category
- The refusal message shown to the user
- Whether the user made a follow-up attempt with a modified request
- Timestamp, session, user, and deployment identifiers

**False positive review process:** Enterprise deployments must define a process for users to report suspected false-positive safe refusals. This process must be surfaced in the refusal message. The review queue must be monitored; unreviewed false positive reports within a reasonable window are a deployment health gap.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Over-triggering | Safe refusal applied to requests that could be handled by constrained completion or alternative suggestion | Users perceive AI as blunt and over-cautious; legitimate use cases are blocked |
| Vague refusal message | User receives "I can't help with that" with no explanation | User cannot understand what triggered the refusal, cannot appeal, and cannot find an alternative |
| Accusatory framing | Refusal implies the user had harmful intent | User trust is damaged; legitimate users feel falsely accused |
| No alternative offered | Refusal is complete but no adjacent path is surfaced even when one exists | User is left entirely without a path forward for a legitimate underlying need |
| No false-positive path | Refusal occurs but there is no way for the user to report a suspected error | Systematic false positives go undetected; the AI improves neither for that user nor for the deployment |

---

## Example Scenario

**Context:** An enterprise AI assistant used by a financial services firm receives a request from a user asking it to generate a synthetic but realistic-looking customer statement that could be presented to a third party as genuine.

**Trigger:** The request matches a financial fraud pattern — creating documents that misrepresent their origin to third parties, regardless of the stated purpose.

**Safe refusal response:**
```
This request cannot be completed.

Generating documents designed to appear as genuine customer statements for presentation 
to third parties creates material risk of fraud under financial services regulations, 
regardless of the intended use.

If you're working on:
• Fraud training materials: I can generate clearly watermarked "SAMPLE — NOT A GENUINE 
  DOCUMENT" examples with realistic structure but obvious labeling
• Testing financial document workflows: Contact your compliance team for approved test 
  data generation processes

If you believe this refusal is incorrect for your use case, use [Report this refusal ↗] 
to have it reviewed by your system administrator.
```

The refusal is specific, non-accusatory, offers two legitimate adjacent alternatives, and provides a false-positive reporting path.
