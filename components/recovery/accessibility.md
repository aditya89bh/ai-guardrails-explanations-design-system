# Recovery Component Accessibility

**Component category:** Recovery
**Phase:** 4
**Status:** stable
**Standard:** WCAG 2.1 AA

---

## ARIA Roles and Attributes

| Component | ARIA role | Key attributes |
|---|---|---|
| RetryPrompt | `role="status"` | `aria-live="polite"` |
| Retry button | `<button>` | `aria-label="Try again — attempt [N] of [M]"` when limit applies |
| RedirectSuggestion | `<section>` | `aria-label="Alternative approaches"` |
| Alternative items | `<ul>` of `<li>` + `<button>` | Each: `aria-label="Choose: [alternative label]"` |
| RepairCard | `role="form"` or `<section>` | `aria-label="Repair required"` |
| Repair fields | Standard form elements | `aria-labelledby` pointing to field labels |
| OverrideConfirmation | `role="dialog"` | `aria-modal="true"`, `aria-labelledby="[override-title-id]"`, `aria-describedby="[risk-statement-id]"` |
| Risk acknowledgment checkbox | `<input type="checkbox">` | `aria-required="true"`, `aria-describedby="[risk-statement-id]"` |
| Confirm override button | `<button>` | `aria-disabled="true"` when checkbox unchecked; not `disabled` attribute |
| AbandonExit | `<section>` | `aria-label="Exit options"` |
| Saved / unsaved lists | `<ul>` | `aria-label="Saved" / "Not saved"` |

---

## Screen Reader Announcements

| Event | Announcement |
|---|---|
| RetryPrompt renders (first) | "You can try again. [Failure summary]." |
| RetryPrompt renders (attempt 2+) | "Attempt [N] of [M]. [Or: try a different approach]." |
| Retry executing | "Retrying..." |
| Retry succeeded | "Succeeded. Continuing." |
| Retry failed (next cascade) | "Attempt failed. Here are alternative approaches." |
| RedirectSuggestion renders | "Alternative approaches available. [N] options." |
| Alternative selected | "Selected: [alternative label]. Loading..." |
| RepairCard renders | "Repair needed: [issue statement]. [repair type]." |
| Repair validated (success) | "Repair complete. Continuing." |
| Repair failed | "Repair could not be applied. [Options]." |
| OverrideConfirmation renders | "Override required. [Override statement]. [Risk]. Acknowledge to enable confirm." |
| Checkbox checked | "Risk acknowledged. Confirm override is now available." |
| Override confirmed | "Override applied. [Scope]. [Expiration]. Proceeding." |
| AbandonExit renders | "Ready to exit. Saved: [list]. Not saved: [list]. Re-entry: [path]." |
| Exit confirmed | "Session ended. Reference: [ID]." |

---

## Keyboard Requirements

- All recovery primary actions are immediately reachable by Tab on component mount.
- Retry: Enter/Space fires `onRetry`.
- RedirectSuggestion: Arrow keys for alternative navigation if implemented as radiogroup.
- RepairCard: Standard form keyboard behavior; Tab through fields.
- OverrideConfirmation: Focus trap active while open (full dialog semantics).
- Escape in RepairCard: cancels repair, returns to prior position.
- Escape in OverrideConfirmation: cancels override, returns to redirect options.

---

## Focus Order

**On recovery mount:** Focus moves immediately to the primary action (see `interaction-model.md`).

**On retry failure and cascade:** Announcement via `aria-live`; focus moves to the new recovery component's first action.

**OverrideConfirmation (dialog):**
| Order | Element |
|---|---|
| 1 | Override title |
| 2 | Risk acknowledgment checkbox |
| 3 | Confirm override (aria-disabled until checked) |
| 4 | Cancel |

**AbandonExit:**
| Order | Element |
|---|---|
| 1 | Section heading |
| 2 | Saved list (read-only) |
| 3 | Not-saved list (read-only) |
| 4 | Re-entry path (if link) |
| 5 | Exit cleanly button |

---

## Color and Contrast

- Retry success state: icon + text, not color-only.
- Override confirmation: risk statement must meet ≥ 4.5:1 contrast — it is the most important text in the component.
- Saved vs. not-saved distinction: icon differentiation required alongside any color distinction.

---

## Reduced Motion

- Recovery entrance: instant.
- Retry loading spinner: replaced with static "Retrying..." text.
- Cascade transition animation: instant (no slide between recovery variants).
- Success animation: instant state change, no spring/bounce.
- Override confirm animation: instant.
