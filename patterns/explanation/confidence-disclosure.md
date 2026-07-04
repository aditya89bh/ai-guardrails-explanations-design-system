# Confidence Disclosure

**Category:** Explanation pattern
**Sub-type:** Confidence disclosure
**Severity:** Informational (Level 0) to Advisory (Level 1)
**Status:** stable
**Phase:** 2B

---

## Problem It Solves

AI systems produce outputs with varying degrees of reliability, but most product surfaces present every output with equal visual weight. Users cannot distinguish between a highly confident factual response and a speculative inference from sparse data. Without calibrated confidence signals, users either over-rely on uncertain outputs in high-stakes decisions or develop blanket distrust because they cannot tell when the AI is on solid ground. Confidence disclosure provides the signal that enables calibrated trust: users can see where the AI is confident, where it is hedging, and adjust their reliance accordingly.

---

## Definition

A confidence disclosure communicates the AI system's degree of certainty in a specific output or output element to the user. It does not expose raw model internals (token probabilities, logits) — it translates confidence into a user-meaningful signal: a label, indicator, or explanatory phrase that tells the user how much weight to place on the output.

---

## When to Use

- The AI's output confidence varies meaningfully across outputs in the same session or product surface
- The deployment context is one where acting on a low-confidence output carries real cost — professional decisions, financial recommendations, clinical guidance, compliance analysis
- Users have the background to act on confidence signals (they know what to do when confidence is low)
- The output type admits graduated confidence — not binary pass/fail outputs where confidence is not a meaningful user-facing signal

---

## When Not to Use

- Confidence is uniformly high across all outputs in the context — surfacing confidence on every output when it is always the same value creates noise without signal
- The confidence signal would be misinterpreted by the target user population as a probability of the statement being true (as opposed to the AI's degree of certainty based on available data)
- The output is binary (yes/no, allowed/denied) and the confidence threshold is already embedded in the decision logic — disclose the reasoning instead, not a separate confidence signal
- The platform has a blanket policy of not disclosing model internals — in this case, use a limitation disclosure instead

---

## Trigger Conditions

- **Confidence threshold breach:** Output confidence for a specific claim or output falls below the deployment-configured advisory threshold; the disclosure changes from passive (no indicator) to active (labeled indicator)
- **Output type classification:** Certain output types always require confidence disclosure regardless of confidence level — e.g., medical differential diagnoses, financial projections, legal risk assessments
- **Data quality signal:** The underlying data used for the output has known quality limitations that affect the reliability of the confidence estimate itself (disclose this meta-uncertainty)
- **First-time output type:** When a user encounters a new output type for the first time, surface the confidence disclosure with an explanation of what the indicator means

---

## Explanation Depth

Confidence disclosure operates at three depths depending on the deployment context and user role:

| Depth | Label | Content | Use when |
|---|---|---|---|
| **Surface** | Badge or label only | "High confidence", "Uncertain", "Estimated" | General enterprise users; high-frequency outputs |
| **Contextual** | Label + one-line explanation | "Uncertain — based on limited training data for this sector" | Professional users; medium-stakes decisions |
| **Detailed** | Label + expandable rationale | Full explanation of what drives the confidence level, what data was used, and what would change the confidence | Power users; high-stakes or regulated decisions |

---

## User Action Supported

Confidence disclosure is informational — it does not require user action. It supports:
- **Decision adjustment:** User increases verification effort when confidence is low
- **Query refinement:** User adds more context to improve output confidence on retry
- **Escalation decision:** User decides to escalate to a human reviewer rather than rely on the low-confidence output
- **Documentation:** User includes confidence level in any downstream documentation of the AI output

---

## Copywriting Guidance

**Surface-depth labels:**
- High confidence → "High confidence" or "Confident"
- Moderate confidence → "Moderate confidence" or "Review recommended"
- Low confidence → "Uncertain" or "Low confidence — verify before use"

Do not use percentages (e.g., "73% confident") unless the deployment is an analytics tool where users understand statistical confidence. Percentages invite false precision and misinterpretation.

**Contextual-depth phrasing:**
- "Uncertain — this sector has limited representation in the available data. Treat as directional only."
- "High confidence — this response draws from well-established regulatory guidance with recent updates."
- "Estimated — the underlying figures are modeled from aggregated industry data, not direct measurement."

**Detailed-depth structure:**
- What the confidence level means for this output type
- What data or sources were used (link to source citation pattern if available)
- What would need to change to increase confidence

**Tone:** Calibrated, not alarming. "Uncertain" is not "wrong." Language must not imply the output is worthless at low confidence, but must not imply it is reliable either.

---

## Accessibility Requirements

- **Not color-only:** Confidence levels must be communicated with text labels, not color alone. A green/yellow/red scale without text labels is an accessibility failure.
- **Icon + text:** If icons (e.g., a filled circle, a hazard symbol) are used to represent confidence, they must have descriptive accessible names via `aria-label` or `title`.
- **Reading order:** Confidence disclosure must appear adjacent to or immediately after the content it describes, in the same reading order.
- **ARIA role:** Use `role="note"` for surface and contextual disclosure. For detailed depth, use `aria-expanded` on the expand toggle.
- **Expandable content:** If detailed rationale is behind an expand control, the control must be keyboard accessible and the expanded content must receive focus when opened.

---

## Enterprise Audit Considerations

**Audit logging:** Configurable. In regulated contexts, log:
- Which confidence level was displayed for which output
- Whether the user expanded to detailed depth
- Whether the user subsequently acted on a low-confidence output without verification

**Policy configurability:**
- Confidence thresholds that trigger Advisory disclosure must be configurable per deployment context and output type
- The display depth (surface / contextual / detailed) must be configurable per user role or product tier
- Whether confidence disclosure is shown on all outputs or only below-threshold outputs must be configurable

**Multi-tenant:** Tenants in regulated industries typically require contextual or detailed depth. General enterprise tenants may configure surface depth only.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Always-on high confidence | Disclosure always shows "High confidence" regardless of actual output quality | Users place excessive trust; the signal loses calibration and meaning |
| Percentage overload | Raw model probabilities shown to non-technical users | Misinterpretation; users treat probability as binary truth/false threshold |
| Confidence without action | Low confidence shown with no indication of what to do about it | Users feel informed but helpless; frustration without recourse |
| Confidence hiding in detail | Confidence level buried in expandable content that defaults closed | Users make decisions on low-confidence outputs without seeing the signal |
| Confidence on every token | Micro-level confidence shown for individual words or phrases | Cognitive overload; the signal becomes noise |

---

## Related Patterns

- **[Structured uncertainty disclosure](structured-uncertainty-disclosure.md)** — Combines confidence disclosure with limitation disclosure for high-stakes outputs requiring both signals
- **[Limitation disclosure](limitation-disclosure.md)** — Pair when the confidence constraint is driven by a capability boundary, not just data quality
- **[Source citation](source-citation.md)** — Pair to explain what data underpins the confidence level
- **[Uncertainty states](../../docs/patterns/index.md)** — Confidence disclosure drives the display logic for uncertainty states at the output level
- **[Inline warning](../warning/inline-warning.md)** — For low-confidence outputs at Advisory severity, an inline warning often pairs with the confidence disclosure to prompt verification

---

## Example Scenario

**Context:** A legal AI platform analyzes a vendor contract and identifies potential compliance risks. Each identified risk is presented with a confidence disclosure that reflects how reliably the AI can classify the risk as a genuine compliance exposure versus a false positive.

**High-confidence item:**
```
● Indemnification clause — unlimited liability exposure
  Confident — this clause pattern matches a well-documented risk category with consistent case law.
```

**Low-confidence item:**
```
◐ IP ownership assignment — potentially ambiguous
  Uncertain — the clause uses non-standard language with multiple plausible interpretations. 
  Legal review recommended before signing. [See rationale ↗]
```

On expanding "See rationale":
> "This clause references 'developed works' without defining what constitutes development activity under the agreement. Three interpretations are plausible under common contract law. The AI cannot determine which interpretation the parties intend. A qualified attorney should review this clause before the contract proceeds to signature."

**What the user can do:** Proceed confidently on the high-confidence items, escalate the uncertain item to a lawyer, and use the rationale to brief that lawyer efficiently.
