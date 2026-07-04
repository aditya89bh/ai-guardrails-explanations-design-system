# Permission Interaction Model

**Component category:** Permission
**Phase:** 4
**Status:** stable

---

## Interaction Principles

1. **Passive dismissal equals denial.** This is a security invariant, not a UX convention. If the user closes or navigates away from a gate without explicitly granting, `onDismiss` fires with `dismissedWithoutAction: true` — treated as denial.
2. **Grant controls are explicit.** The label of the grant button must describe what is being authorized. "OK" and "Continue" are prohibited.
3. **Risk acknowledgment gates the grant control.** For the `override` variant, the grant button is disabled until the risk acknowledgment checkbox is checked. The user must actively choose to proceed.
4. **Delegation request status is live.** The DelegatedPermissionRequest polls or receives push updates on the delegate's status. The user does not need to refresh.

---

## Mouse and Pointer Interactions

### PermissionGate (all types)

| Interaction | Target | Result |
|---|---|---|
| Click grant control | Grant button | Fires `onGrant`; gate closes |
| Click deny control | Deny button | Fires `onDeny`; gate closes |
| Click backdrop | Modal overlay | Fires `onDismiss` (treated as deny) |
| Click cancel | Cancel request (delegated) | Fires `onCancel` |
| Click scope-visualizer item | Individual scope item | Expands scope detail (read-only) |

---

## Keyboard Interactions

| Key | Context | Result |
|---|---|---|
| `Tab` | Within gate | Cycles: deny → grant (deny first, so users can escape quickly) |
| `Shift+Tab` | Within gate | Reverse |
| `Enter` / `Space` | On focused grant | Fires `onGrant` |
| `Enter` / `Space` | On focused deny | Fires `onDeny` |
| `Escape` | While gate is open | Fires `onDismiss` (treated as deny) |
| `Space` | On risk-acknowledgment checkbox | Toggles check; enables/disables grant control |

**Tab order rule:** The deny control must appear before the grant control in tab order. This is intentional — it reduces accidental authorization by keyboard users.

### Focus Management

**On gate mount:** Focus moves immediately to the deny control (not the grant). Rationale: keyboard users who Tab without reading will encounter the denial path first.

**On grant:** Focus returns to the element that will now proceed with authorization. If the authorized action immediately triggers another UI element, focus moves to that element.

**On deny / dismiss:** Focus returns to the element that triggered the gate request (the action button the user clicked that required authorization).

---

## Touch Interactions

| Gesture | Target | Result |
|---|---|---|
| Tap | Grant control | Fires `onGrant` |
| Tap | Deny control | Fires `onDeny` |
| Swipe down | Gate sheet (mobile) | Fires `onDismiss` (treated as deny) |
| Tap outside | Backdrop | Fires `onDismiss` |

---

## Delegation Waiting Interaction

```
User triggers action → DelegatedPermissionRequest renders
User sees: "Awaiting approval from [role]"
Status: PENDING (spinner)

Delegate receives notification (external system)
Delegate approves or denies

DelegatedPermissionRequest updates status automatically:
  APPROVED → success indicator → gate closes → action proceeds
  DENIED → error indicator → redirect recovery options offered

If timeout expires:
  Status: TIMEOUT → "No response received"
  User offered: withdraw / try next approver / abandon
```

User can withdraw the delegation request while PENDING or ROUTED.

---

## Gate Expiration Interaction

Permissions with a configured expiration display a countdown:
- When expiration is > 24 hours away: no countdown shown.
- When expiration is < 24 hours away: "Expires in [X hours]" shown in scope display.
- When expiration is < 1 hour away: countdown timer shown.
- When expired: `onDismiss` fires with expiration reason; user sees revocation notice.

---

## PermissionRevocationNotice Interaction

Revocation notices are informational only — no grant/deny interaction. The user can:
- Dismiss the notice (informational only — the revocation is already in effect).
- Click "Re-authorize" if re-authorization is permitted by deployment configuration.

The revocation itself is not reversible by user action within the component.
