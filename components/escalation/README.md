# Escalation Components

**Pattern category:** Escalation paths
**Phase:** 4
**Status:** stable
**Pattern specs:** `patterns/escalation/`

---

## Purpose

Escalation components communicate that the current AI system is routing the interaction to a higher authority — a human, a higher role, another system, or an emergency response team. They manage the transition gracefully: informing the user what is happening, who will handle it, and what to expect while they wait.

Emergency escalation components operate in interrupt mode and take visual precedence over all other components on screen.

---

## Components in This Category

| Component | Implements pattern | Mode |
|---|---|---|
| `HumanHandoffPanel` | `human-handoff` (escalation) | Inline or slide-over |
| `RoleEscalationCard` | `role-escalation` | Card with status |
| `SystemEscalationNotice` | `system-escalation` | Banner or card |
| `EmergencyEscalationOverlay` | `emergency-escalation` | Full-screen interrupt |
| `AsyncReviewStatus` | `async-review-escalation` | Persistent status bar or card |

---

## Files in This Directory

| File | Contents |
|---|---|
| `README.md` | This file |
| `component-spec.md` | Full specification for all escalation components |
| `interaction-model.md` | Status polling, cancel/withdraw, emergency acknowledgment |
| `accessibility.md` | Emergency alert role, live region for status updates |
| `motion.md` | Emergency interrupt entrance, status transition animation |
| `responsive.md` | Overlay behavior on mobile, status bar placement |
