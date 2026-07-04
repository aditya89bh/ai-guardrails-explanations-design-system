# Structured Uncertainty Disclosure

**Category:** Explanation pattern
**Sub-type:** Structured uncertainty disclosure
**Severity:** Advisory (Level 1) to Caution (Level 2)
**Status:** stable
**Phase:** 2B

---

## Problem It Solves

For high-stakes outputs, a single uncertainty signal — a confidence badge or a brief limitation note — is insufficient. A decision-maker needs to understand not just that the AI is uncertain, but where that uncertainty comes from, what it affects, what is reliable within the output, and what they should do about it. Structured uncertainty disclosure addresses this need by combining multiple uncertainty signals into a single, organized disclosure artifact that covers confidence, limitations, and recommended handling — at the moment the output is consumed, not as a separate inquiry.

---

## Definition

A structured uncertainty disclosure is a composite explanation that combines confidence disclosure, limitation disclosure, and recommended handling guidance into a coherent, structured artifact attached to a high-stakes AI output. It answers three questions in one place: how confident is the AI, what constrains that confidence, and what should the user do given this uncertainty.

---

## When to Use

- The output is high-stakes — it directly informs a consequential decision in a professional, clinical, financial, legal, or compliance context
- Both confidence-level uncertainty (the AI is not sure about this specific output) and structural limitation uncertainty (the AI's capability is constrained in this area) apply simultaneously to the same output
- The user needs a single, organized uncertainty picture rather than scattered signals across the output
- The deployment context requires a documented uncertainty disclosure as part of the output artifact (for audit or regulatory purposes)
- Combining confidence and limitation signals into one disclosure reduces cognitive load compared to managing them separately

---

## When Not to Use

- Only one type of uncertainty applies — use confidence disclosure or limitation disclosure individually; do not use structured uncertainty disclosure to pad a simple signal
- The output is low-stakes — structured disclosure adds friction that is disproportionate to the value
- The user is in an exploratory session where uncertainty expectations are already understood and calibrated — surface uncertainty at the output level only if something is significantly lower than expected
- The output type is already governed by a domain-specific disclosure requirement (e.g., a mandated clinical disclaimer template) — integrate into that template rather than adding a separate structured disclosure

---

## Trigger Conditions

Structured uncertainty disclosure fires when two or more of the following are simultaneously true for the same output:

- **Confidence threshold breach:** Overall output confidence falls below the configured caution threshold for this deployment
- **Scope boundary (partial or full):** Part or all of the output falls at or near the AI's domain boundary
- **Data quality signal:** The underlying data has known quality issues that affect the reliability of both specific outputs and the overall assessment
- **Multiple plausible interpretations:** The AI identified multiple plausible responses and the selected one is not definitively superior
- **Compliance-designated output type:** The output type is classified as requiring structured disclosure regardless of confidence level (e.g., all clinical differential diagnoses, all credit risk assessments, all regulatory interpretations in a new jurisdiction)

---

## Explanation Depth

Structured uncertainty disclosure always operates at contextual or detailed depth — it is not appropriate for surface-level treatment. The depth determines how much supporting detail accompanies each component.

| Depth | Components included | Use when |
|---|---|---|
| **Contextual** | Confidence summary + key limitations + recommended handling | Standard high-stakes enterprise; professional users |
| **Detailed** | Contextual + per-element confidence breakdown + sources with quality notes + decision path options | Regulated contexts; outputs subject to formal review or sign-off |

---

## Structure

A structured uncertainty disclosure is always presented as a discrete, labeled section — not inline within the output prose. It follows the output it describes and precedes any action buttons.

**Standard structure:**

```
UNCERTAINTY DISCLOSURE

Confidence: [Level label — High / Moderate / Low / Uncertain]
[One-line explanation of what drives the confidence level]

Limitations affecting this output:
• [Limitation 1 — specific and actionable]
• [Limitation 2 — specific and actionable]

Reliable elements:
• [What the AI is confident about within this output]

Uncertain elements:
• [What the AI is uncertain about and why]

Recommended handling:
[Specific action the user should take given this uncertainty — verification method, 
escalation path, or conditions under which this output can be used as-is]
```

---

## User Action Supported

Structured uncertainty disclosure is designed to support a specific decision: whether to use the output as-is, verify before use, escalate, or reject and request an alternative. It must make that decision tractable:

- **Use as-is:** User determines the reliable elements cover what they need and the uncertain elements do not affect their decision
- **Verify before use:** User takes the recommended verification step, then proceeds
- **Escalate:** User determines uncertainty is too high for the stakes and initiates an escalation path
- **Request alternative:** User requests a more targeted query that avoids the uncertain domain

---

## Copywriting Guidance

Each component of the structured disclosure has its own language requirements:

**Confidence line:**
- "Moderate confidence — limited data available for this specific market segment in this time period"
- "Low confidence — this jurisdiction's regulatory environment changed significantly after my knowledge cutoff"
- Do not use raw percentages. Do not use hedging language that applies to every possible output ("may not be accurate").

**Limitation bullets:**
- One limitation per bullet. Each bullet must name the specific limitation, not just gesture at uncertainty.
- "My data on this sector ends October 2024 — figures may not reflect recent developments"
- "Access to the client's internal pricing contracts is restricted in this environment — pricing comparisons are based on published rates only"

**Reliable elements:**
- Specifically name what the AI is confident about: "The regulatory framework description is based on well-established guidance and is reliable within the stated jurisdiction and time period."

**Uncertain elements:**
- Specifically name what is uncertain and why: "The projected growth figures are modeled estimates, not measured data. Actual results may differ significantly."

**Recommended handling:**
- One specific action: "Verify the projected figures against the latest industry report before including in board materials."
- Not: "Please double-check everything."

---

## Accessibility Requirements

- **Disclosure section must be labeled:** Use a visible heading ("Uncertainty Disclosure") with appropriate heading level. Screen readers must announce the heading when navigating to this section.
- **Bullet lists:** Use `<ul>` or `<ol>` for limitation and reliable/uncertain element lists — not plain text with dashes.
- **Contrast:** All disclosure text must meet WCAG 2.1 AA.
- **Not color-only:** Confidence level must be communicated with text, not just a colored badge.
- **Collapsible option:** In dense interfaces, the full disclosure may be collapsed with a summary ("Moderate confidence — 2 limitations") visible by default. Collapsed content must be keyboard accessible with proper `aria-expanded` state.

---

## Enterprise Audit Considerations

**Audit logging:** Required in all contexts where structured uncertainty disclosure is triggered. Log:
- The full disclosure content at time of output
- The confidence level and each limitation disclosed
- Whether the user proceeded, verified, escalated, or requested an alternative
- The output it was attached to

**Compliance depth:** In regulated contexts (clinical, financial, legal), the structured uncertainty disclosure is a mandatory component of the output record. It must be immutable after generation. If a new output is generated, the new disclosure is a new record — it does not replace the prior one.

**Configurable components:** The recommended handling text must be configurable to match the organization's actual escalation paths and verification resources. Generic "please verify" language is insufficient for regulated deployments — the disclosure must name the specific verification step (e.g., "Verify against current MAS regulatory circulars" not just "verify this information").

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Structured disclosure on low-stakes outputs | Full structured disclosure appears on routine informational queries | Users habituate to the format and stop reading it when it matters |
| Generic recommended handling | Recommended handling says "verify this before use" without specifying how or against what | Users do not know what to verify against; disclosure provides false assurance |
| Confident elements not identified | Disclosure lists only uncertain elements; user cannot tell what is reliable | Users apply excessive skepticism to reliable output elements; productivity loss |
| Disclosure below the fold | Structured disclosure placed after long output text | Users miss it because they stop reading after the main output |
| Disclosure not attached to agentic outputs | Agentic tasks produce outputs without structured disclosure even when uncertainty is high | Users receive uncertain agentic outputs as if they are reliable decisions |

---

## Related Patterns

- **[Confidence disclosure](confidence-disclosure.md)** — The confidence component of this pattern; use individually for lower-stakes outputs
- **[Limitation disclosure](limitation-disclosure.md)** — The limitation component of this pattern; use individually when only structural limitations apply
- **[Source citation](source-citation.md)** — Pair with the detailed depth to explain what data supports the reliable elements
- **[Reasoning trace](reasoning-trace.md)** — Pair when the user needs to examine the AI's logic, not just the uncertainty picture
- **[Human handoff escalation](../escalation/human-handoff.md)** — The recommended handling in a structured uncertainty disclosure often leads to human handoff when uncertainty is high in a high-stakes context
- **[Uncertainty states](../../docs/patterns/index.md)** — Structured uncertainty disclosure implements the user-facing presentation of the uncertainty state patterns

---

## Example Scenario

**Context:** A healthcare AI platform is being used by a clinical pharmacist to review a patient's medication regimen. The patient has an uncommon combination of conditions and medications. The AI generates a drug interaction analysis but detects that it has limited training data for one of the medications (a recently approved drug) and that one of the patient's conditions falls at the edge of its clinical domain.

**AI output:**

> Drug interaction analysis for Patient #A8821 — 7-drug regimen review
>
> [... interaction analysis output ...]
>
> ---
> **UNCERTAINTY DISCLOSURE**
>
> **Confidence:** Low — one medication in this regimen has limited representation in the training data
>
> **Limitations affecting this output:**
> - Lemivratinib (approved Q4 2024) has limited post-approval interaction data; my analysis of this drug is based on phase III trial data only, not real-world use data
> - The patient's hepatic function classification falls at the boundary of my clinical guidance data; dosing recommendations for borderline hepatic impairment may not reflect current clinical consensus
>
> **Reliable elements:**
> - Interactions among the 6 established medications are well-characterized; analysis of those interactions is high confidence
> - The flagged interaction between metformin and the patient's diuretic is a well-documented risk; this finding is reliable
>
> **Uncertain elements:**
> - Any interaction involving lemivratinib is based on limited data; findings should be treated as preliminary
> - Dosing adjustments for borderline hepatic impairment are uncertain; clinical judgment is required
>
> **Recommended handling:** This analysis should be reviewed by a clinical pharmacologist before the regimen is confirmed. For lemivratinib specifically, consult the current prescribing information and any available post-approval safety reports from the manufacturer.

**What the clinical pharmacist can do:** Act confidently on the reliable interaction findings, escalate the lemivratinib and hepatic impairment questions to a clinical pharmacologist, and document the structured disclosure in the patient record as part of the medication review.
