# Explanation Interaction Model

**Component category:** Explanation
**Phase:** 4
**Status:** stable

---

## Interaction Principles

1. **Explanation components are primarily passive.** They do not require user action to fulfill the guardrail pattern's goal — the disclosure has occurred by rendering. Interaction is offered for users who want to go deeper.
2. **Expand state is optional.** Default render shows surface-depth information. Users who need more can expand. Users who do not need more are not interrupted.
3. **Source links behave as external links.** When a source URL is present, it opens in a new tab. The `onSourceClick` callback fires for audit purposes.
4. **No auto-close.** Explanation components do not auto-dismiss. They remain visible until the user collapses them or the parent output is replaced.

---

## Mouse and Pointer Interactions

| Interaction | Target | Result |
|---|---|---|
| Hover / focus | ConfidenceBadge | Tooltip appears with confidence explanation |
| Click expand icon | ReasoningTrace, DecisionSummary | `expanded` state; full content visible |
| Click collapse icon | ReasoningTrace (expanded) | Returns to collapsed state |
| Click source item | SourceList | `onSourceClick` fires; source opens (if URL present) |
| Click "Show N more" | SourceList | Remaining sources revealed |
| Click detail link | LimitationDisclosure | Expands or navigates to detailed explanation |

---

## Keyboard Interactions

| Key | Context | Result |
|---|---|---|
| `Tab` | Through explanation components | Each interactive element focusable |
| `Enter` / `Space` | On expand control | Toggles expanded state |
| `Enter` | On source item link | Opens source (new tab) |
| `Enter` | On detail link | Expands or navigates |
| `Escape` | Within open tooltip | Closes tooltip; returns focus to badge |

### Focus Management

Explanation components do not capture or redirect focus on mount — they are passive disclosures. Interactive controls (expand, source links) are in the natural tab order of the document.

When a section is expanded, focus does not auto-move to the expanded content. Screen reader users are notified of the state change via `aria-expanded` on the control.

---

## Touch Interactions

| Gesture | Target | Result |
|---|---|---|
| Tap | ConfidenceBadge | Tooltip appears (tap again to dismiss) |
| Tap | Expand control | Toggles expanded state |
| Tap | Source item | `onSourceClick` fires |
| Long press | ConfidenceBadge | No special behavior |

---

## StructuredUncertaintyCard Interaction Flow

The StructuredUncertaintyCard is the most interactive explanation component. It combines three sub-components (confidence badge, limitation disclosure, source list) and allows users to explore each independently.

```
Card renders with:
  ConfidenceBadge (surface depth)
  Limitation notice (always visible)
  SourceList (collapsed, showing first 2 sources)

User taps confidence badge → tooltip explains confidence level
User taps "Show all sources" → full source list expands
User taps individual source → source opens or onSourceClick fires
```

The card does not have a dismiss control — it remains visible as a permanent disclosure for this output.

---

## Loading and Empty States

**Loading** (async source retrieval):
- SourceList and ReasoningTrace show skeleton content while loading.
- ConfidenceBadge always renders immediately (it is not async).

**Empty state** (no sources available):
- SourceList renders "No sources available" rather than an empty list.
- This is an expected state when the AI produced output from training alone (Source reliability P10 = 0).

**Error state** (source load failed):
- SourceList shows "Could not load sources — retry" with a retry control.
- After 3 failed retries, shows "Sources unavailable" permanently.
