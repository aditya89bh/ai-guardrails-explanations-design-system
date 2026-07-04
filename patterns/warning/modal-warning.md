# Modal Warning

**Category:** Warning pattern
**Sub-type:** Modal warning
**Severity:** Caution (Level 2) to Blocking (Level 3)
**Status:** stable
**Phase:** 2A

---

## Problem It Solves

Some concerns are serious enough that passive inline disclosure is insufficient — the user needs to actively engage with the warning before proceeding. However, many of these situations do not justify a full block: the user should be able to proceed if they understand and accept the concern. Modal warnings interrupt the user's flow, ensure they encounter the warning, and require a deliberate action to continue — without making the decision for them.

---

## Definition

A modal warning is an overlay dialog that interrupts the current workflow to surface a concern requiring user acknowledgment before the action or output is accepted or the workflow continues. The user must take an explicit action — confirm, dismiss, or cancel — to exit the modal. The modal does not prevent the user from proceeding; it ensures they do so with awareness.

---

## When to Use

- The concern is significant enough that passive disclosure risks being overlooked
- The action the user is about to take is consequential but reversible, and informed consent is the goal
- The warning applies to the entire action or output, not a specific element within it
- The user needs to make a binary choice: proceed with awareness, or cancel and reconsider
- Context switches naturally (e.g., the user clicks "Send", "Submit", or "Apply") and a pause point exists where the interruption is appropriate
- Severity is Caution or Blocking, but the decision authority remains with the user

---

## When Not to Use

- The concern is minor and informational — use an inline warning instead
- The user should be able to proceed without any acknowledgment — use an inline or ambient warning
- The action is irreversible and high-stakes — use a blocking warning or a permission gate, which requires a more deliberate confirmation mechanism
- The same modal would fire repeatedly for the same user on the same type of action — modal fatigue sets in quickly and destroys the signal value
- The user has already seen and dismissed this modal for this class of action within the configurable habituation window — use an ambient warning instead

---

## Trigger Conditions

- **Irreversibility detection (moderate):** The action cannot be easily undone, but the impact is contained (e.g., sending a message to a large distribution list, publishing a document)
- **Third-party impact:** The output or action will affect users or systems outside the requester's direct scope
- **Confidence threshold breach (output-level):** The AI's confidence in the output as a whole — not a single element — falls below the caution threshold for the deployment context
- **Data sensitivity signal (elevated):** The action involves data at a sensitivity classification that requires explicit acknowledgment before transfer or exposure
- **Policy match (soft):** The request matches a policy flag that requires user acknowledgment but does not require a hard block
- **Scope boundary (full):** The entire requested output falls outside the AI's verified knowledge domain and the user should be explicitly informed before acting on it

---

## Severity Level

**Caution (Level 2) to Blocking (Level 3).** The modal is always at least Caution — it requires user acknowledgment. It reaches Level 3 when the user's only exit options are "Cancel" (abandon the action) or an explicit confirmation; there is no passive dismiss available.

A modal warning at Caution allows dismissal without a confirm action (clicking the backdrop or pressing Escape closes it and allows the user to proceed). A modal warning at Blocking requires an explicit button press to either confirm or cancel. Do not use Escape-to-dismiss at Blocking severity.

---

## User Action Required

**At Caution:** User must see the modal. Can dismiss by:
- Clicking "Understood, continue"
- Pressing Escape
- Clicking outside the modal (if the deployment context allows)

**At Blocking:** User must make an explicit choice:
- Click a labeled confirm action ("Continue anyway", "I understand", "Proceed")
- Click a labeled cancel action ("Go back", "Cancel")
- No passive dismissal. Escape key behavior should be mapped to "Cancel", not silent close.

---

## Explanation Requirements

The modal must include:
1. **A clear subject line** — what the warning is about, in 6–10 words. Not a generic "Warning."
2. **The concern in plain language** — what specifically the system detected and why it matters. Two to four sentences maximum.
3. **The consequence of proceeding** — what happens if the user clicks confirm. One sentence.
4. **The user's options** — labeled action buttons that describe the action, not just "OK" and "Cancel."

The modal must not include:
- Technical internals (model scores, raw thresholds, system identifiers)
- More than one concern — if multiple concerns exist, surface the most critical one and note that others exist
- Inline links that take the user away from the modal to resolve the concern (this breaks flow; provide the information directly)

---

## Copywriting Guidance

**Modal title structure:** `[Concern noun phrase]` — e.g., "Outdated source data", "Distribution scope includes external users", "Output confidence is low for this query"

**Body structure:** `[What was detected] + [Why it matters for this user's action] + [What proceeding means]`

**Good examples:**

Title: "This output uses data from 60+ days ago"
Body: "The market segment figures in this response are sourced from a feed last updated 63 days ago. These figures may not reflect current conditions. If you proceed, these projections will be included in your report as-is."
Buttons: "Use current data instead" (primary) | "Continue with existing data" (secondary)

---

Title: "This action will notify 847 external recipients"
Body: "The distribution list includes 847 recipients outside your organization. Replies and replies-all will be visible to all of them. This cannot be undone after sending."
Buttons: "Review list first" (primary) | "Send anyway" (secondary, destructive style)

---

**Bad examples:**
- Title: "Warning" — no information value
- Body: "Are you sure?" — no context about what the concern is
- Buttons: "OK" | "Cancel" — do not describe the action being taken

**Tone:** Neutral and factual. Do not alarm unnecessarily. Do not apologize. State the situation and let the user decide.

---

## Accessibility Requirements

- **Focus management:** When the modal opens, focus must move to the modal container or to the first interactive element within it. When the modal closes, focus must return to the element that triggered it.
- **Focus trap:** While the modal is open, Tab key navigation must be trapped within the modal. Users must not be able to Tab into background content.
- **ARIA role:** Use `role="dialog"` with `aria-modal="true"`. Set `aria-labelledby` to the modal title element.
- **Escape key:** At Caution severity, Escape closes the modal (mapped to cancel). At Blocking severity, Escape maps to the cancel/go-back action.
- **Screen reader announcement:** The modal title and first paragraph must be read immediately on open. Do not rely on the user to navigate to the content.
- **Backdrop:** The backdrop must not be an interactive element. It must not receive focus.
- **Contrast:** Modal background and text must maintain WCAG 2.1 AA contrast. Buttons must meet 3:1 contrast against their backgrounds.
- **No auto-close:** Modals must not close automatically on a timer. Users who read slowly or use screen readers will have the modal dismissed before they have processed it.

---

## Enterprise Audit Considerations

**Audit logging:** Required at Blocking severity. Recommended at Caution severity in regulated contexts. Log:
- Modal identifier (which warning was shown)
- Action that triggered the modal
- User choice (confirmed / cancelled / dismissed)
- Timestamp
- Session and user identifiers

**Policy configurability:**
- The list of actions that trigger a modal warning must be configurable at the tenant level
- Habituation suppression window (the period after a user has acknowledged a modal during which repeat modals are suppressed) must be configurable
- Severity threshold for a given action type must be configurable — some tenants may require modal warnings where others use inline warnings for the same trigger

**Multi-tenant:** Modal warning policies are tenant-scoped. A tenant in a regulated industry may have a broader set of triggers than a general enterprise tenant. Suppression windows may be disabled entirely in high-compliance contexts.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Modal habituation | The same modal fires too frequently | Users click confirm without reading; the warning becomes noise |
| Vague title | Modal title is "Warning" or "Confirmation required" | Users cannot anticipate what they are about to read; trust declines |
| OK/Cancel buttons | Buttons use generic labels with no action description | Users do not understand what each choice commits them to |
| No focus trap | Tab key escapes the modal | Keyboard-only users can interact with background content; accessibility violation |
| Auto-dismiss | Modal closes on a timer | Screen reader users and slow readers miss the content entirely |
| Multiple concerns | Modal surfaces three separate concerns simultaneously | Users cannot process all of them; the most important concern is lost |
| Modal on every click | Modal fires on routine actions with no significant consequence | Users treat all modals as bureaucratic interruptions; actual high-stakes modals are dismissed without reading |

---

## Recovery Path

If the user clicks cancel or go-back, they return to their previous state with no changes made. The system must preserve all user input from the triggering action so it is not lost. If the user clicks confirm and the subsequent action produces an error or unintended outcome, the relevant recovery flow applies — typically a retry recovery or repair recovery. See [`patterns/recovery/`](../recovery/).

---

## Related Patterns

- **[Inline warning](inline-warning.md)** — Use instead for element-level concerns that do not require flow interruption
- **[Blocking warning](blocking-warning.md)** — Escalate to this when the user must not proceed until the concern is resolved or overridden by authority
- **[Ambient warning](ambient-warning.md)** — Use as a persistent lower-friction alternative when habituation to modals is a risk
- **[Progressive warning](progressive-warning.md)** — Use to escalate toward a modal when the user approaches but has not yet committed to the risky action
- **[Soft permission gate](../permission/soft-gate.md)** — Use instead when the goal is to capture explicit authorization, not just acknowledgment
- **[Hard permission gate](../permission/hard-gate.md)** — Use instead when irreversibility and impact are high enough that a simple "continue" is insufficient

---

## Example Scenario

**Context:** An enterprise AI drafting tool is helping a communications manager prepare a product announcement. The manager asks the AI to send the draft to the distribution list on file. The AI detects that the list includes 1,200 recipients, of whom 340 are external press contacts — and that the draft contains three paragraphs marked as "internal review only" by the document policy engine.

**Modal warning rendered:**

> **This draft contains sections marked "Internal Review Only"**
>
> Three sections of this draft are flagged as internal-only. Sending to the current list will share these sections with 340 external press contacts.
>
> If you continue, the message will be sent immediately and cannot be recalled.
>
> [Review draft before sending] [Send anyway]

**What the manager can do:** Click "Review draft before sending" to return to the editor and remove or revise the flagged sections. Click "Send anyway" to proceed with awareness of the consequence.

**What would go wrong without this pattern:** The AI sends the draft including internal-review sections to press contacts. The organization's internal review process is bypassed without the manager being aware it happened.
