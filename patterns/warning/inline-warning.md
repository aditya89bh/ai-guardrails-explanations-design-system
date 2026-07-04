# Inline Warning

**Category:** Warning pattern
**Sub-type:** Inline warning
**Severity:** Advisory (Level 1)
**Status:** stable
**Phase:** 2A

---

## Problem It Solves

AI outputs frequently contain elements that require user judgment before being acted on — estimated figures, data from a source with limited freshness, outputs that assume a context the AI cannot verify, or content that is plausible but should not be treated as authoritative. Without any signal, users over-trust these outputs and act on them without verification. Inline warnings attach the concern directly to the relevant output element, at the moment it is consumed, without interrupting the user's workflow.

---

## Definition

An inline warning is a non-blocking, contextually positioned alert that surfaces a concern about a specific piece of content or output — adjacent to that content, within the natural reading flow. The user is informed but not stopped. Agency remains entirely with the user.

---

## When to Use

- The concern applies to a specific element of an output, not the output as a whole
- The concern is advisory in nature — important, but not sufficient reason to block the user
- The user can reasonably proceed with awareness of the concern
- The action the user might take based on this output is reversible
- The warning can be communicated in one to two short sentences without requiring explanation infrastructure

---

## When Not to Use

- The concern applies to the entire output or the entire action — use an ambient warning or modal warning instead
- The action the user is about to take is irreversible — use a permission gate
- The concern requires the user to take a specific action before proceeding — use a blocking warning or modal warning
- The warning would appear on every item in a long list, creating habituation — use an ambient warning at the container level instead
- The severity justifies interrupting the user's flow — use a modal warning

---

## Trigger Conditions

- **Confidence threshold breach:** The AI's confidence in a specific claim, figure, or recommendation falls below the configured advisory threshold for the deployment context
- **Data sensitivity signal:** The referenced data is marked as estimated, derived, or sourced from a feed with known staleness
- **Scope boundary (partial):** The AI produced a response but part of it falls outside its verified knowledge domain
- **Output staleness signal:** The referenced information has a known expiry or freshness constraint that has been breached or is approaching
- **Uncertainty ceiling (localized):** A specific sub-claim within an otherwise confident output has multiple plausible interpretations

---

## Severity Level

**Advisory (Level 1).** The user is informed but not blocked. The inline warning does not prevent any action. If severity escalates — for example, because the user has acknowledged the warning and is about to act on the flagged content in a high-stakes context — the system should consider escalating to a modal warning.

---

## User Action Required

None required. The user may:
- Read and proceed
- Read and investigate further
- Read and discard the flagged content

The warning must not require dismissal, acknowledgment click, or any interaction to clear.

---

## Explanation Requirements

The inline warning must state:
1. **What the concern is** — the specific reason the warning exists (e.g., "This figure is estimated")
2. **Why it matters in this context** — one short phrase connecting the concern to user impact (e.g., "Verify before including in a report")
3. **What the user can do** — optional but strongly recommended; one concrete action (e.g., "Check the source data")

The warning must not include:
- Technical model internals (confidence scores as raw percentages unless the context is an analytics tool)
- Vague hedges without a specific concern ("This may not be accurate")
- Legal boilerplate that displaces the useful information

---

## Copywriting Guidance

**Structure:** `[What is flagged] — [Why it matters] — [Optional: what to do]`

**Good examples:**
- "This figure is estimated from incomplete data. Verify before use in external documents."
- "Source last updated 47 days ago. Time-sensitive decisions should use current data."
- "This recommendation assumes standard configuration. Review if your environment differs."

**Bad examples:**
- "AI outputs may be inaccurate." — no specificity, will be ignored
- "Warning." — meaningless without content
- "The model's confidence is 0.61 for this token sequence." — exposes internals with no user value

**Tone:** Matter-of-fact. Not apologetic, not alarmist. State the fact and move on.

**Length:** One to two sentences maximum. Inline warnings that require more explanation should be escalated to a modal or moved to an explanation pattern.

---

## Accessibility Requirements

- **Not color-only:** The warning state must be communicated with an icon (e.g., warning triangle) and text label in addition to any color treatment. Color alone is insufficient.
- **Icon alt text:** Warning icon must have descriptive alt text: `alt="Warning"` or equivalent accessible label
- **Reading order:** The warning must appear immediately after the flagged content in DOM order, so screen readers encounter it at the correct point in the reading flow
- **Contrast:** Warning text must meet WCAG 2.1 AA contrast requirements (minimum 4.5:1 against background)
- **No auto-dismiss:** Inline warnings must not disappear automatically. Users relying on screen readers or reading slowly must not miss them.
- **ARIA:** Use `role="note"` or `aria-label` to identify the warning to assistive technology. Do not use `role="alert"` — that is for time-sensitive, assertive announcements and will interrupt screen reader flow inappropriately for a passive inline element.

---

## Enterprise Audit Considerations

**Audit logging:** Configurable. By default, inline warnings at Advisory severity do not require audit logging. Deployments in regulated contexts (financial services, healthcare, legal) should configure logging for:
- Which warning was displayed
- The content element it was attached to
- The session identifier
- Whether the user subsequently acted on the flagged content

**Policy configurability:** The confidence threshold that triggers inline warnings must be configurable per deployment context. A general-purpose assistant may warn at a lower confidence threshold than a specialized clinical tool.

**Multi-tenant:** Each tenant may configure independent warning thresholds. A tenant operating in a regulated industry should have a lower (more sensitive) threshold than a general enterprise tenant.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Warning on every item | Inline warning appears on most or all outputs in a list or result set | Users habituate and stop reading warnings entirely |
| Vague warning text | Warning does not specify what the concern is | Users cannot act on the information; trust degrades |
| Missing icon | Warning communicated by color only | Inaccessible to color-blind users; undetectable in low-color environments |
| Warning too small | Warning text rendered at font size below body text | Users miss it; particularly problematic for users with low vision |
| Warning blocks layout | Warning causes content reflow that disrupts the reading context | User loses their place; warning becomes associated with disruption rather than information |

---

## Recovery Path

Inline warnings do not require a recovery flow because they do not block users. If a user acts on flagged content and the result is an error or problem, the recovery path is handled by the relevant recovery flow for that downstream action (typically a retry recovery or repair recovery). See [`patterns/recovery/`](../recovery/) for recovery flow specifications.

---

## Related Patterns

- **[Ambient warning](ambient-warning.md)** — Use instead when the concern applies to the entire output container, not a specific element, or when inline warnings would appear too densely
- **[Modal warning](modal-warning.md)** — Escalate to this when the concern justifies interrupting the user's flow before they can act
- **[Blocking warning](blocking-warning.md)** — Escalate to this when the user must not proceed without resolving the concern
- **[Progressive warning](progressive-warning.md)** — Use instead when severity should increase as the user moves toward acting on the flagged content
- **[Confidence disclosure](../explanation/confidence-disclosure.md)** — Use alongside when the user needs to understand the AI's confidence level, not just that a concern exists
- **[Limitation disclosure](../explanation/limitation-disclosure.md)** — Use alongside when the scope of the AI's knowledge is the underlying reason for the warning

---

## Example Scenario

**Context:** An enterprise AI assistant is helping a financial analyst build a quarterly forecast. The analyst asks for revenue projections for a specific market segment. The AI generates a projection but it includes a figure derived from a third-party data feed that was last updated 52 days ago, which exceeds the configurable freshness threshold of 30 days for this tenant.

**Inline warning rendered:**
```
Q3 projected revenue: $4.2M
⚠ Source data is 52 days old. This figure may not reflect recent market conditions. 
  Verify against current feed before including in board materials.
```

**What the analyst can do:** Proceed with the projection knowing the constraint, or open the source data panel to check the current feed. The inline warning does not stop them from doing either.

**What would go wrong without this pattern:** The analyst includes the $4.2M figure in board materials. The figure is later found to be significantly off due to market movement in the past 52 days. Neither the AI nor the product surfaced the data age. Trust in the system is damaged.
