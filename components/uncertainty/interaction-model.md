# Uncertainty Interaction Model

**Component category:** Uncertainty
**Phase:** 4
**Status:** stable

---

## Interaction Principles

1. **Uncertainty indicators are attached to their output, not floating.** They render adjacent to the specific output element they qualify. A standalone uncertainty card unattached to any output creates confusion.
2. **State transitions are reflected immediately.** When the underlying uncertainty state transitions (e.g., the user provides clarification and confidence improves), the component updates without requiring a page reload.
3. **The UnresolvableStateCard offers the only interaction.** All other uncertainty components are primarily passive. The unresolvable card is the exception — it must offer next-step controls.
4. **Tooltip interactions do not block workflow.** Tooltips on confidence badges are informational and dismissable. They do not gate any user action.

---

## Mouse and Pointer Interactions

| Interaction | Target | Result |
|---|---|---|
| Hover / focus | UncertaintyIndicator | Tooltip appears |
| Click | UncertaintyIndicator (badge) | No action (passive) |
| Click "Refresh" | StaleContextBadge | `onRefresh` fires; system attempts re-retrieval |
| Click next-step option | UnresolvableStateCard | `onNextOptionSelect` fires |
| Click detail link | ConflictingEvidenceCard | Expands evidence panel |

---

## Keyboard Interactions

| Key | Context | Result |
|---|---|---|
| `Tab` | Through page | Uncertainty indicators are focusable (not in reading tab flow) |
| `Enter` / `Space` | On next-step option | `onNextOptionSelect` fires |
| `Enter` / `Space` | On Refresh button | `onRefresh` fires |
| `Escape` | On focused tooltip | Dismisses tooltip |

### Focus Management

Uncertainty components do not capture focus on mount. The UnresolvableStateCard is the exception: when it renders as a terminal state replacement, focus moves to the first next-step option.

---

## State Transition Reflection

When the underlying uncertainty state transitions, the component reflects the new state:

| Previous state | New state | Visual transition |
|---|---|---|
| LC or MC | HC | Indicator fades from low/moderate icon to high-confidence icon; then fades out entirely |
| SC | HC or MC | Stale badge removes; confidence badge (MC) appears if applicable |
| CE | MC or HC | Conflict card collapses; confidence badge appears |
| UR | [Refusal or new request] | Card exits; refusal or redirect component enters |

State transitions are not animated when `prefers-reduced-motion` is active — they are immediate.

---

## ConflictingEvidenceCard Interaction

```
Card renders with two evidence columns
User reads both claims and sources
User may:
  1. Click a source to review it externally
  2. Type a clarification (if clarification input is enabled)
  3. Click "Proceed with awareness" (if allowed by risk level)
  4. Click "Get human review" (routes to escalation)
```

The card does not resolve the conflict — the user's action or the system's response resolves it. The card reflects the resolution when it occurs.

---

## Touch Interactions

| Gesture | Target | Result |
|---|---|---|
| Tap | UncertaintyIndicator | Tooltip appears |
| Tap off indicator | Anywhere else | Tooltip dismisses |
| Tap | Refresh button | `onRefresh` fires |
| Tap | Next-step option | `onNextOptionSelect` fires |
