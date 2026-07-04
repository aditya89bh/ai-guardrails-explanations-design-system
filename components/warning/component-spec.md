# Warning Component Specification

**Implements patterns:** Inline warning, modal warning, ambient warning, blocking warning, progressive warning, policy warning
**Phase:** 4
**Status:** stable
**Decision engine reference:** `docs/decision-flows/pattern-selection-engine.md` § Warning Category Selection

---

## Purpose

Warning components surface risk signals before a user completes an action. They are not error messages — errors report what went wrong after the fact. Warning components are prospective: they give the user information to make an informed decision before proceeding.

The component does not evaluate risk. It receives a `severity` prop, a `variant` prop, and message content from the decision engine and renders accordingly.

---

## Component Variants

| Variant | Renders as | Blocks interaction | Can dismiss |
|---|---|---|---|
| `inline` | Inline element within content flow | No | Yes (optional) |
| `banner` | Sticky horizontal bar above or below content | No | Yes |
| `ambient` | Persistent background indicator across session | No | No (persists until condition clears) |
| `modal` | Centered dialog overlay | Yes (modal focus trap) | Yes (explicit) |
| `blocking` | Full-screen overlay or inline lock | Yes (prevents all action) | No (action required) |
| `policy` | Modal or banner with policy attribution | Depends on policy level | No |

---

## Anatomy

### Inline and Banner variants

```
┌─────────────────────────────────────────────────────────────┐
│ [Icon]  [Severity label]  [Message text]         [Dismiss?] │
└─────────────────────────────────────────────────────────────┘
```

Named parts:
- **severity-icon** — Icon corresponding to `icon-severity-{severity}` token. Required; provides non-color severity signal.
- **severity-label** — Short text label for the severity level (e.g., "Advisory", "Caution"). Required for blocking and critical; optional for informational.
- **message** — Primary warning message. Required. Max 2 lines in inline variant before truncation with expand option.
- **detail** (optional) — Secondary supporting text. Visible after expand or always visible in banner variant.
- **action-area** (optional) — One primary action button (e.g., "Review details", "Learn more") and optionally one secondary/dismiss action.
- **dismiss-control** (optional) — X button to dismiss. Present in inline and banner; absent in blocking and ambient.
- **audit-indicator** (optional) — Shown when `auditId` prop is present. Uses `icon-audit` at `audit-indicator-opacity`.

### Modal variant

```
┌─────────────────────────────────────────┐
│  [Severity surface header]              │
│  [Icon]  [Title]                        │
│  [Message body]                         │
│  [Detail / explanation section]         │
│  [Action buttons]              [Cancel] │
│  [Audit indicator]                      │
└─────────────────────────────────────────┘
```

Additional named parts:
- **modal-overlay** — Semi-transparent backdrop. Priority: `priority-overlay`.
- **modal-container** — Dialog surface. Priority: `priority-modal`. Elevation: `elevation-3`.
- **modal-header** — Severity-colored header region with icon and title.
- **action-primary** — Primary action (e.g., "Proceed with risk", "Acknowledge"). Required.
- **action-cancel** — Cancel or go-back action. Required for all modals; must always provide a way out.

### Blocking variant

```
┌─────────────────────────────────────────┐
│  [Full-width severity surface]          │
│  [Large severity icon]                  │
│  [Title]                                │
│  [Message body — detailed]              │
│  [Required action controls]             │
│  [Audit indicator]                      │
└─────────────────────────────────────────┘
```

Blocking variant has no dismiss control and no cancel — only defined resolution actions.

---

## Input Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `severity` | `'informational' \| 'advisory' \| 'caution' \| 'blocking' \| 'critical'` | Yes | Drives all token selection |
| `variant` | `'inline' \| 'banner' \| 'ambient' \| 'modal' \| 'blocking' \| 'policy'` | Yes | Determines layout and blocking behavior |
| `title` | `string` | Yes (modal, blocking) | Warning heading |
| `message` | `string` | Yes | Primary warning message — plain text or structured |
| `detail` | `string` | No | Supporting explanation text |
| `policyId` | `string` | Policy variant only | Policy rule identifier for attribution |
| `policyLabel` | `string` | Policy variant only | Human-readable policy name |
| `actions` | `WarningAction[]` | No | Array of action objects — each has `label`, `handler`, `role` (primary/secondary) |
| `dismissible` | `boolean` | No (default: true for inline/banner, false for blocking) | Whether the user can dismiss |
| `onDismiss` | `() => void` | No | Callback on dismiss |
| `onAction` | `(actionId: string) => void` | No | Callback when user selects an action |
| `auditId` | `string` | No | If present, renders audit indicator and associates this interaction with the audit record |
| `progressionLevel` | `1 \| 2 \| 3` | Progressive variant only | Tracks prior-warning count in session; drives styling escalation |

---

## Output / Callbacks

| Callback | Trigger | Payload |
|---|---|---|
| `onDismiss` | User clicks dismiss control | `{ warningId, severity, timestamp }` |
| `onAction` | User selects an action | `{ warningId, actionId, severity, timestamp }` |
| `onMount` | Component renders | `{ warningId, severity, variant }` — for audit purposes |
| `onTimeout` | Auto-dismiss timer expires (if configured) | `{ warningId, severity }` |

All callbacks that produce an audit-relevant event must include `auditId` in their payload when `auditId` prop is present.

---

## States

| State | Visual treatment | Trigger |
|---|---|---|
| `default` | Full severity color; icon visible; actions available | Normal rendered state |
| `expanded` | Detail section visible; component taller | User clicks expand or "learn more" |
| `loading` | Primary actions replaced with loading indicator | Async action in progress |
| `dismissed` | Component hidden; no layout space | User dismisses or auto-dismiss fires |
| `resolved` | Brief success state before hide | Blocking warning action completed |
| `error` | Error message in action area | Async action failed; user may retry |
| `disabled` | Actions disabled; component visible | While awaiting async operation |

---

## Visual Hierarchy

- **Inline warnings** render at document flow level with no elevation. They do not interrupt reading flow but are visually distinct from body content.
- **Banner warnings** use `elevation-1` and stick to the top of their container. They should not cover the page header.
- **Modal warnings** use `elevation-3` with an overlay backdrop. They interrupt workflow.
- **Blocking warnings** use `elevation-4` with a full-viewport overlay. They prevent all interaction with background content.
- **Ambient warnings** use `elevation-0` — they sit in the background without elevation. They are passive and persistent.

**Severity and elevation are independent:** A high-severity warning does not automatically get higher elevation. Elevation is determined by the variant, not the severity.

---

## Progressive Warning Behavior

When `variant = 'progressive'` and `progressionLevel > 1`, the component applies visual escalation:

| progressionLevel | Title prefix | Border treatment | Icon |
|---|---|---|---|
| 1 | None | Standard border | Standard icon |
| 2 | "Repeated:" | Thicker border (`border-width-accent`) | Standard icon + badge |
| 3 | "Final notice:" | Filled border, severity background intensified | Urgency icon |

The decision engine is responsible for tracking `progressionLevel` across the session. The component renders the level it receives.

---

## Audit Indicator

When `auditId` is present, the audit indicator (using `icon-audit`) appears in the lower-right corner of the component at `audit-indicator-opacity`. It is not interactive in the default configuration. In enterprise deployments, it may be tappable/clickable to open the audit record (governed by the `auditLinkEnabled` prop).

Screen reader users receive a visually hidden label: "Audit record logged for this warning."

---

## Related Patterns

- `patterns/warning/inline-warning.md` — specifies trigger conditions and message content
- `patterns/warning/modal-warning.md` — specifies when modal presentation is required
- `patterns/warning/blocking-warning.md` — specifies when full block is required
- `patterns/warning/policy-warning.md` — specifies policy attribution requirements

## Related Decision Engine Rules

- `docs/decision-flows/pattern-selection-engine.md` § Warning Category Selection — determines which variant and severity to render
- `docs/decision-flows/pattern-precedence-engine.md` § Intra-Category Warning Precedence — determines which warning to show when multiple triggers are active
- `docs/decision-flows/pattern-composition-engine.md` § Standard Composition Templates — determines when permission gate follows warning
