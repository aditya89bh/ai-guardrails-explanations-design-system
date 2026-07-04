# Warning Interaction Model

**Component category:** Warning
**Phase:** 4
**Status:** stable

---

## Interaction Principles

1. **Warnings do not compete with each other for attention.** Multiple active warnings are presented in precedence order, not simultaneously at the same visual weight.
2. **Dismissal is never implicit.** A warning is only dismissed when the user takes an explicit action (clicks dismiss, completes an action, or the triggering condition clears). Navigating away does not dismiss a warning that requires acknowledgment.
3. **Blocking warnings require an explicit resolution action.** There is no dismiss control. The user must either proceed with acknowledgment or cancel.
4. **Progressive warnings escalate across interactions, not within a single display.** The first occurrence is inline; the second is modal; the third is blocking. The component does not escalate on its own — the hosting system tracks occurrence count and the decision engine selects the variant.

---

## Mouse and Pointer Interactions

### Inline and Banner variants

| Interaction | Target | Result |
|---|---|---|
| Click dismiss (×) | Dismiss control | Fires `onDismiss`; component exits |
| Click action button | Action control | Fires `onAction`; action executes |
| Click "expand" / "learn more" | Expand control | `expanded` state activated; detail visible |
| Click "collapse" | Collapse control | Returns to default state |
| Hover | Component surface | No visual change (not selectable) |

### Modal variant

| Interaction | Target | Result |
|---|---|---|
| Click primary action | Primary action button | Fires `onAction`; modal closes |
| Click cancel | Cancel button | Fires `onDismiss`; modal closes |
| Click backdrop | Modal overlay (outside modal) | Fires `onDismiss` for dismissible modals only; no effect for non-dismissible |

### Blocking variant

| Interaction | Target | Result |
|---|---|---|
| Click required action | Action button | Fires `onAction`; blocking resolves |
| Click any area outside blocking overlay | Background content | No effect — blocking is active |

**The blocking overlay must prevent pointer events on all content beneath it.** This is not optional — any clickable element behind a blocking warning must be inaccessible while the blocking state is active.

---

## Keyboard Interactions

| Key | Context | Result |
|---|---|---|
| `Tab` | Within warning component | Cycles through interactive elements (dismiss, actions, expand) |
| `Shift+Tab` | Within warning component | Reverse tab cycle |
| `Enter` / `Space` | On focused dismiss control | Fires `onDismiss` |
| `Enter` / `Space` | On focused action button | Fires `onAction` |
| `Enter` / `Space` | On focused expand control | Toggles expanded state |
| `Escape` | Within modal variant | Fires `onDismiss` for dismissible modals; no effect for non-dismissible |
| `Escape` | Within blocking variant | No effect — blocking requires resolution |

### Focus Management

**On mount (modal and blocking variants):** Focus moves automatically to the first interactive element in the warning component — typically the primary action button or the cancel button. Focus must not remain on the triggering element behind the warning.

**On dismiss:** Focus returns to the element that was active before the warning appeared. If that element no longer exists in the DOM, focus returns to the most logical predecessor in the document flow.

**On blocking resolve:** Focus returns to the next logical step in the workflow (the element the user was about to interact with when blocked).

---

## Touch Interactions

| Gesture | Target | Result |
|---|---|---|
| Tap | Dismiss control | Fires `onDismiss` |
| Tap | Action button | Fires `onAction` |
| Tap | Expand control | Toggles expanded state |
| Swipe down (configurable) | Banner variant | Fires `onDismiss` (only for dismissible banners) |
| Tap backdrop | Modal variant | Fires `onDismiss` for dismissible modals only |

**Touch target minimum:** All interactive controls must have a minimum tap area of 44×44px. Use padding to achieve this when the visual size is smaller.

---

## Auto-Dismiss Behavior

Some warning variants support auto-dismiss after a configured duration (informational severity only).

| Variant | Auto-dismiss supported | Conditions |
|---|---|---|
| `inline` — informational | Yes | When `autoDismissDelay` prop is set |
| `banner` — informational | Yes | When `autoDismissDelay` prop is set |
| `ambient` | No | Persists until condition clears |
| `modal` | No | Requires explicit user action |
| `blocking` | No | Requires resolution action |
| `policy` | No | Requires explicit acknowledgment |

When auto-dismiss is active:
1. A visible progress indicator (timer arc or countdown bar) shows remaining time.
2. Hovering or focusing the component pauses the auto-dismiss timer.
3. Keyboard users are notified via `aria-live` that auto-dismiss is counting down.
4. The `onTimeout` callback fires when the timer expires.

---

## Progressive Warning Interaction Flow

```
Session attempt 1 → inline warning shown
User proceeds without modifying approach
Session attempt 2 → modal warning shown
User proceeds again
Session attempt 3 → blocking warning shown (no further escalation after this)
```

The interaction model for each escalation step is independent — the user experiences each as a standalone warning at the appropriate severity.

---

## Empty and Loading States

**Loading state** (when warning content is loaded asynchronously):
- A skeleton/shimmer occupies the component area while content loads.
- Interactive elements (dismiss, action) are not shown until content is loaded.
- Maximum load wait: 3 seconds. If content has not loaded, the component renders a fallback message.

**Empty state** is not applicable for warning components — a warning without a message must not render.

---

## Error State (Async Actions)

When a warning action triggers an async operation that fails:
1. The action button returns to active state.
2. An error message appears within the action area: "Something went wrong — try again."
3. The user can retry the action.
4. After 3 failed attempts, an alternative suggestion is offered if available.
