# Permission Components

**Pattern category:** Permission patterns
**Phase:** 4
**Status:** stable
**Pattern specs:** `patterns/permission/`

---

## Purpose

Permission components request, capture, manage, and revoke user authorization for AI-initiated actions. They are the visual and interactive surface for explicit consent — every action that requires authorization must surface a permission component before the action executes.

Permission components always include an explanation of what is being authorized and why. They do not operate silently.

---

## Components in This Category

| Component | Implements pattern | Blocking |
|---|---|---|
| `PermissionGate` | `one-time-permission`, `session-permission`, `persistent-permission` | Yes (gate) |
| `ScopedPermissionGate` | `scoped-permission` | Yes (scoped gate) |
| `DelegatedPermissionRequest` | `delegated-permission` | Yes (pending state) |
| `PermissionRevocationNotice` | `revocation` | No (notice) |

---

## Files in This Directory

| File | Contents |
|---|---|
| `README.md` | This file |
| `component-spec.md` | Full specification for all permission components |
| `interaction-model.md` | Grant/deny flows, delegation waiting, revocation handling |
| `accessibility.md` | Dialog ARIA, focus trap, keyboard grant/deny |
| `motion.md` | Gate entrance, denial shake, revocation animation |
| `responsive.md` | Bottom sheet on mobile, responsive scope display |
