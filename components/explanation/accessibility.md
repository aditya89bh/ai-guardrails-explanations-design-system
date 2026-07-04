# Explanation Component Accessibility

**Component category:** Explanation
**Phase:** 4
**Status:** stable
**Standard:** WCAG 2.1 AA

---

## ARIA Roles and Attributes

| Component | ARIA role | Key attributes |
|---|---|---|
| ConfidenceBadge | `role="img"` or `<span>` with `aria-label` | `aria-label="[Confidence level]: [description]"` |
| Tooltip (on badge) | `role="tooltip"` | `id="tooltip-[badge-id]"`, badge has `aria-describedby="tooltip-[badge-id]"` |
| SourceList (collapsed) | `<ul>` with `aria-label="Sources"` | Standard list semantics |
| SourceList expand control | `role="button"` | `aria-expanded="false/true"`, `aria-controls="[list-id]"` |
| ReasoningTrace toggle | `role="button"` | `aria-expanded="false/true"`, `aria-controls="[trace-id]"` |
| ReasoningTrace content | `<section>` or `<div>` | `id="[trace-id]"`, `aria-label="Reasoning steps"` |
| DecisionSummary | `<article>` or `<section>` | `aria-label="Decision summary"` |
| LimitationDisclosure | `role="note"` | `aria-label="Limitation notice"` |
| StructuredUncertaintyCard | `<section>` | `aria-label="Confidence assessment"` |

---

## Screen Reader Announcements

| Event | Announcement |
|---|---|
| ConfidenceBadge renders | Read inline with surrounding content as: "High confidence" (or level) |
| Tooltip opens | Tooltip content read as associated description |
| Source list expands | "Sources: [N] sources. [source 1 label], [source 2 label]..." |
| Reasoning trace expands | "Reasoning steps: Step 1: [action]. Result: [result]. Step 2: ..." |
| Loading state | "Loading sources" / "Loading reasoning trace" |
| Empty state | "No sources available" |
| Error state | "Could not load sources. [Retry control]" |

---

## Keyboard Requirements

- ConfidenceBadge: focusable (tabindex="0" if not naturally focusable); tooltip appears on focus.
- Expand controls: Tab-reachable; Enter/Space toggles.
- Source links: Tab-reachable; Enter opens (new tab).
- Collapsed state is the default — expanded content is not in the reading flow until expanded.

---

## Focus Order

| Order | Element |
|---|---|
| 1 | ConfidenceBadge (passive, tooltip on focus) |
| 2 | SourceList expand control |
| 3 | Source items (when list is expanded) |
| 4 | ReasoningTrace toggle |
| 5 | Trace step links (when expanded, if present) |
| 6 | LimitationDisclosure detail link |

---

## Color and Contrast

- ConfidenceBadge uses semantic icon AND text label — not color-only.
- All text on component surfaces meets ≥ 4.5:1 contrast against background.
- Source quality indicators must not rely on color alone.

---

## Reduced Motion

- Expand/collapse animations: instant when `prefers-reduced-motion` is active.
- Tooltip fade: instant.
- Skeleton shimmer: replaced with static placeholder text.
