# Warning Components

**Pattern category:** Warning patterns
**Phase:** 4
**Status:** stable
**Pattern specs:** `patterns/warning/`

---

## Purpose

Warning components are the visual surface for all six warning guardrail patterns. They communicate risk before a user proceeds — not after. A warning component must appear at the right moment, carry the right severity signal, and require the right level of user acknowledgment.

The decision engine (`docs/decision-flows/pattern-selection-engine.md`) determines when a warning component renders and at which severity level. The component is responsible only for rendering that severity correctly and capturing the user's response.

---

## Components in This Category

| Component | Implements pattern | Severity range | Blocking |
|---|---|---|---|
| `InlineWarning` | `inline-warning` | Informational, Advisory | No |
| `WarningBanner` | `ambient-warning`, `progressive-warning` | Advisory, Caution | No |
| `ModalWarning` | `modal-warning` | Advisory, Caution | Yes (modal) |
| `BlockingWarning` | `blocking-warning` | Blocking, Critical | Yes (full) |
| `PolicyWarning` | `policy-warning` | Blocking | Yes (varies) |

---

## Files in This Directory

| File | Contents |
|---|---|
| `README.md` | This file — category overview |
| `component-spec.md` | Full component specification for all warning components |
| `interaction-model.md` | Interaction sequences, keyboard behavior, focus management |
| `accessibility.md` | ARIA roles, screen reader behavior, keyboard requirements |
| `motion.md` | Animation and transition specifications |
| `responsive.md` | Breakpoint and viewport behavior |

---

## Design Token Usage

Warning components are the primary consumers of severity color tokens. See `design-tokens.md` for the complete token set. The `severity` prop drives all token selection — the component does not hard-code any color values.
