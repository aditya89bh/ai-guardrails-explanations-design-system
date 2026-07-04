# Uncertainty Component Accessibility

**Component category:** Uncertainty
**Phase:** 4
**Status:** stable
**Standard:** WCAG 2.1 AA

---

## ARIA Roles and Attributes

| Component | ARIA role | Key attributes |
|---|---|---|
| UncertaintyIndicator (passive) | `role="img"` with `aria-label` | `aria-label="[State label]: [brief description]"` |
| Tooltip | `role="tooltip"` | `id="tooltip-[indicator-id]"`, indicator has `aria-describedby` |
| ConflictingEvidenceCard | `<section>` | `aria-label="Conflicting information"` |
| Evidence columns | `<div>` with heading | Each column has a visible heading (`Source A`, `Source B`) |
| StaleContextBadge | `role="img"` | `aria-label="Data as of [date] — may be outdated"` |
| Refresh control | `<button>` | `aria-label="Refresh data"` |
| UnresolvableStateCard | `role="alert"` | `aria-live="assertive"` — unresolvable state is a meaningful escalation |
| Next-step options | `<ul>` of `<button>` | `aria-label="Next steps"` |
| State change (HC to other) | `role="status"` | `aria-live="polite"` for non-critical state changes |

---

## Screen Reader Announcements

| Event | Announcement |
|---|---|
| UncertaintyIndicator renders (non-HC) | "[State label]" — read inline as part of content |
| Tooltip appears on focus | Tooltip content as associated description |
| StaleContextBadge renders | "Data as of [date] — may be outdated" |
| State transitions from LC to MC | "Confidence updated to moderate" — politely |
| UnresolvableStateCard renders | "Cannot produce a reliable output. [Reason]. [Next steps]" — assertive |
| Refresh initiated | "Refreshing data..." |
| Refresh complete | "Data refreshed. [New state if changed]." |

---

## Keyboard Requirements

- UncertaintyIndicator is focusable (tabindex="0") to allow tooltip access by keyboard users.
- Tooltip appears on focus and dismisses on Escape.
- Refresh control on StaleContextBadge: Tab-reachable, operable by Enter/Space.
- ConflictingEvidenceCard next-step options: Tab-reachable, operable by Enter/Space.
- UnresolvableStateCard next-step options: Tab-reachable; focus moves here automatically on card mount.

---

## Focus Order

For UncertaintyIndicator (passive): in the natural document tab flow adjacent to its output.

For UnresolvableStateCard (active):
| Order | Element |
|---|---|
| 1 | Card heading (reason statement) |
| 2 | First next-step option |
| 3 | Second next-step option |
| 4 | Third next-step option |

---

## Color and Contrast

- Confidence state must not be communicated by color alone. Icon + label required for all non-high states.
- StaleContextBadge uses `severity-advisory` tokens — all contrast requirements apply.
- ConflictingEvidenceCard evidence columns must be distinguishable without color.

---

## Reduced Motion

- State transitions: instant.
- Refresh spinner: replaced with static "Refreshing..." text.
- Indicator pulse animation (if used to draw attention): suppressed.
