# Refusal Interaction Model

**Component category:** Refusal
**Phase:** 4
**Status:** stable

---

## Interaction Principles

1. **Focus moves to the first path-forward action, not the refusal headline.** When a refusal component mounts, focus lands on the first productive action available — not the "Request declined" heading. The user should immediately have a forward direction.
2. **"None of these" is always available.** The AlternativeSuggestionCard always offers a way out for users who do not find the presented alternatives useful.
3. **Clarification inputs accept the user's terms.** ClarificationRequest text fields must not have input constraints that prevent the user from expressing their intent clearly. Minimum: 500-character limit.
4. **Partial completion does not hide the exclusion.** The exclusion notice is always visible alongside the completed output. It is never collapsed or minimized by default.

---

## Mouse and Pointer Interactions

| Interaction | Target | Result |
|---|---|---|
| Click alternative | Alternative item | `onAlternativeSelect` fires; item visually selected |
| Click "None of these" | None option | `onNoneSelect` fires; abandoned or new-request flow |
| Click submit | ClarificationRequest | `onClarificationSubmit` fires; loading state on submit |
| Click cancel | Cancel control | Fires cancel; returns focus to prior position |
| Click "Confirm handoff" | HumanHandoffCard | Handoff initiated; status updates begin |
| Click redirect | PartialCompletionCard redirect | `onAlternativeSelect` fires for excluded portions |

---

## Keyboard Interactions

| Key | Context | Result |
|---|---|---|
| `Tab` | Within refusal component | Cycles through alternatives, inputs, actions |
| `Enter` / `Space` | On alternative item | `onAlternativeSelect` fires |
| `Enter` | On submit | `onClarificationSubmit` fires |
| `Escape` | Within ClarificationRequest | Cancels without submitting |
| `Arrow keys` | Within radio-style alternatives | Navigates alternatives (if implemented as radio group) |

### Focus Management

**On refusal mount:** Focus moves to the first productive action:
- AlternativeSuggestionCard → focus to first alternative
- ClarificationRequest → focus to the input field
- PartialCompletionCard → focus to the redirect suggestion
- HumanHandoffCard → focus to the confirm handoff control
- RefusalCard (safe-refusal, no alternatives) → focus to the "acknowledged" or "exit" control

**On alternative selected:** Focus remains on the selected alternative. A brief confirmation state is shown before transition.

**On clarification submitted:** Focus moves to a loading indicator; then to the response when it renders.

---

## Touch Interactions

| Gesture | Target | Result |
|---|---|---|
| Tap | Alternative item | `onAlternativeSelect` fires |
| Tap | Submit | `onClarificationSubmit` fires |
| Tap | Cancel | Returns to prior state |
| Tap | "None of these" | `onNoneSelect` fires |

---

## Clarification Request Flow

```
ClarificationRequest renders with specific question
User reads question
User types response OR selects structured option

If text input:
  User types → submit control activates → user submits
  Fires: onClarificationSubmit({ input })
  Loading state while request re-evaluates
  New response renders; refusal may or may not recur

If structured options:
  User selects option → submit activates immediately
  Fires: onClarificationSubmit({ input: selectedOption })
```

The clarification request does not validate or constrain the user's input. The AI re-evaluates after receiving it.

---

## Human Handoff Status Updates

When the HumanHandoffCard is active in the refusal category:
1. Status indicator updates when a handler accepts or denies.
2. The user does not need to take any action while waiting — status is push-updated.
3. If no handler accepts within the SLA window, the card shows "No handler available" and offers redirect recovery.
4. The user may cancel the handoff while it is in ROUTING or ROUTED state.
