# Permission Component Accessibility

**Component category:** Permission
**Phase:** 4
**Status:** stable
**Standard:** WCAG 2.1 AA

---

## ARIA Roles and Attributes

| Component | ARIA role | Key attributes |
|---|---|---|
| PermissionGate | `role="dialog"` | `aria-modal="true"`, `aria-labelledby="[gate-title-id]"`, `aria-describedby="[authorization-statement-id]"` |
| Grant control | `<button>` | `aria-label="Allow [action label]"` — descriptive, not generic |
| Deny control | `<button>` | `aria-label="Don't allow [action label]"` |
| Risk acknowledgment checkbox | `<input type="checkbox">` | `aria-required="true"`, `aria-describedby="[risk-statement-id]"` |
| Scope display | `<ul>` | `aria-label="Permission scope"` |
| DelegatedPermissionRequest status | `role="status"` | `aria-live="polite"`, `aria-atomic="true"` |
| PermissionRevocationNotice | `role="alert"` | `aria-live="assertive"` (revocation is time-sensitive) |
| ScopedPermissionGate scope visualizer | `<ul>` | `aria-label="Authorized resources"` |

---

## Screen Reader Announcements

| Event | Announcement |
|---|---|
| Gate mounts | "[Title]: [Authorization statement]. [Deny] or [Grant]" |
| Risk acknowledgment checked | "Risk acknowledged. [Grant] is now available." |
| Grant action | "[Action label] allowed." — politely |
| Deny action | "[Action label] not allowed." — politely |
| Dismiss without action | "[Action label] not allowed." — passive dismiss treated as deny |
| Delegate status: approved | "[Role] approved this request." |
| Delegate status: denied | "[Role] denied this request." |
| Delegation timeout | "No response received. [Next options]." |
| Revocation | "Permission revoked: [what was revoked]. [Reason if provided]." |

---

## Keyboard Requirements

- Permission gates must implement a full **focus trap** while open.
- Tab order within gate: deny control → grant control (deny first — see `interaction-model.md`).
- Escape fires `onDismiss` (treated as deny). This must be announced to screen readers.
- After gate closes (granted or denied), focus returns to the element that triggered the gate.
- The risk acknowledgment checkbox must be reachable by Tab and operable by Space.
- Grant control must be `aria-disabled="true"` (not `disabled`) when awaiting checkbox — allows screen readers to announce it without allowing activation.

---

## Focus Order Within PermissionGate

| Order | Element |
|---|---|
| 1 | Gate title (heading level — aria-labelledby reference) |
| 2 | Authorization statement (read as description) |
| 3 | Scope display (if expandable, include expand control) |
| 4 | Deny control |
| 5 | Grant control |

For OverrideConfirmation:
| Order | Element |
|---|---|
| 1 | Override title |
| 2 | Risk acknowledgment checkbox |
| 3 | Confirm override (initially aria-disabled) |
| 4 | Cancel |

---

## Color and Contrast

- Grant and deny controls must be visually distinct from each other by more than color alone. Label text is required (not icon-only).
- Permission scope tags must meet ≥ 4.5:1 contrast for text content.
- Revocation notice uses `severity-blocking` tokens — all contrast requirements apply.

---

## Reduced Motion

- Gate entrance: instant.
- Denial shake (subtle feedback on deny): suppressed.
- Delegation status spinner: replaced with static text "Waiting for response."
