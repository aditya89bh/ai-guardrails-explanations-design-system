# Explanation Component Motion

**Component category:** Explanation
**Phase:** 4
**Status:** stable

---

## Motion Principles

Explanation components should never feel intrusive. Their animations must be subtle — they are secondary to the primary output they qualify. Motion is used only to signal transitions (open/close, load/complete), not to attract attention.

---

## Entrance Animations

| Component | Duration | Easing | Reduced-motion |
|---|---|---|---|
| ConfidenceBadge | `duration-fast` (100ms) | `easing-enter` | Instant |
| SourceList | `duration-standard` (300ms) | `easing-enter` | Instant |
| ReasoningTrace (collapsed state) | `duration-fast` (100ms) | `easing-enter` | Instant |
| DecisionSummary | `duration-standard` (300ms) | `easing-enter` | Instant |
| LimitationDisclosure | `duration-standard` (300ms) | `easing-enter` | Instant |
| StructuredUncertaintyCard | `duration-standard` (300ms) | `easing-enter` | Instant |

---

## Expand / Collapse Animations

| Transition | Duration | Easing | Reduced-motion |
|---|---|---|---|
| Collapsed → expanded (source list, trace, summary) | `duration-moderate` (200ms) | `easing-standard` | Instant |
| Expanded → collapsed | `duration-moderate` (200ms) | `easing-standard` | Instant |
| Expand icon rotation (chevron) | `duration-fast` (100ms) | `easing-standard` | Instant |

---

## Tooltip Animation

| Transition | Duration | Easing | Reduced-motion |
|---|---|---|---|
| Tooltip entrance | `duration-fast` (100ms) | `easing-enter` | Instant |
| Tooltip exit | `duration-fast` (100ms) | `easing-exit` | Instant |

---

## Loading / Skeleton Animation

| State | Animation | Reduced-motion |
|---|---|---|
| Source loading | Skeleton shimmer (linear, 1.5s loop) | Static placeholder text, no shimmer |
| Trace loading | Skeleton shimmer | Static placeholder text |
| Load complete | Fade from skeleton to content (100ms) | Instant swap |

---

## Performance Guidance

- Tooltips: use `opacity` and `transform: translateY(4px→0)` only.
- Expand/collapse: use `max-height` with `overflow: hidden` or `grid-template-rows: 0fr → 1fr`.
- Skeleton shimmer: use a CSS `@keyframes` linear animation on a `background-position`; do not use JavaScript for timing.
