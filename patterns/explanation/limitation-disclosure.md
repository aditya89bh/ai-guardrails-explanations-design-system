# Limitation Disclosure

**Category:** Explanation pattern
**Sub-type:** Limitation disclosure
**Severity:** Advisory (Level 1)
**Status:** stable
**Phase:** 2B

---

## Problem It Solves

AI systems have capability boundaries that are often invisible to users. A system trained on data through a certain date cannot reliably answer questions about events after that date — but it will often still try. A model fine-tuned for one domain may produce plausible-sounding but unreliable outputs when asked about a domain it was not trained on. Without explicit disclosure of these limitations, users cannot know when they are operating within the AI's reliable range versus outside it. They extend trust they should be withholding. Limitation disclosure makes capability boundaries explicit and actionable — not as a liability disclaimer, but as a functional signal users can use to navigate the system.

---

## Definition

A limitation disclosure communicates a specific, functional boundary of the AI system's capability that is relevant to the user's current request or context. It distinguishes between what the AI can do reliably, what it can do with reduced confidence, and what it cannot do at all — and directs users toward appropriate alternatives when the boundary is reached.

---

## When to Use

- The user's request falls at or near the boundary of the AI's reliable operating domain
- The AI's output for this type of request is systematically less reliable than for other output types (domain gap, data gap, training cutoff)
- The limitation is structural — it will not improve on retry and cannot be resolved by rephrasing the query
- The limitation affects the current session or context-level capability (e.g., the user's data environment has restricted the AI's access to relevant sources)
- Disclosing the limitation enables the user to take a better alternative path

---

## When Not to Use

- The limitation is a one-time, transient error — use an error recovery flow instead
- The limitation applies to all AI outputs in this deployment, universally — an ambient warning at session start is more appropriate than per-output limitation disclosure
- The limitation is so fundamental that it constitutes a refusal — if the AI cannot meaningfully engage with the request at all, use a refusal state
- The "limitation" is actually uncertainty about a specific output — use confidence disclosure instead; limitation disclosure describes structural capability boundaries, not output-level confidence

---

## Trigger Conditions

- **Scope boundary:** The request asks about a domain, time period, geography, or data type that the AI's deployment has not been configured to handle reliably
- **Training data gap:** The AI's knowledge base does not cover the requested topic with adequate depth for reliable output in a consequential context
- **Temporal boundary:** The request involves events, regulations, prices, or conditions after the AI's training or knowledge cutoff
- **Access restriction:** The AI's access to relevant data or documents has been restricted by the deployment configuration (e.g., the user's role does not grant access to the data the AI would need to answer reliably)
- **Task type boundary:** The AI is asked to perform a task type it is not equipped to perform (e.g., complex numerical computation, real-time data retrieval, multi-modal analysis not supported by the deployment)

---

## Explanation Depth

| Depth | Content | Use when |
|---|---|---|
| **Label** | Brief identification of the limitation — "This topic is outside my current knowledge domain" | Low-stakes interactions; user just needs to know to look elsewhere |
| **Contextual** | Identification + specific boundary + recommended alternative | Standard enterprise deployment; user needs to take a concrete next step |
| **Detailed** | Identification + boundary explanation + why the boundary exists + alternatives + how to tell when you're within range | High-stakes contexts; power users; onboarding for new AI capabilities |

---

## User Action Supported

- **Redirect:** User goes to a different resource, tool, or person better suited to the request
- **Scope adjustment:** User rephrases or narrows the request to bring it within the AI's reliable range
- **Escalation decision:** User decides the limitation means this request requires human handling
- **Expectation calibration:** User understands that the AI will handle similar requests with reduced reliability in this context and adjusts their verification behavior accordingly

---

## Copywriting Guidance

**Label depth:**
- "My knowledge on this topic ends in October 2024. I may not have current information."
- "This question involves real-time data I don't have access to in this environment."
- "Clinical dosage calculations are outside my reliable operating range. Please consult a licensed pharmacist."

**Contextual depth (recommended structure):**
`[What the limitation is] + [Where the boundary is specifically] + [What to do instead]`
- "My legal knowledge covers jurisdictions in the US and EU only. For questions about Australian contract law, consult a qualified Australian legal professional or a legal database licensed for Australian jurisdiction."
- "My market data in this environment is from the prior trading day. For current prices, use the live data terminal."

**Detailed depth structure:**
1. What the limitation is
2. Where exactly the boundary falls (specific date, domain, geography, data type)
3. Why the boundary exists (training scope, access restriction, task type)
4. What the AI can and cannot do at the boundary (partial capability if any)
5. What the user can do instead

**Tone:** Matter-of-fact and helpful. Limitation disclosures are not apologies. The AI is communicating a functional boundary, not admitting a failure. "I don't have access to this" is clear and neutral. "I'm so sorry, I'm unable to help with this" is neither honest nor useful.

**What to avoid:**
- Disclosing the limitation only at the end of a long response, after the user has already read and potentially acted on unreliable content
- Using limitation language to refuse a request that the AI could actually engage with at reduced confidence — use confidence disclosure instead, and let the user decide
- Vague boundaries ("I may not have all the information you need") that give no actionable signal

---

## Accessibility Requirements

- **Placement:** Limitation disclosures must appear before or alongside the affected content, not buried at the end. A limitation that appears after three paragraphs of output will be missed.
- **ARIA role:** Use `role="note"` for inline limitation disclosures. Use `role="status"` if the disclosure updates dynamically based on session changes.
- **Contrast:** Must meet WCAG 2.1 AA.
- **Icon + text:** If limitation disclosure uses an icon (e.g., a boundary or scope icon), the icon must have an accessible name.
- **Not color-only:** Must not communicate limitation boundaries through color alone.

---

## Enterprise Audit Considerations

**Audit logging:** Configurable. In regulated contexts where acting on a limited AI output creates liability, log:
- Which limitation was disclosed for which output
- Whether the user proceeded after seeing the limitation
- Whether the user took the recommended alternative path

**Policy configurability:**
- Which limitation types trigger disclosure must be configurable by deployment context
- The recommended alternative ("consult a licensed professional") must be configurable to match the organization's preferred escalation path
- Whether the limitation is shown inline (per output) or as a session-level ambient warning must be configurable based on limitation type

**Knowledge cutoff transparency:** Enterprise deployments must maintain a documented, user-accessible statement of the AI's training and knowledge cutoff dates, data domains, and geographic scope. The limitation disclosure pattern references this documentation. It must be kept current.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Limitation disclosed after unreliable output | AI produces a long response and adds a limitation notice at the end | User has already read and may have acted on the unreliable output; the disclosure is too late |
| Limitation too broad | "I may not know everything about this topic" | No actionable signal; user cannot calibrate their reliance |
| Limitation as refusal avoidance | AI discloses a limitation instead of attempting a reasonable partial response | User is blocked from useful output when a hedged partial response would serve them |
| Limitation not updated | Deployment knowledge cutoff has changed but limitation disclosure still states the old date | Users receive misleading information about the AI's actual capability boundary |
| Limitation never shown | Limitation exists but is not disclosed; AI produces unreliable output with no signal | Users rely on systematically unreliable outputs without knowing it |

---

## Related Patterns

- **[Confidence disclosure](confidence-disclosure.md)** — Pair when the limitation manifests as output-level uncertainty (lower confidence), not just a structural boundary
- **[Structured uncertainty disclosure](structured-uncertainty-disclosure.md)** — Use when both a capability limitation and output-level uncertainty need to be communicated together for a high-stakes output
- **[Ambient warning](../warning/ambient-warning.md)** — Use instead when the limitation applies to the entire session, not specific outputs
- **[Scope refusal](../refusal/scope-refusal.md)** — Escalate to this when the limitation is so fundamental the AI cannot engage with the request meaningfully
- **[Redirect recovery](../recovery/redirect-recovery.md)** — The recommended alternative in a limitation disclosure typically feeds a redirect recovery flow

---

## Example Scenario

**Context:** An enterprise AI assistant is being used by a global compliance team. A compliance officer in the Singapore office asks the AI to summarize the current regulatory requirements for cryptocurrency exchange licensing in Singapore.

**AI response with contextual-depth limitation disclosure:**

> Based on available information as of October 2024, Singapore's Payment Services Act (PSA) requires digital payment token service providers to obtain a Major Payment Institution (MPI) license for cryptocurrency exchange operations.
>
> ⚠ **Regulatory knowledge boundary:** My information on Singapore's MAS (Monetary Authority of Singapore) regulatory framework ends in October 2024. This is a rapidly evolving area of regulation. Requirements may have changed, and licensing thresholds or application procedures may have been updated.
>
> **For current requirements:** Consult the MAS official website or your regulatory counsel for the current version of the Payment Services Act and any recent MAS notices or circulars.

**What the compliance officer can do:** Use the AI's output as background context and orientation, then verify with MAS directly before making any compliance decisions. They know exactly what to verify and where to go.

**What would go wrong without this pattern:** The compliance officer takes the October 2024 regulatory summary as current, prepares a compliance assessment based on it, and submits it internally. If regulations changed in Q1 2025, the assessment is inaccurate. The organization has a compliance gap based on outdated AI output.
