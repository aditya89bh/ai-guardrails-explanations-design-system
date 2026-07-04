# Recovery Interaction Model

**Component category:** Recovery
**Phase:** 4
**Status:** stable

---

## Interaction Principles

1. **Recovery components take focus immediately after a blocking event resolves.** The user's next focus should be a path forward, not the blocking event itself.
2. **Retry is always the first option when it applies.** The system tries the easiest path (retry) before offering more complex options (redirect, repair, override, abandon).
3. **Override requires active acknowledgment before the confirm button is enabled.** The risk-acknowledgment checkbox must be explicitly checked. Auto-checking is prohibited.
4. **Abandon always discloses what was saved before exit.** Users must know exactly what they are leaving behind.

---

## Mouse and Pointer Interactions

| Interaction | Target | Result |
|---|---|---|
| Click Retry | RetryPrompt retry button | `onRetry` fires; loading state |
| Click alternative | RedirectSuggestion item | `onAlternativeSelect` fires |
| Click "None of these" | Redirect none-option | `onNoneSelect` fires |
| Click Validate | RepairCard validate | `onRepairValidate` fires; loading state |
| Click Cancel | RepairCard cancel | Returns to prior state |
| Check acknowledgment | OverrideConfirmation checkbox | Enables confirm button |
| Click Confirm override | OverrideConfirmation confirm | `onOverrideConfirm` fires |
| Click Cancel override | Cancel button | Returns to redirect options |
| Click Exit cleanly | AbandonExit | `onAbandon` fires; session closes |

---

## Keyboard Interactions

| Key | Context | Result |
|---|---|---|
| `Tab` | Within recovery component | Cycles interactive elements |
| `Enter` / `Space` | On retry | `onRetry` fires |
| `Enter` / `Space` | On alternative | `onAlternativeSelect` fires |
| `Enter` / `Space` | On validate | `onRepairValidate` fires |
| `Space` | On acknowledgment checkbox | Toggles check; enables/disables confirm |
| `Enter` | On confirm override (enabled) | `onOverrideConfirm` fires |
| `Enter` | On exit | `onAbandon` fires |
| `Escape` | Within repair or override | Returns to prior recovery step |

### Focus Management

**On recovery mount:** Focus moves immediately to the primary recovery action:
- RetryPrompt → retry button
- RedirectSuggestion → first alternative
- RepairCard → first repair field
- OverrideConfirmation → risk acknowledgment checkbox
- AbandonExit → exit cleanly button

**On retry executing:** Focus stays on the retry button (now in loading state). When result returns, focus moves to the outcome.

**On recovery cascade:** When the current recovery fails and the next is offered, focus moves to the first action of the new recovery component. A brief connecting message is announced to screen readers.

**On recovery succeeded:** Focus returns to the main workflow — the element the user will interact with next.

---

## Touch Interactions

| Gesture | Target | Result |
|---|---|---|
| Tap | Retry button | `onRetry` fires |
| Tap | Alternative item | `onAlternativeSelect` fires |
| Tap | Validate | `onRepairValidate` fires |
| Tap | Acknowledgment checkbox | Toggles check |
| Tap | Confirm override | `onOverrideConfirm` fires |
| Tap | Exit cleanly | `onAbandon` fires |

---

## Retry Interaction Flow

```
RetryPrompt renders (attempt 1)
  Retry button available
  "Or: try a different approach" (secondary — not shown on attempt 1)

User clicks Retry
  Loading state on button
  System re-attempts

  Success → recovery SUCCEEDED → main workflow resumes
  Failure → attempt counter increments → RetryPrompt re-renders (attempt 2)
    "Or: try a different approach" now visible
  
  After retryLimit reached → "No more retries available"
    Cascade to RedirectSuggestion
```

---

## Override Confirmation Flow

```
OverrideConfirmation renders
  [Confirm override] is disabled
  Risk acknowledgment checkbox: unchecked

User reads override statement and risk statement
User checks acknowledgment checkbox
  → [Confirm override] enables

User clicks [Confirm override]
  → onOverrideConfirm fires
  → Loading state
  → System applies override and proceeds
  → Audit record created (mandatory)
  → OverrideConfirmation exits

If user clicks Cancel instead:
  → onCancel fires
  → User returned to redirect recovery options
```

---

## Abandon Exit Flow

```
AbandonExit renders

User sees:
  Saved: [list of saved items]
  Not saved: [list of unsaved items]
  How to return: [re-entry path description]

User clicks [Exit cleanly]
  → onAbandon fires
  → Session closes
  → User receives reference ID for re-entry
```

The AbandonExit component does not have a cancel control — if the user decides not to abandon, they navigate back using the browser/app back action. The component is not responsible for re-initiating the workflow.
