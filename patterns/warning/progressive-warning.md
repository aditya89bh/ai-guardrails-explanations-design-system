# Progressive Warning

**Category:** Warning pattern
**Sub-type:** Progressive warning
**Severity:** Advisory (Level 1) → Caution (Level 2) → Blocking (Level 3) — escalates over steps
**Status:** stable
**Phase:** 2A

---

## Problem It Solves

Single-point warnings — whether inline, modal, or blocking — treat the user's approach toward a risky action as a single event. But many risky actions are reached through a sequence of steps, and the user's intent and commitment level change as they move through that sequence. A warning that fires at step one may be appropriate as a soft advisory; the same concern at step five — when the user is about to commit an irreversible action — warrants a hard block. The progressive warning pattern matches warning severity to the user's proximity to risk, escalating from low-friction advisory signals through to a full block as the user moves closer to the point of consequence.

---

## Definition

A progressive warning is a series of warning states that escalate in severity, friction, and prominence as the user moves through a multi-step workflow toward an action with significant risk or consequence. Each stage in the progression is defined by a proximity trigger — a step, threshold, or user action that elevates the warning level. At the final stage, the escalation may reach blocking severity, or it may hand off to a modal or permission gate.

---

## When to Use

- The risky action is reached through a multi-step workflow where the user's commitment increases with each step
- Different levels of warning friction are appropriate at different points in the workflow (early steps warrant advisory; final confirmation warrants blocking)
- There is a measurable or detectable "proximity to risk" signal — a step count, a form completion percentage, a selection that unlocks the consequential action
- Users frequently begin workflows without understanding their endpoint, and early disclosure prevents most of the downstream friction
- A single blocking warning at the final step would create disproportionate disruption given that most users who reach that point have already passed multiple lower-severity signals

---

## When Not to Use

- The workflow has only one step — there is no progression to design; use inline, modal, or blocking warning directly
- The risk is not graduated — the action is fully consequential from the first step — use a blocking warning or permission gate at step one
- The user's intent is clear and the action is low-risk — progressive escalation through an advisory workflow creates unnecessary friction
- The progression cannot be defined based on measurable signals — do not implement progressive warnings where "progress" is subjective or unmeasurable

---

## Trigger Conditions

Progressive warnings use proximity-based triggers. Define three stages:

### Stage 1 — Advisory entry (earliest proximity signal)
- User selects an option, enters a workflow, or crosses a threshold that indicates they may be moving toward a consequential action
- Trigger examples: entering a "delete", "send", "publish", or "transfer" workflow; selecting a recipient list type that includes external users; switching from draft to review mode

### Stage 2 — Caution escalation (mid-workflow signal)
- User has taken one or more steps that increase specificity or commitment (filled in key fields, made selections that constrain the path, passed a point of partial investment)
- Trigger examples: completing the first three of five form steps; selecting a specific target for a bulk operation; entering the final stage of a multi-stage workflow

### Stage 3 — Blocking or modal at commitment point (final proximity signal)
- User is about to execute the consequential action — one click away from the irreversible outcome
- Trigger examples: clicking the final "Submit" or "Send" button; completing all required fields in a consequential form; reaching the confirmation screen

---

## Severity Level

**Escalating across stages:**

| Stage | Severity | Treatment |
|---|---|---|
| Stage 1 | Advisory (Level 1) | Inline warning or ambient banner |
| Stage 2 | Caution (Level 2) | Inline warning with elevated visual prominence, or modal if the step is a natural pause point |
| Stage 3 | Blocking (Level 3) or Modal | Blocking warning requiring resolution action, or modal requiring explicit confirmation |

The system must not skip stages for users who progress quickly. Each stage must be encountered in sequence.

---

## User Action Required

**Stage 1:** No action required. Informational disclosure. User may continue.

**Stage 2:** Soft acknowledgment may be required — a checkpoint that confirms the user has seen the warning before advancing to Stage 3. In high-risk workflows, a "I've reviewed this" checkbox at Stage 2 reduces the cognitive load of the final blocking stage.

**Stage 3:** Explicit action required — confirm or cancel. See [blocking-warning.md](blocking-warning.md) and [modal-warning.md](modal-warning.md) for the Stage 3 requirements.

---

## Explanation Requirements

Each stage has specific explanation requirements:

**Stage 1 (Advisory):**
- Name the risk category that will become relevant if the user continues
- Keep explanation brief — the user is early in the workflow and needs orientation, not a full briefing
- Do not use alarming language at Stage 1; the user may not need to continue past this point

**Stage 2 (Caution):**
- Remind the user of the Stage 1 concern with more specificity now that their path is more defined
- Name the specific consequence based on the selections made so far
- Provide a clear, low-friction path to change course without abandoning all progress

**Stage 3 (Blocking/Modal):**
- Full explanation of the consequence of proceeding
- The specific action the user is about to take
- The irreversibility or scope of that action
- Explicit resolution or confirmation options
- See [blocking-warning.md](blocking-warning.md) for full Stage 3 requirements

---

## Copywriting Guidance

Each stage requires distinct copy that reflects the escalating severity and the user's increasing proximity to consequence.

**Stage 1 (inline or ambient — early in workflow):**
- "This workflow may result in changes that cannot be reversed. Review carefully before submitting."
- "You're entering a process that will affect external users. You can change the scope before the final step."

**Stage 2 (inline with emphasis or modal at a natural pause point):**
- "You've selected 2,400 records for permanent deletion. This will affect 12 production databases. Review your selection before continuing to the final step."
- "This export will include customer PII. Your current selections include fields that require elevated approval. Modify the export or confirm you have the necessary authorization."

**Stage 3 (blocking or modal — at commitment point):**
- Apply [blocking-warning.md](blocking-warning.md) or [modal-warning.md](modal-warning.md) copywriting guidance in full

**Tone progression:**
- Stage 1: Informative, calm, early-signal
- Stage 2: Specific, factual, action-oriented
- Stage 3: Direct, clear, no softening — the user is at the commitment point

---

## Accessibility Requirements

- **Stage transitions must be announced:** When the warning escalates from Stage 1 to Stage 2, and from Stage 2 to Stage 3, screen reader users must be informed of the escalation. Use `aria-live="polite"` for Stage 1→2 transitions. Use `aria-live="assertive"` or `role="alertdialog"` for Stage 2→3 transitions.
- **Visual escalation must not be color-only:** The increase in severity between stages must be communicated through changes in icon, label, size, or position — not color alone.
- **Stage 3 accessibility requirements:** Inherit all requirements from [blocking-warning.md](blocking-warning.md) or [modal-warning.md](modal-warning.md) as applicable.
- **Progression must be linear:** Users using keyboard navigation or assistive technology must not be able to skip to Stage 3 without encountering Stage 1 and Stage 2.
- **Contrast:** All stages must meet WCAG 2.1 AA at their respective prominence levels.

---

## Enterprise Audit Considerations

**Audit logging:** Required for Stage 3. Recommended for Stage 2 in regulated contexts. Log:
- Which stage was reached
- At Stage 3: the resolution action taken (confirmed / cancelled)
- The workflow context (which workflow, step number, user selections that determined the risk level)
- Timestamp, session, and user identifiers

**Policy configurability:**
- The trigger conditions for each stage must be configurable at the tenant level — a financial services tenant may trigger Stage 2 at a different threshold than a general enterprise tenant
- Whether Stage 2 requires an explicit acknowledgment checkpoint must be configurable
- The Stage 3 treatment (blocking warning vs. modal warning) must be configurable per workflow type

**Multi-tenant:** Progressive warning workflows are typically configured as part of tenant-level workflow policy. Platform defaults define stage transitions conservatively; tenants may tighten or loosen stages within defined bounds.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Skipping stages | Stage 1 and 2 are present but easy to miss; users reach Stage 3 as a surprise | Users feel ambushed by the Stage 3 block and are frustrated |
| Stage 1 is too alarming | Stage 1 copy uses blocking-severity language | Users either abandon the workflow unnecessarily or habituate to alarming language early and ignore Stage 3 |
| Stage 3 is identical to Stage 1 | No visible escalation between stages | The progressive pattern loses its signal value; Stage 3 has no additional weight |
| Re-triggering Stage 1 repeatedly | Stage 1 fires every time the user re-enters the workflow, even after they have completed it many times | Habituation; users click through Stage 1 without reading |
| Stage transitions are invisible | The severity escalation is not visually or linguistically distinct | Users do not perceive that the stakes have changed |
| No path to correct course at Stage 2 | User reaches Stage 2 but has no way to adjust their selection without abandoning all progress | Users are forced to choose between completing a risky action and losing significant work |

---

## Recovery Path

- **At Stage 1:** No recovery needed — the user has not committed to anything.
- **At Stage 2:** The user must be able to modify their selection or path without losing Stage 1 progress. Preserve all user input.
- **At Stage 3:** If the user cancels, return to Stage 2 state with all input preserved. If the user confirms and the action produces an unintended outcome, apply the relevant downstream recovery flow.

---

## Related Patterns

- **[Inline warning](inline-warning.md)** — Often serves as the Stage 1 treatment in a progressive sequence
- **[Modal warning](modal-warning.md)** — Often serves as the Stage 2 or Stage 3 treatment at natural workflow pause points
- **[Blocking warning](blocking-warning.md)** — Often serves as the Stage 3 treatment at the final commitment point
- **[Policy warning](policy-warning.md)** — Use alongside when the escalation is driven by policy rule detection rather than proximity alone
- **[Soft permission gate](../permission/soft-gate.md)** — May replace a progressive warning Stage 3 when the required resolution is user authorization rather than a resolution action
- **[Hard permission gate](../permission/hard-gate.md)** — Use instead of Stage 3 when formal authorization from a specific role is required to proceed

---

## Example Scenario

**Context:** An enterprise AI assistant is helping a platform administrator delete a set of user accounts. The admin selects a batch deletion function, chooses accounts, and proceeds toward confirmation. The operation is irreversible — deleted accounts cannot be restored.

**Stage 1 — Admin enters the batch deletion workflow (inline advisory):**
```
ⓘ Batch deletion is permanent. Deleted accounts and their associated data cannot be recovered.
   Make sure your selection is complete before submitting.
```

**Stage 2 — Admin has selected 340 accounts and proceeds to the review screen (elevated inline warning):**
```
⚠ You are about to permanently delete 340 accounts.
  This action will remove all data associated with these accounts from all systems.
  There is no undo. Review your selection carefully before continuing.
  [Edit selection] [Continue to final confirmation]
```

**Stage 3 — Admin clicks "Continue to final confirmation" (blocking warning):**
> **Permanently deleting 340 accounts cannot be undone**
>
> All account data, history, and configurations for these 340 users will be permanently removed from all systems. This action is irreversible and cannot be undone by support.
>
> To confirm, type **DELETE 340 ACCOUNTS** in the field below.
>
> [Confirm permanent deletion] [Go back and review selection]

**What the admin can do at each stage:** Exit at Stage 1 with no consequence. Revise the selection at Stage 2. Cancel or complete the typed confirmation at Stage 3.

**What would go wrong without this pattern:** The admin selects and deletes 340 accounts without seeing the scope of the operation clearly stated until the final click. Many batch operations are performed routinely; without progressive escalation, the severity of the deletion does not register as different from routine operations.
